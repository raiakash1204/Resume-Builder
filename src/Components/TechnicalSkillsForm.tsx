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
    <div className="space-y-6">
      <div className="flex items-center space-x-2 mb-4">
        <Settings className="w-5 h-5 text-blue-600" />
        <h2 className="text-xl font-semibold text-gray-800">Technical Skills</h2>
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Programming Languages *
          </label>
          <input
            type="text"
            value={data.languages}
            onChange={(e) => handleChange('languages', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Python, JavaScript, Java, C++, SQL"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Frameworks & Libraries *
          </label>
          <input
            type="text"
            value={data.frameworks}
            onChange={(e) => handleChange('frameworks', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="React, Node.js, Django, Flask, Express, TensorFlow"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Developer Tools *
          </label>
          <input
            type="text"
            value={data.tools}
            onChange={(e) => handleChange('tools', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Git, Docker, VS Code, AWS, Kubernetes"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Specialized Software
          </label>
          <input
            type="text"
            value={data.specialized}
            onChange={(e) => handleChange('specialized', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="MATLAB, AutoCAD, Photoshop, Figma"
          />
        </div>
      </div>
    </div>
  );
};