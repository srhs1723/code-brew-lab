
import { useEditor, Language } from '@/context/EditorContext';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { Code, FileText, Paintbrush } from 'lucide-react';

export default function TabSelector() {
  const { editorState, setCurrentLanguage } = useEditor();
  const { currentLanguage } = editorState;
  const isMobile = useIsMobile();
  
  const tabs: { id: Language, label: string, icon: React.ReactNode }[] = [
    { id: 'html', label: 'HTML', icon: <FileText size={isMobile ? 16 : 14} /> },
    { id: 'css', label: 'CSS', icon: <Paintbrush size={isMobile ? 16 : 14} /> },
    { id: 'javascript', label: 'JavaScript', icon: <Code size={isMobile ? 16 : 14} /> }
  ];

  return (
    <div className="flex mb-1 border-b border-border overflow-x-auto">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setCurrentLanguage(tab.id)}
          className={cn(
            "px-3 py-2 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring flex items-center gap-1 whitespace-nowrap",
            currentLanguage === tab.id
              ? "text-foreground border-b-2 border-accent"
              : "text-muted-foreground hover:text-foreground"
          )}
          aria-label={`Switch to ${tab.label} editor`}
        >
          {tab.icon}
          {!isMobile && tab.label}
          {isMobile && <span className="sr-only">{tab.label}</span>}
        </button>
      ))}
    </div>
  );
}
