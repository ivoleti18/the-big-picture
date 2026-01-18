import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import type { Topic } from '@/lib/types';

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

    // Initialize Gemini client (will be used in Task 3.1)
    try {
      const genAI = getGeminiClient();
      // For now, return mock response
      // Actual Gemini integration will be in Task 3.1
      const mockTopic = getMockTopic(sanitizedQuery);
      return NextResponse.json(mockTopic);
    } catch (error) {
      // If client initialization fails, return mock
      console.error('Gemini client initialization error:', error);
      const mockTopic = getMockTopic(sanitizedQuery);
      return NextResponse.json(mockTopic);
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
