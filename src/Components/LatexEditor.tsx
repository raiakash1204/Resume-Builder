import React, { useState, useEffect } from 'react';
import { Code2, RefreshCw, AlertCircle } from 'lucide-react';
import { ResumeData } from '../types/resume';
import { generateLatexResume } from '../utils/latexGenerator';
import { parseLatexToResumeData } from '../utils/latexParser';

interface LatexEditorProps {
  data: ResumeData;
  onChange: (data: ResumeData) => void;
}

export const LatexEditor: React.FC<LatexEditorProps> = ({ data, onChange }) => {
  const [latexContent, setLatexContent] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [parseError, setParseError] = useState<string | null>(null);

  useEffect(() => {
    if (!isEditing) {
      const newLatex = generateLatexResume(data);
      setLatexContent(newLatex);
    }
  }, [data, isEditing]);

  const handleLatexChange = (value: string) => {
    setLatexContent(value);
    setIsEditing(true);
    setParseError(null);
  };

  const handleApplyChanges = () => {
    try {
      const parsedData = parseLatexToResumeData(latexContent);
      onChange(parsedData);
      setIsEditing(false);
      setParseError(null);
    } catch (error) {
      setParseError('Error parsing LaTeX. Please check your syntax.');
      console.error('LaTeX parsing error:', error);
    }
  };

  const handleResetChanges = () => {
    const originalLatex = generateLatexResume(data);
    setLatexContent(originalLatex);
    setIsEditing(false);
    setParseError(null);
  };

  const handleRefreshFromData = () => {
    const newLatex = generateLatexResume(data);
    setLatexContent(newLatex);
    setIsEditing(false);
    setParseError(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Code2 className="w-5 h-5 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">LaTeX Editor</h2>
        </div>
        
        <div className="flex items-center space-x-2">
          {isEditing && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-orange-600 dark:text-orange-400 font-medium">Unsaved changes</span>
              <button
                onClick={handleResetChanges}
                className="px-3 py-1 text-sm bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
              >
                Reset
              </button>
              <button
                onClick={handleApplyChanges}
                className="px-3 py-1 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                Apply Changes
              </button>
            </div>
          )}
          
          <button
            onClick={handleRefreshFromData}
            className="flex items-center space-x-1 px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            title="Refresh LaTeX from form data"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {parseError && (
        <div className="flex items-center space-x-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
          <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
          <span className="text-red-700 dark:text-red-300">{parseError}</span>
        </div>
      )}

      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
        <div className="mb-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            LaTeX Source Code
          </label>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Edit the LaTeX code directly. Changes will be applied to the form when you click "Apply Changes".
          </p>
        </div>
        
        <textarea
          value={latexContent}
          onChange={(e) => handleLatexChange(e.target.value)}
          className={`w-full h-96 px-3 py-2 font-mono text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${
            isEditing 
              ? 'border-orange-300 dark:border-orange-600 bg-orange-50 dark:bg-orange-900/20' 
              : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700'
          } text-gray-900 dark:text-white`}
          placeholder="LaTeX code will appear here..."
          spellCheck={false}
        />
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <h3 className="font-medium text-blue-900 dark:text-blue-300 mb-2">LaTeX Editor Tips:</h3>
        <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
          <li>• Edit the LaTeX code directly to make advanced formatting changes</li>
          <li>• Changes are bidirectional - editing here updates the form, and vice versa</li>
          <li>• Use "Apply Changes" to sync your LaTeX edits back to the form</li>
          <li>• Use "Refresh" to regenerate LaTeX from the current form data</li>
        </ul>
      </div>
    </div>
  );
};