
import { EditorProvider } from "@/context/EditorContext";
import Header from "@/components/Header";
import Editor from "@/components/Editor";
import Preview from "@/components/Preview";
import TabSelector from "@/components/TabSelector";

const Index = () => {
  return (
    <EditorProvider>
      <div className="min-h-screen flex flex-col">
        <Header />
        
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
        
        <footer className="text-center py-4 text-sm text-muted-foreground border-t border-border">
          <p>HTMLReader - Live Code Editor</p>
        </footer>
      </div>
    </EditorProvider>
  );
};

export default Index;
