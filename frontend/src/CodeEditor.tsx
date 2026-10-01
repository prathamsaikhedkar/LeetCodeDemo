import { useState, useRef } from "react";
import Editor from '@monaco-editor/react';
import type {OnMount, OnChange, Monaco} from '@monaco-editor/react';
import type * as monaco from 'monaco-editor';
import React from 'react'
import { languages } from "./data/languages";

function CodeEditor() {
  const [code, setCode] = useState('Hello');
  const [language, setLanguage] = useState('python')
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);

  const handleEditorDidMount : OnMount = (editor, monacoInstance : Monaco) => {
    editorRef.current = editor;

    editor.addAction({
      id: 'run-code',
      label: 'Run Code',
      keybindings: [
        monacoInstance.KeyMod.CtrlCmd | monacoInstance.KeyCode.Enter
      ],
      run: () => {
        handleRunCode();
      }
    })

  }

  const handleRunCode = () => {
    console.log("running code:", editorRef.current?.getValue());
    
  }

  const handleEditorDidChange : OnChange = (value) => {
    console.log(value);
    setCode(value || '');
  }

  const displayLanguages = () => {
    const elements = languages.map((language) => {
      return (
        <div key={language.id}>
          {language.name}
        </div>
      )
    });
    return elements;
  }

  return (
    <div>
      <select onChange={(e) => {setLanguage(e.target.value)}}>
        {languages.map((language) => (
          <option key={language.id} value={language.id}>
            {language.name}
          </option>
        ))}
      </select>
      <Editor 
        height={'500px'}
        defaultLanguage="python"
        defaultValue={code}
        language={language}
        value={code}
        theme="vs-dark"  
        onMount={handleEditorDidMount}
        onChange={handleEditorDidChange}
        options={
          {
            tabCompletion : 'off',
            tabSize: 2,
            minimap: {enabled: false},
            wordWrap: 'on',
            automaticLayout: true,
            scrollBeyondLastLine: false
          }
        }
      />
      <button onClick={handleRunCode} className={'bg-lime-400 rounded-xl h-10 w-50'}>Run Code</button>
    </div>
  )
}

export default CodeEditor