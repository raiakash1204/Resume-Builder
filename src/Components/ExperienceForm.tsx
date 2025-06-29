import React from 'react';
import { Briefcase, Plus, Trash2 } from 'lucide-react';
import { Experience } from '../types/resume';

interface ExperienceFormProps {
  data: Experience[];
  onChange: (data: Experience[]) => void;
}

export const ExperienceForm: React.FC<ExperienceFormProps> = ({ data, onChange }) => {
  const addExperience = () => {
    const newExperience: Experience = {
      id: Date.now().toString(),
      position: '',
      duration: '',
      company: '',
      location: '',
      bullets: ['']
    };
    onChange([...data, newExperience]);
  };

  const removeExperience = (id: string) => {
    onChange(data.filter(exp => exp.id !== id));
  };

  const updateExperience = (id: string, field: keyof Experience, value: string | string[]) => {
    onChange(data.map(exp => 
      exp.id === id ? { ...exp, [field]: value } : exp
    ));
  };

  const addBullet = (id: string) => {
    const experience = data.find(exp => exp.id === id);
    if (experience) {
      updateExperience(id, 'bullets', [...experience.bullets, '']);
    }
  };

  const removeBullet = (id: string, bulletIndex: number) => {
    const experience = data.find(exp => exp.id === id);
    if (experience && experience.bullets.length > 1) {
      const newBullets = experience.bullets.filter((_, index) => index !== bulletIndex);
      updateExperience(id, 'bullets', newBullets);
    }
  };

  const updateBullet = (id: string, bulletIndex: number, value: string) => {
    const experience = data.find(exp => exp.id === id);
    if (experience) {
      const newBullets = experience.bullets.map((bullet, index) => 
        index === bulletIndex ? value : bullet
      );
      updateExperience(id, 'bullets', newBullets);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
            <Briefcase className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Experience</h2>
        </div>
        <button
          onClick={addExperience}
          className="flex items-center space-x-1 px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all duration-200 hover:scale-105 transform shadow-md hover:shadow-lg"
        >
          <Plus className="w-4 h-4" />
          <span>Add Experience</span>
        </button>
      </div>

      {data.length === 0 && (
        <p className="text-gray-500 dark:text-gray-400 text-center py-4 animate-bounce-in">
          No experience added yet. Click "Add Experience" to get started.
        </p>
      )}

      {data.map((exp, index) => (
        <div key={exp.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 space-y-4 bg-gray-50 dark:bg-gray-700 transition-all duration-300 hover:shadow-md transform hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-gray-800 dark:text-white">Experience #{index + 1}</h3>
            <button
              onClick={() => removeExperience(exp.id)}
              className="text-red-600 hover:text-red-800 transition-all duration-200 hover:scale-110 transform p-1 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="transform transition-all duration-200 hover:scale-[1.02]">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Position/Title *
              </label>
              <input
                type="text"
                value={exp.position}
                onChange={(e) => updateExperience(exp.id, 'position', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-all duration-200"
                placeholder="Software Engineer"
                required
              />
            </div>
            
            <div className="transform transition-all duration-200 hover:scale-[1.02]">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Duration *
              </label>
              <input
                type="text"
                value={exp.duration}
                onChange={(e) => updateExperience(exp.id, 'duration', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-all duration-200"
                placeholder="June 2020 -- Present"
                required
              />
            </div>
            
            <div className="transform transition-all duration-200 hover:scale-[1.02]">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Company *
              </label>
              <input
                type="text"
                value={exp.company}
                onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-all duration-200"
                placeholder="Company Name"
                required
              />
            </div>
            
            <div className="transform transition-all duration-200 hover:scale-[1.02]">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Location *
              </label>
              <input
                type="text"
                value={exp.location}
                onChange={(e) => updateExperience(exp.id, 'location', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-all duration-200"
                placeholder="City, State"
                required
              />
            </div>
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Job Responsibilities/Achievements
              </label>
              <button
                onClick={() => addBullet(exp.id)}
                className="text-blue-600 hover:text-blue-800 text-sm transition-all duration-200 hover:scale-105 transform px-2 py-1 rounded-md hover:bg-blue-50 dark:hover:bg-blue-900/20"
              >
                + Add Bullet
              </button>
            </div>
            
            {exp.bullets.map((bullet, bulletIndex) => (
              <div key={bulletIndex} className="flex items-center space-x-2 mb-2">
                <textarea
                  value={bullet}
                  onChange={(e) => updateBullet(exp.id, bulletIndex, e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-all duration-200"
                  placeholder="Describe your achievement or responsibility..."
                  rows={2}
                />
                {exp.bullets.length > 1 && (
                  <button
                    onClick={() => removeBullet(exp.id, bulletIndex)}
                    className="text-red-600 hover:text-red-800 transition-all duration-200 hover:scale-110 transform p-1 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};