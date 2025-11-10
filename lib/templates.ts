export interface ResumeTemplate {
  id: string;
  name: string;
  description: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    text: string;
    background: string;
    cardBg: string;
  };
  fonts: {
    heading: string;
    body: string;
  };
  styles: {
    headerAlign: 'left' | 'center' | 'right';
    sectionDivider: 'line' | 'space' | 'border';
    bulletStyle: 'disc' | 'circle' | 'square';
    datePosition: 'inline' | 'right';
    accentWeight: 'subtle' | 'moderate' | 'bold';
  };
}

export const templates: ResumeTemplate[] = [
  {
    id: 'classic-red',
    name: 'Classic Red',
    description: 'Traditional design with red accents - professional and bold',
    colors: {
      primary: '#dc2626',
      secondary: '#991b1b',
      accent: '#fef2f2',
      text: '#1f2937',
      background: '#ffffff',
      cardBg: '#ffffff',
    },
    fonts: {
      heading: 'font-bold',
      body: 'font-normal',
    },
    styles: {
      headerAlign: 'center',
      sectionDivider: 'line',
      bulletStyle: 'disc',
      datePosition: 'right',
      accentWeight: 'moderate',
    },
  },
  {
    id: 'modern-blue',
    name: 'Modern Blue',
    description: 'Clean and corporate with blue tones - trustworthy and professional',
    colors: {
      primary: '#2563eb',
      secondary: '#1e40af',
      accent: '#eff6ff',
      text: '#1f2937',
      background: '#ffffff',
      cardBg: '#ffffff',
    },
    fonts: {
      heading: 'font-bold',
      body: 'font-normal',
    },
    styles: {
      headerAlign: 'left',
      sectionDivider: 'border',
      bulletStyle: 'disc',
      datePosition: 'right',
      accentWeight: 'moderate',
    },
  },
  {
    id: 'professional-navy',
    name: 'Professional Navy',
    description: 'Sophisticated navy design - executive and authoritative',
    colors: {
      primary: '#1e40af',
      secondary: '#1e3a8a',
      accent: '#dbeafe',
      text: '#1f2937',
      background: '#ffffff',
      cardBg: '#ffffff',
    },
    fonts: {
      heading: 'font-bold',
      body: 'font-normal',
    },
    styles: {
      headerAlign: 'center',
      sectionDivider: 'line',
      bulletStyle: 'disc',
      datePosition: 'inline',
      accentWeight: 'bold',
    },
  },
  {
    id: 'creative-purple',
    name: 'Creative Purple',
    description: 'Vibrant purple theme - creative and innovative',
    colors: {
      primary: '#9333ea',
      secondary: '#7e22ce',
      accent: '#faf5ff',
      text: '#1f2937',
      background: '#ffffff',
      cardBg: '#ffffff',
    },
    fonts: {
      heading: 'font-bold',
      body: 'font-normal',
    },
    styles: {
      headerAlign: 'left',
      sectionDivider: 'border',
      bulletStyle: 'circle',
      datePosition: 'right',
      accentWeight: 'moderate',
    },
  },
  {
    id: 'tech-teal',
    name: 'Tech Teal',
    description: 'Modern teal design - perfect for tech professionals',
    colors: {
      primary: '#0d9488',
      secondary: '#115e59',
      accent: '#f0fdfa',
      text: '#1f2937',
      background: '#ffffff',
      cardBg: '#ffffff',
    },
    fonts: {
      heading: 'font-bold',
      body: 'font-normal',
    },
    styles: {
      headerAlign: 'left',
      sectionDivider: 'line',
      bulletStyle: 'square',
      datePosition: 'right',
      accentWeight: 'subtle',
    },
  },
  {
    id: 'elegant-emerald',
    name: 'Elegant Emerald',
    description: 'Refined emerald green - growth and prosperity',
    colors: {
      primary: '#059669',
      secondary: '#047857',
      accent: '#f0fdf4',
      text: '#1f2937',
      background: '#ffffff',
      cardBg: '#ffffff',
    },
    fonts: {
      heading: 'font-bold',
      body: 'font-normal',
    },
    styles: {
      headerAlign: 'center',
      sectionDivider: 'border',
      bulletStyle: 'disc',
      datePosition: 'right',
      accentWeight: 'moderate',
    },
  },
  {
    id: 'minimalist-slate',
    name: 'Minimalist Slate',
    description: 'Clean slate gray - simple and timeless',
    colors: {
      primary: '#475569',
      secondary: '#334155',
      accent: '#f8fafc',
      text: '#1f2937',
      background: '#ffffff',
      cardBg: '#ffffff',
    },
    fonts: {
      heading: 'font-bold',
      body: 'font-normal',
    },
    styles: {
      headerAlign: 'left',
      sectionDivider: 'space',
      bulletStyle: 'disc',
      datePosition: 'inline',
      accentWeight: 'subtle',
    },
  },
  {
    id: 'warm-orange',
    name: 'Warm Orange',
    description: 'Energetic orange theme - enthusiastic and dynamic',
    colors: {
      primary: '#ea580c',
      secondary: '#c2410c',
      accent: '#fff7ed',
      text: '#1f2937',
      background: '#ffffff',
      cardBg: '#ffffff',
    },
    fonts: {
      heading: 'font-bold',
      body: 'font-normal',
    },
    styles: {
      headerAlign: 'center',
      sectionDivider: 'line',
      bulletStyle: 'circle',
      datePosition: 'right',
      accentWeight: 'bold',
    },
  },
  {
    id: 'corporate-indigo',
    name: 'Corporate Indigo',
    description: 'Professional indigo - serious and dependable',
    colors: {
      primary: '#4f46e5',
      secondary: '#4338ca',
      accent: '#eef2ff',
      text: '#1f2937',
      background: '#ffffff',
      cardBg: '#ffffff',
    },
    fonts: {
      heading: 'font-bold',
      body: 'font-normal',
    },
    styles: {
      headerAlign: 'left',
      sectionDivider: 'border',
      bulletStyle: 'disc',
      datePosition: 'right',
      accentWeight: 'moderate',
    },
  },
  {
    id: 'vibrant-pink',
    name: 'Vibrant Pink',
    description: 'Bold pink design - creative and confident',
    colors: {
      primary: '#db2777',
      secondary: '#be185d',
      accent: '#fdf2f8',
      text: '#1f2937',
      background: '#ffffff',
      cardBg: '#ffffff',
    },
    fonts: {
      heading: 'font-bold',
      body: 'font-normal',
    },
    styles: {
      headerAlign: 'center',
      sectionDivider: 'line',
      bulletStyle: 'disc',
      datePosition: 'inline',
      accentWeight: 'moderate',
    },
  },
  {
    id: 'traditional-black',
    name: 'Traditional Black',
    description: 'Classic black and white - ultra-professional',
    colors: {
      primary: '#000000',
      secondary: '#1f2937',
      accent: '#f9fafb',
      text: '#1f2937',
      background: '#ffffff',
      cardBg: '#ffffff',
    },
    fonts: {
      heading: 'font-bold',
      body: 'font-normal',
    },
    styles: {
      headerAlign: 'center',
      sectionDivider: 'line',
      bulletStyle: 'disc',
      datePosition: 'right',
      accentWeight: 'bold',
    },
  },
  {
    id: 'fresh-cyan',
    name: 'Fresh Cyan',
    description: 'Bright cyan theme - innovative and modern',
    colors: {
      primary: '#0891b2',
      secondary: '#0e7490',
      accent: '#ecfeff',
      text: '#1f2937',
      background: '#ffffff',
      cardBg: '#ffffff',
    },
    fonts: {
      heading: 'font-bold',
      body: 'font-normal',
    },
    styles: {
      headerAlign: 'left',
      sectionDivider: 'border',
      bulletStyle: 'square',
      datePosition: 'right',
      accentWeight: 'subtle',
    },
  },
];

export const getTemplate = (templateId?: string): ResumeTemplate => {
  if (!templateId) {
    return templates[0]; // Default to Classic Red
  }
  return templates.find(t => t.id === templateId) || templates[0];
};

export const getTemplateStyles = (template: ResumeTemplate) => {
  return {
    '--template-primary': template.colors.primary,
    '--template-secondary': template.colors.secondary,
    '--template-accent': template.colors.accent,
    '--template-text': template.colors.text,
    '--template-background': template.colors.background,
    '--template-card-bg': template.colors.cardBg,
  } as React.CSSProperties;
};
