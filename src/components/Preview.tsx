
import { useEffect, useRef, useState } from 'react';
import { useEditor } from '@/context/EditorContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { AlertCircle } from 'lucide-react';

export default function Preview() {
  const { editorState } = useEditor();
  const { html, css, javascript } = editorState;
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const isMobile = useIsMobile();
  const [previewError, setPreviewError] = useState<string | null>(null);

  useEffect(() => {
    // Use a timer to slightly delay the update for better performance
    const timer = setTimeout(() => {
      updatePreview();
    }, 300);
    return () => clearTimeout(timer);
  }, [html, css, javascript]);

  useEffect(() => {
    // Add keyboard shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+Enter to update preview
      if (e.ctrlKey && e.key === 'Enter') {
        updatePreview();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const updatePreview = () => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    try {
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
            <script>${javascript}</script>
          </body>
        </html>
      `;
      
      // Set the content using srcdoc (with lowercase 'd')
      iframe.srcdoc = content;
      setPreviewError(null);
      
    } catch (error) {
      console.error("Error updating preview:", error);
      setPreviewError("Failed to update preview");
    }
  };

  return (
    <div className="h-full w-full flex flex-col bg-card rounded-lg shadow border border-border overflow-hidden">
      <div className="px-4 py-2 bg-muted flex items-center justify-between border-b border-border">
        <div className="text-sm font-medium flex items-center gap-1">
          Preview
          {isMobile && <span className="text-xs text-muted-foreground">(Mobile view)</span>}
        </div>
        <button
          onClick={updatePreview}
          className="text-xs px-2 py-1 bg-primary text-primary-foreground rounded hover:bg-primary/90"
          aria-label="Refresh preview"
        >
          Refresh
        </button>
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
    </div>
  );
}
