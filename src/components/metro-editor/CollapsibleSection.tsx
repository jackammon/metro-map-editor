"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronRight, Eye, EyeOff } from 'lucide-react';

interface CollapsibleSectionProps {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  defaultExpanded?: boolean;
  defaultVisible?: boolean;
  onVisibilityChange?: (visible: boolean) => void;
  className?: string;
}

export const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({
  title,
  icon,
  children,
  defaultExpanded = true,
  defaultVisible = true,
  onVisibilityChange,
  className = ""
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [isVisible, setIsVisible] = useState(defaultVisible);

  const handleVisibilityToggle = () => {
    const newVisible = !isVisible;
    setIsVisible(newVisible);
    onVisibilityChange?.(newVisible);
  };

  if (!isVisible) {
    return (
      <div className={`border-b border-gray-200 ${className}`}>
        <div className="flex items-center justify-between p-2 bg-gray-50/50">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            {icon}
            <span>{title}</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleVisibilityToggle}
            className="h-6 w-6 p-0"
          >
            <Eye className="h-3 w-3" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={`border-b border-gray-200 ${className}`}>
      <div className="flex items-center justify-between p-2 bg-gray-50/80">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 h-auto p-1 text-sm font-medium"
        >
          {isExpanded ? (
            <ChevronDown className="h-3 w-3" />
          ) : (
            <ChevronRight className="h-3 w-3" />
          )}
          {icon}
          <span>{title}</span>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleVisibilityToggle}
          className="h-6 w-6 p-0"
        >
          <EyeOff className="h-3 w-3" />
        </Button>
      </div>
      {isExpanded && (
        <div className="p-3 bg-white">
          {children}
        </div>
      )}
    </div>
  );
}; 