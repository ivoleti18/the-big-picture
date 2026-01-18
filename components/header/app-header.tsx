'use client';

import { Compass, GitCompare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TopicSelector } from './topic-selector';
import type { Topic } from '@/lib/types';
import { cn } from '@/lib/utils';

interface AppHeaderProps {
  selectedTopic: Topic;
  onTopicChange: (topic: Topic) => void;
  compareMode: boolean;
  onCompareModeToggle: () => void;
  compareCount: number;
}

export function AppHeader({
  selectedTopic,
  onTopicChange,
  compareMode,
  onCompareModeToggle,
  compareCount,
}: AppHeaderProps) {
  return (
    <header className="h-16 border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="h-full px-4 md:px-6 flex items-center justify-between gap-4">
        {/* Logo & Title */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center">
            <Compass className="w-5 h-5 text-primary" />
          </div>
          <div className="hidden md:block">
            <h1 className="text-lg font-bold text-foreground leading-none">
              TheBigPicture
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Map complexity. Foster understanding.
            </p>
          </div>
        </div>

        {/* Center: Topic Selector */}
        <TopicSelector
          selectedTopic={selectedTopic}
          onTopicChange={onTopicChange}
        />

        {/* Right: Compare Mode Toggle */}
        <Button
          variant={compareMode ? 'default' : 'outline'}
          className={cn(
            "gap-2 relative",
            compareMode && "bg-yellow-500/20 border-yellow-500 text-yellow-400 hover:bg-yellow-500/30"
          )}
          onClick={onCompareModeToggle}
        >
          <GitCompare className="w-4 h-4" />
          <span className="hidden sm:inline">Compare</span>
          {compareMode && compareCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-yellow-500 text-yellow-950 text-xs font-bold flex items-center justify-center">
              {compareCount}
            </span>
          )}
        </Button>
      </div>
    </header>
  );
}
