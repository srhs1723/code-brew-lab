
import { useEffect, useRef } from 'react';
import { useEditor } from '@/context/EditorContext';

export default function Preview() {
  const { editorState } = useEditor();
  const { html, css, javascript } = editorState;
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    updatePreview();
    
    // Add keyboard shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+Enter to update preview (although we already update in real-time)
      if (e.ctrlKey && e.key === 'Enter') {
        updatePreview();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [html, css, javascript]);

  const updatePreview = () => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const document = iframe.contentDocument;
    if (!document) return;

    const content = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>${css}</style>
        </head>
        <body>
          ${html}
          <script>${javascript}</script>
        </body>
      </html>
    `;

    document.open();
    document.write(content);
    document.close();
  };

  return (
    <div className="h-full w-full flex flex-col bg-card rounded-lg shadow border border-border overflow-hidden">
      <div className="px-4 py-2 bg-muted flex items-center justify-between border-b border-border">
        <div className="text-sm font-medium">Preview</div>
        <button
          onClick={updatePreview}
          className="text-xs px-2 py-1 bg-primary text-primary-foreground rounded hover:bg-primary/90"
        >
          Refresh
        </button>
      </div>
      <div className="flex-1 overflow-hidden">
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
