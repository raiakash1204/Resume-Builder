import React from 'react';
import { Award, Plus, Trash2 } from 'lucide-react';
import { Award as AwardType } from '../types/resume';

interface AwardsFormProps {
  data: AwardType[];
  onChange: (data: AwardType[]) => void;
}

export const AwardsForm: React.FC<AwardsFormProps> = ({ data, onChange }) => {
  const addAward = () => {
    const newAward: AwardType = {
      id: Date.now().toString(),
      title: '',
      description: ''
    };
    onChange([...data, newAward]);
  };

  const removeAward = (id: string) => {
    onChange(data.filter(award => award.id !== id));
  };

  const updateAward = (id: string, field: keyof AwardType, value: string) => {
    onChange(data.map(award => 
      award.id === id ? { ...award, [field]: value } : award
    ));
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
            <Award className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Awards & Honors</h2>
        </div>
        <button
          onClick={addAward}
          className="flex items-center space-x-1 px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all duration-200 hover:scale-105 transform shadow-md hover:shadow-lg"
        >
          <Plus className="w-4 h-4" />
          <span>Add Award</span>
        </button>
      </div>

      {data.length === 0 && (
        <p className="text-gray-500 dark:text-gray-400 text-center py-4 animate-bounce-in">
          No awards added yet. Click "Add Award" to get started.
        </p>
      )}

      {data.map((award, index) => (
        <div key={award.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 space-y-4 bg-gray-50 dark:bg-gray-700 transition-all duration-300 hover:shadow-md transform hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-gray-800 dark:text-white">Award #{index + 1}</h3>
            <button
              onClick={() => removeAward(award.id)}
              className="text-red-600 hover:text-red-800 transition-all duration-200 hover:scale-110 transform p-1 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
          
          <div className="space-y-4">
            <div className="transform transition-all duration-200 hover:scale-[1.02]">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Award Title *
              </label>
              <input
                type="text"
                value={award.title}
                onChange={(e) => updateAward(award.id, 'title', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-all duration-200"
                placeholder="Dean's List"
                required
              />
            </div>
            
            <div className="transform transition-all duration-200 hover:scale-[1.02]">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description *
              </label>
              <textarea
                value={award.description}
                onChange={(e) => updateAward(award.id, 'description', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-all duration-200"
                placeholder="{ Awarded for academic excellence with GPA above 3.8 for Fall 2023 semester.}"
                rows={3}
                required
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};