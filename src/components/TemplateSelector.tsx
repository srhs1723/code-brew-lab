
import React from 'react';
import { templates } from '@/utils/templates';
import { useEditor } from '@/context/EditorContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export default function TemplateSelector() {
  const { setTemplate } = useEditor();

  const handleSelectTemplate = (index: number) => {
    const template = templates[index];
    setTemplate(template.html, template.css, template.javascript);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          Templates
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Choose a Template</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {templates.map((template, index) => (
          <DropdownMenuItem 
            key={index} 
            onClick={() => handleSelectTemplate(index)}
            className="cursor-pointer"
          >
            <div>
              <div className="font-medium">{template.name}</div>
              <div className="text-xs text-muted-foreground">{template.description}</div>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
