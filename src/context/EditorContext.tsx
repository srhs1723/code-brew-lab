
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Language = 'html' | 'css' | 'javascript';

interface EditorState {
  html: string;
  css: string;
  javascript: string;
  currentLanguage: Language;
  isDarkMode: boolean;
}

interface EditorContextType {
  editorState: EditorState;
  setHtml: (html: string) => void;
  setCss: (css: string) => void;
  setJavascript: (js: string) => void;
  setCurrentLanguage: (lang: Language) => void;
  toggleDarkMode: () => void;
  resetCode: () => void;
  setTemplate: (html: string, css: string, js: string) => void;
}

const defaultState: EditorState = {
  html: '<!-- Add your HTML here -->\n<h1>Hello HTMLReader!</h1>\n<p>Start coding to see the live preview.</p>',
  css: '/* Add your CSS here */\nbody {\n  font-family: system-ui, sans-serif;\n  line-height: 1.5;\n  padding: 2rem;\n}\n\nh1 {\n  color: #C05746;\n}',
  javascript: '// Add your JavaScript here\nconsole.log("HTMLReader is running!");',
  currentLanguage: 'html',
  isDarkMode: window.matchMedia('(prefers-color-scheme: dark)').matches,
};

const EditorContext = createContext<EditorContextType | undefined>(undefined);

export function EditorProvider({ children }: { children: ReactNode }) {
  // Try to load saved state from localStorage
  const savedState = localStorage.getItem('htmlreader-state');
  const initialState = savedState ? JSON.parse(savedState) : defaultState;

  const [html, setHtml] = useState(initialState.html);
  const [css, setCss] = useState(initialState.css);
  const [javascript, setJavascript] = useState(initialState.javascript);
  const [currentLanguage, setCurrentLanguage] = useState<Language>(initialState.currentLanguage);
  const [isDarkMode, setIsDarkMode] = useState(initialState.isDarkMode);

  // Set initial theme
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    const state = {
      html,
      css,
      javascript,
      currentLanguage,
      isDarkMode,
    };
    localStorage.setItem('htmlreader-state', JSON.stringify(state));
  }, [html, css, javascript, currentLanguage, isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => {
      const newMode = !prev;
      if (newMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      return newMode;
    });
  };

  const resetCode = () => {
    setHtml(defaultState.html);
    setCss(defaultState.css);
    setJavascript(defaultState.javascript);
  };

  const setTemplate = (htmlCode: string, cssCode: string, jsCode: string) => {
    setHtml(htmlCode);
    setCss(cssCode);
    setJavascript(jsCode);
  };

  const editorState = {
    html,
    css,
    javascript,
    currentLanguage,
    isDarkMode,
  };

  const value = {
    editorState,
    setHtml,
    setCss,
    setJavascript,
    setCurrentLanguage,
    toggleDarkMode,
    resetCode,
    setTemplate,
  };

  return <EditorContext.Provider value={value}>{children}</EditorContext.Provider>;
}

export function useEditor() {
  const context = useContext(EditorContext);
  if (context === undefined) {
    throw new Error('useEditor must be used within an EditorProvider');
  }
  return context;
}
