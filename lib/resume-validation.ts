import { Resume } from '@/types/resume';
import {
  ValidationErrors,
  validateDate,
  validateDateRange,
  validateEmail,
  validateGpa,
  validateLength,
  validatePhone,
  validateRequired,
  validateResponsibilities,
  validateSkills,
  validateSummary,
  validateUrl,
} from '@/lib/validation';

/**
 * Every rule the editor enforces, as one pure function. The editor shows
 * these messages next to fields and uses them for per-step status.
 */
export function validateResume(resume: Partial<Resume>): ValidationErrors {
  const newErrors: ValidationErrors = {};

  // Validate Personal Information
  if (resume.personalInfo) {
    const personalErrors: ValidationErrors['personalInfo'] = {};
    
    personalErrors.fullName = validateLength(resume.personalInfo.fullName || '', 'Full Name', 2, 100);
    personalErrors.email = validateEmail(resume.personalInfo.email || '');
    personalErrors.phone = validatePhone(resume.personalInfo.phone || '');
    personalErrors.location = validateRequired(resume.personalInfo.location || '', 'Location');
    
    if (resume.personalInfo.linkedin) {
      personalErrors.linkedin = validateUrl(resume.personalInfo.linkedin, 'LinkedIn');
    }
    if (resume.personalInfo.website) {
      personalErrors.website = validateUrl(resume.personalInfo.website, 'Website');
    }
    if (resume.personalInfo.github) {
      personalErrors.github = validateUrl(resume.personalInfo.github, 'GitHub');
    }

    // Only add personalInfo errors if there are actual errors
    const filteredPersonalErrors: ValidationErrors['personalInfo'] = {};
    Object.entries(personalErrors).forEach(([key, value]) => {
      if (value) {
        filteredPersonalErrors[key as keyof typeof personalErrors] = value;
      }
    });
    if (Object.keys(filteredPersonalErrors).length > 0) {
      newErrors.personalInfo = filteredPersonalErrors;
    }
  }

  // Validate Summary
  const summaryError = validateSummary(resume.summary || '');
  if (summaryError) {
    newErrors.summary = summaryError;
  }

  // Validate Skills
  const skillsError = validateSkills(resume.skills || []);
  if (skillsError) {
    newErrors.skills = skillsError;
  }

  // Validate Work Experience
  if (resume.experience && resume.experience.length > 0) {
    const experienceErrors: Record<number, {
      company?: string;
      position?: string;
      location?: string;
      startDate?: string;
      endDate?: string;
      responsibilities?: Record<number, string>;
    }> = {};
    resume.experience.forEach((exp, index) => {
      const expErrors: {
        company?: string;
        position?: string;
        location?: string;
        startDate?: string;
        endDate?: string;
        responsibilities?: Record<number, string>;
      } = {};
      const companyError = validateRequired(exp.company || '', 'Company');
      if (companyError) expErrors.company = companyError;
      
      const positionError = validateRequired(exp.position || '', 'Position');
      if (positionError) expErrors.position = positionError;
      
      const locationError = validateRequired(exp.location || '', 'Location');
      if (locationError) expErrors.location = locationError;
      
      const startDateError = validateDate(exp.startDate || '', 'Start Date');
      if (startDateError) expErrors.startDate = startDateError;
      
      if (!exp.current) {
        const endDateError = validateDate(exp.endDate || '', 'End Date') || 
                            (exp.startDate && exp.endDate ? validateDateRange(exp.startDate, exp.endDate, 'End Date') : undefined);
        if (endDateError) expErrors.endDate = endDateError;
      }

      const respErrors = validateResponsibilities(exp.responsibilities || []);
      if (respErrors) {
        expErrors.responsibilities = { 0: respErrors };
      } else {
        // Validate individual responsibilities
        const respErrs: Record<number, string> = {};
        exp.responsibilities.forEach((resp, respIndex) => {
          if (resp && resp.trim() !== '') {
            if (resp.trim().length < 10) {
              respErrs[respIndex] = 'Responsibility must be at least 10 characters';
            }
          }
        });
        if (Object.keys(respErrs).length > 0) {
          expErrors.responsibilities = respErrs;
        }
      }

      if (Object.keys(expErrors).length > 0) {
        experienceErrors[index] = expErrors;
      }
    });
    if (Object.keys(experienceErrors).length > 0) {
      newErrors.experience = experienceErrors;
    }
  }

  // Validate Education
  if (resume.education && resume.education.length > 0) {
    const educationErrors: Record<number, {
      institution?: string;
      degree?: string;
      field?: string;
      location?: string;
      startDate?: string;
      endDate?: string;
      gpa?: string;
    }> = {};
    resume.education.forEach((edu, index) => {
      const eduErrors: {
        institution?: string;
        degree?: string;
        field?: string;
        location?: string;
        startDate?: string;
        endDate?: string;
        gpa?: string;
      } = {};
      const institutionError = validateRequired(edu.institution || '', 'Institution');
      if (institutionError) eduErrors.institution = institutionError;
      
      const degreeError = validateRequired(edu.degree || '', 'Degree');
      if (degreeError) eduErrors.degree = degreeError;
      
      const fieldError = validateRequired(edu.field || '', 'Field of Study');
      if (fieldError) eduErrors.field = fieldError;
      
      const locationError = validateRequired(edu.location || '', 'Location');
      if (locationError) eduErrors.location = locationError;
      
      const startDateError = validateDate(edu.startDate || '', 'Start Date');
      if (startDateError) eduErrors.startDate = startDateError;
      
      const endDateError = validateDate(edu.endDate || '', 'End Date') ||
                          (edu.startDate && edu.endDate ? validateDateRange(edu.startDate, edu.endDate, 'End Date') : undefined);
      if (endDateError) eduErrors.endDate = endDateError;
      
      if (edu.gpa) {
        const gpaError = validateGpa(edu.gpa);
        if (gpaError) eduErrors.gpa = gpaError;
      }

      if (Object.keys(eduErrors).length > 0) {
        educationErrors[index] = eduErrors;
      }
    });
    if (Object.keys(educationErrors).length > 0) {
      newErrors.education = educationErrors;
    }
  }

  // Validate Projects (optional but if provided, validate)
  if (resume.projects && resume.projects.length > 0) {
    const projectErrors: Record<number, {
      name?: string;
      description?: string;
      technologies?: string;
      link?: string;
    }> = {};
    resume.projects.forEach((project, index) => {
      const projErrors: {
        name?: string;
        description?: string;
        technologies?: string;
        link?: string;
      } = {};
      if (project.name && project.name.trim() !== '') {
        if (project.name.trim().length < 3) {
          projErrors.name = 'Project name must be at least 3 characters';
        }
      }
      if (project.description && project.description.trim() !== '') {
        if (project.description.trim().length < 20) {
          projErrors.description = 'Project description must be at least 20 characters';
        }
      }
      if (project.link) {
        projErrors.link = validateUrl(project.link, 'Project Link');
      }
      if (Object.keys(projErrors).length > 0) {
        projectErrors[index] = projErrors;
      }
    });
    if (Object.keys(projectErrors).length > 0) {
      newErrors.projects = projectErrors;
    }
  }

  // Validate Certifications (optional but if provided, validate)
  if (resume.certifications && resume.certifications.length > 0) {
    const certErrors: Record<number, {
      name?: string;
      issuer?: string;
      date?: string;
      expiryDate?: string;
      credentialId?: string;
    }> = {};
    resume.certifications.forEach((cert, index) => {
      const certErrs: {
        name?: string;
        issuer?: string;
        date?: string;
        expiryDate?: string;
        credentialId?: string;
      } = {};
      if (cert.name && cert.name.trim() !== '') {
        if (cert.name.trim().length < 3) {
          certErrs.name = 'Certification name must be at least 3 characters';
        }
      }
      if (cert.issuer && cert.issuer.trim() !== '') {
        if (cert.issuer.trim().length < 2) {
          certErrs.issuer = 'Issuer name must be at least 2 characters';
        }
      }
      if (cert.date) {
        certErrs.date = validateDate(cert.date, 'Issue Date');
      }
      if (cert.expiryDate && cert.date) {
        certErrs.expiryDate = validateDateRange(cert.date, cert.expiryDate, 'Expiry Date');
      }
      if (Object.keys(certErrs).length > 0) {
        certErrors[index] = certErrs;
      }
    });
    if (Object.keys(certErrors).length > 0) {
      newErrors.certifications = certErrors;
    }
  }

  return newErrors;
}

/** Sections of ValidationErrors that belong to each editor step. */
export type StepErrorKey = keyof ValidationErrors;

export function hasErrors(errors: ValidationErrors, keys: StepErrorKey[]): boolean {
  return keys.some((k) => errors[k] !== undefined);
}
