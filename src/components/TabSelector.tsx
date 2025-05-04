
import { useEditor, Language } from '@/context/EditorContext';
import { cn } from '@/lib/utils';

export default function TabSelector() {
  const { editorState, setCurrentLanguage } = useEditor();
  const { currentLanguage } = editorState;
  
  const tabs: { id: Language, label: string }[] = [
    { id: 'html', label: 'HTML' },
    { id: 'css', label: 'CSS' },
    { id: 'javascript', label: 'JavaScript' }
  ];

  return (
    <div className="flex mb-1 border-b border-border">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setCurrentLanguage(tab.id)}
          className={cn(
            "px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            currentLanguage === tab.id
              ? "text-foreground border-b-2 border-accent"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
