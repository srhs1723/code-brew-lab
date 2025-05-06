import { EditorProvider } from "@/context/EditorContext";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Header from "@/components/Header";
import Editor from "@/components/Editor";
import Preview from "@/components/Preview";
import TabSelector from "@/components/TabSelector";
import { useIsMobile } from "@/hooks/use-mobile";
import { Eye, Code } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";

interface SharedCodeData {
  html: string;
  css: string;
  javascript: string;
  expiry: number;
  id: string;
}

const Index = () => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [activeView, setActiveView] = useState<'editor' | 'preview'>('editor');
  const [initialCode, setInitialCode] = useState<{
    html?: string;
    css?: string;
    javascript?: string;
  } | null>(null);

  // Check for shared code on mount
  useEffect(() => {
    const shareId = searchParams.get('share');
    
    if (shareId) {
      // Redirect to the dedicated share page instead
      navigate(`/share?id=${shareId}`);
    }
  }, [searchParams, navigate]);

  return (
    <EditorProvider initialCode={initialCode}>
      <div className="min-h-screen flex flex-col">
        <Header />
        
        {isMobile ? (
          // Mobile layout with toggle buttons for editor/preview
          <div className="flex-grow flex flex-col overflow-hidden">
            <div className="flex items-center justify-center p-2 bg-muted border-b border-border">
              <div className="flex rounded-md overflow-hidden">
                <Button
                  variant={activeView === 'editor' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setActiveView('editor')}
                  className="flex items-center gap-2 rounded-r-none border-r-0"
                >
                  <Code size={16} /> Editor
                </Button>
                <Button 
                  variant={activeView === 'preview' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setActiveView('preview')}
                  className="flex items-center gap-2 rounded-l-none"
                >
                  <Eye size={16} /> Preview
                </Button>
              </div>
            </div>
            
            <div className="flex-grow p-2">
              {activeView === 'editor' ? (
                <div className="h-full flex flex-col">
                  <TabSelector />
                  <div className="flex-grow bg-card rounded-lg shadow border border-border overflow-hidden">
                    <Editor />
                  </div>
                </div>
              ) : (
                <div className="h-full">
                  <Preview />
                </div>
              )}
            </div>
          </div>
        ) : (
          // Desktop layout with split view
          <div className="flex-grow flex flex-col md:flex-row overflow-hidden">
            <div className="w-full md:w-1/2 h-1/2 md:h-full p-4 flex flex-col">
              <TabSelector />
              <div className="flex-grow bg-card rounded-lg shadow border border-border overflow-hidden">
                <Editor />
              </div>
            </div>
            
            <div className="w-full md:w-1/2 h-1/2 md:h-full p-4">
              <Preview />
            </div>
          </div>
        )}
        
        <footer className="text-center py-4 text-sm text-muted-foreground border-t border-border">
          <p>HTMLReader - Live Code Editor</p>
        </footer>
      </div>
    </EditorProvider>
  );
};

export default Index;
