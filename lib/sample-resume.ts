import { Resume } from '@/types/resume';

/** Example content for the landing page preview. */
export const SAMPLE_RESUME: Partial<Resume> = {
  template: 'professional-navy',
  personalInfo: {
    fullName: 'Amara Okafor',
    email: 'amara.okafor@email.com',
    phone: '+44 7700 900123',
    location: 'London, UK',
    linkedin: 'https://linkedin.com/in/amara',
    github: 'https://github.com/amara',
  },
  summary:
    'Product-minded software engineer with 6 years of experience shipping web platforms used by millions. I turn fuzzy problems into simple, fast interfaces and mentor engineers along the way.',
  experience: [
    {
      id: 's1',
      position: 'Senior Software Engineer',
      company: 'Northwind Payments',
      location: 'London',
      startDate: '2022-03',
      endDate: '',
      current: true,
      responsibilities: [
        'Led the checkout rebuild in React and TypeScript, lifting conversion 11% across 4 markets',
        'Cut p95 API latency from 820ms to 190ms by redesigning caching and Postgres queries',
        'Mentored 5 engineers; introduced design reviews that halved rework on new features',
      ],
    },
    {
      id: 's2',
      position: 'Software Engineer',
      company: 'Brightlane',
      location: 'Manchester',
      startDate: '2019-06',
      endDate: '2022-02',
      current: false,
      responsibilities: [
        'Built a real-time analytics dashboard used by 3,000 retail managers every day',
        'Automated deployments with GitHub Actions, taking releases from weekly to daily',
      ],
    },
  ],
  education: [
    {
      id: 'e1',
      degree: 'BSc',
      field: 'Computer Science',
      institution: 'University of Leeds',
      location: 'Leeds',
      startDate: '2015-09',
      endDate: '2019-06',
      gpa: '',
    },
  ],
  skills: ['TypeScript', 'React', 'Next.js', 'Node.js', 'PostgreSQL', 'AWS', 'System Design', 'Mentoring'],
  projects: [],
  certifications: [],
  settings: {},
};
