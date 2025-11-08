'use client';

import { useState } from 'react';
import { Resume, WorkExperience, Education, Project, Certification } from '@/types/resume';
import { useRouter } from 'next/navigation';

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
        router.push(`/resume/${savedResume.id}`);
      } else {
        alert('Failed to save resume');
      }
    } catch (error) {
      console.error('Error saving resume:', error);
      alert('Error saving resume');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold">Create ATS-Friendly Resume</h1>

      {/* Personal Information */}
      <section className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-semibold mb-4">Personal Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Full Name *"
            required
            className="border p-2 rounded"
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
            className="border p-2 rounded"
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
            className="border p-2 rounded"
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
            className="border p-2 rounded"
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
            className="border p-2 rounded"
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
            className="border p-2 rounded"
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
            className="border p-2 rounded md:col-span-2"
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
      <section className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-semibold mb-4">Professional Summary</h2>
        <textarea
          placeholder="Write a brief professional summary (2-3 sentences) *"
          required
          rows={4}
          className="w-full border p-2 rounded"
          value={resume.summary}
          onChange={(e) => setResume({ ...resume, summary: e.target.value })}
        />
      </section>

      {/* Work Experience */}
      <section className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-semibold mb-4">Work Experience</h2>
        {resume.experience?.map((exp, index) => (
          <div key={exp.id} className="mb-6 p-4 border rounded">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <input
                type="text"
                placeholder="Company"
                className="border p-2 rounded"
                value={exp.company}
                onChange={(e) => updateExperience(index, 'company', e.target.value)}
              />
              <input
                type="text"
                placeholder="Position"
                className="border p-2 rounded"
                value={exp.position}
                onChange={(e) => updateExperience(index, 'position', e.target.value)}
              />
              <input
                type="text"
                placeholder="Location"
                className="border p-2 rounded"
                value={exp.location}
                onChange={(e) => updateExperience(index, 'location', e.target.value)}
              />
              <div className="flex gap-2">
                <input
                  type="month"
                  placeholder="Start Date"
                  className="border p-2 rounded flex-1"
                  value={exp.startDate}
                  onChange={(e) => updateExperience(index, 'startDate', e.target.value)}
                />
                <input
                  type="month"
                  placeholder="End Date"
                  className="border p-2 rounded flex-1"
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
                  className="w-full border p-2 rounded"
                  value={resp}
                  onChange={(e) => updateResponsibility(index, respIndex, e.target.value)}
                />
              ))}
              <button
                type="button"
                onClick={() => addResponsibility(index)}
                className="text-blue-600 hover:underline text-sm"
              >
                + Add Responsibility
              </button>
            </div>
            <button
              type="button"
              onClick={() => removeExperience(index)}
              className="mt-4 text-red-600 hover:underline text-sm"
            >
              Remove Experience
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addExperience}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Add Work Experience
        </button>
      </section>

      {/* Education */}
      <section className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-semibold mb-4">Education</h2>
        {resume.education?.map((edu, index) => (
          <div key={edu.id} className="mb-6 p-4 border rounded">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Institution"
                className="border p-2 rounded"
                value={edu.institution}
                onChange={(e) => updateEducation(index, 'institution', e.target.value)}
              />
              <input
                type="text"
                placeholder="Degree"
                className="border p-2 rounded"
                value={edu.degree}
                onChange={(e) => updateEducation(index, 'degree', e.target.value)}
              />
              <input
                type="text"
                placeholder="Field of Study"
                className="border p-2 rounded"
                value={edu.field}
                onChange={(e) => updateEducation(index, 'field', e.target.value)}
              />
              <input
                type="text"
                placeholder="Location"
                className="border p-2 rounded"
                value={edu.location}
                onChange={(e) => updateEducation(index, 'location', e.target.value)}
              />
              <input
                type="month"
                placeholder="Start Date"
                className="border p-2 rounded"
                value={edu.startDate}
                onChange={(e) => updateEducation(index, 'startDate', e.target.value)}
              />
              <input
                type="month"
                placeholder="End Date"
                className="border p-2 rounded"
                value={edu.endDate}
                onChange={(e) => updateEducation(index, 'endDate', e.target.value)}
              />
              <input
                type="text"
                placeholder="GPA (optional)"
                className="border p-2 rounded"
                value={edu.gpa}
                onChange={(e) => updateEducation(index, 'gpa', e.target.value)}
              />
            </div>
            <button
              type="button"
              onClick={() => removeEducation(index)}
              className="mt-4 text-red-600 hover:underline text-sm"
            >
              Remove Education
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addEducation}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Add Education
        </button>
      </section>

      {/* Skills */}
      <section className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-semibold mb-4">Skills</h2>
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            placeholder="Add a skill"
            className="flex-1 border p-2 rounded"
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
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Add
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {resume.skills?.map((skill, index) => (
            <span
              key={index}
              className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full flex items-center gap-2"
            >
              {skill}
              <button
                type="button"
                onClick={() => removeSkill(index)}
                className="text-red-600 hover:text-red-800"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </section>

      {/* Projects */}
      <section className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-semibold mb-4">Projects (Optional)</h2>
        {resume.projects?.map((project, index) => (
          <div key={project.id} className="mb-6 p-4 border rounded">
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
              className="mt-4 text-red-600 hover:underline text-sm"
            >
              Remove Project
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addProject}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Add Project
        </button>
      </section>

      {/* Certifications */}
      <section className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-semibold mb-4">Certifications (Optional)</h2>
        {resume.certifications?.map((cert, index) => (
          <div key={cert.id} className="mb-6 p-4 border rounded">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Certification Name"
                className="border p-2 rounded"
                value={cert.name}
                onChange={(e) => updateCertification(index, 'name', e.target.value)}
              />
              <input
                type="text"
                placeholder="Issuing Organization"
                className="border p-2 rounded"
                value={cert.issuer}
                onChange={(e) => updateCertification(index, 'issuer', e.target.value)}
              />
              <input
                type="month"
                placeholder="Issue Date"
                className="border p-2 rounded"
                value={cert.date}
                onChange={(e) => updateCertification(index, 'date', e.target.value)}
              />
              <input
                type="month"
                placeholder="Expiry Date (optional)"
                className="border p-2 rounded"
                value={cert.expiryDate}
                onChange={(e) => updateCertification(index, 'expiryDate', e.target.value)}
              />
              <input
                type="text"
                placeholder="Credential ID (optional)"
                className="border p-2 rounded md:col-span-2"
                value={cert.credentialId}
                onChange={(e) => updateCertification(index, 'credentialId', e.target.value)}
              />
            </div>
            <button
              type="button"
              onClick={() => removeCertification(index)}
              className="mt-4 text-red-600 hover:underline text-sm"
            >
              Remove Certification
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addCertification}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Add Certification
        </button>
      </section>

      {/* Submit Button */}
      <div className="flex justify-center">
        <button
          type="submit"
          disabled={loading}
          className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 disabled:bg-gray-400 text-lg font-semibold"
        >
          {loading ? 'Saving...' : 'Create Resume'}
        </button>
      </div>
    </form>
  );
}
