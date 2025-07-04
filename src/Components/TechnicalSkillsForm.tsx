import React from 'react';
import { Settings } from 'lucide-react';
import { TechnicalSkills } from '../types/resume';

interface TechnicalSkillsFormProps {
  data: TechnicalSkills;
  onChange: (data: TechnicalSkills) => void;
}

export const TechnicalSkillsForm: React.FC<TechnicalSkillsFormProps> = ({ data, onChange }) => {
  const handleChange = (field: keyof TechnicalSkills, value: string) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center space-x-2 mb-4">
        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
          <Settings className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        </div>
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Technical Skills</h2>
      </div>
      
      <div className="space-y-4">
        <div className="transform transition-all duration-200 hover:scale-[1.02]">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Programming Languages *
          </label>
          <input
            type="text"
            value={data.languages}
            onChange={(e) => handleChange('languages', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-200"
            placeholder="Python, JavaScript, Java, C++, SQL"
            required
          />
        </div>
        
        <div className="transform transition-all duration-200 hover:scale-[1.02]">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Frameworks & Libraries *
          </label>
          <input
            type="text"
            value={data.frameworks}
            onChange={(e) => handleChange('frameworks', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-200"
            placeholder="React, Node.js, Django, Flask, Express, TensorFlow"
            required
          />
        </div>
        
        <div className="transform transition-all duration-200 hover:scale-[1.02]">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Developer Tools *
          </label>
          <input
            type="text"
            value={data.tools}
            onChange={(e) => handleChange('tools', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-200"
            placeholder="Git, Docker, VS Code, AWS, Kubernetes"
            required
          />
        </div>
        
        <div className="transform transition-all duration-200 hover:scale-[1.02]">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Specialized Software
          </label>
          <input
            type="text"
            value={data.specialized}
            onChange={(e) => handleChange('specialized', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-200"
            placeholder="MATLAB, AutoCAD, Photoshop, Figma"
          />
        </div>
      </div>
    </div>
  );
};