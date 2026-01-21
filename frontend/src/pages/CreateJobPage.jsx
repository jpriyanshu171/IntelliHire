import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../services/api';

export default function CreateJobPage() {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditMode = !!id;

    const [form, setForm] = useState({
        title: '',
        company: '',
        location: '',
        description: '',
        salaryMin: '',
        salaryMax: '',
        requiredSkills: '',
        status: 'ACTIVE'
    });

    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(isEditMode);

    useEffect(() => {
        if (isEditMode) {
            api.get(`/jobs/${id}`)
                .then(res => {
                    const job = res.data;
                    setForm({
                        title: job.title || '',
                        company: job.company || '',
                        location: job.location || '',
                        description: job.description || '',
                        salaryMin: job.salaryMin || '',
                        salaryMax: job.salaryMax || '',
                        requiredSkills: job.requiredSkills ? job.requiredSkills.join(', ') : '',
                        status: job.status || 'ACTIVE'
                    });
                })
                .catch(err => {
                    console.error(err);
                    alert('Failed to load job details');
                    navigate('/recruiter/jobs');
                })
                .finally(() => setFetching(false));
        }
    }, [id, isEditMode, navigate]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Convert comma-separated skills to array
            const skillsArray = form.requiredSkills
                ? String(form.requiredSkills).split(',').map(skill => skill.trim()).filter(skill => skill.length > 0)
                : [];

            const payload = {
                ...form,
                requiredSkills: skillsArray,
                salaryMin: form.salaryMin ? parseFloat(form.salaryMin) : null,
                salaryMax: form.salaryMax ? parseFloat(form.salaryMax) : null
            };

            if (isEditMode) {
                await api.put(`/jobs/${id}`, payload);
                alert('✅ Job updated successfully!');
            } else {
                await api.post('/jobs', payload);
                alert('✅ Job posted successfully!');
            }
            navigate('/recruiter/jobs');
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || 'Failed to save job');
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto px-6 py-12">
            <h1 className="text-4xl font-extrabold mb-8">
                {isEditMode ? 'Edit Job Posting' : 'Post a New Job'}
            </h1>

            <form
                onSubmit={handleSubmit}
                className="bg-white p-8 rounded-2xl shadow-lg space-y-6"
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block font-semibold mb-2">Job Title</label>
                        <input
                            type="text"
                            name="title"
                            required
                            value={form.title}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                            placeholder="e.g. Software Engineer"
                        />
                    </div>

                    <div>
                        <label className="block font-semibold mb-2">Company</label>
                        <input
                            type="text"
                            name="company"
                            required
                            value={form.company}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                            placeholder="Company name"
                        />
                    </div>
                </div>

                <div>
                    <label className="block font-semibold mb-2">Location</label>
                    <input
                        type="text"
                        name="location"
                        required
                        value={form.location}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="Remote / City"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block font-semibold mb-2">Min Salary ($)</label>
                        <input
                            type="number"
                            name="salaryMin"
                            value={form.salaryMin}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                            placeholder="e.g. 80000"
                        />
                    </div>

                    <div>
                        <label className="block font-semibold mb-2">Max Salary ($)</label>
                        <input
                            type="number"
                            name="salaryMax"
                            value={form.salaryMax}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                            placeholder="e.g. 120000"
                        />
                    </div>
                </div>

                <div>
                    <label className="block font-semibold mb-2">Required Skills (comma separated)</label>
                    <input
                        type="text"
                        name="requiredSkills"
                        value={form.requiredSkills}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g. Java, React, SQL"
                    />
                </div>

                <div>
                    <label className="block font-semibold mb-2">Job Description</label>
                    <textarea
                        name="description"
                        required
                        rows="5"
                        value={form.description}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="Describe the role, requirements, etc."
                    />
                </div>

                <div>
                    <label className="block font-semibold mb-2">Status</label>
                    <select
                        name="status"
                        value={form.status}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="ACTIVE">Active (Visible to students)</option>
                        <option value="DRAFT">Draft (Hidden)</option>
                        <option value="CLOSED">Closed</option>
                    </select>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl hover:shadow-xl transition-all disabled:opacity-60"
                >
                    {loading ? 'Saving…' : (isEditMode ? 'Update Job' : 'Post Job')}
                </button>
            </form>
        </div>
    );
}
