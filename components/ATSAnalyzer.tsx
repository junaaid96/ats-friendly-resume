'use client';

import { useState } from 'react';
import { Resume } from '@/types/resume';

interface ATSAnalyzerProps {
  resume: Resume;
}

export default function ATSAnalyzer({ resume }: ATSAnalyzerProps) {
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<{
    score: number;
    suggestions: string[];
    keywords: string[];
  } | null>(null);
  const [showAnalysis, setShowAnalysis] = useState(false);

  const analyzeResume = async () => {
    setAnalyzing(true);
    try {
      const response = await fetch('/api/ai/analyze-ats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(resume),
      });

      if (!response.ok) throw new Error('Failed to analyze');

      const data = await response.json();
      setAnalysis(data);
      setShowAnalysis(true);
    } catch (error) {
      console.error('Error analyzing resume:', error);
      alert('Failed to analyze resume. Please try again.');
    } finally {
      setAnalyzing(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'from-green-500 to-emerald-600';
    if (score >= 60) return 'from-yellow-500 to-orange-600';
    return 'from-red-500 to-pink-600';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    return 'Needs Improvement';
  };

  if (!showAnalysis) {
    return (
      <div className="mt-4 print:hidden">
        <button
          onClick={analyzeResume}
          disabled={analyzing}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all disabled:opacity-50 font-medium flex items-center justify-center gap-2"
        >
          {analyzing ? (
            <>
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span>Analyzing with AI...</span>
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <span>Analyze ATS Compatibility</span>
            </>
          )}
        </button>
      </div>
    );
  }

  if (!analysis) return null;

  return (
    <div className="mt-6 print:hidden">
      <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-6 border-2 border-purple-200">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-2 rounded-lg">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">ATS Analysis Report</h3>
              <p className="text-sm text-gray-600">Powered by AI</p>
            </div>
          </div>
          <button
            onClick={() => setShowAnalysis(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Score Card */}
        <div className="bg-white rounded-xl p-6 shadow-lg mb-6">
          <div className="text-center">
            <div className={`inline-flex items-baseline gap-2 bg-gradient-to-r ${getScoreColor(analysis.score)} bg-clip-text text-transparent`}>
              <span className="text-6xl font-bold">{analysis.score}</span>
              <span className="text-3xl font-semibold">/100</span>
            </div>
            <p className="text-lg font-semibold text-gray-700 mt-2">
              {getScoreLabel(analysis.score)}
            </p>
            <p className="text-sm text-gray-600 mt-1">
              ATS Compatibility Score
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mt-4 bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className={`h-full bg-gradient-to-r ${getScoreColor(analysis.score)} transition-all duration-1000 ease-out`}
              style={{ width: `${analysis.score}%` }}
            />
          </div>
        </div>

        {/* Suggestions */}
        <div className="bg-white rounded-xl p-6 shadow-lg mb-6">
          <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
            Improvement Suggestions
          </h4>
          <div className="space-y-3">
            {analysis.suggestions.map((suggestion, idx) => (
              <div key={idx} className="flex gap-3 p-3 bg-purple-50 rounded-lg border border-purple-200">
                <span className="flex-shrink-0 w-6 h-6 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  {idx + 1}
                </span>
                <p className="text-sm text-gray-700">{suggestion}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Keywords */}
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
            Recommended Keywords
          </h4>
          <div className="flex flex-wrap gap-2">
            {analysis.keywords.map((keyword, idx) => (
              <span
                key={idx}
                className="bg-gradient-to-r from-yellow-100 to-orange-100 text-gray-800 px-4 py-2 rounded-full text-sm font-medium border-2 border-yellow-300 hover:shadow-md transition-shadow"
              >
                {keyword}
              </span>
            ))}
          </div>
          <p className="text-xs text-gray-600 mt-4">
            💡 Tip: Incorporate these keywords naturally throughout your resume to improve ATS compatibility.
          </p>
        </div>

        {/* Re-analyze Button */}
        <button
          onClick={analyzeResume}
          disabled={analyzing}
          className="w-full mt-6 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all disabled:opacity-50 font-medium"
        >
          {analyzing ? 'Re-analyzing...' : '🔄 Re-analyze Resume'}
        </button>
      </div>
    </div>
  );
}
