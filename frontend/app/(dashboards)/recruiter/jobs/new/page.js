'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createJob } from '@/lib/api';

export default function CreateJobPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    type: 'Full-time',
    workplace: 'On-site',
    location: '',
    experienceLevel: 'Entry-level',
    minSalary: '',
    maxSalary: '',
    skills: '',
    description: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const skillsArray = formData.skills.split(',').map(s => s.trim()).filter(Boolean);
      
      const payload = {
        title: formData.title,
        company: formData.company,
        type: formData.type,
        workplace: formData.workplace,
        location: formData.location,
        experienceLevel: formData.experienceLevel,
        salaryRange: {
          min: formData.minSalary ? Number(formData.minSalary) : undefined,
          max: formData.maxSalary ? Number(formData.maxSalary) : undefined
        },
        skills: skillsArray,
        description: formData.description
      };

      await createJob(payload);
      alert('Job posted successfully!');
      router.push('/recruiter/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b1120] p-8 text-white">
      <div className="max-w-3xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-extrabold text-white mb-2">Create a Job Posting</h1>
          <p className="text-slate-400">Attract top talent by providing clear and detailed information about the role.</p>
        </div>

        {error && (
          <div className="bg-red-900/30 border border-red-500/50 text-red-400 p-4 rounded-xl">
            {error}
          </div>
        )}

        <div className="bg-[#121a2f] border border-[#1e293b] rounded-2xl shadow-xl overflow-hidden">
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-slate-300 mb-2">Job Title *</label>
                <input required type="text" name="title" value={formData.title} onChange={handleChange} placeholder="e.g. Frontend Developer"
                  className="w-full bg-[#0b1120] border border-[#1e293b] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-300 mb-2">Company Name *</label>
                <input required type="text" name="company" value={formData.company} onChange={handleChange} placeholder="e.g. Google"
                  className="w-full bg-[#0b1120] border border-[#1e293b] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-bold text-slate-300 mb-2">Job Type</label>
                <select name="type" value={formData.type} onChange={handleChange}
                  className="w-full bg-[#0b1120] border border-[#1e293b] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors">
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Internship">Internship</option>
                  <option value="Contract">Contract</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-300 mb-2">Workplace</label>
                <select name="workplace" value={formData.workplace} onChange={handleChange}
                  className="w-full bg-[#0b1120] border border-[#1e293b] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors">
                  <option value="On-site">On-site</option>
                  <option value="Remote">Remote</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-300 mb-2">Location</label>
                <input type="text" name="location" value={formData.location} onChange={handleChange} placeholder="e.g. Dhaka, Bangladesh"
                  className="w-full bg-[#0b1120] border border-[#1e293b] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-bold text-slate-300 mb-2">Experience Level</label>
                <select name="experienceLevel" value={formData.experienceLevel} onChange={handleChange}
                  className="w-full bg-[#0b1120] border border-[#1e293b] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors">
                  <option value="Entry-level">Entry-level</option>
                  <option value="Mid-level">Mid-level</option>
                  <option value="Senior">Senior</option>
                  <option value="Director">Director</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-300 mb-2">Min Salary (USD)</label>
                <input type="number" name="minSalary" value={formData.minSalary} onChange={handleChange} placeholder="e.g. 50000"
                  className="w-full bg-[#0b1120] border border-[#1e293b] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-300 mb-2">Max Salary (USD)</label>
                <input type="number" name="maxSalary" value={formData.maxSalary} onChange={handleChange} placeholder="e.g. 80000"
                  className="w-full bg-[#0b1120] border border-[#1e293b] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-300 mb-2">Required Skills (Comma separated)</label>
              <input type="text" name="skills" value={formData.skills} onChange={handleChange} placeholder="e.g. React, Node.js, MongoDB"
                className="w-full bg-[#0b1120] border border-[#1e293b] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors" />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-300 mb-2">Job Description</label>
              <textarea rows="6" name="description" value={formData.description} onChange={handleChange} placeholder="Describe the responsibilities and requirements..."
                className="w-full bg-[#0b1120] border border-[#1e293b] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors resize-y" />
            </div>

            <div className="pt-4 flex justify-end gap-4 border-t border-[#1e293b]">
              <button type="button" onClick={() => router.back()} className="px-6 py-3 font-medium rounded-xl text-slate-400 hover:text-white transition-colors">
                Cancel
              </button>
              <button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50">
                {loading ? 'Posting...' : 'Post Job'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
