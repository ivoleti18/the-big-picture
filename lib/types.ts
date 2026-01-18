export type PoliticalLeaning = 
  | 'left' 
  | 'lean-left' 
  | 'center' 
  | 'lean-right' 
  | 'right' 
  | 'neutral';

/**
 * Perspective Analysis provides detailed breakdown of why an article
 * received its political leaning classification
 */
export interface PerspectiveAnalysis {
  /** Analysis of language patterns used in the article */
  languagePatterns: {
    /** Specific framing indicators identified in the content */
    framingIndicators: string[];
    /** Overall sentiment assessment (positive, negative, neutral, mixed) */
    sentiment: 'positive' | 'negative' | 'neutral' | 'mixed';
    /** Examples of specific phrases or language patterns that indicate perspective */
    examples: string[];
  };
  
  /** Reasoning for how the source contributes to classification */
  sourceClassification: {
    /** Explanation of how the publication's known bias influences classification */
    publicationBias: string;
    /** Historical context about the source's editorial stance */
    editorialStance: string;
    /** How source reputation factors into the classification */
    reputationFactors?: string[];
  };
  
  /** What aspects of the topic receive emphasis in the article */
  topicCoverage: {
    /** Key aspects/angles of the topic that are emphasized */
    emphasisPoints: string[];
    /** What perspectives or angles are given more or less coverage */
    coverageDistribution: string;
    /** Notable omissions or underemphasized perspectives */
    omissions?: string[];
  };
  
  /** Confidence level in the leaning classification (0-100) */
  confidenceScore: number;
  
  /** Overall explanation/summary of why this classification was made */
  reasoning: string;
}

export interface Article {
  id: string;
  title: string;
  source: string;
  leaning: PoliticalLeaning;
  summary: string[];
  url?: string;
  keyFacts?: string[];
  /** Detailed analysis explaining the political leaning classification */
  perspectiveAnalysis?: PerspectiveAnalysis;
}

export interface SubTopic {
  id: string;
  name: string;
  description: string;
  articles: Article[];
}

export interface Topic {
  id: string;
  name: string;
  description: string;
  subTopics: SubTopic[];
}

export interface SelectedArticle extends Article {
  subTopicName: string;
}

export interface ComparisonResult {
  leftArticle: SelectedArticle;
  rightArticle: SelectedArticle;
  sharedFacts: string[];
  differences: string[];
}

export const leaningColors: Record<PoliticalLeaning, string> = {
  'left': 'bg-spectrum-left',
  'lean-left': 'bg-spectrum-lean-left',
  'center': 'bg-spectrum-center',
  'lean-right': 'bg-spectrum-lean-right',
  'right': 'bg-spectrum-right',
  'neutral': 'bg-spectrum-neutral',
};

export const leaningLabels: Record<PoliticalLeaning, string> = {
  'left': 'Left',
  'lean-left': 'Lean Left',
  'center': 'Center',
  'lean-right': 'Lean Right',
  'right': 'Right',
  'neutral': 'Neutral',
};

export const leaningBorderColors: Record<PoliticalLeaning, string> = {
  'left': 'border-spectrum-left',
  'lean-left': 'border-spectrum-lean-left',
  'center': 'border-spectrum-center',
  'lean-right': 'border-spectrum-lean-right',
  'right': 'border-spectrum-right',
  'neutral': 'border-spectrum-neutral',
};
