import { ResumeData } from '../types/resume';

export const generateLatexResume = (data: ResumeData): string => {
  const { personalInfo, education, experience, projects, technicalSkills, awards } = data;

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


%----------FONT OPTIONS----------
% sans-serif
% \\usepackage[sfdefault]{FiraSans}
% \\usepackage[sfdefault]{roboto}
% \\usepackage[sfdefault]{noto-sans}
% \\usepackage[default]{sourcesanspro}

% serif
% \\usepackage{CormorantGaramond}
% \\usepackage{charter}


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
    \\textbf{\\Huge \\scshape ${personalInfo.name}} \\\\ \\vspace{1pt}
    \\small ${personalInfo.phone} $|$ \\href{mailto:${personalInfo.email}}{\\underline{${personalInfo.email}}} $|$ 
    ${personalInfo.linkedin ? `\\href{${personalInfo.linkedin}}{\\underline{LinkedIn}} $|$` : ''}
    ${personalInfo.github ? `\\href{${personalInfo.github}}{\\underline{GitHub}} $|$` : ''}
    ${personalInfo.portfolio ? `\\href{${personalInfo.portfolio}}{\\underline{Portfolio}}` : ''}
\\end{center}


%-----------EDUCATION-----------
\\section{Education}
  \\resumeSubHeadingListStart
${education.map(edu => `    \\resumeSubheading
      {${edu.institution}}{${edu.location}}
      {${edu.degree}}{${edu.duration}}`).join('\n')}
  \\resumeSubHeadingListEnd

${experience.length > 0 ? `
%-----------EXPERIENCE-----------
\\section{Experience}
  \\resumeSubHeadingListStart
${experience.map(exp => `
    \\resumeSubheading
      {${exp.position}}{${exp.duration}}
      {${exp.company}}{${exp.location}}
      \\resumeItemListStart
${exp.bullets.map(bullet => `        \\resumeItem{${bullet}}`).join('\n')}
      \\resumeItemListEnd`).join('')}
  \\resumeSubHeadingListEnd

` : ''}
%-----------PROJECTS-----------
\\section{Projects}
    \\resumeSubHeadingListStart
${projects.map(project => `      \\resumeProjectHeading
          {\\textbf{${project.name}} $|$ \\emph{${project.technologies}}}{${project.duration}}
          \\resumeItemListStart
${project.bullets.map(bullet => `            \\resumeItem{${bullet}}`).join('\n')}
          \\resumeItemListEnd`).join('\n')}
    \\resumeSubHeadingListEnd

%-----------PROGRAMMING SKILLS-----------
\\section{Technical Skills}
 \\begin{itemize}[leftmargin=0.15in, label={}]
    \\small{\\item{
     \\textbf{Languages}{: ${technicalSkills.languages}} \\\\
     \\textbf{Frameworks \\& Libraries}{: ${technicalSkills.frameworks}} \\\\
     \\textbf{Developer Tools}{: ${technicalSkills.tools}} \\\\
     \\textbf{Specialised Software}{: ${technicalSkills.specialized}} }}
 \\end{itemize}

${awards.length > 0 ? `
%-----Awards And HONORS
\\section{Awards and Honors}
 \\begin{itemize}[leftmargin=0.15in, label={}]
    \\small{\\item{
${awards.map(award => `     \\textbf{${award.title}}{${award.description}} \\\\`).join('\n')}
    }}
 \\end{itemize}
` : ''}
%-------------------------------------------
\\end{document}`;
};