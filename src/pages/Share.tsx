
import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Preview from '@/components/Preview';
import { Button } from "@/components/ui/button";
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";

interface SharedCode {
  html: string;
  css: string;
  javascript: string;
  expiry: number;
  id: string;
}

const Share = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const shareId = searchParams.get('id');
  
  const [sharedCode, setSharedCode] = useState<SharedCode | null>(null);
  const [isExpired, setIsExpired] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    if (!shareId) {
      navigate('/');
      return;
    }
    
    try {
      const sharedDataStr = localStorage.getItem(`htmlreader_share_${shareId}`);
      
      if (!sharedDataStr) {
        setIsExpired(true);
        setIsLoading(false);
        return;
      }
      
      const sharedData = JSON.parse(sharedDataStr) as SharedCode;
      
      // Check if expired
      if (sharedData.expiry < Date.now()) {
        setIsExpired(true);
        localStorage.removeItem(`htmlreader_share_${shareId}`);
      } else {
        setSharedCode(sharedData);
      }
    } catch (error) {
      console.error("Error loading shared code:", error);
      setIsExpired(true);
    }
    
    setIsLoading(false);
  }, [shareId, navigate]);

  // Go back to editor
  const handleGoToEditor = () => {
    navigate('/');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-lg">Loading shared code...</div>
      </div>
    );
  }

  if (isExpired) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <Alert variant="destructive" className="max-w-md mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Error: Link expired or not found
          </AlertDescription>
        </Alert>
        <p className="text-muted-foreground mb-4">
          This shared link has expired or was not found. Share links are valid for 25 minutes.
        </p>
        <Button onClick={handleGoToEditor}>
          Go to Editor
        </Button>
      </div>
    );
  }

  if (!sharedCode) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="w-full bg-card border-b border-border sticky top-0 z-10">
        <div className="container flex items-center justify-between p-4">
          <div className="flex items-center space-x-2">
            <div className="flex flex-col">
              <h1 className="text-xl font-bold tracking-tight text-accent">HTMLReader</h1>
              <p className="text-xs text-muted-foreground">Shared Preview</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={handleGoToEditor} variant="outline" size="sm">
              Open in Editor
            </Button>
          </div>
        </div>
      </header>
      
      <div className="flex-grow p-4">
        <div className="h-full">
          <Preview readOnly={true} initialCode={sharedCode} />
        </div>
      </div>
      
      <footer className="text-center py-4 text-sm text-muted-foreground border-t border-border">
        <p>HTMLReader - Live Code Editor</p>
      </footer>
    </div>
  );
};

export default Share;
