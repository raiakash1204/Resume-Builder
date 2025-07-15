import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { ResumeData } from '../types/resume';
import { generateLatexResumeSync } from './latexGenerator';

export const exportToPDF = async (elementId: string, filename: string = 'resume.pdf', resumeData?: ResumeData) => {
  if (resumeData) {
    return generateDirectPDF(resumeData, filename);
  } else {
    return exportCanvasToPDF(elementId, filename);
  }
};

const generateDirectPDF = (resumeData: ResumeData, filename: string) => {
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const { personalInfo, education, experience, projects, technicalSkills, awards } = resumeData;
  
  let yPosition = 25;
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 10;
  const contentWidth = pageWidth - (margin * 2);
  const lineHeight = 5;
  const sectionSpacing = 8;
  const font = "helvetica" //options are times, courier, helvetica because jspdf supports only these three fonts.

  const checkPageBreak = (requiredSpace: number) => {
    if (yPosition + requiredSpace > pageHeight - margin) {
      pdf.addPage();
      yPosition = margin;
    }
  };

  const addSectionHeader = (title: string) => {
    checkPageBreak(15);
    pdf.setFont(font, 'bold');
    pdf.setFontSize(14);
    pdf.text(title.toUpperCase(), margin, yPosition);
    
    pdf.setDrawColor(0, 0, 0);
    pdf.setLineWidth(0.5);
    pdf.line(margin, yPosition + 2, pageWidth - margin, yPosition + 2);
    
    yPosition += sectionSpacing;
  };

  // Header - Name
  pdf.setFont(font, 'bold');
  pdf.setFontSize(22);
  const name = personalInfo.name || 'Your Name';
  const nameWidth = pdf.getTextWidth(name);
  pdf.text(name, (pageWidth - nameWidth) / 2, yPosition);
  yPosition += 8;

  // Contact info
  pdf.setFont(font, 'normal');
  pdf.setFontSize(10);
  
  const contactParts = [];
  if (personalInfo.phone) contactParts.push(personalInfo.phone);
  if (personalInfo.email) contactParts.push(personalInfo.email);
  if (personalInfo.linkedin) contactParts.push('LinkedIn');
  if (personalInfo.github) contactParts.push('GitHub');
  if (personalInfo.portfolio) contactParts.push('Portfolio');
  
  const contactLine = contactParts.join(' | ');
  const contactWidth = pdf.getTextWidth(contactLine);
  const contactStartX = (pageWidth - contactWidth) / 2;
  
  pdf.text(contactLine, contactStartX, yPosition);
  
  // Add clickable links
  let currentX = contactStartX;
  contactParts.forEach((part, index) => {
    if (index > 0) {
      const separatorWidth = pdf.getTextWidth(' | ');
      currentX += separatorWidth;
    }
    
    const partWidth = pdf.getTextWidth(part);
    
    if (part === personalInfo.email && personalInfo.email) {
      pdf.link(currentX, yPosition - 4, partWidth, 5, { url: `mailto:${personalInfo.email}` });
    } else if (part === 'LinkedIn' && personalInfo.linkedin) {
      pdf.link(currentX, yPosition - 4, partWidth, 5, { url: personalInfo.linkedin });
    } else if (part === 'GitHub' && personalInfo.github) {
      pdf.link(currentX, yPosition - 4, partWidth, 5, { url: personalInfo.github });
    } else if (part === 'Portfolio' && personalInfo.portfolio) {
      pdf.link(currentX, yPosition - 4, partWidth, 5, { url: personalInfo.portfolio });
    }
    
    currentX += partWidth;
  });
  
  yPosition += 12;

  // Education
  if (education.length > 0 && education[0].institution) {
    addSectionHeader('Education');
    
    education.forEach((edu) => {
      if (!edu.institution) return;
      
      checkPageBreak(20);
      
      pdf.setFont(font, 'bold');
      pdf.setFontSize(11);
      pdf.text(edu.institution, margin, yPosition);
      
      if (edu.location) {
        const locationWidth = pdf.getTextWidth(edu.location);
        pdf.text(edu.location, pageWidth - margin - locationWidth, yPosition);
      }
      yPosition += lineHeight;
      
      pdf.setFont(font, 'italic');
      pdf.setFontSize(10);
      if (edu.degree) {
        pdf.text(edu.degree, margin, yPosition);
      }
      
      if (edu.duration) {
        const durationWidth = pdf.getTextWidth(edu.duration);
        pdf.text(edu.duration, pageWidth - margin - durationWidth, yPosition);
      }
      yPosition += lineHeight + 2;
    });
    yPosition += 3;
  }

  // Experience
  if (experience.length > 0) {
    addSectionHeader('Experience');
    
    experience.forEach((exp) => {
      if (!exp.position) return;
      
      checkPageBreak(25);
      
      pdf.setFont(font, 'bold');
      pdf.setFontSize(11);
      pdf.text(exp.position, margin, yPosition);
      
      if (exp.duration) {
        const durationWidth = pdf.getTextWidth(exp.duration);
        pdf.text(exp.duration, pageWidth - margin - durationWidth, yPosition);
      }
      yPosition += lineHeight;
      
      pdf.setFont(font, 'italic');
      pdf.setFontSize(10);
      if (exp.company) {
        pdf.text(exp.company, margin, yPosition);
      }
      
      if (exp.location) {
        const locationWidth = pdf.getTextWidth(exp.location);
        pdf.text(exp.location, pageWidth - margin - locationWidth, yPosition);
      }
      yPosition += lineHeight + 1;
      
      pdf.setFont(font, 'normal');
      pdf.setFontSize(10);
      exp.bullets.forEach((bullet) => {
        if (bullet.trim()) {
          checkPageBreak(8);
          const bulletText = `• ${bullet}`;
          const bulletLines = pdf.splitTextToSize(bulletText, contentWidth - 10);
          bulletLines.forEach((line: string) => {
            pdf.text(line, margin + 5, yPosition);
            yPosition += lineHeight;
          });
        }
      });
      yPosition += 3;
    });
  }

  // Projects
  if (projects.length > 0 && projects[0].name) {
    addSectionHeader('Projects');
    
    projects.forEach((project) => {
      if (!project.name) return;
      
      checkPageBreak(25);
      
      pdf.setFont(font, 'bold');
      pdf.setFontSize(11);
      const projectTitle = project.technologies ? 
        `${project.name} | ${project.technologies}` : 
        project.name;
      pdf.text(projectTitle, margin, yPosition);
      
      if (project.duration) {
        const durationWidth = pdf.getTextWidth(project.duration);
        pdf.text(project.duration, pageWidth - margin - durationWidth, yPosition);
      }
      yPosition += lineHeight + 1;
      
      pdf.setFont(font, 'normal');
      pdf.setFontSize(10);
      project.bullets.forEach((bullet) => {
        if (bullet.trim()) {
          checkPageBreak(8);
          const bulletText = `• ${bullet}`;
          const bulletLines = pdf.splitTextToSize(bulletText, contentWidth - 10);
          bulletLines.forEach((line: string) => {
            pdf.text(line, margin + 5, yPosition);
            yPosition += lineHeight;
          });
        }
      });
      yPosition += 3;
    });
  }

  // Technical Skills
  addSectionHeader('Technical Skills');
  
  const skillCategories = [
    { label: 'Languages', value: technicalSkills.languages },
    { label: 'Frameworks & Libraries', value: technicalSkills.frameworks },
    { label: 'Developer Tools', value: technicalSkills.tools },
    { label: 'Specialized Software', value: technicalSkills.specialized }
  ];
  
  skillCategories.forEach((category) => {
    if (category.value) {
      checkPageBreak(8);
      
      pdf.setFont(font, 'bold');
      pdf.setFontSize(10);
      const labelText = `${category.label}: `;
      pdf.text(labelText, margin, yPosition);
      
      pdf.setFont(font, 'normal');
      const labelWidth = pdf.getTextWidth(labelText);
      const valueLines = pdf.splitTextToSize(category.value, contentWidth - labelWidth);
      
      valueLines.forEach((line: string, index: number) => {
        if (index > 0) {
          yPosition += lineHeight;
          checkPageBreak(5);
        }
        pdf.text(line, margin + (index === 0 ? labelWidth : 0), yPosition);
      });
      
      yPosition += lineHeight + 1;
    }
  });

  // Awards
  if (awards.length > 0) {
    yPosition += 3;
    addSectionHeader('Awards and Honors');
    
    awards.forEach((award) => {
      if (!award.title) return;
      
      checkPageBreak(8);
      
      pdf.setFont(font, 'bold');
      pdf.setFontSize(10);
      const titleText = `${award.title}: `;
      pdf.text(titleText, margin, yPosition);
      
      if (award.description) {
        pdf.setFont(font, 'normal');
        const titleWidth = pdf.getTextWidth(titleText);
        const descLines = pdf.splitTextToSize(award.description, contentWidth - titleWidth);
        
        descLines.forEach((line: string, index: number) => {
          if (index > 0) {
            yPosition += lineHeight;
            checkPageBreak(5);
          }
          pdf.text(line, margin + (index === 0 ? titleWidth : 0), yPosition);
        });
      }
      
      yPosition += lineHeight + 2;
    });
  }

  pdf.save(filename);
  return true;
};

const exportCanvasToPDF = async (elementId: string, filename: string) => {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error('Element not found');
  }

  try {
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff'
    });

    const imgData = canvas.toDataURL('image/png');
    
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    
    const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
    const imgX = (pdfWidth - imgWidth * ratio) / 2;
    const imgY = 0;

    pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
    pdf.save(filename);
    
    return true;
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
};

export const downloadLatexFile = (latexContent: string, filename: string = 'resume.tex') => {
  // If no content provided, generate from current data
  if (!latexContent) {
    console.warn('No LaTeX content provided to downloadLatexFile');
    return;
  }
  
  const blob = new Blob([latexContent], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};