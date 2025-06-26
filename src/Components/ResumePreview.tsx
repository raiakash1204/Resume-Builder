import React from 'react';
import { ResumeData } from '../types/resume';

interface ResumePreviewProps {
  data: ResumeData;
}

export const ResumePreview: React.FC<ResumePreviewProps> = ({ data }) => {
  const { personalInfo, education, experience, projects, technicalSkills, awards } = data;

  return (
    <div className="bg-white p-8 shadow-lg max-w-4xl mx-auto text-sm leading-relaxed">
      {/* Header */}
      <div className="text-center mb-6 border-b pb-4">
        <h1 className="text-2xl font-bold mb-2">{personalInfo.name || 'Your Name'}</h1>
        <div className="text-gray-600 space-x-2">
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {personalInfo.phone && personalInfo.email && <span>|</span>}
          {personalInfo.email && (
            <a href={`mailto:${personalInfo.email}`} className="underline">
              {personalInfo.email}
            </a>
          )}
          {personalInfo.linkedin && (
            <>
              <span>|</span>
              <a href={personalInfo.linkedin} className="underline" target="_blank" rel="noopener noreferrer">
                LinkedIn
              </a>
            </>
          )}
          {personalInfo.github && (
            <>
              <span>|</span>
              <a href={personalInfo.github} className="underline" target="_blank" rel="noopener noreferrer">
                GitHub
              </a>
            </>
          )}
          {personalInfo.portfolio && (
            <>
              <span>|</span>
              <a href={personalInfo.portfolio} className="underline" target="_blank" rel="noopener noreferrer">
                Portfolio
              </a>
            </>
          )}
        </div>
      </div>

      {/* Education */}
      {education.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-bold mb-3 border-b border-gray-400 pb-1">EDUCATION</h2>
          {education.map((edu) => (
            <div key={edu.id} className="mb-3">
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-bold">{edu.institution}</div>
                  <div className="italic text-gray-700">{edu.degree}</div>
                </div>
                <div className="text-right">
                  <div>{edu.location}</div>
                  <div className="italic text-gray-700">{edu.duration}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-bold mb-3 border-b border-gray-400 pb-1">EXPERIENCE</h2>
          {experience.map((exp) => (
            <div key={exp.id} className="mb-4">
              <div className="flex justify-between items-start mb-1">
                <div>
                  <div className="font-bold">{exp.position}</div>
                  <div className="italic text-gray-700">{exp.company}</div>
                </div>
                <div className="text-right">
                  <div>{exp.duration}</div>
                  <div className="italic text-gray-700">{exp.location}</div>
                </div>
              </div>
              {exp.bullets.length > 0 && exp.bullets[0] && (
                <ul className="list-disc list-inside ml-4 space-y-1">
                  {exp.bullets.filter(bullet => bullet.trim()).map((bullet, index) => (
                    <li key={index} className="text-gray-700">{bullet}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-bold mb-3 border-b border-gray-400 pb-1">PROJECTS</h2>
          {projects.map((project) => (
            <div key={project.id} className="mb-4">
              <div className="flex justify-between items-start mb-1">
                <div>
                  <span className="font-bold">{project.name}</span>
                  {project.technologies && (
                    <span className="italic text-gray-700"> | {project.technologies}</span>
                  )}
                </div>
                <div>{project.duration}</div>
              </div>
              {project.bullets.length > 0 && project.bullets[0] && (
                <ul className="list-disc list-inside ml-4 space-y-1">
                  {project.bullets.filter(bullet => bullet.trim()).map((bullet, index) => (
                    <li key={index} className="text-gray-700">{bullet}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Technical Skills */}
      <div className="mb-6">
        <h2 className="text-lg font-bold mb-3 border-b border-gray-400 pb-1">TECHNICAL SKILLS</h2>
        <div className="space-y-1">
          {technicalSkills.languages && (
            <div>
              <span className="font-bold">Languages: </span>
              <span>{technicalSkills.languages}</span>
            </div>
          )}
          {technicalSkills.frameworks && (
            <div>
              <span className="font-bold">Frameworks & Libraries: </span>
              <span>{technicalSkills.frameworks}</span>
            </div>
          )}
          {technicalSkills.tools && (
            <div>
              <span className="font-bold">Developer Tools: </span>
              <span>{technicalSkills.tools}</span>
            </div>
          )}
          {technicalSkills.specialized && (
            <div>
              <span className="font-bold">Specialized Software: </span>
              <span>{technicalSkills.specialized}</span>
            </div>
          )}
        </div>
      </div>

      {/* Awards */}
      {awards.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-bold mb-3 border-b border-gray-400 pb-1">AWARDS AND HONORS</h2>
          <div className="space-y-1">
            {awards.map((award) => (
              <div key={award.id}>
                <span className="font-bold">{award.title}: </span>
                <span>{award.description}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};