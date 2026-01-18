'use client';

import { useMemo } from 'react';
import { X, Sparkles, ArrowLeftRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { SelectedArticle, PoliticalLeaning } from '@/lib/types';

interface ComparisonPanelProps {
  articles: SelectedArticle[];
  onRemoveArticle: (id: string) => void;
  onClose: () => void;
}

const leaningStyles: Record<PoliticalLeaning, { bg: string; border: string; text: string }> = {
  'left': { bg: 'bg-blue-600/20', border: 'border-blue-500', text: 'text-blue-400' },
  'lean-left': { bg: 'bg-sky-500/20', border: 'border-sky-400', text: 'text-sky-300' },
  'center': { bg: 'bg-purple-500/20', border: 'border-purple-400', text: 'text-purple-300' },
  'lean-right': { bg: 'bg-orange-500/20', border: 'border-orange-400', text: 'text-orange-300' },
  'right': { bg: 'bg-red-600/20', border: 'border-red-500', text: 'text-red-400' },
  'neutral': { bg: 'bg-gray-500/20', border: 'border-gray-400', text: 'text-gray-300' },
};

// Find common ground between articles based on key facts
function findCommonGround(articles: SelectedArticle[]): string[] {
  if (articles.length < 2) return [];
  
  const allFacts = articles.flatMap(a => a.keyFacts || []);
  const factCounts = new Map<string, number>();
  
  for (const fact of allFacts) {
    const normalizedFact = fact.toLowerCase();
    factCounts.set(normalizedFact, (factCounts.get(normalizedFact) || 0) + 1);
  }
  
  // Find shared themes even if wording differs
  const commonThemes: string[] = [];
  
  // Check for numerical overlap
  const numbers = allFacts.flatMap(f => f.match(/\d+/g) || []);
  const uniqueNumbers = [...new Set(numbers)];
  if (uniqueNumbers.length > 0) {
    const numberMentions = uniqueNumbers.filter(num => 
      allFacts.filter(f => f.includes(num)).length >= 2
    );
    if (numberMentions.length > 0) {
      commonThemes.push(`Both sources reference similar data points (${numberMentions.slice(0, 2).join(', ')})`);
    }
  }

  // Check for topic overlap based on keywords
  const keywords = ['cost', 'safety', 'jobs', 'environment', 'health', 'productivity', 'innovation'];
  for (const keyword of keywords) {
    const articlesWithKeyword = articles.filter(a => 
      a.summary.some(s => s.toLowerCase().includes(keyword)) ||
      (a.keyFacts || []).some(f => f.toLowerCase().includes(keyword))
    );
    if (articlesWithKeyword.length >= 2) {
      commonThemes.push(`Both perspectives address ${keyword}-related concerns`);
    }
  }

  // Default common ground based on shared topic
  if (articles.length >= 2 && articles[0].subTopicName === articles[1].subTopicName) {
    commonThemes.push(`Both articles examine the "${articles[0].subTopicName}" aspect of this issue`);
  }

  // Add a general insight
  if (articles.length >= 2) {
    const leanings = articles.map(a => a.leaning);
    const hasOpposing = (leanings.includes('left') || leanings.includes('lean-left')) && 
                       (leanings.includes('right') || leanings.includes('lean-right'));
    if (hasOpposing) {
      commonThemes.push('Despite different political leanings, both sources acknowledge the complexity of this issue');
    }
  }

  return [...new Set(commonThemes)].slice(0, 4);
}

export function ComparisonPanel({ articles, onRemoveArticle, onClose }: ComparisonPanelProps) {
  const commonGround = useMemo(() => findCommonGround(articles), [articles]);

  if (articles.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center">
        <div className="w-16 h-16 rounded-full bg-yellow-500/20 flex items-center justify-center mb-4">
          <ArrowLeftRight className="w-8 h-8 text-yellow-500" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">Compare Perspectives</h3>
        <p className="text-sm text-muted-foreground max-w-[260px]">
          Select 2 or more articles from different perspectives to discover common ground and key differences.
        </p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-border shrink-0">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <ArrowLeftRight className="w-5 h-5 text-yellow-500" />
            Compare Views
          </h2>
          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onClose}>
            <X className="h-4 w-4" />
            <span className="sr-only">Close comparison</span>
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">
          {articles.length} article{articles.length !== 1 ? 's' : ''} selected
        </p>
      </div>

      <ScrollArea className="flex-1 min-h-0">
        <div className="p-4 space-y-4">
          {/* Selected Articles */}
          {articles.map((article) => {
            const style = leaningStyles[article.leaning];
            return (
              <Card key={article.id} className={cn("border", style.border, style.bg)}>
                <CardHeader className="p-3 pb-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <Badge 
                        className={cn(
                          "mb-1 text-xs",
                          style.bg,
                          style.border,
                          style.text
                        )}
                      >
                        {article.leaning.replace('-', ' ')}
                      </Badge>
                      <CardTitle className="text-sm font-medium text-foreground leading-tight">
                        {article.source}
                      </CardTitle>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 shrink-0"
                      onClick={() => onRemoveArticle(article.id)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-3 pt-0">
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {article.summary[0]}
                  </p>
                </CardContent>
              </Card>
            );
          })}

          {/* Common Ground Section */}
          {articles.length >= 2 && commonGround.length > 0 && (
            <>
              <Separator />
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-yellow-500" />
                  Common Ground Found
                </h3>
                <Card className="border-yellow-500/30 bg-yellow-500/10">
                  <CardContent className="p-4">
                    <ul className="space-y-2">
                      {commonGround.map((point, index) => (
                        <li key={index} className="flex gap-2 text-sm">
                          <span className="text-yellow-500 shrink-0">•</span>
                          <span className="text-foreground/90">{point}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
                <p className="text-xs text-muted-foreground mt-3 text-center italic">
                  The Aha! Moment: Finding shared facts across perspectives
                </p>
              </div>
            </>
          )}

          {/* Prompt for more */}
          {articles.length < 2 && (
            <div className="bg-muted/30 rounded-lg p-4 text-center">
              <p className="text-sm text-muted-foreground">
                Select one more article to reveal common ground
              </p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
