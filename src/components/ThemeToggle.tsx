
import React from 'react';
import { Button } from "@/components/ui/button";
import { Moon, Sun } from 'lucide-react';
import { useEditor } from '@/context/EditorContext';
import { useIsMobile } from '@/hooks/use-mobile';

export default function ThemeToggle() {
  const { editorState, toggleDarkMode } = useEditor();
  const { isDarkMode } = editorState;
  const isMobile = useIsMobile();

  return (
    <Button 
      variant="ghost" 
      size={isMobile ? "sm" : "icon"}
      onClick={toggleDarkMode} 
      aria-label="Toggle theme"
      className="rounded-full transition-all"
      title={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDarkMode ? (
        <Sun className={`${isMobile ? 'h-4 w-4' : 'h-5 w-5'} text-yellow-400`} />
      ) : (
        <Moon className={`${isMobile ? 'h-4 w-4' : 'h-5 w-5'} text-slate-700`} />
      )}
    </Button>
  );
}
