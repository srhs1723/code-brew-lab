
import React from 'react';
import { Button } from "@/components/ui/button";
import { Moon, Sun } from 'lucide-react';
import { useEditor } from '@/context/EditorContext';

export default function ThemeToggle() {
  const { editorState, toggleDarkMode } = useEditor();
  const { isDarkMode } = editorState;

  return (
    <Button 
      variant="ghost" 
      size="icon"
      onClick={toggleDarkMode} 
      aria-label="Toggle theme"
      className="rounded-full transition-all"
      title={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDarkMode ? (
        <Sun className="h-5 w-5 text-yellow-400" />
      ) : (
        <Moon className="h-5 w-5 text-slate-700" />
      )}
    </Button>
  );
}
