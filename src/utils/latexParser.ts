import { ResumeData, PersonalInfo, Education, Experience, Project, TechnicalSkills, Award } from '../types/resume';

export const parseLatexToResumeData = (latexContent: string): ResumeData => {
  const initialData: ResumeData = {
    personalInfo: {
      name: '',
      phone: '',
      email: '',
      linkedin: '',
      github: '',
      portfolio: ''
    },
    education: [],
    experience: [],
    projects: [],
    technicalSkills: {
      languages: '',
      frameworks: '',
      tools: '',
      specialized: ''
    },
    awards: []
  };

  try {
    const personalInfo = parsePersonalInfo(latexContent);
    const education = parseEducation(latexContent);
    const experience = parseExperience(latexContent);
    const projects = parseProjects(latexContent);
    const technicalSkills = parseTechnicalSkills(latexContent);
    const awards = parseAwards(latexContent);

    return {
      personalInfo,
      education: education.length > 0 ? education : [{ id: '1', institution: '', location: '', degree: '', duration: '' }],
      experience,
      projects: projects.length > 0 ? projects : [{ id: '1', name: '', technologies: '', duration: '', bullets: [''] }],
      technicalSkills,
      awards
    };
  } catch (error) {
    console.error('Error parsing LaTeX:', error);
    return initialData;
  }
};

const parsePersonalInfo = (latex: string): PersonalInfo => {
  const personalInfo: PersonalInfo = {
    name: '',
    phone: '',
    email: '',
    linkedin: '',
    github: '',
    portfolio: ''
  };

  const nameMatch = latex.match(/\\textbf\{\\Huge \\scshape ([^}]+)\}/);
  if (nameMatch) {
    personalInfo.name = nameMatch[1].trim();
  }

  const phoneMatch = latex.match(/\\small ([+\d\-\s]+) \$\|\$/);
  if (phoneMatch) {
    personalInfo.phone = phoneMatch[1].trim();
  }

  const emailMatch = latex.match(/\\href\{mailto:([^}]+)\}/);
  if (emailMatch) {
    personalInfo.email = emailMatch[1].trim();
  }

  const linkedinMatch = latex.match(/\\href\{(https:\/\/[^}]*linkedin[^}]*)\}/);
  if (linkedinMatch) {
    personalInfo.linkedin = linkedinMatch[1].trim();
  }

  const githubMatch = latex.match(/\\href\{(https:\/\/[^}]*github[^}]*)\}/);
  if (githubMatch) {
    personalInfo.github = githubMatch[1].trim();
  }

  const portfolioMatches = latex.match(/\\href\{(https:\/\/[^}]+)\}/g);
  if (portfolioMatches) {
    const portfolioMatch = portfolioMatches.find(match => 
      !match.includes('linkedin') && 
      !match.includes('github') && 
      !match.includes('mailto')
    );
    if (portfolioMatch) {
      const urlMatch = portfolioMatch.match(/\\href\{([^}]+)\}/);
      if (urlMatch) {
        personalInfo.portfolio = urlMatch[1].trim();
      }
    }
  }

  return personalInfo;
};

const parseEducation = (latex: string): Education[] => {
  const education: Education[] = [];
  
  const educationSection = latex.match(/\\section\{Education\}([\s\S]*?)(?=\\section|\%---)/);
  if (!educationSection) return education;

  const educationEntries = educationSection[1].match(/\\resumeSubheading\s*\{([^}]+)\}\{([^}]+)\}\s*\{([^}]+)\}\{([^}]+)\}/g);
  
  if (educationEntries) {
    educationEntries.forEach((entry, index) => {
      const match = entry.match(/\\resumeSubheading\s*\{([^}]+)\}\{([^}]+)\}\s*\{([^}]+)\}\{([^}]+)\}/);
      if (match) {
        education.push({
          id: (index + 1).toString(),
          institution: match[1].trim(),
          location: match[2].trim(),
          degree: match[3].trim(),
          duration: match[4].trim()
        });
      }
    });
  }

  return education;
};

const parseExperience = (latex: string): Experience[] => {
  const experience: Experience[] = [];
  
  const experienceSection = latex.match(/\\section\{Experience\}([\s\S]*?)(?=\\section|\%---)/);
  if (!experienceSection) return experience;

  const experienceText = experienceSection[1];
  const experienceEntries = experienceText.split(/\\resumeSubheading/);
  
  experienceEntries.forEach((entry, index) => {
    if (index === 0 || !entry.trim()) return;
    
    const headerMatch = entry.match(/\s*\{([^}]+)\}\{([^}]+)\}\s*\{([^}]+)\}\{([^}]+)\}/);
    if (!headerMatch) return;

    const bullets: string[] = [];
    const bulletMatches = entry.match(/\\resumeItem\{([^}]+(?:\{[^}]*\}[^}]*)*)\}/g);
    
    if (bulletMatches) {
      bulletMatches.forEach(bulletMatch => {
        const bulletContent = bulletMatch.match(/\\resumeItem\{([^}]+(?:\{[^}]*\}[^}]*)*)\}/);
        if (bulletContent) {
          bullets.push(bulletContent[1].trim());
        }
      });
    }

    experience.push({
      id: index.toString(),
      position: headerMatch[1].trim(),
      duration: headerMatch[2].trim(),
      company: headerMatch[3].trim(),
      location: headerMatch[4].trim(),
      bullets: bullets.length > 0 ? bullets : ['']
    });
  });

  return experience;
};

const parseProjects = (latex: string): Project[] => {
  const projects: Project[] = [];
  
  const projectsSection = latex.match(/\\section\{Projects\}([\s\S]*?)(?=\\section|\%---)/);
  if (!projectsSection) return projects;

  const projectsText = projectsSection[1];
  const projectEntries = projectsText.split(/\\resumeProjectHeading/);
  
  projectEntries.forEach((entry, index) => {
    if (index === 0 || !entry.trim()) return;
    
    const headerMatch = entry.match(/\s*\{\\textbf\{([^}]+)\} \$\|\$ \\emph\{([^}]+)\}\}\{([^}]+)\}/);
    if (!headerMatch) return;

    const bullets: string[] = [];
    const bulletMatches = entry.match(/\\resumeItem\{([^}]+(?:\{[^}]*\}[^}]*)*)\}/g);
    
    if (bulletMatches) {
      bulletMatches.forEach(bulletMatch => {
        const bulletContent = bulletMatch.match(/\\resumeItem\{([^}]+(?:\{[^}]*\}[^}]*)*)\}/);
        if (bulletContent) {
          bullets.push(bulletContent[1].trim());
        }
      });
    }

    projects.push({
      id: index.toString(),
      name: headerMatch[1].trim(),
      technologies: headerMatch[2].trim(),
      duration: headerMatch[3].trim(),
      bullets: bullets.length > 0 ? bullets : ['']
    });
  });

  return projects;
};

const parseTechnicalSkills = (latex: string): TechnicalSkills => {
  const technicalSkills: TechnicalSkills = {
    languages: '',
    frameworks: '',
    tools: '',
    specialized: ''
  };

  const skillsSection = latex.match(/\\section\{Technical Skills\}([\s\S]*?)(?=\\section|\%---)/);
  if (!skillsSection) return technicalSkills;

  const skillsText = skillsSection[1];

  const languagesMatch = skillsText.match(/\\textbf\{Languages\}\{:([^}]+)\}/);
  if (languagesMatch) {
    technicalSkills.languages = languagesMatch[1].trim();
  }

  const frameworksMatch = skillsText.match(/\\textbf\{Frameworks \\& Libraries\}\{:([^}]+)\}/);
  if (frameworksMatch) {
    technicalSkills.frameworks = frameworksMatch[1].trim();
  }

  const toolsMatch = skillsText.match(/\\textbf\{Developer Tools\}\{:([^}]+)\}/);
  if (toolsMatch) {
    technicalSkills.tools = toolsMatch[1].trim();
  }

  const specializedMatch = skillsText.match(/\\textbf\{Specialised Software\}\{:([^}]+)\}/);
  if (specializedMatch) {
    technicalSkills.specialized = specializedMatch[1].trim();
  }

  return technicalSkills;
};

const parseAwards = (latex: string): Award[] => {
  const awards: Award[] = [];
  
  const awardsSection = latex.match(/\\section\{Awards and Honors\}([\s\S]*?)(?=\\section|\%---)/);
  if (!awardsSection) return awards;

  const awardsText = awardsSection[1];
  const awardMatches = awardsText.match(/\\textbf\{([^}]+)\}\{([^}]+)\}/g);
  
  if (awardMatches) {
    awardMatches.forEach((match, index) => {
      const awardMatch = match.match(/\\textbf\{([^}]+)\}\{([^}]+)\}/);
      if (awardMatch) {
        awards.push({
          id: (index + 1).toString(),
          title: awardMatch[1].trim(),
          description: awardMatch[2].trim()
        });
      }
    });
  }

  return awards;
};