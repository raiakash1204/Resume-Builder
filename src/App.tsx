import React, { useState, useEffect } from 'react';
import { FileDown, Download, Eye, Code, RotateCcw, Moon, Sun } from 'lucide-react';
import { PersonalInfoForm } from './Components/PersonalInfoForm';
import { EducationForm } from './Components/EducationForm';
import { ExperienceForm } from './Components/ExperienceForm';
import { ProjectsForm } from './Components/ProjectsForm';
import { TechnicalSkillsForm } from './Components/TechnicalSkillsForm';
import { AwardsForm } from './Components/AwardsForm';
import { LatexEditor } from './Components/LatexEditor';
import { ResumePreview } from './Components/ResumePreview';
import { ResumeData } from './types/resume';
import { generateLatexResume } from './utils/latexGenerator';
import { exportToPDF, downloadLatexFile } from './utils/pdfExport';

const initialData: ResumeData = {
  personalInfo: {
    name: '',
    phone: '',
    email: '',
    linkedin: '',
    github: '',
    portfolio: ''
  },
  education: [{
    id: '1',
    institution: '',
    location: '',
    degree: '',
    duration: ''
  }],
  experience: [],
  projects: [{
    id: '1',
    name: '',
    technologies: '',
    duration: '',
    bullets: ['']
  }],
  technicalSkills: {
    languages: '',
    frameworks: '',
    tools: '',
    specialized: ''
  },
  awards: []
};

const tabs = [
  { id: 'personal', label: 'Personal Info' },
  { id: 'education', label: 'Education' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Projects' },
  { id: 'skills', label: 'Skills' },
  { id: 'awards', label: 'Awards' },
  { id: 'latex', label: 'LaTeX Editor' }
];

function App() {
  const [resumeData, setResumeData] = useState<ResumeData>(initialData);
  const [activeTab, setActiveTab] = useState('personal');
  const [showPreview, setShowPreview] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const savedData = localStorage.getItem('resumeBuilderData');
    const savedTheme = localStorage.getItem('resumeBuilderTheme');
    
    if (savedData) {
      try {
        setResumeData(JSON.parse(savedData));
      } catch (error) {
        console.error('Error loading data from localStorage:', error);
      }
    }
    
    if (savedTheme) {
      setIsDarkMode(savedTheme === 'dark');
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('resumeBuilderData', JSON.stringify(resumeData));
  }, [resumeData]);

  useEffect(() => {
    localStorage.setItem('resumeBuilderTheme', isDarkMode ? 'dark' : 'light');
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const handleExportPDF = async () => {
    try {
      await exportToPDF('resume-preview', `${resumeData.personalInfo.name || 'resume'}.pdf`, resumeData);
    } catch (error) {
      alert('Error generating PDF. Please try again.');
    }
  };

  const handleDownloadLatex = () => {
    const latexContent = generateLatexResume(resumeData);
    downloadLatexFile(latexContent, `${resumeData.personalInfo.name || 'resume'}.tex`);
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
      setResumeData(initialData);
      localStorage.removeItem('resumeBuilderData');
    }
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const renderForm = () => {
    switch (activeTab) {
      case 'personal':
        return (
          <PersonalInfoForm
            data={resumeData.personalInfo}
            onChange={(data) => setResumeData(prev => ({ ...prev, personalInfo: data }))}
          />
        );
      case 'education':
        return (
          <EducationForm
            data={resumeData.education}
            onChange={(data) => setResumeData(prev => ({ ...prev, education: data }))}
          />
        );
      case 'experience':
        return (
          <ExperienceForm
            data={resumeData.experience}
            onChange={(data) => setResumeData(prev => ({ ...prev, experience: data }))}
          />
        );
      case 'projects':
        return (
          <ProjectsForm
            data={resumeData.projects}
            onChange={(data) => setResumeData(prev => ({ ...prev, projects: data }))}
          />
        );
      case 'skills':
        return (
          <TechnicalSkillsForm
            data={resumeData.technicalSkills}
            onChange={(data) => setResumeData(prev => ({ ...prev, technicalSkills: data }))}
          />
        );
      case 'awards':
        return (
          <AwardsForm
            data={resumeData.awards}
            onChange={(data) => setResumeData(prev => ({ ...prev, awards: data }))}
          />
        );
      case 'latex':
        return (
          <LatexEditor
            data={resumeData}
            onChange={setResumeData}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 transition-all duration-500 ease-in-out">
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-lg shadow-lg">
                <FileDown className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Resume Builder</h1>
                <p className="text-sm text-gray-600 dark:text-gray-300">Create professional LaTeX resumes</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="flex items-center space-x-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200"
              >
                <Eye className="w-4 h-4" />
                <span className="hidden sm:inline">{showPreview ? 'Hide' : 'Show'} Preview</span>
              </button>
              
              <button
                onClick={handleReset}
                className="p-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-all duration-200 border border-red-200 dark:border-red-800"
                title="Reset all data"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              
              <button
                onClick={handleDownloadLatex}
                className="flex items-center space-x-1 px-4 py-2 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/30 transition-all duration-200 border border-indigo-200 dark:border-indigo-800"
              >
                <Code className="w-4 h-4" />
                <span className="hidden sm:inline">Download LaTeX</span>
              </button>
              
              <button
                onClick={handleExportPDF}
                className="flex items-center space-x-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Export PDF</span>
              </button>
              
              <button
                onClick={toggleTheme}
                className="p-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200"
                title={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
              >
                {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className={`grid transition-all duration-700 ease-in-out ${showPreview ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'} gap-8`}>
          <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transition-all duration-700 ease-in-out ${showPreview ? '' : 'max-w-4xl mx-auto'}`}>
            <div className="flex flex-wrap border-b border-gray-200 dark:border-gray-700 mb-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-b-2 border-blue-600 shadow-md'
                      : 'text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="min-h-[500px]">
              {renderForm()}
            </div>
          </div>

          <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transition-all duration-700 ease-in-out transform ${
            showPreview 
              ? 'opacity-100 translate-x-0 scale-100' 
              : 'opacity-0 translate-x-full scale-95 lg:hidden'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Resume Preview</h2>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Live preview updates automatically
              </div>
            </div>
            
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
              <div id="resume-preview" className="transform scale-75 origin-top-left w-[133.33%]">
                <ResumePreview data={resumeData} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;