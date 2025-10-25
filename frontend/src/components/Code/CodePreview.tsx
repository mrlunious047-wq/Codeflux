import React, { useState } from 'react';
import { useProject } from '../../contexts/ProjectContext';
import CodeEditor from './CodeEditor';
import PreviewFrame from './PreviewFrame';
import ExportButtons from './ExportButtons';

const CodePreview: React.FC = () => {
  const { currentProject } = useProject();
  const [activeTab, setActiveTab] = useState<'preview' | 'code'>('preview');
  const [activeFile, setActiveFile] = useState<string>('index.html');

  if (!currentProject?.generatedCode) {
    return (
      <div className="h-full flex items-center justify-center bg-cyber-gray rounded-2xl border border-neon-green/20 backdrop-blur-sm">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-neon-green/30 border-t-neon-green rounded-full animate-spin mx-auto mb-4"></div>
          <h3 className="text-lg font-mono text-neon-green mb-2">CodeFlux AI</h3>
          <p className="text-gray-400 text-sm">Describe your project to generate code</p>
        </div>
      </div>
    );
  }

  const files = Object.keys(currentProject.generatedCode);

  return (
    <div className="h-full flex flex-col bg-cyber-gray rounded-2xl border border-neon-green/20 backdrop-blur-sm">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-neon-green/20">
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveTab('preview')}
            className={`px-4 py-2 rounded-lg font-mono text-sm transition-all ${
              activeTab === 'preview'
                ? 'bg-neon-green text-cyber-black font-bold'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            PREVIEW
          </button>
          <button
            onClick={() => setActiveTab('code')}
            className={`px-4 py-2 rounded-lg font-mono text-sm transition-all ${
              activeTab === 'code'
                ? 'bg-neon-green text-cyber-black font-bold'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            CODE
          </button>
        </div>
        <ExportButtons code={currentProject.generatedCode} />
      </div>

      {/* File Tabs - Only show in code view */}
      {activeTab === 'code' && (
        <div className="flex border-b border-neon-green/20">
          {files.map((file) => (
            <button
              key={file}
              onClick={() => setActiveFile(file)}
              className={`px-4 py-2 font-mono text-sm border-b-2 transition-all ${
                activeFile === file
                  ? 'border-neon-green text-neon-green'
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              {file}
            </button>
          ))}
        </div>
      )}

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === 'preview' ? (
          <PreviewFrame code={currentProject.generatedCode} />
        ) : (
          <CodeEditor
            code={currentProject.generatedCode[activeFile]}
            language={currentProject.language}
            filename={activeFile}
          />
        )}
      </div>
    </div>
  );
};

export default CodePreview;
