'use client';

import { memo } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';

// Inject shimmer animation styles
if (typeof document !== 'undefined') {
  const styleId = 'skeleton-shimmer-styles';
  if (!document.getElementById(styleId)) {
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      @keyframes skeleton-shimmer {
        0% {
          background-position: -200% 0;
        }
        100% {
          background-position: 200% 0;
        }
      }
      .skeleton-shimmer {
        background: linear-gradient(
          90deg,
          var(--muted) 25%,
          var(--accent) 50%,
          var(--muted) 75%
        );
        background-size: 200% 100%;
        animation: skeleton-shimmer 2s infinite;
      }
    `;
    document.head.appendChild(style);
  }
}

// Central Skeleton Node
export const SkeletonCentralNode = memo(function SkeletonCentralNode({ data }: NodeProps) {
  return (
    <div className="flex items-center justify-center">
      <div className="relative flex items-center justify-center w-40 h-40 rounded-full border-2 border-border">
        <div className="absolute inset-0 rounded-full skeleton-shimmer" />
        <div className="absolute inset-2 rounded-full bg-muted/30" />
        <div className="relative z-10 text-center px-4">
          <div className="h-4 w-24 bg-muted-foreground/20 rounded mx-auto skeleton-shimmer" />
        </div>
      </div>
      <Handle type="source" position={Position.Right} className="!bg-border !w-3 !h-3 pointer-events-none" />
      <Handle type="source" position={Position.Bottom} className="!bg-border !w-3 !h-3 pointer-events-none" />
      <Handle type="source" position={Position.Left} className="!bg-border !w-3 !h-3 pointer-events-none" />
      <Handle type="source" position={Position.Top} className="!bg-border !w-3 !h-3 pointer-events-none" />
    </div>
  );
});

// Sub-Topic Skeleton Node
export const SkeletonSubTopicNode = memo(function SkeletonSubTopicNode({ data }: NodeProps) {
  return (
    <div className="flex items-center justify-center">
      <Handle type="target" position={Position.Left} className="!bg-border !w-2 !h-2 pointer-events-none" />
      <Handle type="target" position={Position.Top} className="!bg-border !w-2 !h-2 pointer-events-none" />
      <Handle type="target" position={Position.Bottom} className="!bg-border !w-2 !h-2 pointer-events-none" />
      <Handle type="target" position={Position.Right} className="!bg-border !w-2 !h-2 pointer-events-none" />
      <div className="w-28 h-28 rounded-full border-2 border-border relative overflow-hidden">
        <div className="absolute inset-0 skeleton-shimmer" />
        <div className="absolute inset-1 rounded-full bg-muted/30 flex items-center justify-center">
          <div className="h-3 w-16 bg-muted-foreground/20 rounded skeleton-shimmer" />
        </div>
      </div>
      <Handle type="source" position={Position.Right} className="!bg-border !w-2 !h-2 pointer-events-none" />
      <Handle type="source" position={Position.Bottom} className="!bg-border !w-2 !h-2 pointer-events-none" />
      <Handle type="source" position={Position.Left} className="!bg-border !w-2 !h-2 pointer-events-none" />
      <Handle type="source" position={Position.Top} className="!bg-border !w-2 !h-2 pointer-events-none" />
    </div>
  );
});

// Article Skeleton Node
export const SkeletonArticleNode = memo(function SkeletonArticleNode({ data }: NodeProps) {
  return (
    <div className="flex items-center justify-center">
      <Handle type="target" position={Position.Left} className="!bg-border !w-2 !h-2 pointer-events-none" />
      <Handle type="target" position={Position.Top} className="!bg-border !w-2 !h-2 pointer-events-none" />
      <Handle type="target" position={Position.Bottom} className="!bg-border !w-2 !h-2 pointer-events-none" />
      <Handle type="target" position={Position.Right} className="!bg-border !w-2 !h-2 pointer-events-none" />
      <div className="w-24 min-h-24 rounded-xl border-2 border-border flex flex-col items-center justify-center p-2 relative overflow-hidden">
        <div className="absolute inset-0 skeleton-shimmer" />
        <div className="absolute inset-0.5 rounded-xl bg-muted/30 flex flex-col items-center justify-center gap-2 p-2">
          <div className="h-2.5 w-16 bg-muted-foreground/20 rounded skeleton-shimmer" />
          <div className="h-2 w-12 bg-muted-foreground/20 rounded skeleton-shimmer" />
        </div>
      </div>
    </div>
  );
});

export const skeletonNodeTypes = {
  central: SkeletonCentralNode,
  subTopic: SkeletonSubTopicNode,
  article: SkeletonArticleNode,
};

