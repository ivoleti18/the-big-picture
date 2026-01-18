import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import type { Topic } from '@/lib/types';
import { generateTopicPrompt, cleanPromptResponse } from '@/lib/prompts';

// Initialize Gemini client
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey || apiKey === 'your_api_key_here') {
    throw new Error('GEMINI_API_KEY is not configured. Please set it in .env.local');
  }
  
  return new GoogleGenerativeAI(apiKey);
}

// Mock response for testing (matches Topic type)
function getMockTopic(query: string): Topic {
  const kebabQuery = query.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  
  return {
    id: kebabQuery || 'sample-topic',
    name: query || 'Sample Topic',
    description: `AI-generated perspective analysis for: ${query}`,
    subTopics: [
      {
        id: `${kebabQuery}-subtopic-1`,
        name: 'Economic Impact',
        description: 'Economic implications and market effects',
        articles: [
          {
            id: `${kebabQuery}-article-1`,
            title: 'Economic Analysis: Market Perspectives',
            source: 'The Economist',
            leaning: 'center',
            summary: [
              'This article examines the economic implications from a neutral, data-driven perspective.',
              'Key market indicators suggest significant impact on global trade patterns.',
              'Experts predict both short-term volatility and long-term structural changes.',
              'Investment strategies are adapting to new economic realities.'
            ],
            keyFacts: ['Market analysis', 'Trade impact', 'Investment trends']
          },
          {
            id: `${kebabQuery}-article-2`,
            title: 'Progressive Economic View',
            source: 'The Guardian',
            leaning: 'lean-left',
            summary: [
              'A progressive perspective on economic implications and social equity concerns.',
              'Emphasis on protecting vulnerable communities during economic transitions.',
              'Advocates for policy measures that prioritize social welfare.',
              'Calls for systemic reform to address underlying inequalities.'
            ],
            keyFacts: ['Social equity', 'Policy reform', 'Community protection']
          }
        ]
      },
      {
        id: `${kebabQuery}-subtopic-2`,
        name: 'Policy Implications',
        description: 'Regulatory and policy considerations',
        articles: [
          {
            id: `${kebabQuery}-article-3`,
            title: 'Conservative Policy Framework',
            source: 'National Review',
            leaning: 'right',
            summary: [
              'Conservative analysis of policy implications and regulatory approaches.',
              'Emphasizes limited government intervention and market-based solutions.',
              'Argues for preserving individual freedoms and economic competitiveness.',
              'Suggests incremental policy changes over sweeping reform.'
            ],
            keyFacts: ['Limited government', 'Market solutions', 'Individual freedom']
          },
          {
            id: `${kebabQuery}-article-4`,
            title: 'Policy Analysis from Center',
            source: 'Reuters',
            leaning: 'neutral',
            summary: [
              'Factual reporting on policy developments and regulatory changes.',
              'Provides balanced coverage of different policy proposals.',
              'Includes analysis from multiple expert perspectives.',
              'Focuses on verifiable information and data-driven insights.'
            ],
            keyFacts: ['Factual reporting', 'Expert analysis', 'Data-driven']
          }
        ]
      }
    ]
  };
}

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json().catch(() => ({}));
    const { query } = body;

    // Validate input
    if (!query || typeof query !== 'string' || query.trim().length === 0) {
      return NextResponse.json(
        { error: 'Invalid request. Please provide a valid query string.' },
        { status: 400 }
      );
    }

    // Sanitize query
    const sanitizedQuery = query.trim();

    // Validate API key (but don't throw yet - return mock for now)
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'your_api_key_here') {
      // Return mock response if API key not configured
      console.warn('GEMINI_API_KEY not configured. Returning mock response.');
      const mockTopic = getMockTopic(sanitizedQuery);
      return NextResponse.json(mockTopic);
    }

    // Initialize Gemini client and generate topic
    try {
      const genAI = getGeminiClient();
      
      // Use Gemini 2.5 Flash model (without Google Search for faster responses)
      // Note: Google Search grounding disabled to reduce latency (was causing 30-60s delays)
      // The prompt will instruct Gemini to generate representative articles instead
      const model = genAI.getGenerativeModel({ 
        model: 'gemini-2.5-flash',
        generationConfig: {
          temperature: 0.7,
          topP: 0.9,
          topK: 40,
          maxOutputTokens: 16384, // Limit output tokens for faster responses (~12K tokens for full topic structure)
        },
      });

      // Generate prompt with generation-focused instructions (no search)
      const prompt = generateTopicPrompt(sanitizedQuery);

      // Call Gemini API with timeout
      // Note: Vercel limits: Hobby (10s), Pro (60s), Enterprise (300s)
      // Using 55s to leave buffer for platform overhead
      const startTime = Date.now();
      const timeoutMs = 55000; // 55 second timeout (within Pro plan 60s limit)
      
      console.log(`Calling Gemini API for query: "${sanitizedQuery}" (without Google Search for faster response)`);
      
      const result = await Promise.race([
        model.generateContent({
          contents: [
            {
              role: 'user',
              parts: [{ text: prompt }],
            },
          ],
          // Google Search disabled - generates articles directly for faster responses
          // tools: [{ googleSearch: {} }] as any,
        }),
        new Promise<never>((_, reject) => 
          setTimeout(() => reject(new Error('API request timeout')), timeoutMs)
        ),
      ]);
      
      const response = result.response;
      const text = response.text();
      const elapsedTime = Date.now() - startTime;
      
      console.log(`Gemini API call completed in ${elapsedTime}ms`);

      // Clean and parse JSON response
      const cleanedText = cleanPromptResponse(text);
      let topicData: Topic;

      try {
        topicData = JSON.parse(cleanedText);
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
        console.error('Response text:', cleanedText.substring(0, 500));
        // Fallback to mock if JSON parsing fails
        console.warn('Failed to parse Gemini response. Using mock fallback.');
        const mockTopic = getMockTopic(sanitizedQuery);
        return NextResponse.json(mockTopic);
      }

      // Validate response structure (comprehensive validation)
      if (!topicData.id || !topicData.name || !topicData.subTopics || !Array.isArray(topicData.subTopics)) {
        console.error('Invalid topic structure:', topicData);
        // Fallback to mock if structure invalid
        console.warn('Invalid Gemini response structure. Using mock fallback.');
        const mockTopic = getMockTopic(sanitizedQuery);
        return NextResponse.json(mockTopic);
      }

      // Validate and normalize leanings (ensure they're valid enum values)
      const validLeanings: Array<Topic['subTopics'][0]['articles'][0]['leaning']> = 
        ['left', 'lean-left', 'center', 'lean-right', 'right', 'neutral'];
      
      // Count real vs generated articles for logging
      let realArticleCount = 0;
      let generatedArticleCount = 0;
      
      topicData.subTopics.forEach((subTopic, subTopicIndex) => {
        // Validate sub-topic structure
        if (!subTopic.id || !subTopic.name || !subTopic.articles || !Array.isArray(subTopic.articles)) {
          console.warn(`Invalid sub-topic structure at index ${subTopicIndex}`);
          return;
        }
        
        subTopic.articles.forEach((article, articleIndex) => {
          // Validate article structure
          if (!article.id || !article.title || !article.source || !article.leaning || !article.summary) {
            console.warn(`Invalid article structure at sub-topic ${subTopicIndex}, article ${articleIndex}`);
            return;
          }
          
          // Validate leaning
          if (!validLeanings.includes(article.leaning)) {
            console.warn(`Invalid leaning "${article.leaning}" found. Defaulting to "center".`);
            article.leaning = 'center';
          }
          
          // Detect if article is real (has URL) or generated
          if (article.url && article.url.trim().length > 0) {
            // Validate URL format
            try {
              new URL(article.url);
              realArticleCount++;
              console.log(`Real article detected: ${article.title} from ${article.source}`);
            } catch {
              // Invalid URL, treat as generated
              console.warn(`Invalid URL format for article: ${article.url}`);
              delete article.url;
              generatedArticleCount++;
            }
          } else {
            generatedArticleCount++;
          }
          
          // Ensure summary has minimum items
          if (!Array.isArray(article.summary) || article.summary.length < 4) {
            console.warn(`Article summary has insufficient items (${article.summary?.length || 0}), expected at least 4`);
          }
          
          // Ensure keyFacts is an array (optional field)
          if (article.keyFacts && !Array.isArray(article.keyFacts)) {
            article.keyFacts = [];
          }
        });
      });
      
      console.log(`Article breakdown: ${realArticleCount} real articles, ${generatedArticleCount} generated articles`);
      
      // Normalize IDs to kebab-case if needed
      const toKebabCase = (str: string): string => {
        return str
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '');
      };
      
      if (topicData.id !== toKebabCase(topicData.name)) {
        topicData.id = toKebabCase(topicData.name) || 'topic';
      }
      
      topicData.subTopics.forEach((subTopic, subTopicIndex) => {
        if (subTopic.id !== toKebabCase(subTopic.name)) {
          subTopic.id = toKebabCase(subTopic.name) || `subtopic-${subTopicIndex + 1}`;
        }
        
        subTopic.articles.forEach((article, articleIndex) => {
          if (article.id !== toKebabCase(article.title)) {
            article.id = toKebabCase(article.title) || `${subTopic.id}-article-${articleIndex + 1}`;
          }
        });
      });

      return NextResponse.json(topicData);
    } catch (error) {
      // If Gemini API fails, fall back to mock response
      console.error('Gemini API error:', error);
      
      // Handle specific error types
      if (error instanceof Error) {
        // Rate limiting errors
        if (error.message.includes('quota') || 
            error.message.includes('429') || 
            error.message.includes('rate limit') ||
            error.message.includes('RESOURCE_EXHAUSTED')) {
          console.warn('Rate limit reached. Using mock fallback.');
          const mockTopic = getMockTopic(sanitizedQuery);
          return NextResponse.json(mockTopic, {
            headers: {
              'X-Rate-Limited': 'true',
              'Retry-After': '60',
            },
          });
        }
        
        // Timeout errors
        if (error.message.includes('timeout') || error.message.includes('API request timeout')) {
          console.warn('API request timeout. Using mock fallback.');
          const mockTopic = getMockTopic(sanitizedQuery);
          return NextResponse.json(mockTopic, {
            headers: {
              'X-Timeout': 'true',
            },
          });
        }
        
        // Authentication errors
        if (error.message.includes('API_KEY') || 
            error.message.includes('authentication') ||
            error.message.includes('UNAUTHENTICATED')) {
          console.error('API authentication error:', error.message);
          return NextResponse.json(
            { 
              error: 'API authentication failed. Please check your GEMINI_API_KEY configuration.',
              fallback: true,
            },
            { status: 401 }
          );
        }
        
        // Invalid request errors
        if (error.message.includes('INVALID_ARGUMENT') || 
            error.message.includes('invalid')) {
          console.error('Invalid API request:', error.message);
          // Still try to provide mock fallback for user experience
          const mockTopic = getMockTopic(sanitizedQuery);
          return NextResponse.json(mockTopic, {
            headers: {
              'X-Fallback-Reason': 'invalid-request',
            },
          });
        }
      }

      // For other errors, fall back to mock
      console.warn('Gemini API unavailable. Using mock fallback. Error:', error);
      const mockTopic = getMockTopic(sanitizedQuery);
      return NextResponse.json(mockTopic, {
        headers: {
          'X-Fallback-Reason': 'api-error',
        },
      });
    }
  } catch (error) {
    console.error('API route error:', error);
    
    // Handle specific error types
    if (error instanceof Error) {
      if (error.message.includes('GEMINI_API_KEY')) {
        return NextResponse.json(
          { error: 'API configuration error. Please check your environment variables.' },
          { status: 500 }
        );
      }
    }

    // Generic error response
    return NextResponse.json(
      { error: 'An unexpected error occurred while processing your request.' },
      { status: 500 }
    );
  }
}
