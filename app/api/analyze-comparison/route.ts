import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { generateComparisonPrompt, cleanPromptResponse, parseJSONWithRepair } from '@/lib/prompts';
import type { SelectedArticle } from '@/lib/types';

interface ComparisonAnalysisResponse {
  sharedFacts: string[];
  differences: string[];
  commonThemes: string[];
  dataPoints: string[];
}

// JSON Schema for structured output (ensures complete JSON responses)
// This schema enforces that Gemini completes the entire JSON structure
const comparisonSchema = {
  type: 'object',
  properties: {
    sharedFacts: {
      type: 'array',
      items: { type: 'string' },
    },
    commonThemes: {
      type: 'array',
      items: { type: 'string' },
    },
    differences: {
      type: 'array',
      items: { type: 'string' },
    },
    dataPoints: {
      type: 'array',
      items: { type: 'string' },
    },
  },
  required: ['sharedFacts', 'commonThemes', 'differences', 'dataPoints'],
};

// Initialize Gemini client
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey === 'your_api_key_here') {
    throw new Error('GEMINI_API_KEY is not configured. Please set it in .env.local');
  }

  return new GoogleGenerativeAI(apiKey);
}

// Fallback analysis function (uses heuristic method)
function getFallbackAnalysis(articles: SelectedArticle[]): ComparisonAnalysisResponse {
  // This is a simplified fallback - could import the analyzeComparison function if needed
  const sharedFacts: string[] = [];
  const differences: string[] = [];
  const commonThemes: string[] = [];
  const dataPoints: string[] = [];

  if (articles.length < 2) {
    return { sharedFacts, differences, commonThemes, dataPoints };
  }

  // Extract key facts
  const allKeyFacts = articles.flatMap(a => a.keyFacts || []);
  const factCounts = new Map<string, number>();
  allKeyFacts.forEach(fact => {
    const normalized = fact.toLowerCase().trim();
    factCounts.set(normalized, (factCounts.get(normalized) || 0) + 1);
  });

  const exactMatches = Array.from(factCounts.entries())
    .filter(([_, count]) => count >= 2)
    .map(([fact]) => fact)
    .slice(0, 3);

  exactMatches.forEach(match => {
    const originalFact = allKeyFacts.find(f => f.toLowerCase().trim() === match);
    if (originalFact) {
      sharedFacts.push(`Both agree: "${originalFact}"`);
    }
  });

  // Extract numbers/data points
  const allText = articles.flatMap(a => [...a.summary, ...(a.keyFacts || [])]).join(' ');
  const numbers = allText.match(/\$?\d+(?:,\d{3})*(?:\.\d+)?[BMKkmbt%]?/g) || [];
  const uniqueNumbers = [...new Set(numbers)];
  dataPoints.push(...uniqueNumbers.slice(0, 5));

  // Simple theme detection
  const leanings = articles.map(a => a.leaning);
  const hasOpposing =
    (leanings.includes('left') || leanings.includes('lean-left')) &&
    (leanings.includes('right') || leanings.includes('lean-right'));

  if (hasOpposing) {
    commonThemes.push('Despite political differences, both recognize the multifaceted nature of this issue');
  }

  if (articles[0].subTopicName === articles[1]?.subTopicName) {
    commonThemes.push(`Both examine the "${articles[0].subTopicName}" dimension of this topic`);
  }

  return {
    sharedFacts: sharedFacts.slice(0, 5),
    differences: differences.slice(0, 3),
    commonThemes: commonThemes.slice(0, 4),
    dataPoints: dataPoints.slice(0, 10),
  };
}

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json().catch(() => ({}));
    const { articles } = body;

    // Validate input
    if (!articles || !Array.isArray(articles) || articles.length < 2) {
      return NextResponse.json(
        { error: 'Invalid request. Please provide at least 2 articles to compare.' },
        { status: 400 }
      );
    }

    // Validate API key (but don't throw - use fallback if missing)
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'your_api_key_here') {
      console.warn('GEMINI_API_KEY not configured. Using fallback analysis.');
      const fallbackAnalysis = getFallbackAnalysis(articles as SelectedArticle[]);
      return NextResponse.json(fallbackAnalysis, {
        headers: { 'X-Fallback-Reason': 'api-key-missing' },
      });
    }

    // Initialize Gemini client and analyze comparison
    try {
      const genAI = getGeminiClient();

      // Use Gemini 2.5 Flash model with structured output (Response Schema)
      // Note: Response Schema ensures complete JSON responses and validates structure
      const model = genAI.getGenerativeModel({
        model: 'gemini-2.5-flash',
        generationConfig: {
          temperature: 0.3, // Lower temperature for more focused analysis
          topP: 0.8,
          topK: 40,
          maxOutputTokens: 4096, // Limit output tokens for faster responses (~3K tokens for comparison analysis)
          responseMimeType: 'application/json', // Enforce JSON output format
          responseSchema: comparisonSchema as any, // JSON Schema to ensure complete, valid responses (type assertion for SDK compatibility)
        },
      });

      // Generate prompt
      const prompt = generateComparisonPrompt(articles as SelectedArticle[]);

      // Call Gemini API with timeout
      // Note: Vercel limits: Hobby (10s), Pro (60s), Enterprise (300s)
      // Using 55s to leave buffer for platform overhead
      const startTime = Date.now();
      const timeoutMs = 55000; // 55 second timeout (within Pro plan 60s limit)

      console.log(`Calling Gemini API for comparison analysis of ${articles.length} articles`);

      const result = await Promise.race([
        model.generateContent({
          contents: [
            {
              role: 'user',
              parts: [{ text: prompt }],
            },
          ],
        }),
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('API request timeout')), timeoutMs)
        ),
      ]);

      const response = result.response;
      const elapsedTime = Date.now() - startTime;

      console.log(`Gemini comparison analysis completed in ${elapsedTime}ms`);

      // With responseSchema, response.text() returns valid JSON directly
      // Schema ensures complete JSON structure, but we add repair fallback for edge cases
      let analysis: ComparisonAnalysisResponse;
      const text = response.text(); // Get response text once

      try {
        // Try parsing with repair function (handles incomplete JSON)
        analysis = parseJSONWithRepair(text);
      } catch (parseError) {
        console.error('JSON parse error (with repair attempts):', parseError);
        console.error('Response text (first 500 chars):', text.substring(0, 500));

        // Log JSON structure info for debugging
        const openBraces = (text.match(/\{/g) || []).length;
        const closeBraces = (text.match(/\}/g) || []).length;
        const openBrackets = (text.match(/\[/g) || []).length;
        const closeBrackets = (text.match(/\]/g) || []).length;
        console.error(`JSON structure: {${openBraces}/${closeBraces}}, [${openBrackets}/${closeBrackets}]`);

        // Fallback to heuristic analysis if JSON parsing fails
        console.warn('Failed to parse Gemini response after repair attempts. Using fallback analysis.');
        const fallbackAnalysis = getFallbackAnalysis(articles as SelectedArticle[]);
        return NextResponse.json(fallbackAnalysis, {
          headers: { 'X-Fallback-Reason': 'parse-error' },
        });
      }

      // Validate response structure
      if (!analysis.sharedFacts || !analysis.commonThemes || !analysis.differences || !analysis.dataPoints) {
        console.error('Invalid analysis structure:', analysis);
        const fallbackAnalysis = getFallbackAnalysis(articles as SelectedArticle[]);
        return NextResponse.json(fallbackAnalysis, {
          headers: { 'X-Fallback-Reason': 'invalid-structure' },
        });
      }

      // Ensure all fields are arrays of strings
      analysis.sharedFacts = Array.isArray(analysis.sharedFacts)
        ? analysis.sharedFacts.filter(f => typeof f === 'string').slice(0, 5)
        : [];
      analysis.commonThemes = Array.isArray(analysis.commonThemes)
        ? analysis.commonThemes.filter(t => typeof t === 'string').slice(0, 4)
        : [];
      analysis.differences = Array.isArray(analysis.differences)
        ? analysis.differences.filter(d => typeof d === 'string').slice(0, 3)
        : [];
      analysis.dataPoints = Array.isArray(analysis.dataPoints)
        ? analysis.dataPoints.filter(d => typeof d === 'string').slice(0, 10)
        : [];

      return NextResponse.json(analysis);
    } catch (error) {
      // If Gemini API fails, fall back to heuristic analysis
      console.error('Gemini API error:', error);

      // Handle specific error types
      if (error instanceof Error) {
        // Rate limiting errors
        if (error.message.includes('quota') ||
          error.message.includes('429') ||
          error.message.includes('rate limit') ||
          error.message.includes('RESOURCE_EXHAUSTED')) {
          console.warn('Rate limit reached. Using fallback analysis.');
          const fallbackAnalysis = getFallbackAnalysis(articles as SelectedArticle[]);
          return NextResponse.json(fallbackAnalysis, {
            headers: {
              'X-Rate-Limited': 'true',
              'Retry-After': '60',
              'X-Fallback-Reason': 'rate-limit',
            },
          });
        }

        // Timeout errors
        if (error.message.includes('timeout') || error.message.includes('API request timeout')) {
          console.warn('API request timeout. Using fallback analysis.');
          const fallbackAnalysis = getFallbackAnalysis(articles as SelectedArticle[]);
          return NextResponse.json(fallbackAnalysis, {
            headers: {
              'X-Timeout': 'true',
              'X-Fallback-Reason': 'timeout',
            },
          });
        }
      }

      // For other errors, fall back to heuristic analysis
      console.warn('Gemini API unavailable. Using fallback analysis. Error:', error);
      const fallbackAnalysis = getFallbackAnalysis(articles as SelectedArticle[]);
      return NextResponse.json(fallbackAnalysis, {
        headers: { 'X-Fallback-Reason': 'api-error' },
      });
    }
  } catch (error) {
    console.error('API route error:', error);

    return NextResponse.json(
      { error: 'An unexpected error occurred while processing your request.' },
      { status: 500 }
    );
  }
}

