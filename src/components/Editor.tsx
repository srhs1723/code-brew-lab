
import React, { useEffect, useState } from 'react';
import { useEditor } from '@/context/EditorContext';
import { basicSetup } from 'codemirror';
import { EditorView, keymap } from '@codemirror/view';
import { indentWithTab } from '@codemirror/commands';
import { javascript } from '@codemirror/lang-javascript';
import { html } from '@codemirror/lang-html';
import { css } from '@codemirror/lang-css';
import { vscodeDark } from '@uiw/codemirror-theme-vscode';
import { githubLight } from '@uiw/codemirror-theme-github';
import { oneDark } from '@codemirror/theme-one-dark';

export default function Editor() {
  const { editorState, setHtml, setCss, setJavascript } = useEditor();
  const { html: htmlContent, css: cssContent, javascript: jsContent, currentLanguage, isDarkMode } = editorState;

  const [editorContainer, setEditorContainer] = useState<HTMLDivElement | null>(null);
  const [editorView, setEditorView] = useState<EditorView | null>(null);

  // Set up editor extensions based on language
  useEffect(() => {
    if (!editorContainer) return;

    // Clean up previous editor if it exists
    if (editorView) {
      editorView.destroy();
    }

    // Determine which language extension to use
    let languageExtension;
    let content = '';

    switch (currentLanguage) {
      case 'html':
        languageExtension = html();
        content = htmlContent;
        break;
      case 'css':
        languageExtension = css();
        content = cssContent;
        break;
      case 'javascript':
        languageExtension = javascript();
        content = jsContent;
        break;
    }

    // Choose theme based on dark mode preference
    const theme = isDarkMode ? oneDark : githubLight;

    // Initialize editor
    const view = new EditorView({
      doc: content,
      extensions: [
        basicSetup,
        languageExtension,
        theme,
        keymap.of([indentWithTab]),
        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            const newContent = update.state.doc.toString();
            switch (currentLanguage) {
              case 'html':
                setHtml(newContent);
                break;
              case 'css':
                setCss(newContent);
                break;
              case 'javascript':
                setJavascript(newContent);
                break;
            }
          }
        }),
        // Keyboard shortcuts
        keymap.of([
          // Ctrl+S to prevent browser save dialog
          {
            key: 'Ctrl-s',
            run: () => {
              // Instead of saving, we just prevent browser dialog
              console.log('Saving is automatic');
              return true;
            },
          },
        ]),
      ],
      parent: editorContainer,
    });

    setEditorView(view);

    // Clean up on unmount
    return () => {
      view.destroy();
    };
  }, [currentLanguage, editorContainer, isDarkMode]);

  // Update editor content if it changes externally (e.g., when selecting a template)
  useEffect(() => {
    if (!editorView) return;

    let content = '';
    switch (currentLanguage) {
      case 'html':
        content = htmlContent;
        break;
      case 'css':
        content = cssContent;
        break;
      case 'javascript':
        content = jsContent;
        break;
    }

    const currentContent = editorView.state.doc.toString();
    if (content !== currentContent) {
      editorView.dispatch({
        changes: { from: 0, to: currentContent.length, insert: content }
      });
    }
  }, [htmlContent, cssContent, jsContent, currentLanguage, editorView]);

  return (
    <div className="h-full w-full flex flex-col overflow-hidden">
      <div ref={setEditorContainer} className="flex-1 overflow-hidden" />
    </div>
  );
}
