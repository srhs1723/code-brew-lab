
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import ThemeToggle from './ThemeToggle';
import TemplateSelector from './TemplateSelector';
import { useEditor } from '@/context/EditorContext';
import { Download, Upload, Keyboard, Share2 } from 'lucide-react';
import JSZip from 'jszip';
import FileSaver from 'file-saver';
import { toast } from "@/components/ui/sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function Header() {
  const { editorState, resetCode, setHtml, setCss, setJavascript } = useEditor();
  const { html, css, javascript } = editorState;
  const [shareLink, setShareLink] = useState<string | null>(null);
  const [isGeneratingLink, setIsGeneratingLink] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  
  // Download code as individual files or zip
  const downloadAsZip = () => {
    const zip = new JSZip();
    
    zip.file("index.html", html);
    zip.file("styles.css", css);
    zip.file("script.js", javascript);
    
    zip.generateAsync({ type: "blob" }).then((content) => {
      FileSaver.saveAs(content, "htmlreader-project.zip");
    });
  };
  
  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    
    Array.from(files).forEach(file => {
      const reader = new FileReader();
      
      reader.onload = (event) => {
        if (!event.target || typeof event.target.result !== 'string') return;
        
        if (file.name.endsWith('.html')) {
          setHtml(event.target.result);
        } else if (file.name.endsWith('.css')) {
          setCss(event.target.result);
        } else if (file.name.endsWith('.js')) {
          setJavascript(event.target.result);
        }
      };
      
      reader.readAsText(file);
    });
    
    // Reset the input so the same file can be uploaded again if needed
    e.target.value = '';
  };

  // Generate a temporary share link (valid for 25 minutes)
  const generateShareLink = () => {
    setIsGeneratingLink(true);
    
    try {
      // Create a unique ID for this share
      const shareId = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Create a temporary object to store in localStorage
      const shareData = {
        html,
        css,
        javascript,
        expiry: Date.now() + 25 * 60 * 1000, // 25 minutes from now
        id: shareId
      };
      
      // Store in localStorage
      localStorage.setItem(`htmlreader_share_${shareId}`, JSON.stringify(shareData));
      
      // Create the share link with the new share page path
      const baseUrl = window.location.origin;
      const shareUrl = `${baseUrl}/share?id=${shareId}`;
      
      setShareLink(shareUrl);
      setIsGeneratingLink(false);
      
      // Auto-expire after 25 minutes
      setTimeout(() => {
        localStorage.removeItem(`htmlreader_share_${shareId}`);
      }, 25 * 60 * 1000);
    } catch (error) {
      console.error("Error generating share link:", error);
      toast.error("Failed to generate share link");
      setIsGeneratingLink(false);
    }
  };
  
  // Copy the share link to clipboard
  const copyShareLink = () => {
    if (!shareLink) return;
    
    navigator.clipboard.writeText(shareLink)
      .then(() => {
        toast.success("Share link copied to clipboard!");
      })
      .catch(() => {
        toast.error("Failed to copy link");
      });
  };

  // Keyboard shortcuts dialog
  const shortcuts = [
    { key: 'Ctrl + S', description: 'Save changes (automatic)' },
    { key: 'Ctrl + Enter', description: 'Update preview (automatic)' },
    { key: 'Tab', description: 'Indent code' },
    { key: 'Shift + Tab', description: 'Outdent code' },
    { key: 'Ctrl + /  or  Cmd + /', description: 'Toggle comment' },
    { key: 'Ctrl + Space', description: 'Trigger autocomplete' },
  ];
  
  return (
    <header className="w-full bg-card border-b border-border sticky top-0 z-10">
      <div className="container flex items-center justify-between p-4">
        <div className="flex items-center space-x-2">
          <div className="flex flex-col">
            <h1 className="text-xl font-bold tracking-tight text-accent">HTMLReader</h1>
            <p className="text-xs text-muted-foreground">Live HTML/CSS/JS Editor</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full" title="Share">
                <Share2 className="h-5 w-5" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Share Your Code</DialogTitle>
                <DialogDescription>
                  Create a temporary link that expires in 25 minutes
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-2">
                {!shareLink ? (
                  <Button 
                    onClick={generateShareLink} 
                    disabled={isGeneratingLink}
                    className="w-full"
                  >
                    {isGeneratingLink ? 'Generating...' : 'Generate Share Link'}
                  </Button>
                ) : (
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        readOnly 
                        value={shareLink} 
                        className="flex-1 bg-muted px-3 py-2 text-sm rounded-md border"
                      />
                      <Button onClick={copyShareLink} variant="secondary">
                        Copy
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      This link will expire in 25 minutes
                    </p>
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full" title="Keyboard shortcuts">
                <Keyboard className="h-5 w-5" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Keyboard Shortcuts</DialogTitle>
                <DialogDescription>
                  Useful keyboard shortcuts to improve your workflow
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-2">
                {shortcuts.map((shortcut, i) => (
                  <div key={i} className="flex justify-between">
                    <span className="font-mono bg-muted px-2 py-1 rounded text-sm">
                      {shortcut.key}
                    </span>
                    <span className="text-sm text-muted-foreground">{shortcut.description}</span>
                  </div>
                ))}
              </div>
            </DialogContent>
          </Dialog>
          
          <TemplateSelector />
          
          <div className="relative">
            <Button variant="outline" size="sm" className="flex items-center gap-1" title="Upload files">
              <Upload className="h-4 w-4" />
              <span className="hidden sm:inline">Upload</span>
              <input 
                type="file" 
                accept=".html,.css,.js" 
                multiple 
                onChange={handleFileUpload}
                className="absolute inset-0 opacity-0 cursor-pointer"
                title="Upload HTML, CSS, or JavaScript files"
              />
            </Button>
          </div>
          
          <Button variant="outline" size="sm" className="flex items-center gap-1" onClick={downloadAsZip} title="Download as ZIP">
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Download</span>
          </Button>
          
          <Button variant="outline" size="sm" onClick={resetCode}>
            Reset
          </Button>
          
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
