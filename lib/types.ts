export type PoliticalLeaning = 
  | 'left' 
  | 'lean-left' 
  | 'center' 
  | 'lean-right' 
  | 'right' 
  | 'neutral';

export interface Article {
  id: string;
  title: string;
  source: string;
  leaning: PoliticalLeaning;
  summary: string[];
  url?: string;
  keyFacts?: string[];
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
