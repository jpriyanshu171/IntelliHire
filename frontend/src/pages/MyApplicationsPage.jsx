import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';

const STATUS_CONFIG = {
  APPLIED: { label: 'Applied', color: 'blue', bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  SHORTLISTED: { label: 'Shortlisted', color: 'purple', bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
  INTERVIEW: { label: 'Interview', color: 'orange', bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' },
  SELECTED: { label: 'Selected', color: 'green', bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
  REJECTED: { label: 'Rejected', color: 'red', bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
};

export default function MyApplicationsPage() {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/applications/me')
      .then((res) => setApps(res.data))
      .finally(() => setLoading(false));
  }, []);

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
            <h1 className="text-4xl font-extrabold mb-2">My Applications</h1>
            <p className="text-blue-100 text-lg">Track your job applications and their status</p>
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
          <p className="text-xl text-slate-600">Loading your applications...</p>
        </div>
      ) : apps.length === 0 ? (
        <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-3xl shadow-xl p-16 text-center border-2 border-dashed border-slate-200">
          <div className="text-8xl mb-6">📝</div>
          <h3 className="text-3xl font-bold text-slate-900 mb-3">No applications yet</h3>
          <p className="text-lg text-slate-600 mb-8 max-w-md mx-auto">
            Start applying to jobs to see them here! Browse available opportunities and apply to your dream roles.
          </p>
          <Link
            to="/"
            className="inline-block px-10 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl hover:shadow-xl transition-all duration-200 transform hover:scale-105"
          >
            Browse Jobs
          </Link>
        </div>
      ) : (
        <div className="grid gap-6">
          {apps.map((app) => {
            const statusConfig = getStatusConfig(app.status);
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
                          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-2xl font-bold text-slate-900 mb-2">{app.jobTitle}</h3>
                          <div className="flex flex-wrap items-center gap-4 mb-4">
                            {app.company && (
                              <div className="flex items-center gap-2 text-slate-700 font-semibold">
                                <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                                {app.company}
                              </div>
                            )}
                            {app.location && (
                              <div className="flex items-center gap-2 text-slate-600">
                                <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                {app.location}
                              </div>
                            )}
                            <div className="flex items-center gap-2 text-slate-500 text-sm">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              Applied {new Date(app.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                          
                          {/* Status Timeline */}
                          <div className="mb-4">
                            <div className="flex items-center gap-2 mb-2">
                              <span className={`inline-flex items-center gap-2 px-4 py-2 ${statusConfig.bg} ${statusConfig.text} rounded-full text-sm font-bold border-2 ${statusConfig.border}`}>
                                <div className={`w-2 h-2 bg-${statusConfig.color}-500 rounded-full ${app.status === 'INTERVIEW' ? 'animate-pulse' : ''}`}></div>
                                {statusConfig.label}
                              </span>
                              {app.matchingScore !== null && app.matchingScore !== undefined && (
                                <span className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-semibold">
                                  {app.matchingScore}% Match
                                </span>
                              )}
                            </div>
                            
                            {/* Status Flow Visualization */}
                            <div className="flex items-center gap-2 mt-3">
                              {['APPLIED', 'SHORTLISTED', 'INTERVIEW', 'SELECTED'].map((status, idx) => {
                                const statusOrder = ['APPLIED', 'SHORTLISTED', 'INTERVIEW', 'SELECTED'];
                                const currentStatusIdx = statusOrder.indexOf(app.status);
                                const isActive = currentStatusIdx >= idx;
                                const isCurrent = app.status === status;
                                const sConfig = STATUS_CONFIG[status] || STATUS_CONFIG.APPLIED;
                                return (
                                  <div key={status} className="flex items-center">
                                    <div className={`flex flex-col items-center ${isActive ? 'opacity-100' : 'opacity-30'}`}>
                                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                                        isCurrent 
                                          ? `${statusConfig.bg} ${statusConfig.text}` 
                                          : isActive 
                                            ? 'bg-green-500 text-white' 
                                            : 'bg-slate-200 text-slate-500'
                                      }`}>
                                        {idx + 1}
                                      </div>
                                      <div className="text-xs mt-1 text-slate-600 font-medium">{sConfig.label}</div>
                                    </div>
                                    {idx < 3 && (
                                      <div className={`w-12 h-1 mx-1 ${isActive ? 'bg-green-500' : 'bg-slate-200'}`}></div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>

                          {/* Interview Info */}
                          {app.interview && (
                            <div className="mt-4 p-4 bg-orange-50 border-2 border-orange-200 rounded-xl">
                              <div className="flex items-center gap-2 mb-2">
                                <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <span className="font-bold text-orange-900">Interview Scheduled</span>
                              </div>
                              <div className="text-sm text-orange-800">
                                <div>Date: {new Date(app.interview.scheduledAt).toLocaleString()}</div>
                                <div>Mode: {app.interview.mode}</div>
                                {app.interview.meetingLink && (
                                  <div>
                                    <a href={app.interview.meetingLink} target="_blank" rel="noopener noreferrer" className="text-orange-600 hover:underline">
                                      Join Meeting
                                    </a>
                                  </div>
                                )}
                              </div>
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
