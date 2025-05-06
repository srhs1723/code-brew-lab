
import { useEffect, useRef, useState } from 'react';
import { useEditor } from '@/context/EditorContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { AlertCircle, Terminal } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SharedCode {
  html: string;
  css: string;
  javascript: string;
}

interface PreviewProps {
  readOnly?: boolean;
  initialCode?: SharedCode | null;
}

export default function Preview({ readOnly = false, initialCode = null }: PreviewProps) {
  const { editorState } = useEditor();
  const html = initialCode?.html ?? editorState.html;
  const css = initialCode?.css ?? editorState.css;
  const javascript = initialCode?.javascript ?? editorState.javascript;
  
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const isMobile = useIsMobile();
  const [previewError, setPreviewError] = useState<string | null>(null);
  const [showConsole, setShowConsole] = useState(false);
  const [consoleLogs, setConsoleLogs] = useState<string[]>([]);

  useEffect(() => {
    // Use a timer to slightly delay the update for better performance
    const timer = setTimeout(() => {
      updatePreview();
    }, 300);
    return () => clearTimeout(timer);
  }, [html, css, javascript]);

  useEffect(() => {
    // Add keyboard shortcuts (only in editor mode)
    if (readOnly) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+Enter to update preview
      if (e.ctrlKey && e.key === 'Enter') {
        updatePreview();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [readOnly]);

  const updatePreview = () => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    try {
      // Reset console logs when updating preview
      setConsoleLogs([]);
      
      // Create custom console to capture logs
      const consoleInterceptor = `
        (function() {
          const originalConsole = console;
          console = {
            log: function() {
              const args = Array.from(arguments).map(arg => 
                typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
              ).join(' ');
              originalConsole.log(...arguments);
              window.parent.postMessage({type: 'console', method: 'log', args}, '*');
            },
            error: function() {
              const args = Array.from(arguments).map(arg => 
                typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
              ).join(' ');
              originalConsole.error(...arguments);
              window.parent.postMessage({type: 'console', method: 'error', args}, '*');
            },
            warn: function() {
              const args = Array.from(arguments).map(arg => 
                typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
              ).join(' ');
              originalConsole.warn(...arguments);
              window.parent.postMessage({type: 'console', method: 'warn', args}, '*');
            },
            info: function() {
              const args = Array.from(arguments).map(arg => 
                typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
              ).join(' ');
              originalConsole.info(...arguments);
              window.parent.postMessage({type: 'console', method: 'info', args}, '*');
            }
          };
        })();
      `;

      // Create the HTML content with proper sandbox attributes
      const content = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
              /* Reset styles for consistency */
              * {
                box-sizing: border-box;
                margin: 0;
                padding: 0;
              }
              body {
                font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                line-height: 1.5;
                overflow-x: hidden;
                width: 100%;
                height: 100%;
              }
              ${css}
            </style>
          </head>
          <body>
            ${html}
            <script>${consoleInterceptor}</script>
            <script>${javascript}</script>
          </body>
        </html>
      `;
      
      // Set the content using srcdoc
      iframe.srcdoc = content;
      setPreviewError(null);
      
    } catch (error) {
      console.error("Error updating preview:", error);
      setPreviewError("Failed to update preview");
    }
  };

  // Handle console messages from iframe
  useEffect(() => {
    const handleConsoleMessages = (event: MessageEvent) => {
      if (event.data && event.data.type === 'console') {
        setConsoleLogs(prev => [...prev, `${event.data.method}: ${event.data.args}`]);
      }
    };
    
    window.addEventListener('message', handleConsoleMessages);
    return () => window.removeEventListener('message', handleConsoleMessages);
  }, []);

  return (
    <div className="h-full w-full flex flex-col bg-card rounded-lg shadow border border-border overflow-hidden">
      <div className="px-4 py-2 bg-muted flex items-center justify-between border-b border-border">
        <div className="text-sm font-medium flex items-center gap-1">
          Preview
          {isMobile && <span className="text-xs text-muted-foreground">(Mobile view)</span>}
        </div>
        <div className="flex items-center gap-2">
          {!readOnly && (
            <Button
              onClick={updatePreview}
              className="text-xs px-2 py-1 bg-primary text-primary-foreground rounded hover:bg-primary/90"
              aria-label="Refresh preview"
              size="sm"
            >
              Refresh
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowConsole(prev => !prev)}
            className="flex items-center gap-1 text-xs"
            title="JS++ Console"
          >
            <Terminal className="h-4 w-4" />
            JS++
          </Button>
        </div>
      </div>
      <div className="flex-1 overflow-hidden relative bg-white">
        {previewError && (
          <div className="absolute inset-0 flex items-center justify-center bg-muted/50 z-10">
            <div className="flex items-center gap-2 text-destructive bg-destructive/10 px-3 py-2 rounded">
              <AlertCircle size={16} />
              <span>{previewError}</span>
            </div>
          </div>
        )}
        <iframe
          ref={iframeRef}
          title="preview"
          sandbox="allow-scripts"
          className="w-full h-full border-0"
        />
      </div>
      
      {showConsole && (
        <div className="border-t border-border bg-black text-green-500 font-mono text-sm p-2 max-h-40 overflow-y-auto">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs text-white">Console</span>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setConsoleLogs([])}
              className="h-6 px-2 text-xs text-white hover:text-white"
            >
              Clear
            </Button>
          </div>
          {consoleLogs.length === 0 ? (
            <div className="text-xs opacity-50 italic">No console output</div>
          ) : (
            consoleLogs.map((log, i) => (
              <div key={i} className="whitespace-pre-wrap break-words">{log}</div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
