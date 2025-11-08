'use client';

import { useState } from 'react';
import { Resume, WorkExperience, Education, Project, Certification } from '@/types/resume';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { showToast } from '@/components/Toast';

export default function ResumeForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

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
  });

  const [skillInput, setSkillInput] = useState('');

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
        showToast('Failed to save resume. Please try again.', 'error');
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

      {/* Personal Information */}
      <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h2 className="text-xl font-semibold mb-4 text-gray-900">Personal Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Full Name *"
            required
            className="border border-gray-300 p-3 rounded-lg focus:border-red-500 focus:ring-2 focus:ring-red-100 transition-colors"
            value={resume.personalInfo?.fullName}
            onChange={(e) =>
              setResume({
                ...resume,
                personalInfo: { ...resume.personalInfo!, fullName: e.target.value },
              })
            }
          />
          <input
            type="email"
            placeholder="Email *"
            required
            className="border border-gray-300 p-3 rounded-lg focus:border-red-500 focus:ring-2 focus:ring-red-100 transition-colors"
            value={resume.personalInfo?.email}
            onChange={(e) =>
              setResume({
                ...resume,
                personalInfo: { ...resume.personalInfo!, email: e.target.value },
              })
            }
          />
          <input
            type="tel"
            placeholder="Phone *"
            required
            className="border border-gray-300 p-3 rounded-lg focus:border-red-500 focus:ring-2 focus:ring-red-100 transition-colors"
            value={resume.personalInfo?.phone}
            onChange={(e) =>
              setResume({
                ...resume,
                personalInfo: { ...resume.personalInfo!, phone: e.target.value },
              })
            }
          />
          <input
            type="text"
            placeholder="Location *"
            required
            className="border border-gray-300 p-3 rounded-lg focus:border-red-500 focus:ring-2 focus:ring-red-100 transition-colors"
            value={resume.personalInfo?.location}
            onChange={(e) =>
              setResume({
                ...resume,
                personalInfo: { ...resume.personalInfo!, location: e.target.value },
              })
            }
          />
          <input
            type="url"
            placeholder="LinkedIn (optional)"
            className="border border-gray-300 p-3 rounded-lg focus:border-red-500 focus:ring-2 focus:ring-red-100 transition-colors"
            value={resume.personalInfo?.linkedin}
            onChange={(e) =>
              setResume({
                ...resume,
                personalInfo: { ...resume.personalInfo!, linkedin: e.target.value },
              })
            }
          />
          <input
            type="url"
            placeholder="Website (optional)"
            className="border border-gray-300 p-3 rounded-lg focus:border-red-500 focus:ring-2 focus:ring-red-100 transition-colors"
            value={resume.personalInfo?.website}
            onChange={(e) =>
              setResume({
                ...resume,
                personalInfo: { ...resume.personalInfo!, website: e.target.value },
              })
            }
          />
          <input
            type="url"
            placeholder="GitHub (optional)"
            className="border border-gray-300 p-3 rounded-lg focus:border-red-500 focus:ring-2 focus:ring-red-100 transition-colors md:col-span-2"
            value={resume.personalInfo?.github}
            onChange={(e) =>
              setResume({
                ...resume,
                personalInfo: { ...resume.personalInfo!, github: e.target.value },
              })
            }
          />
        </div>
      </section>

      {/* Summary */}
      <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h2 className="text-xl font-semibold mb-4 text-gray-900">Professional Summary</h2>
        <textarea
          placeholder="Write a brief professional summary (2-3 sentences) *"
          required
          rows={4}
          className="w-full border border-gray-300 p-3 rounded-lg focus:border-red-500 focus:ring-2 focus:ring-red-100 transition-colors resize-none"
          value={resume.summary}
          onChange={(e) => setResume({ ...resume, summary: e.target.value })}
        />
      </section>

      {/* Work Experience */}
      <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h2 className="text-xl font-semibold mb-4 text-gray-900">Work Experience</h2>
        {resume.experience?.map((exp, index) => (
          <div key={exp.id} className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <input
                type="text"
                placeholder="Company"
                className="border border-gray-300 p-3 rounded-lg focus:border-red-500 focus:ring-2 focus:ring-red-100 transition-colors"
                value={exp.company}
                onChange={(e) => updateExperience(index, 'company', e.target.value)}
              />
              <input
                type="text"
                placeholder="Position"
                className="border border-gray-300 p-3 rounded-lg focus:border-red-500 focus:ring-2 focus:ring-red-100 transition-colors"
                value={exp.position}
                onChange={(e) => updateExperience(index, 'position', e.target.value)}
              />
              <input
                type="text"
                placeholder="Location"
                className="border border-gray-300 p-3 rounded-lg focus:border-red-500 focus:ring-2 focus:ring-red-100 transition-colors"
                value={exp.location}
                onChange={(e) => updateExperience(index, 'location', e.target.value)}
              />
              <div className="flex gap-2">
                <input
                  type="month"
                  placeholder="Start Date"
                  className="border border-gray-300 p-3 rounded-lg focus:border-red-500 focus:ring-2 focus:ring-red-100 transition-colors flex-1"
                  value={exp.startDate}
                  onChange={(e) => updateExperience(index, 'startDate', e.target.value)}
                />
                <input
                  type="month"
                  placeholder="End Date"
                  className="border border-gray-300 p-3 rounded-lg focus:border-red-500 focus:ring-2 focus:ring-red-100 transition-colors flex-1"
                  value={exp.endDate}
                  onChange={(e) => updateExperience(index, 'endDate', e.target.value)}
                  disabled={exp.current}
                />
              </div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={exp.current}
                  onChange={(e) => updateExperience(index, 'current', e.target.checked)}
                />
                Current Position
              </label>
            </div>
            <div className="space-y-2">
              <label className="font-medium">Responsibilities:</label>
              {exp.responsibilities.map((resp, respIndex) => (
                <input
                  key={respIndex}
                  type="text"
                  placeholder="Responsibility/Achievement"
                  className="w-full border border-gray-300 p-3 rounded-lg focus:border-red-500 focus:ring-2 focus:ring-red-100 transition-colors"
                  value={resp}
                  onChange={(e) => updateResponsibility(index, respIndex, e.target.value)}
                />
              ))}
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
              <input
                type="text"
                placeholder="Institution"
                className="border border-gray-300 p-3 rounded-lg focus:border-red-500 focus:ring-2 focus:ring-red-100 transition-colors"
                value={edu.institution}
                onChange={(e) => updateEducation(index, 'institution', e.target.value)}
              />
              <input
                type="text"
                placeholder="Degree"
                className="border border-gray-300 p-3 rounded-lg focus:border-red-500 focus:ring-2 focus:ring-red-100 transition-colors"
                value={edu.degree}
                onChange={(e) => updateEducation(index, 'degree', e.target.value)}
              />
              <input
                type="text"
                placeholder="Field of Study"
                className="border border-gray-300 p-3 rounded-lg focus:border-red-500 focus:ring-2 focus:ring-red-100 transition-colors"
                value={edu.field}
                onChange={(e) => updateEducation(index, 'field', e.target.value)}
              />
              <input
                type="text"
                placeholder="Location"
                className="border border-gray-300 p-3 rounded-lg focus:border-red-500 focus:ring-2 focus:ring-red-100 transition-colors"
                value={edu.location}
                onChange={(e) => updateEducation(index, 'location', e.target.value)}
              />
              <input
                type="month"
                placeholder="Start Date"
                className="border border-gray-300 p-3 rounded-lg focus:border-red-500 focus:ring-2 focus:ring-red-100 transition-colors"
                value={edu.startDate}
                onChange={(e) => updateEducation(index, 'startDate', e.target.value)}
              />
              <input
                type="month"
                placeholder="End Date"
                className="border border-gray-300 p-3 rounded-lg focus:border-red-500 focus:ring-2 focus:ring-red-100 transition-colors"
                value={edu.endDate}
                onChange={(e) => updateEducation(index, 'endDate', e.target.value)}
              />
              <input
                type="text"
                placeholder="GPA (optional)"
                className="border border-gray-300 p-3 rounded-lg focus:border-red-500 focus:ring-2 focus:ring-red-100 transition-colors"
                value={edu.gpa}
                onChange={(e) => updateEducation(index, 'gpa', e.target.value)}
              />
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
              }
            }}
          />
          <button
            type="button"
            onClick={addSkill}
            className="bg-red-600 text-white px-4 py-3 rounded-lg hover:bg-red-700 transition-colors font-medium"
          >
            Add
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {resume.skills?.map((skill, index) => (
            <span
              key={index}
              className="bg-red-100 text-red-800 px-3 py-1.5 rounded-lg flex items-center gap-2 text-sm font-medium border border-red-200"
            >
              {skill}
              <button
                type="button"
                onClick={() => removeSkill(index)}
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
              <input
                type="text"
                placeholder="Project Name"
                className="w-full border p-2 rounded"
                value={project.name}
                onChange={(e) => updateProject(index, 'name', e.target.value)}
              />
              <textarea
                placeholder="Project Description"
                rows={3}
                className="w-full border p-2 rounded"
                value={project.description}
                onChange={(e) => updateProject(index, 'description', e.target.value)}
              />
              <input
                type="text"
                placeholder="Technologies (comma-separated)"
                className="w-full border p-2 rounded"
                value={project.technologies.join(', ')}
                onChange={(e) =>
                  updateProject(
                    index,
                    'technologies',
                    e.target.value.split(',').map((t) => t.trim())
                  )
                }
              />
              <input
                type="url"
                placeholder="Project Link (optional)"
                className="w-full border p-2 rounded"
                value={project.link}
                onChange={(e) => updateProject(index, 'link', e.target.value)}
              />
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
              <input
                type="text"
                placeholder="Certification Name"
                className="border border-gray-300 p-3 rounded-lg focus:border-red-500 focus:ring-2 focus:ring-red-100 transition-colors"
                value={cert.name}
                onChange={(e) => updateCertification(index, 'name', e.target.value)}
              />
              <input
                type="text"
                placeholder="Issuing Organization"
                className="border border-gray-300 p-3 rounded-lg focus:border-red-500 focus:ring-2 focus:ring-red-100 transition-colors"
                value={cert.issuer}
                onChange={(e) => updateCertification(index, 'issuer', e.target.value)}
              />
              <input
                type="month"
                placeholder="Issue Date"
                className="border border-gray-300 p-3 rounded-lg focus:border-red-500 focus:ring-2 focus:ring-red-100 transition-colors"
                value={cert.date}
                onChange={(e) => updateCertification(index, 'date', e.target.value)}
              />
              <input
                type="month"
                placeholder="Expiry Date (optional)"
                className="border border-gray-300 p-3 rounded-lg focus:border-red-500 focus:ring-2 focus:ring-red-100 transition-colors"
                value={cert.expiryDate}
                onChange={(e) => updateCertification(index, 'expiryDate', e.target.value)}
              />
              <input
                type="text"
                placeholder="Credential ID (optional)"
                className="border border-gray-300 p-3 rounded-lg focus:border-red-500 focus:ring-2 focus:ring-red-100 transition-colors md:col-span-2"
                value={cert.credentialId}
                onChange={(e) => updateCertification(index, 'credentialId', e.target.value)}
              />
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
