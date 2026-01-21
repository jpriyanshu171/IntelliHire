import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext.jsx';

const STATUS_CONFIG = {
  APPLIED: { label: 'Applied', color: 'blue', bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  SHORTLISTED: { label: 'Shortlisted', color: 'purple', bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
  INTERVIEW: { label: 'Interview', color: 'orange', bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' },
  SELECTED: { label: 'Selected', color: 'green', bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
  REJECTED: { label: 'Rejected', color: 'red', bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
};

export default function MyApplicationsPage() {
  const { id: jobId } = useParams(); // Get jobId from URL if present
  const { user } = useAuth();
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [resumes, setResumes] = useState({}); // Cache for student resumes
  const [interviewForm, setInterviewForm] = useState({
    applicationId: null,
    scheduledAt: '',
    mode: 'ONLINE',
    location: '',
    meetingLink: '',
    notes: ''
  });

  const isRecruiterView = user?.role === 'RECRUITER' && jobId;

  // Helper to safely parse JSON
  const safeParse = (data) => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    try {
      return JSON.parse(data);
    } catch (e) {
      return [];
    }
  };

  useEffect(() => {
    const fetchApps = async () => {
      try {
        let endpoint = '/applications/me';
        if (isRecruiterView) {
          endpoint = `/applications/job/${jobId}`;
        }
        const res = await api.get(endpoint);
        setApps(res.data);

        // If recruiter view, fetch resumes for applicants
        if (isRecruiterView) {
          const studentIds = [...new Set(res.data.map(app => app.studentId))];
          const resumePromises = studentIds.map(sid => 
            api.get(`/resumes/student/${sid}`).then(r => ({ sid, data: r.data })).catch(() => ({ sid, data: null }))
          );
          const resumeResults = await Promise.all(resumePromises);
          const resumeMap = {};
          resumeResults.forEach(r => {
            if (r.data) {
              // Parse JSON fields immediately
              resumeMap[r.sid] = {
                ...r.data,
                education: safeParse(r.data.education),
                experience: safeParse(r.data.experience),
                projects: safeParse(r.data.projects)
              };
            }
          });
          setResumes(resumeMap);
        }
      } catch (err) {
        console.error("Failed to fetch applications", err);
      } finally {
        setLoading(false);
      }
    };

    fetchApps();
  }, [jobId, isRecruiterView]);

  const handleStatusUpdate = async (appId, newStatus) => {
    try {
      await api.put(`/applications/${appId}/status`, { status: newStatus });
      setApps(apps.map(app => app.id === appId ? { ...app, status: newStatus } : app));
      
      // If status is INTERVIEW, open interview form
      if (newStatus === 'INTERVIEW') {
        setInterviewForm(prev => ({ ...prev, applicationId: appId }));
      } else {
        alert(`Application status updated to ${newStatus}`);
      }
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const handleScheduleInterview = async (e) => {
    e.preventDefault();
    try {
      await api.post('/interviews', {
        ...interviewForm,
        scheduledAt: new Date(interviewForm.scheduledAt).toISOString()
      });
      alert('✅ Interview scheduled successfully!');
      setInterviewForm({ applicationId: null, scheduledAt: '', mode: 'ONLINE', location: '', meetingLink: '', notes: '' });
      // Refresh apps to show updated status/interview info
      const res = await api.get(`/applications/job/${jobId}`);
      setApps(res.data);
    } catch (err) {
      alert('Failed to schedule interview: ' + (err.response?.data?.message || err.message));
    }
  };

  const getStatusConfig = (status) => STATUS_CONFIG[status] || STATUS_CONFIG.APPLIED;
  const activeApps = apps.filter(app => !['SELECTED', 'REJECTED'].includes(app.status));
  const avgMatchingScore = apps.length > 0 
    ? Math.round(apps.reduce((sum, app) => sum + (app.matchingScore || 0), 0) / apps.length)
    : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl shadow-2xl p-10 mb-8 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-20"></div>
        <div className="relative flex items-center gap-6">
          <div className="bg-white/20 backdrop-blur-md p-6 rounded-2xl border border-white/30">
            <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div>
            <h1 className="text-4xl font-extrabold mb-2">
              {isRecruiterView ? 'Job Applicants' : 'My Applications'}
            </h1>
            <p className="text-blue-100 text-lg">
              {isRecruiterView ? 'Review and manage candidates for this position' : 'Track your job applications and their status'}
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-100">
          <div className="text-4xl font-extrabold text-blue-600 mb-2">{apps.length}</div>
          <div className="text-slate-600 font-semibold">Total Applications</div>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-100">
          <div className="text-4xl font-extrabold text-green-600 mb-2">{activeApps.length}</div>
          <div className="text-slate-600 font-semibold">Active Applications</div>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-100">
          <div className="text-4xl font-extrabold text-purple-600 mb-2">{avgMatchingScore}%</div>
          <div className="text-slate-600 font-semibold">Avg Match Score</div>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-100">
          <div className="text-4xl font-extrabold text-orange-600 mb-2">
            {apps.filter(app => app.status === 'INTERVIEW').length}
          </div>
          <div className="text-slate-600 font-semibold">Interviews</div>
        </div>
      </div>

      {/* Applications List */}
      {loading ? (
        <div className="text-center py-20">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mb-4"></div>
          <p className="text-xl text-slate-600">Loading applications...</p>
        </div>
      ) : apps.length === 0 ? (
        <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-3xl shadow-xl p-16 text-center border-2 border-dashed border-slate-200">
          <div className="text-8xl mb-6">📝</div>
          <h3 className="text-3xl font-bold text-slate-900 mb-3">No applications yet</h3>
          <p className="text-lg text-slate-600 mb-8 max-w-md mx-auto">
            {isRecruiterView ? 'No candidates have applied for this job yet.' : 'Start applying to jobs to see them here!'}
          </p>
          {!isRecruiterView && (
            <Link
              to="/"
              className="inline-block px-10 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl hover:shadow-xl transition-all duration-200 transform hover:scale-105"
            >
              Browse Jobs
            </Link>
          )}
        </div>
      ) : (
        <div className="grid gap-6">
          {apps.map((app) => {
            const statusConfig = getStatusConfig(app.status);
            const resume = resumes[app.studentId];
            const isScheduling = interviewForm.applicationId === app.id;
            
            return (
              <div
                key={app.id}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-slate-100 overflow-hidden"
              >
                <div className="p-8">
                  <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                    <div className="flex-1">
                      <div className="flex items-start gap-4 mb-4">
                        <div className={`bg-gradient-to-br from-${statusConfig.color}-500 to-${statusConfig.color}-600 text-white p-5 rounded-xl shadow-lg`}>
                          {isRecruiterView ? (
                            <div className="text-xl font-bold">{app.studentName?.charAt(0)}</div>
                          ) : (
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-2xl font-bold text-slate-900 mb-2">
                            {isRecruiterView ? app.studentName : app.jobTitle}
                          </h3>
                          <div className="flex flex-wrap items-center gap-4 mb-4">
                            {!isRecruiterView && app.company && (
                              <div className="flex items-center gap-2 text-slate-700 font-semibold">
                                <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                                {app.company}
                              </div>
                            )}
                            {isRecruiterView && (
                              <div className="flex items-center gap-2 text-slate-600">
                                <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                {app.studentEmail}
                              </div>
                            )}
                            <div className="flex items-center gap-2 text-slate-500 text-sm">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              Applied {new Date(app.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                          
                          {/* Status & Match Score */}
                          <div className="mb-4 flex flex-wrap gap-3">
                            <span className={`inline-flex items-center gap-2 px-4 py-2 ${statusConfig.bg} ${statusConfig.text} rounded-full text-sm font-bold border-2 ${statusConfig.border}`}>
                              <div className={`w-2 h-2 bg-${statusConfig.color}-500 rounded-full ${app.status === 'INTERVIEW' ? 'animate-pulse' : ''}`}></div>
                              {statusConfig.label}
                            </span>
                            {app.matchingScore !== null && (
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center ${
                                app.matchingScore >= 80 ? 'bg-green-100 text-green-800' : 
                                app.matchingScore >= 50 ? 'bg-yellow-100 text-yellow-800' : 
                                'bg-red-100 text-red-800'
                              }`}>
                                {app.matchingScore}% Match
                              </span>
                            )}
                          </div>

                          {/* Recruiter Actions */}
                          {isRecruiterView && (
                            <div className="mt-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
                              <h4 className="font-bold text-slate-800 mb-2">Candidate Details</h4>
                              
                              {/* Resume Summary */}
                              {resume ? (
                                <div className="mb-4">
                                  <p className="text-sm text-slate-600 italic mb-4">"{resume.summary}"</p>
                                  
                                  {/* Skills */}
                                  <div className="mb-4">
                                    <h5 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Skills</h5>
                                    <div className="flex flex-wrap gap-2">
                                      {resume.skills && resume.skills.map((skill, idx) => (
                                        <span key={idx} className="px-2 py-1 bg-white border border-slate-200 rounded text-xs text-slate-600 font-medium">
                                          {skill}
                                        </span>
                                      ))}
                                    </div>
                                  </div>

                                  {/* Education */}
                                  {resume.education && resume.education.length > 0 && (
                                    <div className="mb-4">
                                      <h5 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Education</h5>
                                      <div className="space-y-2">
                                        {resume.education.map((edu, idx) => (
                                          <div key={idx} className="text-sm bg-white p-2 rounded border border-slate-100">
                                            <div className="font-semibold text-slate-800">{edu.degree} in {edu.field}</div>
                                            <div className="text-slate-600">{edu.institution} • {edu.year}</div>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}

                                  {/* Experience */}
                                  {resume.experience && resume.experience.length > 0 && (
                                    <div className="mb-4">
                                      <h5 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Experience</h5>
                                      <div className="space-y-2">
                                        {resume.experience.map((exp, idx) => (
                                          <div key={idx} className="text-sm bg-white p-2 rounded border border-slate-100">
                                            <div className="font-semibold text-slate-800">{exp.position}</div>
                                            <div className="text-slate-600">{exp.company} • {exp.duration}</div>
                                            {exp.description && <div className="text-xs text-slate-500 mt-1">{exp.description}</div>}
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}

                                  {/* Projects */}
                                  {resume.projects && resume.projects.length > 0 && (
                                    <div className="mb-4">
                                      <h5 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Projects</h5>
                                      <div className="space-y-2">
                                        {resume.projects.map((proj, idx) => (
                                          <div key={idx} className="text-sm bg-white p-2 rounded border border-slate-100">
                                            <div className="font-semibold text-slate-800">{proj.name}</div>
                                            <div className="text-xs text-slate-500 mt-1">{proj.description}</div>
                                            {proj.tech && <div className="text-xs text-blue-600 mt-1 font-medium">{proj.tech}</div>}
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <div className="mb-4 text-sm text-slate-500 italic">No resume available</div>
                              )}

                              <div className="flex flex-wrap gap-3 mt-4 items-center border-t border-slate-200 pt-4">
                                <select
                                  value={app.status}
                                  onChange={(e) => handleStatusUpdate(app.id, e.target.value)}
                                  className="px-3 py-2 border rounded-lg text-sm font-medium bg-white focus:ring-2 focus:ring-blue-500"
                                >
                                  <option value="APPLIED">Applied</option>
                                  <option value="SHORTLISTED">Shortlisted</option>
                                  <option value="INTERVIEW">Interview</option>
                                  <option value="SELECTED">Selected</option>
                                  <option value="REJECTED">Rejected</option>
                                </select>
                                
                                {resume?.filePath && (
                                  <a 
                                    href={`http://localhost:8080/${resume.filePath}`} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="px-4 py-2 bg-blue-600 text-white text-sm font-bold rounded-lg hover:bg-blue-700 flex items-center gap-2"
                                  >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    View Resume PDF
                                  </a>
                                )}
                              </div>

                              {/* Interview Scheduling Form */}
                              {isScheduling && (
                                <div className="mt-4 p-4 bg-orange-50 border border-orange-200 rounded-xl animate-fade-in">
                                  <h5 className="font-bold text-orange-800 mb-3">Schedule Interview</h5>
                                  <form onSubmit={handleScheduleInterview} className="space-y-3">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                      <div>
                                        <label className="block text-xs font-semibold text-orange-700 mb-1">Date & Time</label>
                                        <input
                                          type="datetime-local"
                                          required
                                          value={interviewForm.scheduledAt}
                                          onChange={(e) => setInterviewForm({...interviewForm, scheduledAt: e.target.value})}
                                          className="w-full px-3 py-2 border border-orange-200 rounded-lg text-sm"
                                        />
                                      </div>
                                      <div>
                                        <label className="block text-xs font-semibold text-orange-700 mb-1">Mode</label>
                                        <select
                                          value={interviewForm.mode}
                                          onChange={(e) => setInterviewForm({...interviewForm, mode: e.target.value})}
                                          className="w-full px-3 py-2 border border-orange-200 rounded-lg text-sm"
                                        >
                                          <option value="ONLINE">Online</option>
                                          <option value="OFFLINE">Offline</option>
                                          <option value="HYBRID">Hybrid</option>
                                        </select>
                                      </div>
                                    </div>
                                    
                                    {interviewForm.mode !== 'OFFLINE' && (
                                      <div>
                                        <label className="block text-xs font-semibold text-orange-700 mb-1">Meeting Link</label>
                                        <input
                                          type="url"
                                          placeholder="https://meet.google.com/..."
                                          value={interviewForm.meetingLink}
                                          onChange={(e) => setInterviewForm({...interviewForm, meetingLink: e.target.value})}
                                          className="w-full px-3 py-2 border border-orange-200 rounded-lg text-sm"
                                        />
                                      </div>
                                    )}
                                    
                                    {interviewForm.mode !== 'ONLINE' && (
                                      <div>
                                        <label className="block text-xs font-semibold text-orange-700 mb-1">Location</label>
                                        <input
                                          type="text"
                                          placeholder="Office Address"
                                          value={interviewForm.location}
                                          onChange={(e) => setInterviewForm({...interviewForm, location: e.target.value})}
                                          className="w-full px-3 py-2 border border-orange-200 rounded-lg text-sm"
                                        />
                                      </div>
                                    )}

                                    <div className="flex gap-2 justify-end pt-2">
                                      <button
                                        type="button"
                                        onClick={() => setInterviewForm(prev => ({ ...prev, applicationId: null }))}
                                        className="px-3 py-1.5 text-sm text-slate-600 hover:text-slate-800"
                                      >
                                        Cancel
                                      </button>
                                      <button
                                        type="submit"
                                        className="px-4 py-1.5 bg-orange-600 text-white text-sm font-bold rounded-lg hover:bg-orange-700"
                                      >
                                        Schedule
                                      </button>
                                    </div>
                                  </form>
                                </div>
                              )}
                            </div>
                          )}

                          {/* Cover Letter */}
                          {app.coverLetter && (
                            <div className="mt-4 text-sm text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100">
                              <span className="font-semibold block mb-1">Cover Letter:</span>
                              {app.coverLetter}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
