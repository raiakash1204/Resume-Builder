export interface PersonalInfo {
  name: string;
  phone: string;
  email: string;
  linkedin: string;
  github: string;
  portfolio: string;
}

export interface Education {
  id: string;
  institution: string;
  location: string;
  degree: string;
  duration: string;
}

export interface Experience {
  id: string;
  position: string;
  duration: string;
  company: string;
  location: string;
  bullets: string[];
}

export interface Project {
  id: string;
  name: string;
  technologies: string;
  duration: string;
  bullets: string[];
}

export interface TechnicalSkills {
  languages: string;
  frameworks: string;
  tools: string;
  specialized: string;
}

export interface Award {
  id: string;
  title: string;
  description: string;
}

export interface ResumeData {
  personalInfo: PersonalInfo;
  education: Education[];
  experience: Experience[];
  projects: Project[];
  technicalSkills: TechnicalSkills;
  awards: Award[];
}