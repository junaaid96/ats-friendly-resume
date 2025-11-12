'use client';

import { useState } from 'react';
import { Resume } from '@/types/resume';
import { showToast } from '@/components/Toast';

interface AIAssistantProps {
  resume: Partial<Resume>;
  onApplySuggestion?: (field: string, value: any) => void;
}

export default function AIAssistant({ resume, onApplySuggestion }: AIAssistantProps) {
  const [activeTab, setActiveTab] = useState<'summary' | 'bullet' | 'skills' | 'ats' | 'template'>('summary');
  const [loading, setLoading] = useState(false);
  const [summaries, setSummaries] = useState<string[]>([]);
  const [bulletImprovements, setBulletImprovements] = useState<string[]>([]);
  const [skillSuggestions, setSkillSuggestions] = useState<string[]>([]);
  const [atsAnalysis, setAtsAnalysis] = useState<{
    score: number;
    suggestions: string[];
    keywords: string[];
  } | null>(null);
  const [templateRec, setTemplateRec] = useState<{
    templateId: string;
    reason: string;
  } | null>(null);

  // Form inputs
  const [jobTitle, setJobTitle] = useState('');
  const [yearsExp, setYearsExp] = useState('');
  const [bulletPoint, setBulletPoint] = useState('');

  const generateSummaries = async () => {
    if (!jobTitle || !yearsExp) {
      showToast('Please enter job title and years of experience', 'error');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/ai/generate-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobTitle,
          yearsExperience: yearsExp,
          keySkills: resume.skills || [],
        }),
      });

      if (!response.ok) throw new Error('Failed to generate summaries');

      const data = await response.json();
      setSummaries(data.summaries);
      showToast('Summaries generated successfully!', 'success');
    } catch (error) {
      showToast('Failed to generate summaries', 'error');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const improveBullet = async () => {
    if (!bulletPoint || !jobTitle) {
      showToast('Please enter a bullet point and job title', 'error');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/ai/improve-bullet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bulletPoint,
          jobTitle,
        }),
      });

      if (!response.ok) throw new Error('Failed to improve bullet point');

      const data = await response.json();
      setBulletImprovements(data.improvements);
      showToast('Improvements generated!', 'success');
    } catch (error) {
      showToast('Failed to improve bullet point', 'error');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const suggestSkills = async () => {
    if (!jobTitle) {
      showToast('Please enter a job title', 'error');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/ai/suggest-skills', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobTitle,
          currentSkills: resume.skills || [],
        }),
      });

      if (!response.ok) throw new Error('Failed to suggest skills');

      const data = await response.json();
      setSkillSuggestions(data.skills);
      showToast('Skill suggestions generated!', 'success');
    } catch (error) {
      showToast('Failed to suggest skills', 'error');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const analyzeATS = async () => {
    if (!resume.summary && !resume.experience?.length) {
      showToast('Please add some resume content first', 'error');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/ai/analyze-ats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(resume),
      });

      if (!response.ok) throw new Error('Failed to analyze ATS');

      const data = await response.json();
      setAtsAnalysis(data);
      showToast('ATS analysis complete!', 'success');
    } catch (error) {
      showToast('Failed to analyze ATS', 'error');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const recommendTemplate = async () => {
    if (!resume.summary) {
      showToast('Please add a summary first', 'error');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/ai/recommend-template', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(resume),
      });

      if (!response.ok) throw new Error('Failed to recommend template');

      const data = await response.json();
      setTemplateRec(data);
      showToast('Template recommendation ready!', 'success');
    } catch (error) {
      showToast('Failed to recommend template', 'error');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-purple-50 to-blue-50 p-6 rounded-xl border-2 border-purple-200">
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-2 rounded-lg">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900">AI Assistant</h3>
          <p className="text-sm text-gray-600">Powered by Groq LLaMA 3.3</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-4">
        {[
          { id: 'summary', label: 'Summary', icon: '📝' },
          { id: 'bullet', label: 'Bullet Points', icon: '✨' },
          { id: 'skills', label: 'Skills', icon: '🎯' },
          { id: 'ats', label: 'ATS Score', icon: '📊' },
          { id: 'template', label: 'Template', icon: '🎨' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
              activeTab === tab.id
                ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            <span className="mr-1">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        {/* Summary Tab */}
        {activeTab === 'summary' && (
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Generate Professional Summary</h4>
              <p className="text-sm text-gray-600 mb-3">
                AI will create 3 compelling summary variations for your resume.
              </p>
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Job Title (e.g., Software Engineer)"
                  className="w-full border border-gray-300 p-3 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Years of Experience (e.g., 5 years)"
                  className="w-full border border-gray-300 p-3 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                  value={yearsExp}
                  onChange={(e) => setYearsExp(e.target.value)}
                />
                <button
                  type="button"
                  onClick={generateSummaries}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-3 rounded-lg hover:shadow-lg transition-all disabled:opacity-50 font-medium"
                >
                  {loading ? '⏳ Generating...' : '✨ Generate Summaries'}
                </button>
              </div>

              {summaries.length > 0 && (
                <div className="mt-4 space-y-3">
                  <h5 className="font-semibold text-gray-900">Suggestions:</h5>
                  {summaries.map((summary, idx) => (
                    <div key={idx} className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                      <p className="text-sm text-gray-800 mb-2">{summary}</p>
                      <button
                        type="button"
                        onClick={() => onApplySuggestion?.('summary', summary)}
                        className="text-purple-600 hover:text-purple-700 text-sm font-medium"
                      >
                        → Use this summary
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Bullet Point Tab */}
        {activeTab === 'bullet' && (
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Improve Bullet Point</h4>
              <p className="text-sm text-gray-600 mb-3">
                Transform basic bullet points into achievement-oriented statements.
              </p>
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Job Title"
                  className="w-full border border-gray-300 p-3 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                />
                <textarea
                  placeholder="Enter your bullet point here..."
                  rows={3}
                  className="w-full border border-gray-300 p-3 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-100 resize-none"
                  value={bulletPoint}
                  onChange={(e) => setBulletPoint(e.target.value)}
                />
                <button
                  type="button"
                  onClick={improveBullet}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-3 rounded-lg hover:shadow-lg transition-all disabled:opacity-50 font-medium"
                >
                  {loading ? '⏳ Improving...' : '✨ Improve Bullet Point'}
                </button>
              </div>

              {bulletImprovements.length > 0 && (
                <div className="mt-4 space-y-3">
                  <h5 className="font-semibold text-gray-900">Improved Versions:</h5>
                  {bulletImprovements.map((improvement, idx) => (
                    <div key={idx} className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-sm text-gray-800">{improvement}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Skills Tab */}
        {activeTab === 'skills' && (
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Skill Suggestions</h4>
              <p className="text-sm text-gray-600 mb-3">
                Get relevant skill recommendations based on your role.
              </p>
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Job Title (e.g., Full Stack Developer)"
                  className="w-full border border-gray-300 p-3 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                />
                <button
                  type="button"
                  onClick={suggestSkills}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-3 rounded-lg hover:shadow-lg transition-all disabled:opacity-50 font-medium"
                >
                  {loading ? '⏳ Analyzing...' : '🎯 Suggest Skills'}
                </button>
              </div>

              {skillSuggestions.length > 0 && (
                <div className="mt-4">
                  <h5 className="font-semibold text-gray-900 mb-2">Suggested Skills:</h5>
                  <div className="flex flex-wrap gap-2">
                    {skillSuggestions.map((skill, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          if (!resume.skills?.includes(skill)) {
                            onApplySuggestion?.('addSkill', skill);
                            showToast(`Added "${skill}" to skills`, 'success');
                          }
                        }}
                        className="bg-gradient-to-r from-green-100 to-blue-100 text-gray-800 px-3 py-1.5 rounded-lg text-sm font-medium hover:shadow-md transition-all border border-green-200"
                      >
                        + {skill}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ATS Tab */}
        {activeTab === 'ats' && (
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">ATS Optimization Analysis</h4>
              <p className="text-sm text-gray-600 mb-3">
                Check how well your resume will perform with Applicant Tracking Systems.
              </p>
              <button
                type="button"
                onClick={analyzeATS}
                disabled={loading}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-3 rounded-lg hover:shadow-lg transition-all disabled:opacity-50 font-medium"
              >
                {loading ? '⏳ Analyzing...' : '📊 Analyze ATS Score'}
              </button>

              {atsAnalysis && (
                <div className="mt-4 space-y-4">
                  {/* Score */}
                  <div className="p-4 bg-gradient-to-r from-purple-100 to-blue-100 border border-purple-300 rounded-lg">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-purple-700 mb-1">
                        {atsAnalysis.score}
                        <span className="text-2xl">/100</span>
                      </div>
                      <p className="text-sm text-gray-700 font-medium">
                        ATS Compatibility Score
                      </p>
                    </div>
                  </div>

                  {/* Suggestions */}
                  <div>
                    <h5 className="font-semibold text-gray-900 mb-2">Improvement Suggestions:</h5>
                    <ul className="space-y-2">
                      {atsAnalysis.suggestions.map((suggestion, idx) => (
                        <li key={idx} className="flex gap-2 text-sm text-gray-700">
                          <span className="text-purple-600 font-bold">→</span>
                          <span>{suggestion}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Keywords */}
                  <div>
                    <h5 className="font-semibold text-gray-900 mb-2">Recommended Keywords:</h5>
                    <div className="flex flex-wrap gap-2">
                      {atsAnalysis.keywords.map((keyword, idx) => (
                        <span
                          key={idx}
                          className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-medium border border-yellow-300"
                        >
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Template Tab */}
        {activeTab === 'template' && (
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Smart Template Recommendation</h4>
              <p className="text-sm text-gray-600 mb-3">
                AI will analyze your resume and recommend the best template design.
              </p>
              <button
                type="button"
                onClick={recommendTemplate}
                disabled={loading}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-3 rounded-lg hover:shadow-lg transition-all disabled:opacity-50 font-medium"
              >
                {loading ? '⏳ Analyzing...' : '🎨 Recommend Template'}
              </button>

              {templateRec && (
                <div className="mt-4 p-4 bg-gradient-to-r from-pink-100 to-purple-100 border border-pink-300 rounded-lg">
                  <h5 className="font-semibold text-gray-900 mb-2">Recommended Template:</h5>
                  <div className="space-y-2">
                    <div className="inline-block bg-white px-4 py-2 rounded-lg border-2 border-purple-400 font-bold text-purple-700">
                      {templateRec.templateId}
                    </div>
                    <p className="text-sm text-gray-700">{templateRec.reason}</p>
                    <button
                      type="button"
                      onClick={() => onApplySuggestion?.('template', templateRec.templateId)}
                      className="text-purple-600 hover:text-purple-700 text-sm font-medium"
                    >
                      → Apply this template
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
