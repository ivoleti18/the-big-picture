'use client';

import { memo } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import { cn } from '@/lib/utils';
import type { PoliticalLeaning } from '@/lib/types';
import { Badge } from '@/components/ui/badge';

// Central Topic Node (Largest)
export const CentralNode = memo(function CentralNode({ data }: NodeProps) {
  return (
    <div className="flex items-center justify-center">
      <div className="relative flex items-center justify-center w-40 h-40 rounded-full bg-primary/20 border-2 border-primary shadow-lg shadow-primary/20">
        <div className="absolute inset-2 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 animate-pulse" />
        <div className="relative z-10 text-center px-4">
          <span className="text-lg font-bold text-foreground leading-tight">{data.label as string}</span>
        </div>
      </div>
      <Handle type="source" position={Position.Right} className="!bg-primary !w-3 !h-3" isConnectable={false} />
      <Handle type="source" position={Position.Bottom} className="!bg-primary !w-3 !h-3" isConnectable={false} />
      <Handle type="source" position={Position.Left} className="!bg-primary !w-3 !h-3" isConnectable={false} />
      <Handle type="source" position={Position.Top} className="!bg-primary !w-3 !h-3" isConnectable={false} />
    </div>
  );
});

// Sub-Topic Node (Medium)
export const SubTopicNode = memo(function SubTopicNode({ data }: NodeProps) {
  return (
    <div className="flex items-center justify-center">
      <Handle type="target" position={Position.Left} className="!bg-muted-foreground !w-2 !h-2" isConnectable={false} />
      <Handle type="target" position={Position.Top} className="!bg-muted-foreground !w-2 !h-2" isConnectable={false} />
      <Handle type="target" position={Position.Bottom} className="!bg-muted-foreground !w-2 !h-2" isConnectable={false} />
      <Handle type="target" position={Position.Right} className="!bg-muted-foreground !w-2 !h-2" isConnectable={false} />
      <div className="w-28 h-28 rounded-full bg-secondary border-2 border-border flex items-center justify-center shadow-md hover:shadow-lg hover:border-primary/50 transition-all duration-200">
        <span className="text-sm font-semibold text-foreground text-center px-3 leading-tight">
          {data.label as string}
        </span>
      </div>
      <Handle type="source" position={Position.Right} className="!bg-muted-foreground !w-2 !h-2" isConnectable={false} />
      <Handle type="source" position={Position.Bottom} className="!bg-muted-foreground !w-2 !h-2" isConnectable={false} />
      <Handle type="source" position={Position.Left} className="!bg-muted-foreground !w-2 !h-2" isConnectable={false} />
      <Handle type="source" position={Position.Top} className="!bg-muted-foreground !w-2 !h-2" isConnectable={false} />
    </div>
  );
});

// Article Node (Smallest) - Color coded by political leaning
const leaningColorMap: Record<PoliticalLeaning, { bg: string; border: string; text: string }> = {
  'left': { bg: 'bg-blue-600/20', border: 'border-blue-500', text: 'text-blue-400' },
  'lean-left': { bg: 'bg-sky-500/20', border: 'border-sky-400', text: 'text-sky-300' },
  'center': { bg: 'bg-purple-500/20', border: 'border-purple-400', text: 'text-purple-300' },
  'lean-right': { bg: 'bg-orange-500/20', border: 'border-orange-400', text: 'text-orange-300' },
  'right': { bg: 'bg-red-600/20', border: 'border-red-500', text: 'text-red-400' },
  'neutral': { bg: 'bg-gray-500/20', border: 'border-gray-400', text: 'text-gray-300' },
};

interface ArticleNodeData {
  label: string;
  source: string;
  leaning: PoliticalLeaning;
  selected?: boolean;
  isCompareCandidate?: boolean;
}

export const ArticleNode = memo(function ArticleNode({ data }: NodeProps) {
  const nodeData = data as ArticleNodeData;
  const colors = leaningColorMap[nodeData.leaning];
  
  return (
    <div className="flex items-center justify-center">
      <Handle type="target" position={Position.Left} className="!bg-muted-foreground !w-2 !h-2" isConnectable={false} />
      <Handle type="target" position={Position.Top} className="!bg-muted-foreground !w-2 !h-2" isConnectable={false} />
      <Handle type="target" position={Position.Bottom} className="!bg-muted-foreground !w-2 !h-2" isConnectable={false} />
      <Handle type="target" position={Position.Right} className="!bg-muted-foreground !w-2 !h-2" isConnectable={false} />
      <div 
        className={cn(
          "w-24 min-h-24 rounded-xl border-2 flex flex-col items-center justify-center p-2 shadow-md transition-all duration-200",
          colors.bg,
          colors.border,
          nodeData.selected && "ring-2 ring-primary ring-offset-2 ring-offset-background scale-110",
          nodeData.isCompareCandidate && "ring-2 ring-yellow-400 ring-offset-1 ring-offset-background",
          "hover:scale-105 hover:shadow-lg cursor-pointer"
        )}
      >
        <span className={cn("text-xs font-medium text-center leading-tight mb-1", colors.text)}>
          {nodeData.source}
        </span>
        <Badge 
          variant="outline" 
          className={cn(
            "text-[10px] px-1.5 py-0",
            colors.border,
            colors.text
          )}
        >
          {nodeData.leaning.replace('-', ' ')}
        </Badge>
      </div>
    </div>
  );
});

export const nodeTypes = {
  central: CentralNode,
  subTopic: SubTopicNode,
  article: ArticleNode,
};
