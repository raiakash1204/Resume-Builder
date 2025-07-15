import React from 'react';
import { ResumeData } from '../types/resume';

interface ResumePreviewProps {
  data: ResumeData;
}

export const ResumePreview: React.FC<ResumePreviewProps> = ({ data }) => {
  const { personalInfo, education, experience, projects, technicalSkills, awards } = data;

  return (
    <div className="bg-white px-4 py-6 shadow-lg max-w-4xl mx-auto text-sm leading-relaxed" style={{ fontFamily: 'Atkinson Hyperlegible, system-ui, -apple-system, sans-serif' }}>
      {/* Header */}
      <div className="text-center mb-6 border-b pb-4">
        <h1 className="text-2xl font-bold mb-3 break-words">{personalInfo.name || 'Your Name'}</h1>
        <div className="text-gray-600 flex flex-wrap justify-center items-center gap-1 text-xs">
          {personalInfo.phone && <span className="whitespace-nowrap">{personalInfo.phone}</span>}
          {personalInfo.phone && personalInfo.email && <span className="mx-1">|</span>}
          {personalInfo.email && (
            <a href={`mailto:${personalInfo.email}`} className="underline whitespace-nowrap break-all">
              {personalInfo.email}
            </a>
          )}
          {personalInfo.linkedin && (
            <>
              <span className="mx-1">|</span>
              <a href={personalInfo.linkedin} className="underline whitespace-nowrap" target="_blank" rel="noopener noreferrer">
                LinkedIn
              </a>
            </>
          )}
          {personalInfo.github && (
            <>
              <span className="mx-1">|</span>
              <a href={personalInfo.github} className="underline whitespace-nowrap" target="_blank" rel="noopener noreferrer">
                GitHub
              </a>
            </>
          )}
          {personalInfo.portfolio && (
            <>
              <span className="mx-1">|</span>
              <a href={personalInfo.portfolio} className="underline whitespace-nowrap" target="_blank" rel="noopener noreferrer">
                Portfolio
              </a>
            </>
          )}
        </div>
      </div>

      {/* Education */}
      {education.length > 0 && education.some(edu => edu.institution) && (
        <div className="mb-5">
          <h2 className="text-base font-bold mb-3 border-b border-gray-400 pb-1">EDUCATION</h2>
          {education.map((edu) => {
            if (!edu.institution) return null;
            return (
              <div key={edu.id} className="mb-3">
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="font-bold break-words">{edu.institution}</div>
                    <div className="italic text-gray-700 break-words">{edu.degree}</div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="whitespace-nowrap">{edu.location}</div>
                    <div className="italic text-gray-700 whitespace-nowrap">{edu.duration}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <div className="mb-5">
          <h2 className="text-base font-bold mb-3 border-b border-gray-400 pb-1">EXPERIENCE</h2>
          {experience.map((exp) => {
            if (!exp.position) return null;
            return (
              <div key={exp.id} className="mb-4">
                <div className="flex justify-between items-start gap-4 mb-1">
                  <div className="flex-1 min-w-0">
                    <div className="font-bold break-words">{exp.position}</div>
                    <div className="italic text-gray-700 break-words">{exp.company}</div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="whitespace-nowrap text-xs">{exp.duration}</div>
                    <div className="italic text-gray-700 whitespace-nowrap text-xs">{exp.location}</div>
                  </div>
                </div>
                {exp.bullets.length > 0 && exp.bullets[0] && (
                  <ul className="list-disc list-inside ml-3 space-y-1 mt-2">
                    {exp.bullets.filter(bullet => bullet.trim()).map((bullet, index) => (
                      <li key={index} className="text-gray-700 break-words leading-relaxed">{bullet}</li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Projects */}
      {projects.length > 0 && projects.some(project => project.name) && (
        <div className="mb-5">
          <h2 className="text-base font-bold mb-3 border-b border-gray-400 pb-1">PROJECTS</h2>
          {projects.map((project) => {
            if (!project.name) return null;
            return (
              <div key={project.id} className="mb-4">
                <div className="flex justify-between items-start gap-4 mb-1">
                  <div className="flex-1 min-w-0">
                    <div className="break-words">
                      <span className="font-bold">{project.name}</span>
                      {project.technologies && (
                        <span className="font-normal italic text-gray-700"> | {project.technologies}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex-shrink-0 whitespace-nowrap text-xs">{project.duration}</div>
                </div>
                {project.bullets.length > 0 && project.bullets[0] && (
                  <ul className="list-disc list-inside ml-3 space-y-1 mt-2">
                    {project.bullets.filter(bullet => bullet.trim()).map((bullet, index) => (
                      <li key={index} className="text-gray-700 break-words leading-relaxed">{bullet}</li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Technical Skills */}
      <div className="mb-5">
        <h2 className="text-base font-bold mb-3 border-b border-gray-400 pb-1">TECHNICAL SKILLS</h2>
        <div className="space-y-2">
          {technicalSkills.languages && (
            <div className="break-words">
              <span className="font-bold">Languages: </span>
              <span className="font-normal">{technicalSkills.languages}</span>
            </div>
          )}
          {technicalSkills.frameworks && (
            <div className="break-words">
              <span className="font-bold">Frameworks & Libraries: </span>
              <span className="font-normal">{technicalSkills.frameworks}</span>
            </div>
          )}
          {technicalSkills.tools && (
            <div className="break-words">
              <span className="font-bold">Developer Tools: </span>
              <span className="font-normal">{technicalSkills.tools}</span>
            </div>
          )}
          {technicalSkills.specialized && (
            <div className="break-words">
              <span className="font-bold">Specialized Software: </span>
              <span className="font-normal">{technicalSkills.specialized}</span>
            </div>
          )}
        </div>
      </div>

      {/* Awards */}
      {awards.length > 0 && (
        <div className="mb-5">
          <h2 className="text-base font-bold mb-3 border-b border-gray-400 pb-1">AWARDS AND HONORS</h2>
          <div className="space-y-2">
            {awards.map((award) => {
              if (!award.title) return null;
              return (
                <div key={award.id} className="break-words">
                  <span className="font-bold">{award.title}: </span>
                  <span className="font-normal">{award.description}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};