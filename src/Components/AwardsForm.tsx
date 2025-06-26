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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Award className="w-5 h-5 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-800">Awards & Honors</h2>
        </div>
        <button
          onClick={addAward}
          className="flex items-center space-x-1 px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Award</span>
        </button>
      </div>

      {data.length === 0 && (
        <p className="text-gray-500 text-center py-4">
          No awards added yet. Click "Add Award" to get started.
        </p>
      )}

      {data.map((award, index) => (
        <div key={award.id} className="border border-gray-200 rounded-lg p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-gray-800">Award #{index + 1}</h3>
            <button
              onClick={() => removeAward(award.id)}
              className="text-red-600 hover:text-red-800 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Award Title *
              </label>
              <input
                type="text"
                value={award.title}
                onChange={(e) => updateAward(award.id, 'title', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Dean's List"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description *
              </label>
              <textarea
                value={award.description}
                onChange={(e) => updateAward(award.id, 'description', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
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