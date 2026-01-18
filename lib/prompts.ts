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

3. ARTICLES (2-5 articles per sub-topic):
   
   Generate representative articles for each sub-topic:
   - Create realistic article titles and source names matching political leanings
   - Generate comprehensive summaries that represent the perspective accurately
   - Omit "url" field (articles are generated, not real)
   - Ensure diverse political perspectives across articles

4. ARTICLE DETAILS:
   For each article, provide:
   - Title: Compelling realistic headline (10-15 words) matching the political leaning
   - Source: Realistic news outlet name matching the political leaning
   - Leaning: ONE of: "left", "lean-left", "center", "lean-right", "right", "neutral"
     * Use the classification that matches the source style and perspective
   - Summary: 4-5 comprehensive bullet points that:
     * Create representative summaries for the perspective
     * Include specific details, data points, and evidence
     * Are long enough to be meaningful (2-3 sentences per bullet, not fragments)
     * Avoid extreme brevity - ensure readers get the complete gist
   - Key Facts: 3-5 concise, factual data points generated based on the perspective
   - URL: Omit this field (articles are generated, not real)
   - Perspective Analysis: Detailed breakdown explaining WHY the article received its political leaning classification:
     * Language Patterns: Identify specific framing indicators (e.g., "economic burden", "systemic inequality", "market forces"), assess overall sentiment (positive/negative/neutral/mixed), and provide examples of phrases that indicate perspective
     * Source Classification: Explain how the publication's known bias influences classification, provide historical context about editorial stance, and note reputation factors
     * Topic Coverage: Identify which aspects of the topic are emphasized, describe coverage distribution (what gets more/less attention), and note any notable omissions or underemphasized perspectives
     * Confidence Score: Rate confidence in the classification from 0-100 (higher for clear-cut cases, lower for nuanced/ambiguous ones)
     * Reasoning: Overall explanation summarizing why this specific classification was made

POLITICAL LEANING CLASSIFICATION GUIDE:
- "left": Progressive, socialist, anti-establishment sources (e.g., Jacobin, The Nation, Mother Jones)
- "lean-left": Center-left, liberal sources (e.g., The Guardian, The New York Times, NPR)
- "center": Neutral, fact-driven sources (e.g., Reuters, Associated Press, BBC)
- "lean-right": Center-right, conservative sources (e.g., The Economist, Wall Street Journal, Forbes)
- "right": Conservative, right-wing sources (e.g., National Review, The Federalist, Fox News)
- "neutral": Academic, data-driven, non-partisan sources (e.g., Scientific American, MIT Technology Review)

REQUIREMENTS:
- Article diversity: Each sub-topic should have articles from different leanings (at minimum: left-leaning and right-leaning)
- Comprehensive summaries: 4-5 bullet points, each containing substantive information (2-3 sentences, not fragments)
- Source authenticity: Use realistic source names that match the political leaning
- Data points: Include specific statistics, numbers, and concrete examples in summaries
- Key facts: Concise but informative (numbers, percentages, specific claims)
- URL handling: Omit "url" field (all articles are generated)
- Perspective Analysis: Provide detailed analysis for EVERY article explaining why it received its classification - analyze language patterns, source characteristics, and topic coverage emphasis

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
          // "url": omitted - articles are generated
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
          ],
          "perspectiveAnalysis": {
            "languagePatterns": {
              "framingIndicators": ["Example framing phrase", "Another indicator"],
              "sentiment": "positive|negative|neutral|mixed",
              "examples": ["Specific quote or phrase from article", "Another example"]
            },
            "sourceClassification": {
              "publicationBias": "Explanation of how publication bias influences classification",
              "editorialStance": "Historical context about the source's editorial perspective",
              "reputationFactors": ["Factor 1", "Factor 2"]
            },
            "topicCoverage": {
              "emphasisPoints": ["Aspect emphasized", "Another angle highlighted"],
              "coverageDistribution": "Description of what perspectives get more or less coverage",
              "omissions": ["Notable missing perspective", "Underemphasized angle"]
            },
            "confidenceScore": 85,
            "reasoning": "Overall explanation of why this classification was made, synthesizing language patterns, source reputation, and coverage emphasis"
          }
        }
      ]
    }
  ]
}

IMPORTANT:
- Return ONLY the JSON object, no markdown, no code blocks, no explanations
- Ensure all required fields are present (omit "url" field - articles are generated)
- Use only valid leaning values
- Minimum 2 sub-topics, maximum 3
- Minimum 2 articles per sub-topic, maximum 5
- Each article summary must have 4-5 comprehensive bullet points (not fragments)
- Generate IDs in kebab-case (lowercase, hyphens instead of spaces)
- Do NOT include "url" field (all articles are generated)
- Perspective Analysis: Include "perspectiveAnalysis" for EVERY article with detailed breakdown of classification reasoning

GENERATION STRATEGY:
1. For each sub-topic, generate representative articles matching different political perspectives
2. Create realistic titles, sources, and content that accurately represent each leaning
3. Ensure diversity of political leanings across all articles

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
 * Generates a comprehensive prompt for Gemini to analyze article comparisons
 */
export function generateComparisonPrompt(articles: Array<{
  title: string;
  source: string;
  leaning: string;
  summary: string[];
  keyFacts?: string[];
  subTopicName?: string;
}>): string {
  const articlesText = articles.map((article, index) => {
    const leaningLabel = article.leaning.replace('-', ' ').toUpperCase();
    return `
ARTICLE ${index + 1}:
Title: "${article.title}"
Source: ${article.source} (${leaningLabel} leaning)
Sub-topic: ${article.subTopicName || 'N/A'}
Key Facts: ${(article.keyFacts || []).join('; ')}
Summary:
${article.summary.map((point, i) => `  ${i + 1}. ${point}`).join('\n')}
`;
  }).join('\n---\n');

  return `You are an expert analyst specializing in finding common ground and nuanced differences between articles with different political perspectives. Your goal is to help readers discover the "Aha!" moment - shared facts and overlapping data points even when perspectives differ.

ARTICLES TO COMPARE:
${articlesText}

TASK: Perform a deep, intelligent comparison analysis and identify:

1. SHARED FACTS & DATA POINTS (The "Aha!" Moment):
   - Extract specific facts, statistics, numbers, percentages, dates, or data points that appear in MULTIPLE articles
   - Look for the same or similar numerical data (e.g., "$25B budget", "10% increase", "150,000 people")
   - Identify statements of fact (not opinion) that both sources acknowledge
   - Even if wording differs slightly, if the core fact is the same, include it
   - Format: Clear, concise statements of shared facts (e.g., "Both sources cite the $25B annual budget")
   - Maximum 5 shared facts

2. COMMON THEMES:
   - Identify conceptual areas that both perspectives address, even with different conclusions
   - Look for underlying concerns, values, or considerations both articles recognize
   - Examples: "Both perspectives acknowledge environmental concerns", "Both address economic implications"
   - Maximum 4 common themes

3. KEY DIFFERENCES:
   - Identify where the perspectives genuinely diverge in emphasis, framing, or conclusions
   - Note different priorities, interpretations of data, or solution approaches
   - Avoid simple left/right labeling - focus on substantive differences
   - Maximum 3 differences

4. DATA POINTS:
   - Extract all specific numerical data mentioned across articles
   - Include: percentages, dollar amounts, counts, dates, rates, etc.
   - Format as an array of strings (e.g., ["$25B", "10%", "150,000"])
   - Include only data that appears in 2+ articles

ANALYSIS REQUIREMENTS:
- Be precise: Only cite facts that are actually present in the articles
- Be insightful: Go beyond surface-level similarities to find meaningful overlaps
- Be nuanced: Recognize that agreement on facts can coexist with different interpretations
- Focus on the "Aha!" moment: Highlight surprising commonalities between seemingly opposing perspectives
- Use specific data: Include actual numbers, statistics, or concrete facts when available
- Avoid generic statements: Make each insight specific to these particular articles

OUTPUT FORMAT: Return ONLY valid JSON matching this exact structure:

{
  "sharedFacts": [
    "Specific shared fact with data point (e.g., 'Both sources cite the $25B annual budget')",
    "Another shared fact or data point",
    "..."
  ],
  "commonThemes": [
    "Both perspectives address [specific theme/concept]",
    "Another common theme both recognize",
    "..."
  ],
  "differences": [
    "Specific difference in emphasis or interpretation",
    "Another substantive difference",
    "..."
  ],
  "dataPoints": [
    "$25B",
    "10%",
    "150,000",
    "..."
  ]
}

IMPORTANT:
- Return ONLY the JSON object, no markdown, no code blocks, no explanations
- Ensure all arrays contain only strings (no nested objects)
- All strings should be clear, complete sentences or data points
- Maximum 5 sharedFacts, 4 commonThemes, 3 differences, 10 dataPoints
- sharedFacts should be the most compelling - these are the "Aha!" moments
- Be specific: Include actual numbers or data when mentioned
- If no shared facts/data exist, return empty arrays

Perform the analysis now:`;
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
                url: { type: 'string' },
                perspectiveAnalysis: {
                  type: 'object',
                  required: [
                    'languagePatterns',
                    'sourceClassification',
                    'topicCoverage',
                    'confidenceScore',
                    'reasoning'
                  ],
                  properties: {
                    languagePatterns: {
                      type: 'object',
                      required: ['framingIndicators', 'sentiment', 'examples'],
                      properties: {
                        framingIndicators: {
                          type: 'array',
                          items: { type: 'string', minLength: 3 }
                        },
                        sentiment: {
                          type: 'string',
                          enum: ['positive', 'negative', 'neutral', 'mixed']
                        },
                        examples: {
                          type: 'array',
                          items: { type: 'string', minLength: 5 }
                        }
                      }
                    },
                    sourceClassification: {
                      type: 'object',
                      required: ['publicationBias', 'editorialStance'],
                      properties: {
                        publicationBias: { type: 'string', minLength: 10 },
                        editorialStance: { type: 'string', minLength: 10 },
                        reputationFactors: {
                          type: 'array',
                          items: { type: 'string', minLength: 3 }
                        }
                      }
                    },
                    topicCoverage: {
                      type: 'object',
                      required: ['emphasisPoints', 'coverageDistribution'],
                      properties: {
                        emphasisPoints: {
                          type: 'array',
                          items: { type: 'string', minLength: 3 }
                        },
                        coverageDistribution: { type: 'string', minLength: 10 },
                        omissions: {
                          type: 'array',
                          items: { type: 'string', minLength: 3 }
                        }
                      }
                    },
                    confidenceScore: {
                      type: 'number',
                      minimum: 0,
                      maximum: 100
                    },
                    reasoning: { type: 'string', minLength: 20 }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
} as const;
