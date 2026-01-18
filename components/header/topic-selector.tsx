'use client';

import { Search, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import type { Topic } from '@/lib/types';
import { demoTopics } from '@/lib/demo-data';

interface TopicSelectorProps {
  selectedTopic: Topic;
  onTopicChange: (topic: Topic) => void;
}

export function TopicSelector({ selectedTopic, onTopicChange }: TopicSelectorProps) {
  return (
    <div className="flex items-center gap-3">
      {/* Search Input (cosmetic for demo) */}
      <div className="relative hidden sm:block">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search topics..."
          className="pl-9 w-[200px] md:w-[280px] bg-muted/50 border-border"
          value={selectedTopic.name}
          readOnly
        />
      </div>

      {/* Topic Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="gap-2 bg-transparent">
            <span className="hidden sm:inline">Select Topic</span>
            <span className="sm:hidden">{selectedTopic.name}</span>
            <ChevronDown className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[300px]">
          {demoTopics.map((topic) => (
            <DropdownMenuItem
              key={topic.id}
              onClick={() => onTopicChange(topic)}
              className="flex flex-col items-start gap-1 py-3 cursor-pointer"
            >
              <span className="font-medium text-foreground">{topic.name}</span>
              <span className="text-xs text-muted-foreground line-clamp-1">
                {topic.description}
              </span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
