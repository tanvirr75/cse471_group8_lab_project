'use client';

import { useState } from 'react';

export default function CareerReadinessPage() {
  const [targetRole, setTargetRole] = useState('Software Engineer');
  const [skillsInput, setSkillsInput] = useState('JavaScript, React, Node.js, Express, MongoDB, Git');
  const [loading, setLoading] = useState(false);
  const [roadmap, setRoadmap] = useState(null);
  const [error, setError] = useState('');

  const handleGenerate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setRoadmap(null);

    const userId = localStorage.getItem('userId') || 'student-2';
    const currentSkills = skillsInput.split(',').map(s => s.trim()).filter(Boolean);

    try {
      const response = await fetch('/api/readiness/roadmap', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          userId,
          targetRole,
          currentSkills
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to generate roadmap');

      setRoadmap(data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-blue-400">AI Skill Gap & Roadmap</h1>
          <p className="text-slate-400 mt-2">
            Select your target career path to detect missing skills and receive an AI-generated learning roadmap.
          </p>
        </div>

        {/* Input Form */}
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-md">
          <form onSubmit={handleGenerate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-slate-300">Target Role</label>
              <select
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg p-3"
              >
                <option value="Software Engineer">Software Engineer</option>
                <option value="AI Engineer">AI Engineer</option>
                <option value="Frontend Developer">Frontend Developer</option>
                <option value="Backend Developer">Backend Developer</option>
                <option value="Full Stack Developer">Full Stack Developer</option>
                <option value="UI/UX Designer">UI/UX Designer</option>
                <option value="Cybersecurity Analyst">Cybersecurity Analyst</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-slate-300">Current Skills (comma separated)</label>
              <input
                type="text"
                value={skillsInput}
                onChange={(e) => setSkillsInput(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg p-3"
                placeholder="e.g. React, Node.js, Python, SQL"
              />
            </div>

            {error && <p className="text-red-400 text-sm">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-500 font-semibold py-3 rounded-lg transition-colors disabled:opacity-50"
            >
              {loading ? 'Analyzing Skill Gap with Gemini AI...' : 'Generate Learning Roadmap'}
            </button>
          </form>
        </div>

        {/* AI Results & Roadmap Display */}
        {roadmap && (
          <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-700 pb-4">
              <div>
                <h2 className="text-2xl font-bold">{roadmap.targetRole} Roadmap</h2>
                <p className="text-slate-400 text-sm mt-1">AI-generated step-by-step career path</p>
              </div>
              <div className="text-center bg-slate-900 px-6 py-3 rounded-lg border border-emerald-500">
                <span className="text-3xl font-extrabold text-emerald-400">{roadmap.readinessPercentage}%</span>
                <span className="block text-xs text-slate-400">Readiness Score</span>
              </div>
            </div>

            {/* Detected Missing Skills */}
            <div>
              <h3 className="text-rose-400 font-semibold mb-2">Detected Skill Gaps:</h3>
              <div className="flex flex-wrap gap-2">
                {roadmap.missingSkills.map((skill, idx) => (
                  <span key={idx} className="bg-rose-950 text-rose-300 border border-rose-800 text-xs px-3 py-1 rounded-full">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Step-by-step Steps */}
            <div className="space-y-4 pt-4">
              <h3 className="text-lg font-bold text-blue-400">Personalized Learning Sequence</h3>
              {roadmap.roadmapSteps.map((step) => (
                <div key={step.stepNumber} className="bg-slate-900 p-4 rounded-lg border border-slate-700 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs bg-blue-600 text-white font-bold px-2.5 py-0.5 rounded">
                      Step {step.stepNumber}
                    </span>
                    <span className="text-xs text-slate-400">{step.focusArea}</span>
                  </div>
                  <h4 className="text-md font-semibold text-white">{step.title}</h4>
                  
                  <div className="text-sm text-slate-300">
                    <strong>Skills to Master:</strong> {step.skillsToLearn.join(', ')}
                  </div>
                  <div className="text-sm text-slate-300">
                    <strong>Recommended Project:</strong> {step.recommendedProjects.join(', ')}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}