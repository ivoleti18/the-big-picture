import type { Topic } from './types';

/**
 * Generates a comprehensive prompt for Gemini to create a Topic with
 * diverse perspectives and detailed article summaries
 */
export function generateTopicPrompt(query: string): string {
  return `You are an educational tool that creates balanced, multi-perspective knowledge maps for complex topics. Your goal is to help students understand the "whole board" of a debate by presenting diverse viewpoints.

TOPIC: "${query}"

TASK: Generate a comprehensive knowledge map with the following structure:

1. MAIN TOPIC:
   - Create a clear, concise topic name
   - Write a brief description (1-2 sentences) that explains the debate/controversy

2. SUB-TOPICS (Generate 2-3 relevant sub-topics):
   - Each sub-topic should explore a different angle or dimension of the main topic
   - Sub-topics should be distinct and non-overlapping
   - Name should be clear and descriptive (3-5 words)
   - Include a brief description explaining what aspect this covers

3. ARTICLES (2-5 articles per sub-topic) - HYBRID APPROACH:
   
   PRIORITY 1: Use Google Search to find REAL articles first
   - Search for actual news articles related to each sub-topic
   - Find articles from diverse sources with different political leanings
   - Extract: URL, actual title, real source name, publication date (if available)
   - Use the actual article content to create summaries and extract facts
   - Classify political leaning based on both source reputation AND content analysis
   - Include the "url" field in the JSON when real articles are found
   
   PRIORITY 2: Fallback to GENERATING representative articles if real ones unavailable
   - If real articles cannot be found for a sub-topic, generate representative articles
   - Create realistic article titles and source names matching political leanings
   - Generate comprehensive summaries that represent the perspective accurately
   - Omit "url" field for generated articles (only include for real articles)
   - Ensure generated articles still provide diverse political perspectives

4. ARTICLE DETAILS:
   For each article (real or generated), provide:
   - Title: Actual article title (if real) OR compelling realistic headline (if generated) - 10-15 words
   - Source: Real news outlet name (if real) OR realistic news outlet matching leaning (if generated)
   - Leaning: ONE of: "left", "lean-left", "center", "lean-right", "right", "neutral"
     * For REAL articles: Classify based on source reputation + content analysis
     * For GENERATED articles: Use the classification that matches the source style
   - Summary: 4-5 comprehensive bullet points that:
     * For REAL articles: Summarize the actual article content with key arguments
     * For GENERATED articles: Create representative summaries for the perspective
     * Include specific details, data points, and evidence in both cases
     * Are long enough to be meaningful (2-3 sentences per bullet, not fragments)
     * Avoid extreme brevity - ensure readers get the complete gist
   - Key Facts: 3-5 concise, factual data points extracted from real articles OR generated based on the perspective
   - URL: Include ONLY for real articles found via Google Search (omit for generated articles)

POLITICAL LEANING CLASSIFICATION GUIDE:
- "left": Progressive, socialist, anti-establishment sources (e.g., Jacobin, The Nation, Mother Jones)
- "lean-left": Center-left, liberal sources (e.g., The Guardian, The New York Times, NPR)
- "center": Neutral, fact-driven sources (e.g., Reuters, Associated Press, BBC)
- "lean-right": Center-right, conservative sources (e.g., The Economist, Wall Street Journal, Forbes)
- "right": Conservative, right-wing sources (e.g., National Review, The Federalist, Fox News)
- "neutral": Academic, data-driven, non-partisan sources (e.g., Scientific American, MIT Technology Review)

REQUIREMENTS:
- HYBRID APPROACH: Always try to find real articles first, but gracefully fall back to generation if needed
- Article diversity: Each sub-topic should have articles from different leanings (at minimum: left-leaning and right-leaning)
- Real article preference: Prefer real articles when available, but don't fail if only some are real
- Comprehensive summaries: 4-5 bullet points, each containing substantive information (2-3 sentences, not fragments)
- Source authenticity: Use real source names for real articles, realistic names for generated ones
- Data points: Include specific statistics, numbers, and concrete examples in summaries
- Key facts: Concise but informative (numbers, percentages, specific claims)
- URL handling: Include "url" field only for real articles; omit for generated articles

OUTPUT FORMAT: Return ONLY valid JSON matching this exact structure:

{
  "id": "kebab-case-id-from-topic-name",
  "name": "Exact Topic Name",
  "description": "Brief description of the topic and its controversy/debate",
  "subTopics": [
    {
      "id": "kebab-case-subtopic-id",
      "name": "Sub-Topic Name",
      "description": "What aspect this sub-topic covers",
      "articles": [
        {
          "id": "kebab-case-article-id",
          "title": "Article Title",
          "source": "News Source Name",
          "leaning": "left|lean-left|center|lean-right|right|neutral",
          "url": "https://example.com/article", // Optional: INCLUDE ONLY for real articles, omit for generated
          "summary": [
            "First comprehensive bullet point explaining the article's perspective with details...",
            "Second bullet point with specific arguments, data, or evidence...",
            "Third bullet point covering another aspect of the article's core arguments...",
            "Fourth bullet point providing additional context or implications...",
            "Optional fifth bullet point if needed for completeness..."
          ],
          "keyFacts": [
            "Specific fact or statistic",
            "Another concrete data point",
            "Important claim or finding"
          ]
        }
      ]
    }
  ]
}

IMPORTANT:
- Return ONLY the JSON object, no markdown, no code blocks, no explanations
- HYBRID APPROACH: Mix of real and generated articles is acceptable - use real when available
- Ensure all required fields are present (except "url" which is optional)
- Use only valid leaning values
- Minimum 2 sub-topics, maximum 3
- Minimum 2 articles per sub-topic, maximum 5
- Each article summary must have 4-5 comprehensive bullet points (not fragments)
- Generate IDs in kebab-case (lowercase, hyphens instead of spaces)
- Include "url" field ONLY for real articles found via Google Search

SEARCH STRATEGY:
1. For each sub-topic, search for recent articles from diverse sources
2. If real articles found: Use them with actual URLs, titles, and content
3. If real articles unavailable: Generate representative articles matching the perspective
4. Always ensure diversity of political leanings regardless of source (real or generated)

Generate the knowledge map now for: "${query}"`;
}

/**
 * Validates and cleans the prompt response JSON
 */
export function cleanPromptResponse(response: string): string {
  // Remove markdown code blocks if present
  let cleaned = response.trim();
  
  // Remove ```json and ``` markers
  cleaned = cleaned.replace(/^```json\s*/i, '');
  cleaned = cleaned.replace(/^```\s*/i, '');
  cleaned = cleaned.replace(/\s*```$/i, '');
  
  // Remove any leading/trailing whitespace
  cleaned = cleaned.trim();
  
  // If response starts with explanatory text, try to extract JSON
  const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    cleaned = jsonMatch[0];
  }
  
  return cleaned;
}

/**
 * JSON Schema for Topic response (for reference/validation)
 */
export const TOPIC_JSON_SCHEMA = {
  type: 'object',
  required: ['id', 'name', 'description', 'subTopics'],
  properties: {
    id: { type: 'string', pattern: '^[a-z0-9-]+$' },
    name: { type: 'string', minLength: 1 },
    description: { type: 'string', minLength: 10 },
    subTopics: {
      type: 'array',
      minItems: 2,
      maxItems: 3,
      items: {
        type: 'object',
        required: ['id', 'name', 'description', 'articles'],
        properties: {
          id: { type: 'string', pattern: '^[a-z0-9-]+$' },
          name: { type: 'string', minLength: 1 },
          description: { type: 'string', minLength: 10 },
          articles: {
            type: 'array',
            minItems: 2,
            maxItems: 5,
            items: {
              type: 'object',
              required: ['id', 'title', 'source', 'leaning', 'summary'],
              properties: {
                id: { type: 'string', pattern: '^[a-z0-9-]+$' },
                title: { type: 'string', minLength: 5 },
                source: { type: 'string', minLength: 2 },
                leaning: {
                  type: 'string',
                  enum: ['left', 'lean-left', 'center', 'lean-right', 'right', 'neutral']
                },
                summary: {
                  type: 'array',
                  minItems: 4,
                  maxItems: 5,
                  items: { type: 'string', minLength: 20 }
                },
                keyFacts: {
                  type: 'array',
                  minItems: 0,
                  items: { type: 'string', minLength: 3 }
                },
                url: { type: 'string' }
              }
            }
          }
        }
      }
    }
  }
} as const;
