import React from 'react';
import { Code, Plus, Trash2 } from 'lucide-react';
import { Project } from '../types/resume';

interface ProjectsFormProps {
  data: Project[];
  onChange: (data: Project[]) => void;
}

export const ProjectsForm: React.FC<ProjectsFormProps> = ({ data, onChange }) => {
  const addProject = () => {
    const newProject: Project = {
      id: Date.now().toString(),
      name: '',
      technologies: '',
      duration: '',
      bullets: ['']
    };
    onChange([...data, newProject]);
  };

  const removeProject = (id: string) => {
    onChange(data.filter(proj => proj.id !== id));
  };

  const updateProject = (id: string, field: keyof Project, value: string | string[]) => {
    onChange(data.map(proj => 
      proj.id === id ? { ...proj, [field]: value } : proj
    ));
  };

  const addBullet = (id: string) => {
    const project = data.find(proj => proj.id === id);
    if (project) {
      updateProject(id, 'bullets', [...project.bullets, '']);
    }
  };

  const removeBullet = (id: string, bulletIndex: number) => {
    const project = data.find(proj => proj.id === id);
    if (project && project.bullets.length > 1) {
      const newBullets = project.bullets.filter((_, index) => index !== bulletIndex);
      updateProject(id, 'bullets', newBullets);
    }
  };

  const updateBullet = (id: string, bulletIndex: number, value: string) => {
    const project = data.find(proj => proj.id === id);
    if (project) {
      const newBullets = project.bullets.map((bullet, index) => 
        index === bulletIndex ? value : bullet
      );
      updateProject(id, 'bullets', newBullets);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Code className="w-5 h-5 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-800">Projects</h2>
        </div>
        <button
          onClick={addProject}
          className="flex items-center space-x-1 px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Project</span>
        </button>
      </div>

      {data.map((project, index) => (
        <div key={project.id} className="border border-gray-200 rounded-lg p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-gray-800">Project #{index + 1}</h3>
            {data.length > 1 && (
              <button
                onClick={() => removeProject(project.id)}
                className="text-red-600 hover:text-red-800 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Project Name *
              </label>
              <input
                type="text"
                value={project.name}
                onChange={(e) => updateProject(project.id, 'name', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="AI Math Solver"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Duration *
              </label>
              <input
                type="text"
                value={project.duration}
                onChange={(e) => updateProject(project.id, 'duration', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="February 2025 - March 2025"
                required
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Technologies Used *
            </label>
            <input
              type="text"
              value={project.technologies}
              onChange={(e) => updateProject(project.id, 'technologies', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="React, Node.js, MongoDB, Express"
              required
            />
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Project Description/Features
              </label>
              <button
                onClick={() => addBullet(project.id)}
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                + Add Description
              </button>
            </div>
            
            {project.bullets.map((bullet, bulletIndex) => (
              <div key={bulletIndex} className="flex items-center space-x-2 mb-2">
                <textarea
                  value={bullet}
                  onChange={(e) => updateBullet(project.id, bulletIndex, e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  placeholder="Describe project features, achievements, or technical details..."
                  rows={2}
                />
                {project.bullets.length > 1 && (
                  <button
                    onClick={() => removeBullet(project.id, bulletIndex)}
                    className="text-red-600 hover:text-red-800"
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