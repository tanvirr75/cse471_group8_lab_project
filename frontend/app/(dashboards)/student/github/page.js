'use client';

import { useState, useEffect } from 'react';
import { connectGithubAccount, getConnectedGithubProfile } from '@/lib/api';
import GithubStatsCard from '@/components/features/GithubStatsCard';

export default function StudentGithubPage() {
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState(false);
  const [message, setMessage] = useState('');
  const [username, setUsername] = useState('');
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    fetchConnectedProfile();
  }, []);

  const fetchConnectedProfile = async () => {
    try {
      const data = await getConnectedGithubProfile();
      setProfile(data);
    } catch (err) {
      // Not connected yet (or a fetch error) is a normal state here, not an error to show.
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = async (e) => {
    e.preventDefault();
    setConnecting(true);
    setMessage('');
    try {
      await connectGithubAccount(username);
      setMessage('GitHub account connected successfully!');
      await fetchConnectedProfile();
    } catch (err) {
      setMessage(err.message || 'Error connecting GitHub account');
    } finally {
      setConnecting(false);
    }
  };

  if (loading) return <div className="min-h-screen bg-[#0f111a] flex items-center justify-center text-slate-500">Loading GitHub account...</div>;

  return (
    <div className="min-h-screen bg-[#0f111a] text-white p-8">
      <div className="max-w-[800px] mx-auto space-y-8">

        <div>
          <div className="flex items-center gap-2 text-[10px] font-bold text-blue-500 tracking-widest uppercase mb-3">
            <span>ACCOUNT</span>
            <span className="text-slate-600">•</span>
            <span>GITHUB INTEGRATION</span>
          </div>
          <h1 className="text-3xl font-bold mb-2">GitHub Account</h1>
          <p className="text-sm text-slate-400">Connect your GitHub account so recruiters can see your public activity.</p>
        </div>

        <form onSubmit={handleConnect} className="bg-[#161b22] border border-[#1e293b] rounded-xl p-8 space-y-6 shadow-lg">
          <div className="space-y-4">
            <h3 className="text-lg font-bold border-b border-[#1e293b] pb-2">Connect Account</h3>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">GitHub Username</label>
              <input
                type="text"
                name="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. octocat"
                className="w-full bg-[#0f111a] border border-[#1e293b] rounded-lg px-4 py-2.5 text-sm focus:border-blue-500 outline-none"
              />
            </div>
          </div>

          {message && (
            <div className={`p-4 rounded-lg text-sm font-bold border ${message.includes('success') ? 'bg-emerald-900/20 text-emerald-500 border-emerald-900/50' : 'bg-red-900/20 text-red-500 border-red-900/50'}`}>
              {message}
            </div>
          )}

          <div className="pt-2 flex justify-end">
            <button type="submit" disabled={connecting} className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2.5 rounded-lg text-sm font-bold shadow-lg shadow-blue-500/20 transition-all disabled:opacity-50">
              {connecting ? 'Connecting...' : 'Connect'}
            </button>
          </div>
        </form>

        {profile && (
          <div className="bg-[#161b22] border border-[#1e293b] rounded-xl p-8 space-y-6 shadow-lg">
            <h3 className="text-lg font-bold border-b border-[#1e293b] pb-2">Connected Profile</h3>
            <div className="flex items-start gap-6">
              {profile.avatar_url && (
                <img src={profile.avatar_url} alt={profile.login} className="w-20 h-20 rounded-full border border-[#1e293b]" />
              )}
              <div className="space-y-2 flex-1">
                <div>
                  <p className="text-lg font-bold">{profile.name || profile.login}</p>
                  <a href={profile.html_url} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-500 hover:underline">
                    @{profile.login}
                  </a>
                </div>
                {profile.bio && <p className="text-sm text-slate-400">{profile.bio}</p>}
                <div className="flex gap-6 pt-2">
                  <div>
                    <p className="text-xl font-bold">{profile.public_repos}</p>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Repos</p>
                  </div>
                  <div>
                    <p className="text-xl font-bold">{profile.followers}</p>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Followers</p>
                  </div>
                  <div>
                    <p className="text-xl font-bold">{profile.following}</p>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Following</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {profile && <GithubStatsCard username={profile.login} />}
      </div>
    </div>
  );
}
