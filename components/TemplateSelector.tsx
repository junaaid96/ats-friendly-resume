'use client';

import { templates, ResumeTemplate } from '@/lib/templates';
import { useState } from 'react';

interface TemplateSelectorProps {
  selectedTemplate?: string;
  onSelectTemplate: (templateId: string) => void;
}

export default function TemplateSelector({
  selectedTemplate,
  onSelectTemplate,
}: TemplateSelectorProps) {
  const [hoveredTemplate, setHoveredTemplate] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-2">Choose Your Template</h3>
        <p className="text-sm text-gray-600">
          Select a design that matches your style. All templates are ATS-friendly.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {templates.map((template) => (
          <TemplateCard
            key={template.id}
            template={template}
            isSelected={selectedTemplate === template.id}
            isHovered={hoveredTemplate === template.id}
            onSelect={() => onSelectTemplate(template.id)}
            onHover={() => setHoveredTemplate(template.id)}
            onLeave={() => setHoveredTemplate(null)}
          />
        ))}
      </div>
    </div>
  );
}

interface TemplateCardProps {
  template: ResumeTemplate;
  isSelected: boolean;
  isHovered: boolean;
  onSelect: () => void;
  onHover: () => void;
  onLeave: () => void;
}

function TemplateCard({
  template,
  isSelected,
  isHovered,
  onSelect,
  onHover,
  onLeave,
}: TemplateCardProps) {
  return (
    <div
      onClick={onSelect}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      className={`
        relative cursor-pointer rounded-lg border-2 transition-all duration-200
        ${
          isSelected
            ? 'border-blue-500 shadow-lg scale-105'
            : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
        }
      `}
    >
      {/* Selection Indicator */}
      {isSelected && (
        <div className="absolute -top-2 -right-2 bg-blue-500 text-white rounded-full p-1 z-10">
          <svg
            className="w-4 h-4"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      )}

      {/* Template Preview */}
      <div className="p-4 bg-white rounded-t-lg">
        <div
          className="h-40 rounded border border-gray-200 p-3 overflow-hidden"
          style={{ backgroundColor: template.colors.background }}
        >
          {/* Mini Resume Preview */}
          <div
            className={`text-center ${
              template.styles.headerAlign === 'left'
                ? 'text-left'
                : template.styles.headerAlign === 'right'
                ? 'text-right'
                : 'text-center'
            }`}
          >
            <div
              className="font-bold text-xs mb-1"
              style={{ color: template.colors.primary }}
            >
              JOHN DOE
            </div>
            <div className="text-[6px] text-gray-600 mb-2">
              john@example.com • (555) 123-4567
            </div>
          </div>

          {/* Section Preview */}
          <div className="mt-2 space-y-2">
            <div>
              <div
                className={`text-[7px] font-bold uppercase mb-1 ${
                  template.styles.sectionDivider === 'line'
                    ? 'border-b pb-1'
                    : template.styles.sectionDivider === 'border'
                    ? 'border-b-2 pb-1'
                    : ''
                }`}
                style={{
                  color: template.colors.primary,
                  borderColor: template.colors.primary,
                }}
              >
                Experience
              </div>
              <div className="text-[6px] space-y-1">
                <div className="flex justify-between items-start">
                  <span className="font-semibold" style={{ color: template.colors.text }}>
                    Software Engineer
                  </span>
                  {template.styles.datePosition === 'right' && (
                    <span className="text-gray-500">2020-2024</span>
                  )}
                </div>
                <div className="text-gray-600">Tech Company Inc.</div>
                <ul
                  className={`ml-2 space-y-0.5`}
                  style={{
                    listStyleType: template.styles.bulletStyle,
                  }}
                >
                  <li className="text-gray-600">Achievement one</li>
                  <li className="text-gray-600">Achievement two</li>
                </ul>
              </div>
            </div>

            <div>
              <div
                className={`text-[7px] font-bold uppercase mb-1 ${
                  template.styles.sectionDivider === 'line'
                    ? 'border-b pb-1'
                    : template.styles.sectionDivider === 'border'
                    ? 'border-b-2 pb-1'
                    : ''
                }`}
                style={{
                  color: template.colors.primary,
                  borderColor: template.colors.primary,
                }}
              >
                Skills
              </div>
              <div className="text-[6px] text-gray-600">
                JavaScript • Python • React • Node.js
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Template Info */}
      <div
        className="p-3 rounded-b-lg"
        style={{ backgroundColor: template.colors.accent }}
      >
        <div className="flex items-center gap-2 mb-1">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: template.colors.primary }}
          />
          <h4 className="font-semibold text-sm">{template.name}</h4>
        </div>
        <p className="text-xs text-gray-600">{template.description}</p>
      </div>
    </div>
  );
}
