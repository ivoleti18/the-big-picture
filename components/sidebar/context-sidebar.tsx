'use client';

import { X, ExternalLink, Brain } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import type { SelectedArticle, PoliticalLeaning } from '@/lib/types';

interface ContextSidebarProps {
  article: SelectedArticle | null;
  onClose: () => void;
}

const leaningStyles: Record<PoliticalLeaning, { bg: string; border: string; text: string; label: string }> = {
  'left': { bg: 'bg-blue-600/20', border: 'border-blue-500', text: 'text-blue-400', label: 'Left' },
  'lean-left': { bg: 'bg-sky-500/20', border: 'border-sky-400', text: 'text-sky-300', label: 'Lean Left' },
  'center': { bg: 'bg-purple-500/20', border: 'border-purple-400', text: 'text-purple-300', label: 'Center' },
  'lean-right': { bg: 'bg-orange-500/20', border: 'border-orange-400', text: 'text-orange-300', label: 'Lean Right' },
  'right': { bg: 'bg-red-600/20', border: 'border-red-500', text: 'text-red-400', label: 'Right' },
  'neutral': { bg: 'bg-gray-500/20', border: 'border-gray-400', text: 'text-gray-300', label: 'Neutral' },
};

export function ContextSidebar({ article, onClose }: ContextSidebarProps) {
  if (!article) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
          <Brain className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">Select an Article</h3>
        <p className="text-sm text-muted-foreground max-w-[240px]">
          Click on any article node in the graph to view its summary and perspective analysis.
        </p>
      </div>
    );
  }

  const style = leaningStyles[article.leaning];

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-border shrink-0">
        <div className="flex items-start justify-between gap-2 mb-3">
          <Badge
            className={cn(
              "px-2 py-1 text-xs font-medium",
              style.bg,
              style.border,
              style.text,
              "border"
            )}
          >
            {style.label}
          </Badge>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 shrink-0"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close sidebar</span>
          </Button>
        </div>

        <h2 className="text-lg font-bold text-foreground leading-tight mb-2 break-words">
          {article.title}
        </h2>

        <div className="flex items-center gap-2 text-sm min-w-0">
          <span className="text-muted-foreground shrink-0">Source:</span>
          <span className="font-medium text-foreground break-words min-w-0">{article.source}</span>
        </div>

        <div className="flex items-center gap-2 text-sm mt-1 min-w-0">
          <span className="text-muted-foreground shrink-0">Topic:</span>
          <span className="font-medium text-foreground break-words min-w-0">{article.subTopicName}</span>
        </div>
      </div>

      {/* Content */}
      <ScrollArea className="flex-1 min-h-0">
        <div className="p-4 space-y-4">
          {/* Summary Section */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              The Gist
            </h3>
            <ul className="space-y-3">
              {article.summary.map((point, index) => (
                <li key={index} className="flex gap-3 text-sm min-w-0">
                  <span className="text-muted-foreground shrink-0 mt-1">•</span>
                  <span className="text-foreground/90 leading-relaxed break-words">{point}</span>
                </li>
              ))}
            </ul>
          </div>

          <Separator />

          {/* Key Facts */}
          {article.keyFacts && article.keyFacts.length > 0 && (
            <>
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  Key Facts
                </h3>
                <div className="flex flex-wrap gap-2">
                  {article.keyFacts.map((fact, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="text-xs bg-green-500/10 text-green-400 border border-green-500/30"
                    >
                      {fact}
                    </Badge>
                  ))}
                </div>
              </div>
              <Separator />
            </>
          )}

          {/* Read Original */}
          {article.url && (
            <Button variant="secondary" className="w-full gap-2">
              <ExternalLink className="w-4 h-4" />
              Read Original Article
            </Button>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
