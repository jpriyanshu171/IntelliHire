import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext.jsx';

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [resume, setResume] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const loadData = async () => {
      try {
        const [profileRes, applicationsRes] = await Promise.all([
          api.get('/users/me'),
          user?.role === 'STUDENT' ? api.get('/applications/me').catch(() => ({ data: [] })) : Promise.resolve({ data: [] }),
        ]);
        setProfile(profileRes.data);
        setApplications(applicationsRes.data);
        
        // Try to load resume for students
        if (user?.role === 'STUDENT') {
          api.get('/resumes/me')
            .then(res => setResume(res.data))
            .catch(() => setResume(null));
        }
      } catch (err) {
        console.error('Failed to load data:', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [user]);

  const handleChange = (e) => {
    setProfile((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);
    try {
      const res = await api.put('/users/me', profile);
      setProfile(res.data);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      alert('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading || !profile) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mb-4"></div>
          <div className="text-xl font-semibold text-slate-700">Loading profile...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl shadow-2xl p-10 mb-8 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-20"></div>
        <div className="relative flex items-center gap-6">
          <div className="bg-white/20 backdrop-blur-md p-6 rounded-2xl border border-white/30">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-3xl font-extrabold text-blue-600">
              {profile.fullName?.charAt(0) || 'U'}
            </div>
          </div>
          <div>
            <h1 className="text-4xl font-extrabold mb-2">My Profile</h1>
            <p className="text-blue-100 text-lg">Manage your account information and preferences</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className={`grid grid-cols-1 md:grid-cols-${profile.role === 'STUDENT' ? '4' : '3'} gap-6 mb-8`}>
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-100">
          <div className="text-3xl font-extrabold text-blue-600 mb-2">{profile.role === 'STUDENT' ? '🎓' : '💼'}</div>
          <div className="text-slate-600 font-semibold mb-1">Account Type</div>
          <div className="text-xl font-bold text-slate-900">{profile.role === 'STUDENT' ? 'Student' : 'Recruiter'}</div>
        </div>
        {profile.role === 'STUDENT' && (
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-100">
            <div className="text-3xl font-extrabold text-indigo-600 mb-2">
              {resume ? '✅' : '📝'}
            </div>
            <div className="text-slate-600 font-semibold mb-1">Resume Status</div>
            <div className="text-xl font-bold text-slate-900">
              {resume ? 'Complete' : 'Not Created'}
            </div>
            {!resume && (
              <Link
                to="/resume/builder"
                className="mt-2 text-sm text-blue-600 hover:underline"
              >
                Create Resume →
              </Link>
            )}
          </div>
        )}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-100">
          <div className="text-3xl font-extrabold text-green-600 mb-2">✓</div>
          <div className="text-slate-600 font-semibold mb-1">Account Status</div>
          <div className="text-xl font-bold text-green-600">Verified</div>
        </div>
        {profile.role === 'STUDENT' && (
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-100">
            <div className="text-3xl font-extrabold text-purple-600 mb-2">{applications.length}</div>
            <div className="text-slate-600 font-semibold mb-1">Applications</div>
            <div className="text-xl font-bold text-slate-900">Submitted</div>
          </div>
        )}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-100">
          <div className="text-3xl font-extrabold text-purple-600 mb-2">🔒</div>
          <div className="text-slate-600 font-semibold mb-1">Security</div>
          <div className="text-xl font-bold text-slate-900">Protected</div>
        </div>
      </div>

      {/* Profile Form */}
      <div className="bg-white rounded-3xl shadow-xl p-10 border border-slate-100">
        {success && (
          <div className="mb-8 p-5 bg-green-50 border-2 border-green-200 rounded-xl text-green-700 flex items-center gap-3">
            <svg className="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-semibold">Profile updated successfully!</span>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-3">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                </div>
                <input
                  type="email"
                  value={profile.email}
                  disabled
                  className="w-full pl-12 pr-4 py-4 border-2 border-slate-200 rounded-xl bg-slate-50 text-slate-600 cursor-not-allowed"
                />
              </div>
              <p className="mt-2 text-xs text-slate-500">Email cannot be changed</p>
            </div>
            
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-3">Account Type</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className="text-2xl">{profile.role === 'STUDENT' ? '🎓' : '💼'}</span>
                </div>
                <input
                  type="text"
                  value={profile.role === 'STUDENT' ? 'Student' : 'Recruiter'}
                  disabled
                  className="w-full pl-14 pr-4 py-4 border-2 border-slate-200 rounded-xl bg-slate-50 text-slate-600 cursor-not-allowed"
                />
              </div>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-3">Full Name</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <input
                type="text"
                name="fullName"
                value={profile.fullName || ''}
                onChange={handleChange}
                className="w-full pl-12 pr-4 py-4 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all text-lg"
                placeholder="Enter your full name"
              />
            </div>
          </div>
          
          <div className="pt-6 border-t border-slate-200">
            <button
              type="submit"
              disabled={saving}
              className="px-10 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl hover:shadow-xl transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 transform hover:scale-105"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent"></div>
                  <span>Saving Changes...</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
