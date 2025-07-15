import { ResumeData } from '../types/resume';

// Import the template as a string
const getTemplate = async (): Promise<string> => {
  try {
    const response = await fetch('/src/templates/resume-template.tex');
    return await response.text();
  } catch (error) {
    console.error('Error loading template:', error);
    // Fallback template if file can't be loaded
    return getDefaultTemplate();
  }
};

const getDefaultTemplate = (): string => {
  return `%-------------------------
% Resume in Latex
% Author : Jake Gutierrez
% Based off of: https://github.com/sb2nov/resume
% License : MIT
%------------------------

\\documentclass[letterpaper,11pt]{article}

\\usepackage{latexsym}
\\usepackage[empty]{fullpage}
\\usepackage{titlesec}
\\usepackage{marvosym}
\\usepackage[usenames,dvipsnames]{color}
\\usepackage{verbatim}
\\usepackage{enumitem}
\\usepackage[hidelinks]{hyperref}
\\usepackage{fancyhdr}
\\usepackage[english]{babel}
\\usepackage{tabularx}
\\input{glyphtounicode}

\\pagestyle{fancy}
\\fancyhf{} % clear all header and footer fields
\\fancyfoot{}
\\renewcommand{\\headrulewidth}{0pt}
\\renewcommand{\\footrulewidth}{0pt}

% Adjust margins
\\addtolength{\\oddsidemargin}{-0.5in}
\\addtolength{\\evensidemargin}{-0.5in}
\\addtolength{\\textwidth}{1in}
\\addtolength{\\topmargin}{-.5in}
\\addtolength{\\textheight}{1.0in}

\\urlstyle{same}

\\raggedbottom
\\raggedright
\\setlength{\\tabcolsep}{0in}

% Sections formatting
\\titleformat{\\section}{
  \\vspace{-4pt}\\scshape\\raggedright\\large
}{}{0em}{}[\\color{black}\\titlerule \\vspace{-5pt}]

% Ensure that generate pdf is machine readable/ATS parsable
\\pdfgentounicode=1

%-------------------------
% Custom commands
\\newcommand{\\resumeItem}[1]{
  \\item\\small{
    {#1 \\vspace{-2pt}}
  }
}

\\newcommand{\\resumeSubheading}[4]{
  \\vspace{-2pt}\\item
    \\begin{tabular*}{0.97\\textwidth}[t]{l@{\\extracolsep{\\fill}}r}
      \\textbf{#1} & #2 \\\\
      \\textit{\\small#3} & \\textit{\\small #4} \\\\
    \\end{tabular*}\\vspace{-7pt}
}

\\newcommand{\\resumeSubSubheading}[2]{
    \\item
    \\begin{tabular*}{0.97\\textwidth}{l@{\\extracolsep{\\fill}}r}
      \\textit{\\small#1} & \\textit{\\small #2} \\\\
    \\end{tabular*}\\vspace{-7pt}
}

\\newcommand{\\resumeProjectHeading}[2]{
    \\item
    \\begin{tabular*}{0.97\\textwidth}{l@{\\extracolsep{\\fill}}r}
      \\small#1 & #2 \\\\
    \\end{tabular*}\\vspace{-7pt}
}

\\newcommand{\\resumeSubItem}[1]{\\resumeItem{#1}\\vspace{-4pt}}

\\renewcommand\\labelitemii{$\\vcenter{\\hbox{\\tiny$\\bullet$}}$}

\\newcommand{\\resumeSubHeadingListStart}{\\begin{itemize}[leftmargin=0.15in, label={}]}
\\newcommand{\\resumeSubHeadingListEnd}{\\end{itemize}}
\\newcommand{\\resumeItemListStart}{\\begin{itemize}}
\\newcommand{\\resumeItemListEnd}{\\end{itemize}\\vspace{-5pt}}

%-------------------------------------------
%%%%%%  RESUME STARTS HERE  %%%%%%%%%%%%%%%%%%%%%%%%%%%%

\\begin{document}

%----------HEADING----------
\\begin{center}
    \\textbf{\\Huge \\scshape {{FULL_NAME}}} \\\\ \\vspace{1pt}
    \\small {{PHONE}} $|$ \\href{mailto:{{EMAIL}}}{\\underline{{{EMAIL}}}} $|$ 
    {{LINKEDIN_LINK}}
    {{GITHUB_LINK}}
    {{PORTFOLIO_LINK}}
\\end{center}

{{EDUCATION_SECTION}}

{{EXPERIENCE_SECTION}}

{{PROJECTS_SECTION}}

%
%-----------PROGRAMMING SKILLS-----------
\\section{Technical Skills}
 \\begin{itemize}[leftmargin=0.15in, label={}]
    \\small{\\item{
     \\textbf{Languages}{: {{LANGUAGES}}} \\\\
     \\textbf{Frameworks}{: {{FRAMEWORKS}}} \\\\
     \\textbf{Developer Tools}{: {{TOOLS}}} \\\\
     {{SPECIALIZED_LINE}}
    }}
 \\end{itemize}

{{AWARDS_SECTION}}

%-------------------------------------------
\\end{document}`;
};

export const generateLatexResume = async (data: ResumeData): Promise<string> => {
  const { personalInfo, education, experience, projects, technicalSkills, awards } = data;
  
  let template = getDefaultTemplate();
  
  try {
    template = await getTemplate();
  } catch (error) {
    console.warn('Using fallback template');
  }

  // Generate sections
  const educationSection = generateEducationSection(education);
  const experienceSection = generateExperienceSection(experience);
  const projectsSection = generateProjectsSection(projects);
  const awardsSection = generateAwardsSection(awards);

  // Generate contact links
  const linkedinLink = personalInfo.linkedin ? 
    `\\href{${personalInfo.linkedin}}{\\underline{LinkedIn}} $|$` : '';
  const githubLink = personalInfo.github ? 
    `\\href{${personalInfo.github}}{\\underline{GitHub}}${personalInfo.portfolio ? ' $|$' : ''}` : '';
  const portfolioLink = personalInfo.portfolio ? 
    `\\href{${personalInfo.portfolio}}{\\underline{Portfolio}}` : '';

  // Generate specialized software line
  const specializedLine = technicalSkills.specialized ? 
    `\\textbf{Specialized Software}{: ${technicalSkills.specialized}} \\\\` : '';

  // Replace placeholders
  let result = template
    .replace(/{{FULL_NAME}}/g, personalInfo.name || 'Your Name')
    .replace(/{{PHONE}}/g, personalInfo.phone || '')
    .replace(/{{EMAIL}}/g, personalInfo.email || '')
    .replace(/{{LINKEDIN_LINK}}/g, linkedinLink)
    .replace(/{{GITHUB_LINK}}/g, githubLink)
    .replace(/{{PORTFOLIO_LINK}}/g, portfolioLink)
    .replace(/{{EDUCATION_SECTION}}/g, educationSection)
    .replace(/{{EXPERIENCE_SECTION}}/g, experienceSection)
    .replace(/{{PROJECTS_SECTION}}/g, projectsSection)
    .replace(/{{LANGUAGES}}/g, technicalSkills.languages || '')
    .replace(/{{FRAMEWORKS}}/g, technicalSkills.frameworks || '')
    .replace(/{{TOOLS}}/g, technicalSkills.tools || '')
    .replace(/{{SPECIALIZED_LINE}}/g, specializedLine)
    .replace(/{{AWARDS_SECTION}}/g, awardsSection);

  return result;
};

const generateEducationSection = (education: any[]): string => {
  if (!education.length || !education[0].institution) return '';
  
  return `
%-----------EDUCATION-----------
\\section{Education}
  \\resumeSubHeadingListStart
${education.map(edu => `    \\resumeSubheading
      {${edu.institution}}{${edu.location}}
      {${edu.degree}}{${edu.duration}}`).join('\n')}
  \\resumeSubHeadingListEnd
`;
};

const generateExperienceSection = (experience: any[]): string => {
  if (!experience.length) return '';
  
  return `
%-----------EXPERIENCE-----------
\\section{Experience}
  \\resumeSubHeadingListStart
${experience.map(exp => `
    \\resumeSubheading
      {${exp.position}}{${exp.duration}}
      {${exp.company}}{${exp.location}}
      \\resumeItemListStart
${exp.bullets.filter((bullet: string) => bullet.trim()).map((bullet: string) => `        \\resumeItem{${bullet}}`).join('\n')}
      \\resumeItemListEnd`).join('')}
  \\resumeSubHeadingListEnd
`;
};

const generateProjectsSection = (projects: any[]): string => {
  if (!projects.length || !projects[0].name) return '';
  
  return `
%-----------PROJECTS-----------
\\section{Projects}
    \\resumeSubHeadingListStart
${projects.map(project => `      \\resumeProjectHeading
          {\\textbf{${project.name}} $|$ \\emph{${project.technologies}}}{${project.duration}}
          \\resumeItemListStart
${project.bullets.filter((bullet: string) => bullet.trim()).map((bullet: string) => `            \\resumeItem{${bullet}}`).join('\n')}
          \\resumeItemListEnd`).join('\n')}
    \\resumeSubHeadingListEnd
`;
};

const generateAwardsSection = (awards: any[]): string => {
  if (!awards.length) return '';
  
  return `
%-----Awards And HONORS
\\section{Awards and Honors}
 \\begin{itemize}[leftmargin=0.15in, label={}]
    \\small{\\item{
${awards.map(award => `     \\textbf{${award.title}}{: ${award.description}} \\\\`).join('\n')}
    }}
 \\end{itemize}
`;
};

// For backward compatibility, export a synchronous version that uses the default template
export const generateLatexResumeSync = (data: ResumeData): string => {
  const template = getDefaultTemplate();
  const { personalInfo, education, experience, projects, technicalSkills, awards } = data;

  // Generate sections using the same functions
  const educationSection = generateEducationSection(education);
  const experienceSection = generateExperienceSection(experience);
  const projectsSection = generateProjectsSection(projects);
  const awardsSection = generateAwardsSection(awards);

  // Generate contact links
  const linkedinLink = personalInfo.linkedin ? 
    `\\href{${personalInfo.linkedin}}{\\underline{LinkedIn}} $|$` : '';
  const githubLink = personalInfo.github ? 
    `\\href{${personalInfo.github}}{\\underline{GitHub}}${personalInfo.portfolio ? ' $|$' : ''}` : '';
  const portfolioLink = personalInfo.portfolio ? 
    `\\href{${personalInfo.portfolio}}{\\underline{Portfolio}}` : '';

  // Generate specialized software line
  const specializedLine = technicalSkills.specialized ? 
    `\\textbf{Specialized Software}{: ${technicalSkills.specialized}} \\\\` : '';

  // Replace placeholders
  let result = template
    .replace(/{{FULL_NAME}}/g, personalInfo.name || 'Your Name')
    .replace(/{{PHONE}}/g, personalInfo.phone || '')
    .replace(/{{EMAIL}}/g, personalInfo.email || '')
    .replace(/{{LINKEDIN_LINK}}/g, linkedinLink)
    .replace(/{{GITHUB_LINK}}/g, githubLink)
    .replace(/{{PORTFOLIO_LINK}}/g, portfolioLink)
    .replace(/{{EDUCATION_SECTION}}/g, educationSection)
    .replace(/{{EXPERIENCE_SECTION}}/g, experienceSection)
    .replace(/{{PROJECTS_SECTION}}/g, projectsSection)
    .replace(/{{LANGUAGES}}/g, technicalSkills.languages || '')
    .replace(/{{FRAMEWORKS}}/g, technicalSkills.frameworks || '')
    .replace(/{{TOOLS}}/g, technicalSkills.tools || '')
    .replace(/{{SPECIALIZED_LINE}}/g, specializedLine)
    .replace(/{{AWARDS_SECTION}}/g, awardsSection);

  return result;
};