const FEATURES = [
  {
    icon: '👀',
    title: 'Live preview',
    text: 'See the finished page update beside the form as you type, in your chosen template.',
  },
  {
    icon: '🎯',
    title: 'Job match checker',
    text: 'Paste a job description to see which of its keywords your resume already covers and which are missing.',
  },
  {
    icon: '🤖',
    title: 'AI writing help',
    text: 'Generate summaries, sharpen bullet points into achievements, and get skill suggestions for your role.',
  },
  {
    icon: '🧩',
    title: 'Reorder sections',
    text: 'Move sections up or down and hide the ones that don\'t help for a particular application.',
  },
  {
    icon: '📄',
    title: 'PDF, text & JSON export',
    text: 'Save as PDF, copy a plain-text version for application forms, or back up your data as JSON.',
  },
  {
    icon: '🔒',
    title: 'Private by default',
    text: 'Resumes are never listed publicly. Only this browser can edit them; a share link is view-only.',
  },
];

export default function FeatureGrid() {
  return (
    <section className="mb-20 animate-fade-in" aria-labelledby="features-heading">
      <h2 id="features-heading" className="sr-only">
        Features
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {FEATURES.map((f) => (
          <div
            key={f.title}
            className="bg-white/80 backdrop-blur p-6 rounded-xl border border-red-100 shadow-sm"
          >
            <div className="text-2xl mb-3" aria-hidden>
              {f.icon}
            </div>
            <h3 className="font-semibold text-gray-900 mb-1.5">{f.title}</h3>
            <p className="text-sm text-gray-600 leading-relaxed">{f.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
