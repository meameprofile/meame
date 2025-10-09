// RUTA: src/components/ui/TagInput.tsx
/**
 * @file TagInput.tsx
 * @description Componente de UI atómico y de élite para la entrada de etiquetas (tags).
 * @version 1.0.0 (Elite & MEA/UX)
 * @author RaZ Podestá - MetaShark Tech
 */
"use client";

import React, { useState } from "react";
import { Input, type InputProps } from "@/components/ui/Input";
//import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { DynamicIcon } from "./DynamicIcon";
import { cn } from "@/shared/lib/utils/cn";

interface TagInputProps extends Omit<InputProps, "value" | "onChange"> {
  value: string[];
  onChange: (tags: string[]) => void;
}

export const TagInput = React.forwardRef<HTMLInputElement, TagInputProps>(
  ({ value, onChange, className, ...props }, ref) => {
    const [inputValue, setInputValue] = useState("");

    const handleAddTag = (tagToAdd: string) => {
      const newTag = tagToAdd.trim();
      if (newTag && !value.includes(newTag)) {
        onChange([...value, newTag]);
      }
      setInputValue("");
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" || e.key === ",") {
        e.preventDefault();
        handleAddTag(inputValue);
      }
    };

    const handleRemoveTag = (tagToRemove: string) => {
      onChange(value.filter((tag) => tag !== tagToRemove));
    };

    return (
      <div>
        <div
          className={cn(
            "flex flex-wrap gap-2 rounded-md border border-input bg-background p-2",
            className
          )}
        >
          {value.map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="flex items-center gap-1"
            >
              {tag}
              <button
                type="button"
                onClick={() => handleRemoveTag(tag)}
                className="rounded-full hover:bg-muted-foreground/20"
                aria-label={`Remove ${tag}`}
              >
                <DynamicIcon name="X" className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          <Input
            ref={ref}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 border-none shadow-none focus-visible:ring-0 h-auto p-0"
            {...props}
          />
        </div>
      </div>
    );
  }
);

TagInput.displayName = "TagInput";
