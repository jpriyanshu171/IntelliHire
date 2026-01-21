import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';

export default function RecruiterJobsPage() {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api
            .get('/jobs/me') // recruiter-specific endpoint
            .then((res) => setJobs(res.data))
            .catch(() => setJobs([]))
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="max-w-7xl mx-auto px-6 py-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-10">
                <div>
                    <h1 className="text-4xl font-extrabold text-slate-900 mb-2">
                        Recruiter Dashboard
                    </h1>
                    <p className="text-slate-600 text-lg">
                        Manage your job postings and applicants
                    </p>
                </div>

                <Link
                    to="/recruiter/jobs/new"
                    className="mt-4 md:mt-0 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl hover:shadow-xl transition-all transform hover:scale-105"
                >
                    + Post New Job
                </Link>
            </div>

            {/* Content */}
            {loading ? (
                <div className="text-center py-20">
                    <div className="inline-block animate-spin rounded-full h-14 w-14 border-4 border-blue-600 border-t-transparent mb-4"></div>
                    <p className="text-lg text-slate-600">Loading your jobs…</p>
                </div>
            ) : jobs.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-lg p-16 text-center border border-slate-200">
                    <div className="text-7xl mb-6">📄</div>
                    <h2 className="text-2xl font-bold mb-3">No jobs posted yet</h2>
                    <p className="text-slate-600 mb-6">
                        Start hiring by posting your first job
                    </p>
                    <Link
                        to="/recruiter/jobs/new"
                        className="inline-block px-8 py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700"
                    >
                        Post Your First Job
                    </Link>
                </div>
            ) : (
                <div className="grid gap-6">
                    {jobs.map((job) => (
                        <div
                            key={job.id}
                            className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                        >
                            <div>
                                <div className="flex items-center gap-3 mb-1">
                                    <h3 className="text-xl font-bold text-slate-900">
                                        {job.title}
                                    </h3>
                                    <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                                        job.status === 'ACTIVE' ? 'bg-green-100 text-green-700' :
                                        job.status === 'DRAFT' ? 'bg-gray-100 text-gray-700' :
                                        'bg-red-100 text-red-700'
                                    }`}>
                                        {job.status}
                                    </span>
                                </div>
                                <p className="text-slate-600">
                                    {job.company} • {job.location}
                                </p>
                                <div className="flex items-center gap-4 mt-2 text-sm text-slate-500">
                                    <span>Posted {new Date(job.createdAt).toLocaleDateString()}</span>
                                    <span>•</span>
                                    <span className="font-semibold text-blue-600">{job.applicationCount || 0} Applicants</span>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <Link
                                    to={`/recruiter/jobs/${job.id}`}
                                    className="px-5 py-2 bg-slate-100 text-slate-700 font-semibold rounded-lg hover:bg-slate-200"
                                >
                                    Edit
                                </Link>
                                <Link
                                    to={`/recruiter/jobs/${job.id}/applications`}
                                    className="px-5 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700"
                                >
                                    View Applicants
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
