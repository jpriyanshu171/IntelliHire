import { useEffect, useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext.jsx';

export default function JobsPage() {
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [stats, setStats] = useState({ totalJobs: 0, totalRecruiters: 0, totalStudents: 0, successRate: 98 });
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const { user, token } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const loadPageData = async () => {
      setLoading(true);
      const query = searchParams.get('query');
      
      // Sync search term with URL
      setSearchTerm(query || '');
      
      if (query) {
        setIsSearching(true);
      }

      try {
        const [appsRes, statsRes] = await Promise.all([
          token && user?.role === 'STUDENT' ? api.get('/applications/me').catch(() => ({ data: [] })) : Promise.resolve({ data: [] }),
          api.get('/stats').catch(() => ({ data: { totalJobs: 0, totalRecruiters: 0, totalStudents: 0, successRate: 98 } }))
        ]);
        setApplications(appsRes.data || []);
        setStats(statsRes.data);

        const jobsEndpoint = query ? `/jobs?query=${encodeURIComponent(query)}` : '/jobs';
        const jobsRes = await api.get(jobsEndpoint);
        setJobs(jobsRes.data);

      } catch (err) {
        console.error('Failed to load data:', err);
      } finally {
        setLoading(false);
        setIsSearching(false);
      }
    };

    loadPageData();
    
    const statsInterval = setInterval(() => {
      api.get('/stats')
        .then(res => setStats(res.data))
        .catch(() => {});
    }, 30000);
    
    return () => clearInterval(statsInterval);
  }, [token, user, searchParams]);

  const hasApplied = (jobId) => {
    return applications.some(app => app.jobId === jobId);
  };

  const refreshStats = async () => {
    try {
      const statsRes = await api.get('/stats');
      setStats(statsRes.data);
    } catch (err) {
      console.error('Failed to refresh stats:', err);
    }
  };

  const handleApply = async (jobId) => {
    if (!token) {
      alert('Please login to apply for jobs');
      return;
    }
    if (hasApplied(jobId)) {
      alert('You have already applied for this job!');
      return;
    }
    setApplying(prev => ({ ...prev, [jobId]: true }));
    try {
      await api.post(`/applications/jobs/${jobId}`, { coverLetter: 'Interested in this position.' });
      const job = jobs.find(j => j.id === jobId);
      setApplications(prev => [...prev, {
        id: Date.now(),
        jobId: jobId,
        jobTitle: job?.title || 'Job',
        company: job?.company || 'Company',
        createdAt: new Date().toISOString()
      }]);
      refreshStats();
      alert('✅ Applied successfully!');
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to apply. You may have already applied for this job.';
      alert(errorMessage);
    } finally {
      setApplying(prev => ({ ...prev, [jobId]: false }));
    }
  };

  const handleSearchSubmit = (e) => {
    if (e.key === 'Enter') {
      navigate(`/jobs?query=${encodeURIComponent(searchTerm)}`);
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 py-20 lg:py-28">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full text-white text-sm font-medium mb-6 border border-white/20">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              AI-Powered Job Portal
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-white mb-6 leading-tight">
              IntelliHire
              <span className="block text-4xl md:text-5xl lg:text-6xl mt-2 bg-gradient-to-r from-blue-200 via-indigo-200 to-purple-200 bg-clip-text text-transparent">
                Smart Hiring Starts Here
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 leading-relaxed max-w-3xl mx-auto">
              Connect talented students with top recruiters. Streamline your hiring process and discover your dream career with AI-powered matching.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-10">
              {!user && (
                <>
                  <Link
                    to="/register"
                    className="px-8 py-4 bg-white text-blue-600 font-bold rounded-xl hover:bg-blue-50 shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 text-lg"
                  >
                    Get Started Free
                  </Link>
                  <Link
                    to="/login"
                    className="px-8 py-4 bg-white/10 backdrop-blur-md text-white font-bold rounded-xl hover:bg-white/20 border-2 border-white/30 transition-all duration-300 text-lg"
                  >
                    Sign In
                  </Link>
                </>
              )}
              {user && (
                <div className="text-white text-lg font-semibold">
                  Welcome back, {user.fullName}! 👋
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-slate-50 to-transparent"></div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-900">Platform Statistics</h2>
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span>Live Data</span>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 hover:shadow-lg transition-all duration-300 animate-fade-in">
              <div className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                {stats.totalJobs > 0 ? `${stats.totalJobs}+` : '0+'}
              </div>
              <div className="text-slate-600 font-semibold">Active Jobs</div>
              <div className="text-xs text-slate-400 mt-1 flex items-center justify-center gap-1">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                Live count
              </div>
            </div>
            <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-100 hover:shadow-lg transition-all duration-300 animate-fade-in">
              <div className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                {stats.totalRecruiters > 0 ? (stats.totalRecruiters >= 1000 ? `${(stats.totalRecruiters / 1000).toFixed(1)}K+` : `${stats.totalRecruiters}+`) : '0+'}
              </div>
              <div className="text-slate-600 font-semibold">Recruiters</div>
              <div className="text-xs text-slate-400 mt-1 flex items-center justify-center gap-1">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                Live count
              </div>
            </div>
            <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100 hover:shadow-lg transition-all duration-300 animate-fade-in">
              <div className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">
                {stats.totalStudents > 0 ? (stats.totalStudents >= 1000 ? `${(stats.totalStudents / 1000).toFixed(1)}K+` : `${stats.totalStudents}+`) : '0+'}
              </div>
              <div className="text-slate-600 font-semibold">Students</div>
              <div className="text-xs text-slate-400 mt-1 flex items-center justify-center gap-1">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                Live count
              </div>
            </div>
            <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-orange-50 to-red-50 border border-orange-100 hover:shadow-lg transition-all duration-300 animate-fade-in">
              <div className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-2">
                {stats.successRate.toFixed(0)}%
              </div>
              <div className="text-slate-600 font-semibold">Success Rate</div>
              <div className="text-xs text-slate-400 mt-1 flex items-center justify-center gap-1">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                Calculated
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-b from-white to-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4">
              Why Choose <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">IntelliHire</span>?
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Powerful features designed to make hiring and job searching effortless
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: '🎯', title: 'Smart Matching', desc: 'AI-powered job matching based on skills and preferences' },
              { icon: '🔒', title: 'Secure Auth', desc: 'Enterprise-grade security with JWT authentication' },
              { icon: '👥', title: 'Role-Based Access', desc: 'Separate dashboards for students and recruiters' },
              { icon: '⚡', title: 'Fast Hiring', desc: 'Streamlined application process for quick decisions' },
            ].map((feature, idx) => (
              <div
                key={idx}
                className="p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl border border-slate-100 transition-all duration-300 transform hover:-translate-y-2"
              >
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Jobs Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-2">
                Available <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Opportunities</span>
              </h2>
              <p className="text-lg text-slate-600">Discover your next career move</p>
            </div>
            
            {/* Search Bar in Jobs Section */}
            <div className="mt-4 md:mt-0 w-full md:w-auto">
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-400 to-purple-400 rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-200"></div>
                <div className="relative bg-white rounded-xl shadow-lg flex items-center p-1">
                  <div className="pl-3 text-slate-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder="Search jobs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={handleSearchSubmit}
                    className="w-full md:w-64 px-3 py-2 text-slate-700 placeholder-slate-400 bg-transparent border-none focus:ring-0 focus:outline-none"
                  />
                  <div className="pr-1">
                    {isSearching ? (
                      <div className="w-8 h-8 flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-600 border-t-transparent"></div>
                      </div>
                    ) : (
                      <button 
                        onClick={() => handleSearchSubmit({ key: 'Enter' })}
                        className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-sm"
                      >
                        Go
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mb-4"></div>
              <p className="text-xl text-slate-600">Finding the best opportunities for you...</p>
            </div>
          ) : jobs.length === 0 ? (
            <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl p-16 text-center border-2 border-dashed border-slate-200">
              <div className="text-7xl mb-6">🔍</div>
              <h3 className="text-3xl font-bold text-slate-900 mb-3">No jobs found</h3>
              <p className="text-lg text-slate-600 mb-8 max-w-md mx-auto">
                {searchTerm ? 'Try adjusting your search terms' : 'Be the first to discover new opportunities!'}
              </p>
              {user?.role === 'RECRUITER' && (
                <Link
                  to="/recruiter/jobs"
                  className="inline-block px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                >
                  Post Your First Job
                </Link>
              )}
            </div>
          ) : (
            <div className="grid gap-6">
              {jobs.map((job) => (
                <div
                  key={job.id}
                  className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl border-2 border-slate-100 hover:border-blue-200 transition-all duration-300 overflow-hidden"
                >
                  <div className="p-8">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                      <div className="flex-1">
                        <div className="flex items-start gap-4">
                          <div className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white p-4 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <h3 className="text-2xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                              {job.title}
                            </h3>
                            <div className="flex flex-wrap items-center gap-4 mb-4">
                              {job.company && (
                                <div className="flex items-center gap-2 text-slate-700 font-semibold">
                                  <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                  </svg>
                                  {job.company}
                                </div>
                              )}
                              {job.location && (
                                <div className="flex items-center gap-2 text-slate-600">
                                  <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                  </svg>
                                  {job.location}
                                </div>
                              )}
                              <div className="flex items-center gap-2 text-slate-400 text-sm">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                Posted {new Date(job.createdAt).toLocaleDateString()}
                              </div>
                            </div>
                            <p className="text-slate-600 leading-relaxed line-clamp-2 mb-4">{job.description}</p>
                            <div className="flex flex-wrap gap-2">
                              {job.salaryMin && job.salaryMax && (
                                <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-semibold">
                                  ${job.salaryMin.toLocaleString()} - ${job.salaryMax.toLocaleString()}
                                </span>
                              )}
                              {job.requiredSkills && job.requiredSkills.slice(0, 3).map((skill, idx) => (
                                <span key={idx} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-semibold">
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                      {user?.role === 'STUDENT' && (
                        <div className="flex items-center lg:items-start">
                          {hasApplied(job.id) ? (
                            <button
                              disabled
                              className="px-8 py-4 bg-green-50 text-green-700 font-bold rounded-xl border-2 border-green-200 cursor-not-allowed flex items-center gap-2 whitespace-nowrap"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              Applied
                            </button>
                          ) : (
                            <button
                              onClick={() => handleApply(job.id)}
                              disabled={applying[job.id]}
                              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl hover:shadow-xl transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2 whitespace-nowrap transform hover:scale-105"
                            >
                              {applying[job.id] ? (
                                <>
                                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                                  <span>Applying...</span>
                                </>
                              ) : (
                                <>
                                  <span>Apply Now</span>
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                  </svg>
                                </>
                              )}
                            </button>
                          )}
                        </div>
                      )}
                      {user?.role === 'RECRUITER' && (
                        <Link
                          to="/recruiter/jobs"
                          className="px-8 py-4 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-all duration-200 whitespace-nowrap"
                        >
                          Manage Jobs
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4">
              Trusted by <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Thousands</span>
            </h2>
            <p className="text-xl text-slate-600">See what our users are saying</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: 'Sarah Johnson', role: 'Software Engineer', company: 'Tech Corp', text: 'IntelliHire helped me land my dream job in just 2 weeks! The platform is intuitive and the matching is spot-on.' },
              { name: 'Michael Chen', role: 'HR Manager', company: 'StartupXYZ', text: 'As a recruiter, IntelliHire has streamlined our hiring process. We found 3 perfect candidates in the first week!' },
              { name: 'Emily Rodriguez', role: 'Data Scientist', company: 'DataViz Inc', text: 'The best job portal I\'ve used. Clean UI, fast applications, and great support. Highly recommended!' },
            ].map((testimonial, idx) => (
              <div
                key={idx}
                className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100 hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                  ))}
                </div>
                <p className="text-slate-700 mb-6 leading-relaxed italic">"{testimonial.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">{testimonial.name}</div>
                    <div className="text-sm text-slate-600">{testimonial.role} at {testimonial.company}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {!user && (
        <section className="py-20 bg-gradient-to-r from-blue-600 via-indigo-700 to-purple-800">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6">
              Ready to Transform Your Career?
            </h2>
            <p className="text-xl text-blue-100 mb-8 leading-relaxed">
              Join thousands of students and recruiters already using IntelliHire to connect and grow.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="px-10 py-5 bg-white text-blue-600 font-bold rounded-xl hover:bg-blue-50 shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 text-lg"
              >
                Get Started Free
              </Link>
              <Link
                to="/login"
                className="px-10 py-5 bg-white/10 backdrop-blur-md text-white font-bold rounded-xl hover:bg-white/20 border-2 border-white/30 transition-all duration-300 text-lg"
              >
                Sign In
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
