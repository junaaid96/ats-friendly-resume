'use client';

import { useState } from 'react';
import { Resume, WorkExperience, Education, Project, Certification } from '@/types/resume';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { showToast } from '@/components/Toast';
import TemplateSelector from '@/components/TemplateSelector';
import AIAssistant from '@/components/AIAssistant';
import {
  ValidationErrors,
  validateEmail,
  validatePhone,
  validateUrl,
  validateRequired,
  validateLength,
  validateDate,
  validateDateRange,
  validateGpa,
  validateSummary,
  validateSkills,
  validateResponsibilities,
} from '@/lib/validation';

export default function ResumeForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const [resume, setResume] = useState<Partial<Resume>>({
    personalInfo: {
      fullName: '',
      email: '',
      phone: '',
      location: '',
      linkedin: '',
      website: '',
      github: '',
    },
    summary: '',
    experience: [],
    education: [],
    skills: [],
    projects: [],
    certifications: [],
    template: 'classic-red',
  });

  const [skillInput, setSkillInput] = useState('');

  /**
   * Validates the entire form
   */
  const validateForm = (): boolean => {
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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Validates a single field
   */
  const validateField = (fieldPath: string, value: unknown): void => {
    const pathParts = fieldPath.split('.');
    const newErrors = { ...errors };

    // Clear the specific field error
    if (pathParts.length === 1) {
      if (newErrors[pathParts[0] as keyof ValidationErrors]) {
        delete newErrors[pathParts[0] as keyof ValidationErrors];
      }
    } else if (pathParts.length === 2) {
      const [section, field] = pathParts;
      if (section === 'personalInfo' && newErrors.personalInfo) {
        delete newErrors.personalInfo[field as keyof typeof newErrors.personalInfo];
        if (Object.keys(newErrors.personalInfo).length === 0) {
          delete newErrors.personalInfo;
        }
      }
    }

    setErrors(newErrors);
  };

  /**
   * Mark field as touched
   */
  const markTouched = (fieldPath: string): void => {
    setTouched((prev) => ({ ...prev, [fieldPath]: true }));
  };

  /**
   * Get error message for a field
   */
  const getErrorMessage = (fieldPath: string): string | undefined => {
    const pathParts = fieldPath.split('.');
    if (pathParts.length === 2) {
      const [section, field] = pathParts;
      if (section === 'personalInfo' && errors.personalInfo) {
        return errors.personalInfo[field as keyof typeof errors.personalInfo];
      }
    } else if (pathParts.length === 1) {
      const section = pathParts[0];
      if (section === 'summary') {
        return errors.summary;
      }
      if (section === 'skills') {
        return errors.skills;
      }
    }
    return undefined;
  };

  /**
   * Get error message for nested fields (experience, education, etc.)
   */
  const getNestedErrorMessage = (section: 'experience' | 'education' | 'projects' | 'certifications', index: number, field: string): string | undefined => {
    if (section === 'experience' && errors.experience?.[index]) {
      const errorObj = errors.experience[index];
      return errorObj?.[field as keyof typeof errorObj] as string | undefined;
    }
    if (section === 'education' && errors.education?.[index]) {
      const errorObj = errors.education[index];
      return errorObj?.[field as keyof typeof errorObj] as string | undefined;
    }
    if (section === 'projects' && errors.projects?.[index]) {
      const errorObj = errors.projects[index];
      return errorObj?.[field as keyof typeof errorObj] as string | undefined;
    }
    if (section === 'certifications' && errors.certifications?.[index]) {
      const errorObj = errors.certifications[index];
      return errorObj?.[field as keyof typeof errorObj] as string | undefined;
    }
    return undefined;
  };

  /**
   * Get responsibility error message
   */
  const getResponsibilityErrorMessage = (expIndex: number, respIndex: number): string | undefined => {
    return errors.experience?.[expIndex]?.responsibilities?.[respIndex];
  };

  /**
   * Check if field has error and was touched
   */
  const hasError = (fieldPath: string): boolean => {
    return touched[fieldPath] === true && getErrorMessage(fieldPath) !== undefined;
  };

  /**
   * Check if nested field has error
   */
  const hasNestedError = (section: 'experience' | 'education' | 'projects' | 'certifications', index: number, field: string): boolean => {
    const fieldPath = `${section}.${index}.${field}`;
    return (touched[fieldPath] === true || touched[`${section}.${index}`] === true) && getNestedErrorMessage(section, index, field) !== undefined;
  };

  const addExperience = () => {
    const newExp: WorkExperience = {
      id: `exp-${Date.now()}`,
      company: '',
      position: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      responsibilities: [''],
    };
    setResume({
      ...resume,
      experience: [...(resume.experience || []), newExp],
    });
  };

  const updateExperience = (index: number, field: keyof WorkExperience, value: any) => {
    const updated = [...(resume.experience || [])];
    updated[index] = { ...updated[index], [field]: value };
    setResume({ ...resume, experience: updated });
  };

  const addResponsibility = (expIndex: number) => {
    const updated = [...(resume.experience || [])];
    updated[expIndex].responsibilities.push('');
    setResume({ ...resume, experience: updated });
  };

  const updateResponsibility = (expIndex: number, respIndex: number, value: string) => {
    const updated = [...(resume.experience || [])];
    updated[expIndex].responsibilities[respIndex] = value;
    setResume({ ...resume, experience: updated });
  };

  const removeExperience = (index: number) => {
    const updated = resume.experience?.filter((_, i) => i !== index);
    setResume({ ...resume, experience: updated });
  };

  const addEducation = () => {
    const newEdu: Education = {
      id: `edu-${Date.now()}`,
      institution: '',
      degree: '',
      field: '',
      location: '',
      startDate: '',
      endDate: '',
      gpa: '',
    };
    setResume({
      ...resume,
      education: [...(resume.education || []), newEdu],
    });
  };

  const updateEducation = (index: number, field: keyof Education, value: any) => {
    const updated = [...(resume.education || [])];
    updated[index] = { ...updated[index], [field]: value };
    setResume({ ...resume, education: updated });
  };

  const removeEducation = (index: number) => {
    const updated = resume.education?.filter((_, i) => i !== index);
    setResume({ ...resume, education: updated });
  };

  const addSkill = () => {
    if (skillInput.trim()) {
      setResume({
        ...resume,
        skills: [...(resume.skills || []), skillInput.trim()],
      });
      setSkillInput('');
    }
  };

  const removeSkill = (index: number) => {
    const updated = resume.skills?.filter((_, i) => i !== index);
    setResume({ ...resume, skills: updated });
  };

  const addProject = () => {
    const newProject: Project = {
      id: `proj-${Date.now()}`,
      name: '',
      description: '',
      technologies: [],
      link: '',
    };
    setResume({
      ...resume,
      projects: [...(resume.projects || []), newProject],
    });
  };

  const updateProject = (index: number, field: keyof Project, value: any) => {
    const updated = [...(resume.projects || [])];
    updated[index] = { ...updated[index], [field]: value };
    setResume({ ...resume, projects: updated });
  };

  const removeProject = (index: number) => {
    const updated = resume.projects?.filter((_, i) => i !== index);
    setResume({ ...resume, projects: updated });
  };

  const addCertification = () => {
    const newCert: Certification = {
      id: `cert-${Date.now()}`,
      name: '',
      issuer: '',
      date: '',
      expiryDate: '',
      credentialId: '',
    };
    setResume({
      ...resume,
      certifications: [...(resume.certifications || []), newCert],
    });
  };

  const updateCertification = (index: number, field: keyof Certification, value: any) => {
    const updated = [...(resume.certifications || [])];
    updated[index] = { ...updated[index], [field]: value };
    setResume({ ...resume, certifications: updated });
  };

  const removeCertification = (index: number) => {
    const updated = resume.certifications?.filter((_, i) => i !== index);
    setResume({ ...resume, certifications: updated });
  };

  const handleAISuggestion = (field: string, value: any) => {
    if (field === 'summary') {
      setResume({ ...resume, summary: value });
    } else if (field === 'template') {
      setResume({ ...resume, template: value });
    } else if (field === 'addSkill') {
      if (!resume.skills?.includes(value)) {
        setResume({ ...resume, skills: [...(resume.skills || []), value] });
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mark all fields as touched
    const newTouched: Record<string, boolean> = {
      'personalInfo.fullName': true,
      'personalInfo.email': true,
      'personalInfo.phone': true,
      'personalInfo.location': true,
      'summary': true,
      'skills': true,
    };
    
    // Mark experience fields as touched
    resume.experience?.forEach((_, index) => {
      newTouched[`experience.${index}`] = true;
    });
    
    // Mark education fields as touched
    resume.education?.forEach((_, index) => {
      newTouched[`education.${index}`] = true;
    });
    
    setTouched(newTouched);

    // Validate form
    if (!validateForm()) {
      showToast('Please fill in the required field before submitting.', 'error');
      // Scroll to first error after a brief delay to allow state update
      setTimeout(() => {
        const firstErrorElement = document.querySelector('.border-red-500');
        if (firstErrorElement) {
          firstErrorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
          (firstErrorElement as HTMLElement).focus();
        }
      }, 100);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/resumes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(resume),
      });

      if (response.ok) {
        const savedResume = await response.json();
        showToast('Resume created successfully!', 'success');
        router.push(`/resume/${savedResume.id}`);
      } else {
        const errorData = await response.json().catch(() => ({}));
        showToast(errorData.message || 'Failed to save resume. Please try again.', 'error');
      }
    } catch (error) {
      console.error('Error saving resume:', error);
      showToast('Error saving resume. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-rose-50 to-red-50 py-12 px-6">
      <div className="max-w-5xl mx-auto">
        {/* Back Button */}
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-red-600 hover:text-red-700 font-medium text-sm mb-6 transition-colors"
        >
          <svg 
            className="w-5 h-5" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M15 19l-7-7 7-7" 
            />
          </svg>
          Back to Home
        </Link>

        <div className="text-center mb-10">
          <div className="inline-block mb-4">
            <span className="bg-red-100 text-red-700 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase">
              ATS Friendly Resume Builder
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3 tracking-tight">
            Create Your <span className="text-red-600">Resume</span>
          </h1>
          <p className="text-gray-600 text-base font-light">Fill in your professional information below</p>
        </div>

    <form onSubmit={handleSubmit} className="space-y-6">

      {/* Template Selection */}
      <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <TemplateSelector
          selectedTemplate={resume.template}
          onSelectTemplate={(templateId) => {
            setResume({ ...resume, template: templateId });
          }}
        />
      </section>

      {/* AI Assistant */}
      <section>
        <AIAssistant
          resume={resume}
          onApplySuggestion={handleAISuggestion}
        />
      </section>

      {/* Personal Information */}
      <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h2 className="text-xl font-semibold mb-4 text-gray-900">Personal Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <input
              type="text"
              placeholder="Full Name *"
              className={`w-full border p-3 rounded-lg focus:ring-2 transition-colors ${
                hasError('personalInfo.fullName')
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-100'
                  : 'border-gray-300 focus:border-red-500 focus:ring-red-100'
              }`}
              value={resume.personalInfo?.fullName || ''}
              onChange={(e) => {
                setResume({
                  ...resume,
                  personalInfo: { ...resume.personalInfo!, fullName: e.target.value },
                });
                validateField('personalInfo.fullName', e.target.value);
              }}
              onBlur={() => {
                markTouched('personalInfo.fullName');
                validateForm();
              }}
            />
            {hasError('personalInfo.fullName') && (
              <p className="mt-1 text-sm text-red-600 font-medium">{getErrorMessage('personalInfo.fullName')}</p>
            )}
          </div>
          <div>
            <input
              type="email"
              placeholder="Email *"
              className={`w-full border p-3 rounded-lg focus:ring-2 transition-colors ${
                hasError('personalInfo.email')
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-100'
                  : 'border-gray-300 focus:border-red-500 focus:ring-red-100'
              }`}
              value={resume.personalInfo?.email || ''}
              onChange={(e) => {
                setResume({
                  ...resume,
                  personalInfo: { ...resume.personalInfo!, email: e.target.value },
                });
                validateField('personalInfo.email', e.target.value);
              }}
              onBlur={() => {
                markTouched('personalInfo.email');
                validateForm();
              }}
            />
            {hasError('personalInfo.email') && (
              <p className="mt-1 text-sm text-red-600 font-medium">{getErrorMessage('personalInfo.email')}</p>
            )}
          </div>
          <div>
            <input
              type="tel"
              placeholder="Phone *"
              className={`w-full border p-3 rounded-lg focus:ring-2 transition-colors ${
                hasError('personalInfo.phone')
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-100'
                  : 'border-gray-300 focus:border-red-500 focus:ring-red-100'
              }`}
              value={resume.personalInfo?.phone || ''}
              onChange={(e) => {
                setResume({
                  ...resume,
                  personalInfo: { ...resume.personalInfo!, phone: e.target.value },
                });
                validateField('personalInfo.phone', e.target.value);
              }}
              onBlur={() => {
                markTouched('personalInfo.phone');
                validateForm();
              }}
            />
            {hasError('personalInfo.phone') && (
              <p className="mt-1 text-sm text-red-600 font-medium">{getErrorMessage('personalInfo.phone')}</p>
            )}
          </div>
          <div>
            <input
              type="text"
              placeholder="Location *"
              className={`w-full border p-3 rounded-lg focus:ring-2 transition-colors ${
                hasError('personalInfo.location')
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-100'
                  : 'border-gray-300 focus:border-red-500 focus:ring-red-100'
              }`}
              value={resume.personalInfo?.location || ''}
              onChange={(e) => {
                setResume({
                  ...resume,
                  personalInfo: { ...resume.personalInfo!, location: e.target.value },
                });
                validateField('personalInfo.location', e.target.value);
              }}
              onBlur={() => {
                markTouched('personalInfo.location');
                validateForm();
              }}
            />
            {hasError('personalInfo.location') && (
              <p className="mt-1 text-sm text-red-600 font-medium">{getErrorMessage('personalInfo.location')}</p>
            )}
          </div>
          <div>
            <input
              type="url"
              placeholder="LinkedIn (optional)"
              className={`w-full border p-3 rounded-lg focus:ring-2 transition-colors ${
                hasError('personalInfo.linkedin')
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-100'
                  : 'border-gray-300 focus:border-red-500 focus:ring-red-100'
              }`}
              value={resume.personalInfo?.linkedin || ''}
              onChange={(e) => {
                setResume({
                  ...resume,
                  personalInfo: { ...resume.personalInfo!, linkedin: e.target.value },
                });
                validateField('personalInfo.linkedin', e.target.value);
              }}
              onBlur={() => {
                if (resume.personalInfo?.linkedin) {
                  markTouched('personalInfo.linkedin');
                  validateForm();
                }
              }}
            />
            {hasError('personalInfo.linkedin') && (
              <p className="mt-1 text-sm text-red-600 font-medium">{getErrorMessage('personalInfo.linkedin')}</p>
            )}
          </div>
          <div>
            <input
              type="url"
              placeholder="Website (optional)"
              className={`w-full border p-3 rounded-lg focus:ring-2 transition-colors ${
                hasError('personalInfo.website')
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-100'
                  : 'border-gray-300 focus:border-red-500 focus:ring-red-100'
              }`}
              value={resume.personalInfo?.website || ''}
              onChange={(e) => {
                setResume({
                  ...resume,
                  personalInfo: { ...resume.personalInfo!, website: e.target.value },
                });
                validateField('personalInfo.website', e.target.value);
              }}
              onBlur={() => {
                if (resume.personalInfo?.website) {
                  markTouched('personalInfo.website');
                  validateForm();
                }
              }}
            />
            {hasError('personalInfo.website') && (
              <p className="mt-1 text-sm text-red-600 font-medium">{getErrorMessage('personalInfo.website')}</p>
            )}
          </div>
          <div className="md:col-span-2">
            <input
              type="url"
              placeholder="GitHub (optional)"
              className={`w-full border p-3 rounded-lg focus:ring-2 transition-colors ${
                hasError('personalInfo.github')
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-100'
                  : 'border-gray-300 focus:border-red-500 focus:ring-red-100'
              }`}
              value={resume.personalInfo?.github || ''}
              onChange={(e) => {
                setResume({
                  ...resume,
                  personalInfo: { ...resume.personalInfo!, github: e.target.value },
                });
                validateField('personalInfo.github', e.target.value);
              }}
              onBlur={() => {
                if (resume.personalInfo?.github) {
                  markTouched('personalInfo.github');
                  validateForm();
                }
              }}
            />
            {hasError('personalInfo.github') && (
              <p className="mt-1 text-sm text-red-600 font-medium">{getErrorMessage('personalInfo.github')}</p>
            )}
          </div>
        </div>
      </section>

      {/* Summary */}
      <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h2 className="text-xl font-semibold mb-4 text-gray-900">Professional Summary</h2>
        <textarea
          placeholder="Write a brief professional summary (2-3 sentences) *"
          rows={4}
          className={`w-full border p-3 rounded-lg focus:ring-2 transition-colors resize-none ${
            hasError('summary')
              ? 'border-red-500 focus:border-red-500 focus:ring-red-100'
              : 'border-gray-300 focus:border-red-500 focus:ring-red-100'
          }`}
          value={resume.summary || ''}
          onChange={(e) => {
            setResume({ ...resume, summary: e.target.value });
            validateField('summary', e.target.value);
          }}
          onBlur={() => {
            markTouched('summary');
            validateForm();
          }}
        />
        {hasError('summary') && (
          <p className="mt-1 text-sm text-red-600 font-medium">{getErrorMessage('summary')}</p>
        )}
        {resume.summary && !hasError('summary') && (
          <p className="mt-1 text-sm text-gray-500">{resume.summary.length} / 500 characters</p>
        )}
      </section>

      {/* Work Experience */}
      <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h2 className="text-xl font-semibold mb-4 text-gray-900">Work Experience</h2>
        {resume.experience?.map((exp, index) => (
          <div key={exp.id} className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <input
                  type="text"
                  placeholder="Company *"
                  className={`w-full border p-3 rounded-lg focus:ring-2 transition-colors ${
                    hasNestedError('experience', index, 'company')
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-100'
                      : 'border-gray-300 focus:border-red-500 focus:ring-red-100'
                  }`}
                  value={exp.company}
                  onChange={(e) => {
                    updateExperience(index, 'company', e.target.value);
                    markTouched(`experience.${index}`);
                  }}
                  onBlur={() => {
                    markTouched(`experience.${index}`);
                    validateForm();
                  }}
                />
                {hasNestedError('experience', index, 'company') && (
                  <p className="mt-1 text-sm text-red-600 font-medium">{getNestedErrorMessage('experience', index, 'company')}</p>
                )}
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Position *"
                  className={`w-full border p-3 rounded-lg focus:ring-2 transition-colors ${
                    hasNestedError('experience', index, 'position')
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-100'
                      : 'border-gray-300 focus:border-red-500 focus:ring-red-100'
                  }`}
                  value={exp.position}
                  onChange={(e) => {
                    updateExperience(index, 'position', e.target.value);
                    markTouched(`experience.${index}`);
                  }}
                  onBlur={() => {
                    markTouched(`experience.${index}`);
                    validateForm();
                  }}
                />
                {hasNestedError('experience', index, 'position') && (
                  <p className="mt-1 text-sm text-red-600 font-medium">{getNestedErrorMessage('experience', index, 'position')}</p>
                )}
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Location *"
                  className={`w-full border p-3 rounded-lg focus:ring-2 transition-colors ${
                    hasNestedError('experience', index, 'location')
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-100'
                      : 'border-gray-300 focus:border-red-500 focus:ring-red-100'
                  }`}
                  value={exp.location}
                  onChange={(e) => {
                    updateExperience(index, 'location', e.target.value);
                    markTouched(`experience.${index}`);
                  }}
                  onBlur={() => {
                    markTouched(`experience.${index}`);
                    validateForm();
                  }}
                />
                {hasNestedError('experience', index, 'location') && (
                  <p className="mt-1 text-sm text-red-600 font-medium">{getNestedErrorMessage('experience', index, 'location')}</p>
                )}
              </div>
              <div className="flex gap-2">
                <div className="flex-1">
                  <input
                    type="month"
                    placeholder="Start Date *"
                    className={`w-full border p-3 rounded-lg focus:ring-2 transition-colors ${
                      hasNestedError('experience', index, 'startDate')
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-100'
                        : 'border-gray-300 focus:border-red-500 focus:ring-red-100'
                    }`}
                    value={exp.startDate}
                    onChange={(e) => {
                      updateExperience(index, 'startDate', e.target.value);
                      markTouched(`experience.${index}`);
                    }}
                    onBlur={() => {
                      markTouched(`experience.${index}`);
                      validateForm();
                    }}
                  />
                  {hasNestedError('experience', index, 'startDate') && (
                    <p className="mt-1 text-sm text-red-600 font-medium">{getNestedErrorMessage('experience', index, 'startDate')}</p>
                  )}
                </div>
                <div className="flex-1">
                  <input
                    type="month"
                    placeholder="End Date *"
                    className={`w-full border p-3 rounded-lg focus:ring-2 transition-colors ${
                      hasNestedError('experience', index, 'endDate')
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-100'
                        : 'border-gray-300 focus:border-red-500 focus:ring-red-100'
                    }`}
                    value={exp.endDate}
                    onChange={(e) => {
                      updateExperience(index, 'endDate', e.target.value);
                      markTouched(`experience.${index}`);
                    }}
                    onBlur={() => {
                      markTouched(`experience.${index}`);
                      validateForm();
                    }}
                    disabled={exp.current}
                  />
                  {hasNestedError('experience', index, 'endDate') && (
                    <p className="mt-1 text-sm text-red-600 font-medium">{getNestedErrorMessage('experience', index, 'endDate')}</p>
                  )}
                </div>
              </div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={exp.current}
                  onChange={(e) => {
                    updateExperience(index, 'current', e.target.checked);
                    markTouched(`experience.${index}`);
                    validateForm();
                  }}
                />
                Current Position
              </label>
            </div>
            <div className="space-y-2">
              <label className="font-medium">Responsibilities: *</label>
              {exp.responsibilities.map((resp, respIndex) => {
                const isGeneralError = errors.experience?.[index]?.responsibilities?.[0] && 
                                      typeof errors.experience[index].responsibilities[0] === 'string' &&
                                      errors.experience[index].responsibilities[0].includes('at least one');
                const individualError = getResponsibilityErrorMessage(index, respIndex);
                const showError = !isGeneralError && individualError;
                
                return (
                  <div key={respIndex}>
                    <input
                      type="text"
                      placeholder="Responsibility/Achievement"
                      className={`w-full border p-3 rounded-lg focus:ring-2 transition-colors ${
                        showError || (isGeneralError && respIndex === 0)
                          ? 'border-red-500 focus:border-red-500 focus:ring-red-100'
                          : 'border-gray-300 focus:border-red-500 focus:ring-red-100'
                      }`}
                      value={resp}
                      onChange={(e) => {
                        updateResponsibility(index, respIndex, e.target.value);
                        markTouched(`experience.${index}`);
                      }}
                      onBlur={() => {
                        markTouched(`experience.${index}`);
                        validateForm();
                      }}
                    />
                    {showError && (
                      <p className="mt-1 text-sm text-red-600 font-medium">{individualError}</p>
                    )}
                  </div>
                );
              })}
              {errors.experience?.[index]?.responsibilities?.[0] && 
               typeof errors.experience[index].responsibilities[0] === 'string' &&
               errors.experience[index].responsibilities[0].includes('at least one') && (
                <p className="text-sm text-red-600 font-medium">{errors.experience[index].responsibilities[0]}</p>
              )}
              <button
                type="button"
                onClick={() => addResponsibility(index)}
                className="text-red-600 hover:text-red-700 text-sm font-medium"
              >
                + Add Responsibility
              </button>
            </div>
            <button
              type="button"
              onClick={() => removeExperience(index)}
              className="mt-4 text-red-600 hover:text-red-700 hover:underline text-sm font-medium"
            >
              Remove Experience
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addExperience}
          className="bg-red-600 text-white px-4 py-2.5 rounded-lg hover:bg-red-700 transition-colors font-medium text-sm"
        >
          + Add Work Experience
        </button>
      </section>

      {/* Education */}
      <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h2 className="text-xl font-semibold mb-4 text-gray-900">Education</h2>
        {resume.education?.map((edu, index) => (
          <div key={edu.id} className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <input
                  type="text"
                  placeholder="Institution *"
                  className={`w-full border p-3 rounded-lg focus:ring-2 transition-colors ${
                    hasNestedError('education', index, 'institution')
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-100'
                      : 'border-gray-300 focus:border-red-500 focus:ring-red-100'
                  }`}
                  value={edu.institution}
                  onChange={(e) => {
                    updateEducation(index, 'institution', e.target.value);
                    markTouched(`education.${index}`);
                  }}
                  onBlur={() => {
                    markTouched(`education.${index}`);
                    validateForm();
                  }}
                />
                {hasNestedError('education', index, 'institution') && (
                  <p className="mt-1 text-sm text-red-600 font-medium">{getNestedErrorMessage('education', index, 'institution')}</p>
                )}
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Degree *"
                  className={`w-full border p-3 rounded-lg focus:ring-2 transition-colors ${
                    hasNestedError('education', index, 'degree')
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-100'
                      : 'border-gray-300 focus:border-red-500 focus:ring-red-100'
                  }`}
                  value={edu.degree}
                  onChange={(e) => {
                    updateEducation(index, 'degree', e.target.value);
                    markTouched(`education.${index}`);
                  }}
                  onBlur={() => {
                    markTouched(`education.${index}`);
                    validateForm();
                  }}
                />
                {hasNestedError('education', index, 'degree') && (
                  <p className="mt-1 text-sm text-red-600 font-medium">{getNestedErrorMessage('education', index, 'degree')}</p>
                )}
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Field of Study *"
                  className={`w-full border p-3 rounded-lg focus:ring-2 transition-colors ${
                    hasNestedError('education', index, 'field')
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-100'
                      : 'border-gray-300 focus:border-red-500 focus:ring-red-100'
                  }`}
                  value={edu.field}
                  onChange={(e) => {
                    updateEducation(index, 'field', e.target.value);
                    markTouched(`education.${index}`);
                  }}
                  onBlur={() => {
                    markTouched(`education.${index}`);
                    validateForm();
                  }}
                />
                {hasNestedError('education', index, 'field') && (
                  <p className="mt-1 text-sm text-red-600 font-medium">{getNestedErrorMessage('education', index, 'field')}</p>
                )}
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Location *"
                  className={`w-full border p-3 rounded-lg focus:ring-2 transition-colors ${
                    hasNestedError('education', index, 'location')
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-100'
                      : 'border-gray-300 focus:border-red-500 focus:ring-red-100'
                  }`}
                  value={edu.location}
                  onChange={(e) => {
                    updateEducation(index, 'location', e.target.value);
                    markTouched(`education.${index}`);
                  }}
                  onBlur={() => {
                    markTouched(`education.${index}`);
                    validateForm();
                  }}
                />
                {hasNestedError('education', index, 'location') && (
                  <p className="mt-1 text-sm text-red-600 font-medium">{getNestedErrorMessage('education', index, 'location')}</p>
                )}
              </div>
              <div>
                <input
                  type="month"
                  placeholder="Start Date *"
                  className={`w-full border p-3 rounded-lg focus:ring-2 transition-colors ${
                    hasNestedError('education', index, 'startDate')
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-100'
                      : 'border-gray-300 focus:border-red-500 focus:ring-red-100'
                  }`}
                  value={edu.startDate}
                  onChange={(e) => {
                    updateEducation(index, 'startDate', e.target.value);
                    markTouched(`education.${index}`);
                  }}
                  onBlur={() => {
                    markTouched(`education.${index}`);
                    validateForm();
                  }}
                />
                {hasNestedError('education', index, 'startDate') && (
                  <p className="mt-1 text-sm text-red-600 font-medium">{getNestedErrorMessage('education', index, 'startDate')}</p>
                )}
              </div>
              <div>
                <input
                  type="month"
                  placeholder="End Date *"
                  className={`w-full border p-3 rounded-lg focus:ring-2 transition-colors ${
                    hasNestedError('education', index, 'endDate')
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-100'
                      : 'border-gray-300 focus:border-red-500 focus:ring-red-100'
                  }`}
                  value={edu.endDate}
                  onChange={(e) => {
                    updateEducation(index, 'endDate', e.target.value);
                    markTouched(`education.${index}`);
                  }}
                  onBlur={() => {
                    markTouched(`education.${index}`);
                    validateForm();
                  }}
                />
                {hasNestedError('education', index, 'endDate') && (
                  <p className="mt-1 text-sm text-red-600 font-medium">{getNestedErrorMessage('education', index, 'endDate')}</p>
                )}
              </div>
              <div>
                <input
                  type="text"
                  placeholder="GPA (optional)"
                  className={`w-full border p-3 rounded-lg focus:ring-2 transition-colors ${
                    hasNestedError('education', index, 'gpa')
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-100'
                      : 'border-gray-300 focus:border-red-500 focus:ring-red-100'
                  }`}
                  value={edu.gpa || ''}
                  onChange={(e) => {
                    updateEducation(index, 'gpa', e.target.value);
                    markTouched(`education.${index}`);
                  }}
                  onBlur={() => {
                    if (edu.gpa) {
                      markTouched(`education.${index}`);
                      validateForm();
                    }
                  }}
                />
                {hasNestedError('education', index, 'gpa') && (
                  <p className="mt-1 text-sm text-red-600 font-medium">{getNestedErrorMessage('education', index, 'gpa')}</p>
                )}
              </div>
            </div>
            <button
              type="button"
              onClick={() => removeEducation(index)}
              className="mt-4 text-red-600 hover:text-red-700 hover:underline text-sm font-medium"
            >
              Remove Education
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addEducation}
          className="bg-red-600 text-white px-4 py-2.5 rounded-lg hover:bg-red-700 transition-colors font-medium text-sm"
        >
          + Add Education
        </button>
      </section>

      {/* Skills */}
      <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h2 className="text-xl font-semibold mb-4 text-gray-900">Skills</h2>
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            placeholder="Add a skill"
            className="flex-1 border border-gray-300 p-3 rounded-lg focus:border-red-500 focus:ring-2 focus:ring-red-100 transition-colors"
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addSkill();
                markTouched('skills');
                validateForm();
              }
            }}
          />
          <button
            type="button"
            onClick={() => {
              addSkill();
              markTouched('skills');
              validateForm();
            }}
            className="bg-red-600 text-white px-4 py-3 rounded-lg hover:bg-red-700 transition-colors font-medium"
          >
            Add
          </button>
        </div>
        {hasError('skills') && (
          <p className="mb-2 text-sm text-red-600 font-medium">{getErrorMessage('skills')}</p>
        )}
        <div className="flex flex-wrap gap-2">
          {resume.skills?.map((skill, index) => (
            <span
              key={index}
              className="bg-red-100 text-red-800 px-3 py-1.5 rounded-lg flex items-center gap-2 text-sm font-medium border border-red-200"
            >
              {skill}
              <button
                type="button"
                onClick={() => {
                  removeSkill(index);
                  markTouched('skills');
                  validateForm();
                }}
                className="text-red-600 hover:text-red-800 font-bold"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </section>

      {/* Projects */}
      <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h2 className="text-xl font-semibold mb-4 text-gray-900">Projects (Optional)</h2>
        {resume.projects?.map((project, index) => (
          <div key={project.id} className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
            <div className="space-y-4">
              <div>
                <input
                  type="text"
                  placeholder="Project Name"
                  className={`w-full border p-3 rounded-lg focus:ring-2 transition-colors ${
                    hasNestedError('projects', index, 'name')
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-100'
                      : 'border-gray-300 focus:border-red-500 focus:ring-red-100'
                  }`}
                  value={project.name}
                  onChange={(e) => {
                    updateProject(index, 'name', e.target.value);
                    markTouched(`projects.${index}`);
                  }}
                  onBlur={() => {
                    markTouched(`projects.${index}`);
                    validateForm();
                  }}
                />
                {hasNestedError('projects', index, 'name') && (
                  <p className="mt-1 text-sm text-red-600 font-medium">{getNestedErrorMessage('projects', index, 'name')}</p>
                )}
              </div>
              <div>
                <textarea
                  placeholder="Project Description"
                  rows={3}
                  className={`w-full border p-3 rounded-lg focus:ring-2 transition-colors resize-none ${
                    hasNestedError('projects', index, 'description')
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-100'
                      : 'border-gray-300 focus:border-red-500 focus:ring-red-100'
                  }`}
                  value={project.description}
                  onChange={(e) => {
                    updateProject(index, 'description', e.target.value);
                    markTouched(`projects.${index}`);
                  }}
                  onBlur={() => {
                    markTouched(`projects.${index}`);
                    validateForm();
                  }}
                />
                {hasNestedError('projects', index, 'description') && (
                  <p className="mt-1 text-sm text-red-600 font-medium">{getNestedErrorMessage('projects', index, 'description')}</p>
                )}
              </div>
              <input
                type="text"
                placeholder="Technologies (comma-separated)"
                className="w-full border border-gray-300 p-3 rounded-lg focus:border-red-500 focus:ring-2 focus:ring-red-100 transition-colors"
                value={project.technologies.join(', ')}
                onChange={(e) =>
                  updateProject(
                    index,
                    'technologies',
                    e.target.value.split(',').map((t) => t.trim())
                  )
                }
              />
              <div>
                <input
                  type="url"
                  placeholder="Project Link (optional)"
                  className={`w-full border p-3 rounded-lg focus:ring-2 transition-colors ${
                    hasNestedError('projects', index, 'link')
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-100'
                      : 'border-gray-300 focus:border-red-500 focus:ring-red-100'
                  }`}
                  value={project.link}
                  onChange={(e) => {
                    updateProject(index, 'link', e.target.value);
                    markTouched(`projects.${index}`);
                  }}
                  onBlur={() => {
                    if (project.link) {
                      markTouched(`projects.${index}`);
                      validateForm();
                    }
                  }}
                />
                {hasNestedError('projects', index, 'link') && (
                  <p className="mt-1 text-sm text-red-600 font-medium">{getNestedErrorMessage('projects', index, 'link')}</p>
                )}
              </div>
            </div>
            <button
              type="button"
              onClick={() => removeProject(index)}
              className="mt-4 text-red-600 hover:text-red-700 hover:underline text-sm font-medium"
            >
              Remove Project
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addProject}
          className="bg-red-600 text-white px-4 py-2.5 rounded-lg hover:bg-red-700 transition-colors font-medium text-sm"
        >
          + Add Project
        </button>
      </section>

      {/* Certifications */}
      <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h2 className="text-xl font-semibold mb-4 text-gray-900">Certifications (Optional)</h2>
        {resume.certifications?.map((cert, index) => (
          <div key={cert.id} className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <input
                  type="text"
                  placeholder="Certification Name"
                  className={`w-full border p-3 rounded-lg focus:ring-2 transition-colors ${
                    hasNestedError('certifications', index, 'name')
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-100'
                      : 'border-gray-300 focus:border-red-500 focus:ring-red-100'
                  }`}
                  value={cert.name}
                  onChange={(e) => {
                    updateCertification(index, 'name', e.target.value);
                    markTouched(`certifications.${index}`);
                  }}
                  onBlur={() => {
                    if (cert.name) {
                      markTouched(`certifications.${index}`);
                      validateForm();
                    }
                  }}
                />
                {hasNestedError('certifications', index, 'name') && (
                  <p className="mt-1 text-sm text-red-600 font-medium">{getNestedErrorMessage('certifications', index, 'name')}</p>
                )}
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Issuing Organization"
                  className={`w-full border p-3 rounded-lg focus:ring-2 transition-colors ${
                    hasNestedError('certifications', index, 'issuer')
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-100'
                      : 'border-gray-300 focus:border-red-500 focus:ring-red-100'
                  }`}
                  value={cert.issuer}
                  onChange={(e) => {
                    updateCertification(index, 'issuer', e.target.value);
                    markTouched(`certifications.${index}`);
                  }}
                  onBlur={() => {
                    if (cert.issuer) {
                      markTouched(`certifications.${index}`);
                      validateForm();
                    }
                  }}
                />
                {hasNestedError('certifications', index, 'issuer') && (
                  <p className="mt-1 text-sm text-red-600 font-medium">{getNestedErrorMessage('certifications', index, 'issuer')}</p>
                )}
              </div>
              <div>
                <input
                  type="month"
                  placeholder="Issue Date"
                  className={`w-full border p-3 rounded-lg focus:ring-2 transition-colors ${
                    hasNestedError('certifications', index, 'date')
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-100'
                      : 'border-gray-300 focus:border-red-500 focus:ring-red-100'
                  }`}
                  value={cert.date}
                  onChange={(e) => {
                    updateCertification(index, 'date', e.target.value);
                    markTouched(`certifications.${index}`);
                  }}
                  onBlur={() => {
                    if (cert.date) {
                      markTouched(`certifications.${index}`);
                      validateForm();
                    }
                  }}
                />
                {hasNestedError('certifications', index, 'date') && (
                  <p className="mt-1 text-sm text-red-600 font-medium">{getNestedErrorMessage('certifications', index, 'date')}</p>
                )}
              </div>
              <div>
                <input
                  type="month"
                  placeholder="Expiry Date (optional)"
                  className={`w-full border p-3 rounded-lg focus:ring-2 transition-colors ${
                    hasNestedError('certifications', index, 'expiryDate')
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-100'
                      : 'border-gray-300 focus:border-red-500 focus:ring-red-100'
                  }`}
                  value={cert.expiryDate}
                  onChange={(e) => {
                    updateCertification(index, 'expiryDate', e.target.value);
                    markTouched(`certifications.${index}`);
                  }}
                  onBlur={() => {
                    if (cert.expiryDate) {
                      markTouched(`certifications.${index}`);
                      validateForm();
                    }
                  }}
                />
                {hasNestedError('certifications', index, 'expiryDate') && (
                  <p className="mt-1 text-sm text-red-600 font-medium">{getNestedErrorMessage('certifications', index, 'expiryDate')}</p>
                )}
              </div>
              <div className="md:col-span-2">
                <input
                  type="text"
                  placeholder="Credential ID (optional)"
                  className="w-full border border-gray-300 p-3 rounded-lg focus:border-red-500 focus:ring-2 focus:ring-red-100 transition-colors"
                  value={cert.credentialId}
                  onChange={(e) => updateCertification(index, 'credentialId', e.target.value)}
                />
              </div>
            </div>
            <button
              type="button"
              onClick={() => removeCertification(index)}
              className="mt-4 text-red-600 hover:text-red-700 hover:underline text-sm font-medium"
            >
              Remove Certification
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addCertification}
          className="bg-red-600 text-white px-4 py-2.5 rounded-lg hover:bg-red-700 transition-colors font-medium text-sm"
        >
          + Add Certification
        </button>
      </section>

      {/* Submit Button */}
      <div className="flex justify-center pt-4">
        <button
          type="submit"
          disabled={loading}
          className="bg-red-600 text-white px-10 py-4 rounded-lg hover:bg-red-700 hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed text-base font-semibold"
        >
          {loading ? '⏳ Creating Resume...' : '✓ Create Resume'}
        </button>
      </div>
    </form>
      </div>
    </div>
  );
}
