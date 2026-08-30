'use client';

import { useState, useEffect } from 'react';
import { getProfile, updateProfile } from '@/lib/api';

export default function UniversityProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    universityName: '',
  });

  const fetchProfile = async () => {
    try {
      const data = await getProfile();
      setFormData({
        name: data.name || '',
        email: data.email || '',
        universityName: data.universityName || '',
      });
    } catch (err) {
      console.error(err);
      setMessage('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchProfile();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      await updateProfile(formData);
      setMessage('Profile updated successfully!');
    } catch (err) {
      setMessage('Error updating profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="min-h-screen bg-[#0f111a] flex items-center justify-center text-slate-500">Loading profile...</div>;

  return (
    <div className="min-h-screen bg-[#0f111a] text-white p-8">
      <div className="max-w-[800px] mx-auto space-y-8">
        
        <div>
          <div className="flex items-center gap-2 text-[10px] font-bold text-blue-500 tracking-widest uppercase mb-3">
            <span>ACCOUNT</span>
            <span className="text-slate-600">•</span>
            <span>UNIVERSITY PROFILE</span>
          </div>
          <h1 className="text-3xl font-bold mb-2">University Settings</h1>
          <p className="text-sm text-slate-400">Manage your institution details and representative information.</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-[#161b22] border border-[#1e293b] rounded-xl p-8 space-y-6 shadow-lg">
          
          <div className="space-y-4">
            <h3 className="text-lg font-bold border-b border-[#1e293b] pb-2">Representative Details</h3>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Full Name</label>
                <input 
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-[#0f111a] border border-[#1e293b] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                  placeholder="Admin Name"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Email Address</label>
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled
                  className="w-full bg-[#0f111a]/50 border border-[#1e293b] rounded-lg px-4 py-2.5 text-sm text-slate-500 cursor-not-allowed"
                />
                <p className="text-[10px] text-slate-500">Email cannot be changed</p>
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-4">
            <h3 className="text-lg font-bold border-b border-[#1e293b] pb-2">Institution Identity</h3>
            
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">University Name</label>
              <input 
                type="text" 
                name="universityName"
                value={formData.universityName}
                onChange={handleChange}
                className="w-full bg-[#0f111a] border border-[#1e293b] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                placeholder="e.g. BRAC University"
              />
            </div>
          </div>

          {message && (
            <div className={`p-4 rounded-lg text-sm font-bold border ${message.includes('success') ? 'bg-emerald-900/20 text-emerald-500 border-emerald-900/50' : 'bg-red-900/20 text-red-500 border-red-900/50'}`}>
              {message}
            </div>
          )}

          <div className="pt-4 flex justify-end">
            <button 
              type="submit"
              disabled={saving}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2.5 rounded-lg text-sm font-bold shadow-lg shadow-blue-500/20 transition-all disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save changes'}
            </button>
          </div>
          
        </form>
      </div>
    </div>
  );
}
