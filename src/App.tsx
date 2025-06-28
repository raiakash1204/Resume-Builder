import React, { useState, useEffect } from 'react';
import { FileDown, Download, Eye, Code } from 'lucide-react';
import { PersonalInfoForm } from './components/PersonalInfoForm';
import { EducationForm } from './components/EducationForm';
import { ExperienceForm } from './components/ExperienceForm';
import { ProjectsForm } from './components/ProjectsForm';
import { TechnicalSkillsForm } from './components/TechnicalSkillsForm';
import { AwardsForm } from './components/AwardsForm';
import { LatexEditor } from './components/LatexEditor';
import { ResumePreview } from './components/ResumePreview';
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

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedData = localStorage.getItem('resumeBuilderData');
    if (savedData) {
      try {
        setResumeData(JSON.parse(savedData));
      } catch (error) {
        console.error('Error loading data from localStorage:', error);
      }
    }
  }, []);

  // Save data to localStorage whenever resumeData changes
  useEffect(() => {
    localStorage.setItem('resumeBuilderData', JSON.stringify(resumeData));
  }, [resumeData]);

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <FileDown className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Resume Builder</h1>
                <p className="text-sm text-gray-600">Create professional LaTeX resumes</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="flex items-center space-x-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <Eye className="w-4 h-4" />
                <span>{showPreview ? 'Hide' : 'Show'} Preview</span>
              </button>
              
              <button
                onClick={handleDownloadLatex}
                className="flex items-center space-x-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Code className="w-4 h-4" />
                <span>Download LaTeX</span>
              </button>
              
              <button
                onClick={handleExportPDF}
                className="flex items-center space-x-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Export PDF</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className={`grid ${showPreview ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'} gap-8`}>
          {/* Form Section */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            {/* Tabs */}
            <div className="flex flex-wrap border-b border-gray-200 mb-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white border-b-2 border-blue-600'
                      : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Form Content */}
            <div className="min-h-[500px]">
              {renderForm()}
            </div>
          </div>

          {/* Preview Section */}
          {showPreview && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-800">Resume Preview</h2>
                <div className="text-sm text-gray-500">
                  Live preview updates automatically
                </div>
              </div>
              
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div id="resume-preview" className="transform scale-75 origin-top-left w-[133.33%]">
                  <ResumePreview data={resumeData} />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;