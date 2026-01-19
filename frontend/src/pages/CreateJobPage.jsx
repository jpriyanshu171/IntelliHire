import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';

export default function CreateJobPage() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        title: '',
        company: '',
        location: '',
        description: '',
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await api.post('/jobs', form);
            alert('✅ Job posted successfully!');
            navigate('/recruiter/jobs');
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to post job');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto px-6 py-12">
            <h1 className="text-4xl font-extrabold mb-8">Post a New Job</h1>

            <form
                onSubmit={handleSubmit}
                className="bg-white p-8 rounded-2xl shadow-lg space-y-6"
            >
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

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl hover:shadow-xl transition-all disabled:opacity-60"
                >
                    {loading ? 'Posting…' : 'Post Job'}
                </button>
            </form>
        </div>
    );
}
