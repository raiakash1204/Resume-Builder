import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { ResumeData } from '../types/resume';

export const exportToPDF = async (elementId: string, filename: string = 'resume.pdf', resumeData?: ResumeData) => {
  if (resumeData) {
    // Use direct PDF generation for clickable links
    return generateDirectPDF(resumeData, filename);
  } else {
    // Fallback to canvas method
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
  
  let yPosition = 20;
  const pageWidth = pdf.internal.pageSize.getWidth();
  const margin = 20;
  const contentWidth = pageWidth - (margin * 2);

  // Helper functions
  const addText = (text: string, x: number, y: number, options: any = {}) => {
    pdf.setFont('helvetica', options.style || 'normal');
    pdf.setFontSize(options.size || 10);
    pdf.text(text, x, y);
  };

  const addCenteredText = (text: string, y: number, options: any = {}) => {
    pdf.setFont('helvetica', options.style || 'normal');
    pdf.setFontSize(options.size || 10);
    const textWidth = pdf.getTextWidth(text);
    pdf.text(text, (pageWidth - textWidth) / 2, y);
  };

  const addLine = (y: number) => {
    pdf.setDrawColor(0, 0, 0);
    pdf.setLineWidth(0.5);
    pdf.line(margin, y, pageWidth - margin, y);
  };

  const addSectionHeader = (title: string, y: number) => {
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(12);
    pdf.text(title.toUpperCase(), margin, y);
    addLine(y + 2);
    return y + 8;
  };

  // Header - Name
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(24);
  const nameWidth = pdf.getTextWidth(personalInfo.name || 'Your Name');
  pdf.text(personalInfo.name || 'Your Name', (pageWidth - nameWidth) / 2, yPosition);
  yPosition += 8;

  // Header - Contact Info
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(10);
  
  let contactLine = '';
  const contactParts = [];
  
  if (personalInfo.phone) contactParts.push(personalInfo.phone);
  if (personalInfo.email) contactParts.push(personalInfo.email);
  if (personalInfo.linkedin) contactParts.push('LinkedIn');
  if (personalInfo.github) contactParts.push('GitHub');
  if (personalInfo.portfolio) contactParts.push('Portfolio');
  
  contactLine = contactParts.join(' | ');
  const contactWidth = pdf.getTextWidth(contactLine);
  const contactStartX = (pageWidth - contactWidth) / 2;
  
  // Add contact text
  pdf.text(contactLine, contactStartX, yPosition);
  
  // Add clickable links
  let currentX = contactStartX;
  contactParts.forEach((part, index) => {
    if (index > 0) {
      const separatorWidth = pdf.getTextWidth(' | ');
      currentX += separatorWidth;
    }
    
    const partWidth = pdf.getTextWidth(part);
    
    // Add clickable areas for links
    if (part === personalInfo.email && personalInfo.email) {
      pdf.link(currentX, yPosition - 3, partWidth, 4, { url: `mailto:${personalInfo.email}` });
    } else if (part === 'LinkedIn' && personalInfo.linkedin) {
      pdf.link(currentX, yPosition - 3, partWidth, 4, { url: personalInfo.linkedin });
    } else if (part === 'GitHub' && personalInfo.github) {
      pdf.link(currentX, yPosition - 3, partWidth, 4, { url: personalInfo.github });
    } else if (part === 'Portfolio' && personalInfo.portfolio) {
      pdf.link(currentX, yPosition - 3, partWidth, 4, { url: personalInfo.portfolio });
    }
    
    currentX += partWidth;
  });
  
  yPosition += 10;

  // Education Section
  if (education.length > 0) {
    yPosition = addSectionHeader('Education', yPosition);
    
    education.forEach((edu) => {
      // Institution and Location
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(10);
      pdf.text(edu.institution, margin, yPosition);
      
      const locationWidth = pdf.getTextWidth(edu.location);
      pdf.text(edu.location, pageWidth - margin - locationWidth, yPosition);
      yPosition += 4;
      
      // Degree and Duration
      pdf.setFont('helvetica', 'italic');
      pdf.text(edu.degree, margin, yPosition);
      
      const durationWidth = pdf.getTextWidth(edu.duration);
      pdf.text(edu.duration, pageWidth - margin - durationWidth, yPosition);
      yPosition += 6;
    });
  }

  // Experience Section
  if (experience.length > 0) {
    yPosition = addSectionHeader('Experience', yPosition);
    
    experience.forEach((exp) => {
      // Position and Duration
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(10);
      pdf.text(exp.position, margin, yPosition);
      
      const durationWidth = pdf.getTextWidth(exp.duration);
      pdf.text(exp.duration, pageWidth - margin - durationWidth, yPosition);
      yPosition += 4;
      
      // Company and Location
      pdf.setFont('helvetica', 'italic');
      pdf.text(exp.company, margin, yPosition);
      
      const locationWidth = pdf.getTextWidth(exp.location);
      pdf.text(exp.location, pageWidth - margin - locationWidth, yPosition);
      yPosition += 4;
      
      // Bullets
      pdf.setFont('helvetica', 'normal');
      exp.bullets.forEach((bullet) => {
        if (bullet.trim()) {
          const bulletLines = pdf.splitTextToSize(`• ${bullet}`, contentWidth - 10);
          bulletLines.forEach((line: string) => {
            pdf.text(line, margin + 5, yPosition);
            yPosition += 4;
          });
        }
      });
      yPosition += 2;
    });
  }

  // Projects Section
  if (projects.length > 0) {
    yPosition = addSectionHeader('Projects', yPosition);
    
    projects.forEach((project) => {
      // Project name and duration
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(10);
      const projectTitle = `${project.name} | ${project.technologies}`;
      pdf.text(projectTitle, margin, yPosition);
      
      const durationWidth = pdf.getTextWidth(project.duration);
      pdf.text(project.duration, pageWidth - margin - durationWidth, yPosition);
      yPosition += 4;
      
      // Bullets
      pdf.setFont('helvetica', 'normal');
      project.bullets.forEach((bullet) => {
        if (bullet.trim()) {
          const bulletLines = pdf.splitTextToSize(`• ${bullet}`, contentWidth - 10);
          bulletLines.forEach((line: string) => {
            pdf.text(line, margin + 5, yPosition);
            yPosition += 4;
          });
        }
      });
      yPosition += 2;
    });
  }

  // Technical Skills Section
  yPosition = addSectionHeader('Technical Skills', yPosition);
  
  const skillCategories = [
    { label: 'Languages', value: technicalSkills.languages },
    { label: 'Frameworks & Libraries', value: technicalSkills.frameworks },
    { label: 'Developer Tools', value: technicalSkills.tools },
    { label: 'Specialized Software', value: technicalSkills.specialized }
  ];
  
  skillCategories.forEach((category) => {
    if (category.value) {
      pdf.setFont('helvetica', 'bold');
      pdf.text(`${category.label}: `, margin, yPosition);
      
      pdf.setFont('helvetica', 'normal');
      const labelWidth = pdf.getTextWidth(`${category.label}: `);
      const valueLines = pdf.splitTextToSize(category.value, contentWidth - labelWidth);
      
      valueLines.forEach((line: string, index: number) => {
        pdf.text(line, margin + (index === 0 ? labelWidth : 0), yPosition + (index * 4));
      });
      
      yPosition += Math.max(4, valueLines.length * 4);
    }
  });

  // Awards Section
  if (awards.length > 0) {
    yPosition += 2;
    yPosition = addSectionHeader('Awards and Honors', yPosition);
    
    awards.forEach((award) => {
      pdf.setFont('helvetica', 'bold');
      pdf.text(`${award.title}: `, margin, yPosition);
      
      pdf.setFont('helvetica', 'normal');
      const titleWidth = pdf.getTextWidth(`${award.title}: `);
      const descLines = pdf.splitTextToSize(award.description, contentWidth - titleWidth);
      
      descLines.forEach((line: string, index: number) => {
        pdf.text(line, margin + (index === 0 ? titleWidth : 0), yPosition + (index * 4));
      });
      
      yPosition += Math.max(4, descLines.length * 4) + 1;
    });
  }

  // Save the PDF
  pdf.save(filename);
  return true;
};

const exportCanvasToPDF = async (elementId: string, filename: string) => {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error('Element not found');
  }

  try {
    // Create canvas from the resume preview
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff'
    });

    const imgData = canvas.toDataURL('image/png');
    
    // Create PDF
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
    
    // Save the PDF
    pdf.save(filename);
    
    return true;
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
};

export const downloadLatexFile = (latexContent: string, filename: string = 'resume.tex') => {
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