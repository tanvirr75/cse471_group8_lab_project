'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createJob } from '@/lib/api';

export default function CreateJobPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    type: 'Paid Internship',
    workplace: 'Onsite',
    location: '',
    description: '',
    skillsInput: '',
    skills: ['Node.js', 'MongoDB', 'REST'], // Pre-filled for the visual as per mockup, but fully interactive
    minimumQualification: "Pursuing Bachelor's",
    deadline: '2026-08-15'
  });

  const [previewMatchCount, setPreviewMatchCount] = useState({ seventy: 18, eightyFive: 6 });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Simulate real-time match preview change
    if (name === 'skills' || name === 'title') {
      setPreviewMatchCount({
        seventy: Math.floor(Math.random() * 20) + 10,
        eightyFive: Math.floor(Math.random() * 10) + 2
      });
    }
  };

  const handleAddSkill = (e) => {
    if (e.key === 'Enter' && formData.skillsInput.trim() !== '') {
      e.preventDefault();
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, prev.skillsInput.trim()],
        skillsInput: ''
      }));
    }
  };

  const removeSkill = (index) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e, isDraft = false) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        title: formData.title,
        company: 'Pathao', // Hardcoded as per the context of the user, can be dynamic
        type: formData.type.includes('Internship') ? 'Internship' : 'Full-time',
        workplace: formData.workplace,
        location: formData.location,
        minimumQualification: formData.minimumQualification,
        deadline: formData.deadline,
        skills: formData.skills,
        description: formData.description,
        status: isDraft ? 'draft' : 'open'
      };

      await createJob(payload);
      router.push('/recruiter/dashboard');
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f111a] text-white">
      {/* Top Navbar Placeholder */}
      <div className="h-16 border-b border-[#1e293b] flex items-center justify-between px-6 bg-[#0f111a]">
        <div className="flex-1 max-w-xl">
          <div className="relative">
            <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <input type="text" placeholder="Search candidates by skill or university..." className="w-full bg-[#161b22] border border-[#1e293b] rounded-lg pl-9 pr-4 py-2 text-sm text-slate-300 focus:outline-none focus:border-blue-500" />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button className="w-8 h-8 rounded-full bg-[#161b22] border border-[#1e293b] flex items-center justify-center text-slate-400 hover:text-white">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
          </button>
          <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center text-sm font-bold text-white">
            PT
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto p-8 space-y-6">
        
        {/* Header */}
        <div>
          <div className="flex items-center gap-2 text-[10px] font-bold text-blue-500 tracking-widest uppercase mb-3">
            <span>RECRUITER</span>
            <span className="text-slate-600">•</span>
            <span>NEW POSTING</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Post a new job</h1>
          <p className="text-slate-400 text-sm">Fill in the details. SkillSync will auto-match eligible students on publish.</p>
        </div>

        <form onSubmit={(e) => handleSubmit(e, false)} className="space-y-6">
          
          {/* Job Details Box */}
          <div className="bg-[#161b22] border border-[#1e293b] p-6 rounded-xl space-y-6">
            <h2 className="text-sm font-bold text-white">Job details</h2>
            
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-2">Job title</label>
                <input type="text" name="title" required value={formData.title} onChange={handleChange} placeholder="e.g. Backend Engineering Intern"
                  className="w-full bg-[#0f111a] border border-[#1e293b] rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-2">Employment type</label>
                <div className="relative">
                  <select name="type" value={formData.type} onChange={handleChange}
                    className="w-full bg-[#0f111a] border border-[#1e293b] rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 appearance-none">
                    <option>Paid Internship</option>
                    <option>Full-time</option>
                    <option>Contract</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500 text-xs">▼</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-2">Workplace type</label>
                <div className="relative">
                  <select name="workplace" value={formData.workplace} onChange={handleChange}
                    className="w-full bg-[#0f111a] border border-[#1e293b] rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 appearance-none">
                    <option>Onsite</option>
                    <option>Remote</option>
                    <option>Hybrid</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500 text-xs">▼</div>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-2">Location</label>
                <input type="text" name="location" value={formData.location} onChange={handleChange} placeholder="Dhaka, Bangladesh"
                  className="w-full bg-[#0f111a] border border-[#1e293b] rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-2">Job description</label>
              <textarea rows="4" name="description" value={formData.description} onChange={handleChange} placeholder="Describe the role, responsibilities and team..."
                className="w-full bg-[#0f111a] border border-[#1e293b] rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500 resize-y" />
            </div>
          </div>

          {/* Requirements Box */}
          <div className="bg-[#161b22] border border-[#1e293b] p-6 rounded-xl space-y-6">
            <h2 className="text-sm font-bold text-white">Requirements</h2>
            
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-2">Required skills</label>
              <div className="flex flex-wrap items-center gap-2 bg-[#0f111a] border border-[#1e293b] rounded-lg p-2 min-h-[44px]">
                {formData.skills.map((skill, idx) => (
                  <div key={idx} className="flex items-center gap-1 bg-blue-900/30 text-blue-400 border border-blue-900/50 px-2 py-1 rounded text-[11px] font-bold">
                    {skill}
                    <button type="button" onClick={() => removeSkill(idx)} className="hover:text-white focus:outline-none ml-1 text-[10px]">✕</button>
                  </div>
                ))}
                <input 
                  type="text" 
                  name="skillsInput" 
                  value={formData.skillsInput} 
                  onChange={handleChange} 
                  onKeyDown={handleAddSkill}
                  placeholder="+ add skill"
                  className="bg-transparent border-none outline-none text-sm text-slate-400 placeholder:text-slate-500 flex-1 min-w-[100px] ml-2"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-2">Minimum qualification</label>
                <div className="relative">
                  <select name="minimumQualification" value={formData.minimumQualification} onChange={handleChange}
                    className="w-full bg-[#0f111a] border border-[#1e293b] rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 appearance-none">
                    <option>Pursuing Bachelor's</option>
                    <option>Bachelor's Degree</option>
                    <option>Master's Degree</option>
                    <option>High School</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500 text-xs">▼</div>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-2">Application deadline</label>
                <input type="date" name="deadline" value={formData.deadline} onChange={handleChange}
                  className="w-full bg-[#0f111a] border border-[#1e293b] rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500" style={{ colorScheme: 'dark' }} />
              </div>
            </div>
          </div>

          {/* Match Preview Box */}
          <div className="bg-blue-950/20 border border-blue-900/50 p-6 rounded-xl flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-blue-500 flex items-center justify-center shrink-0 shadow-lg shadow-blue-500/20">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
            </div>
            <div>
              <h3 className="font-bold text-sm text-white mb-2">Match preview</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Based on these requirements, <strong className="text-white">{previewMatchCount.seventy} students</strong> currently match above 70%, and <strong className="text-white">{previewMatchCount.eightyFive} above 85%</strong>. They'll be notified automatically when you publish.
              </p>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 pt-2">
            <button type="button" onClick={(e) => handleSubmit(e, true)} disabled={loading} className="w-[160px] bg-[#161b22] border border-[#1e293b] hover:bg-[#1e293b] text-white py-3 rounded-lg text-sm font-bold transition-colors disabled:opacity-50">
              Save as draft
            </button>
            <button type="submit" disabled={loading} className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg text-sm font-bold transition-colors shadow-lg shadow-blue-500/20 disabled:opacity-50">
              {loading ? 'Publishing...' : 'Publish job post'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
