import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';

export default function ResumeBuilderPage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [resume, setResume] = useState({
    summary: '',
    education: [],
    skills: [],
    experience: [],
    projects: [],
  });
  const [newSkill, setNewSkill] = useState('');
  const [newEducation, setNewEducation] = useState({ degree: '', field: '', institution: '', year: '' });
  const [newExperience, setNewExperience] = useState({ company: '', position: '', duration: '', description: '' });
  const [newProject, setNewProject] = useState({ name: '', description: '', tech: '' });

  // Helper to safely parse JSON
  const safeParse = (data) => {
    if (!data) return [];
    if (Array.isArray(data)) return data; // Already an array
    try {
      return JSON.parse(data);
    } catch (e) {
      console.error("Failed to parse JSON:", data);
      return [];
    }
  };

  useEffect(() => {
    // Try to load existing resume
    api.get('/resumes/me')
      .then(res => {
        const data = res.data;
        setResume({
          summary: data.summary || '',
          education: safeParse(data.education),
          skills: data.skills || [],
          experience: safeParse(data.experience),
          projects: safeParse(data.projects),
        });
      })
      .catch(() => {
        // Resume doesn't exist yet, that's okay
      });
  }, []);

  const addSkill = () => {
    if (newSkill.trim() && !resume.skills.includes(newSkill.trim())) {
      setResume(prev => ({ ...prev, skills: [...prev.skills, newSkill.trim()] }));
      setNewSkill('');
    }
  };

  const removeSkill = (skill) => {
    setResume(prev => ({ ...prev, skills: prev.skills.filter(s => s !== skill) }));
  };

  const addEducation = () => {
    if (newEducation.degree && newEducation.field && newEducation.institution) {
      setResume(prev => ({ ...prev, education: [...prev.education, { ...newEducation }] }));
      setNewEducation({ degree: '', field: '', institution: '', year: '' });
    }
  };

  const removeEducation = (index) => {
    setResume(prev => ({ ...prev, education: prev.education.filter((_, i) => i !== index) }));
  };

  const addExperience = () => {
    if (newExperience.company && newExperience.position) {
      setResume(prev => ({ ...prev, experience: [...prev.experience, { ...newExperience }] }));
      setNewExperience({ company: '', position: '', duration: '', description: '' });
    }
  };

  const removeExperience = (index) => {
    setResume(prev => ({ ...prev, experience: prev.experience.filter((_, i) => i !== index) }));
  };

  const addProject = () => {
    if (newProject.name && newProject.description) {
      setResume(prev => ({ ...prev, projects: [...prev.projects, { ...newProject }] }));
      setNewProject({ name: '', description: '', tech: '' });
    }
  };

  const removeProject = (index) => {
    setResume(prev => ({ ...prev, projects: prev.projects.filter((_, i) => i !== index) }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // Since we updated the backend to use @JdbcTypeCode(SqlTypes.JSON),
      // Hibernate expects JSON objects, not strings.
      // However, the DTO still has String fields for JSON.
      // Let's try sending the objects directly if the backend accepts it,
      // OR send stringified JSON if the DTO requires strings.
      
      // Based on the error "column education is of type jsonb but expression is of type character varying",
      // it seems Hibernate is trying to insert a String into a JSONB column.
      // The @JdbcTypeCode(SqlTypes.JSON) annotation should fix this by telling Hibernate to convert the String to JSON.
      
      // So we should still send JSON strings from the frontend because the DTO has String fields.
      
      await api.post('/resumes', {
        summary: resume.summary,
        education: JSON.stringify(resume.education),
        skills: resume.skills,
        experience: JSON.stringify(resume.experience),
        projects: JSON.stringify(resume.projects),
      });
      alert('✅ Resume saved successfully!');
      navigate('/profile');
    } catch (err) {
      console.error(err);
      alert('Failed to save resume: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { number: 1, title: 'Summary', icon: '📝' },
    { number: 2, title: 'Education', icon: '🎓' },
    { number: 3, title: 'Skills', icon: '💼' },
    { number: 4, title: 'Experience', icon: '💻' },
    { number: 5, title: 'Projects', icon: '🚀' },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl shadow-2xl p-10 mb-8 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-20"></div>
        <div className="relative">
          <h1 className="text-4xl font-extrabold mb-2">Resume Builder</h1>
          <p className="text-blue-100 text-lg">Create a professional resume step by step</p>
        </div>
      </div>

      {/* Stepper */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-slate-100">
        <div className="flex items-center justify-between">
          {steps.map((step, idx) => (
            <div key={step.number} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold transition-all ${
                  currentStep === step.number 
                    ? 'bg-blue-600 text-white shadow-lg scale-110' 
                    : currentStep > step.number 
                      ? 'bg-green-500 text-white' 
                      : 'bg-slate-200 text-slate-500'
                }`}>
                  {currentStep > step.number ? '✓' : step.number}
                </div>
                <div className={`mt-2 text-sm font-semibold ${currentStep >= step.number ? 'text-slate-900' : 'text-slate-400'}`}>
                  {step.title}
                </div>
              </div>
              {idx < steps.length - 1 && (
                <div className={`flex-1 h-1 mx-2 ${currentStep > step.number ? 'bg-green-500' : 'bg-slate-200'}`}></div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Form Content */}
      <div className="bg-white rounded-3xl shadow-xl p-10 border border-slate-100">
        {/* Step 1: Summary */}
        {currentStep === 1 && (
          <div>
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Professional Summary</h2>
            <textarea
              value={resume.summary}
              onChange={(e) => setResume(prev => ({ ...prev, summary: e.target.value }))}
              placeholder="Write a brief summary about yourself, your career goals, and what makes you unique..."
              className="w-full px-5 py-4 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all text-lg"
              rows={8}
            />
          </div>
        )}

        {/* Step 2: Education */}
        {currentStep === 2 && (
          <div>
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Education</h2>
            <div className="space-y-4 mb-6">
              {resume.education.map((edu, idx) => (
                <div key={idx} className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="font-bold text-slate-900">{edu.degree} in {edu.field}</div>
                      <div className="text-slate-600">{edu.institution}</div>
                      {edu.year && <div className="text-sm text-slate-500">Year: {edu.year}</div>}
                    </div>
                    <button
                      onClick={() => removeEducation(idx)}
                      className="text-red-600 hover:text-red-700"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <input
                type="text"
                placeholder="Degree (e.g., Bachelor of Science)"
                value={newEducation.degree}
                onChange={(e) => setNewEducation(prev => ({ ...prev, degree: e.target.value }))}
                className="px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-500"
              />
              <input
                type="text"
                placeholder="Field of Study"
                value={newEducation.field}
                onChange={(e) => setNewEducation(prev => ({ ...prev, field: e.target.value }))}
                className="px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-500"
              />
              <input
                type="text"
                placeholder="Institution Name"
                value={newEducation.institution}
                onChange={(e) => setNewEducation(prev => ({ ...prev, institution: e.target.value }))}
                className="px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-500"
              />
              <input
                type="text"
                placeholder="Year (e.g., 2024)"
                value={newEducation.year}
                onChange={(e) => setNewEducation(prev => ({ ...prev, year: e.target.value }))}
                className="px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-500"
              />
            </div>
            <button
              onClick={addEducation}
              className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700"
            >
              + Add Education
            </button>
          </div>
        )}

        {/* Step 3: Skills */}
        {currentStep === 3 && (
          <div>
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Skills</h2>
            <div className="flex flex-wrap gap-2 mb-6">
              {resume.skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="px-4 py-2 bg-blue-50 text-blue-700 rounded-full font-semibold flex items-center gap-2"
                >
                  {skill}
                  <button onClick={() => removeSkill(skill)} className="text-blue-500 hover:text-blue-700">✕</button>
                </span>
              ))}
            </div>
            <div className="flex gap-4">
              <input
                type="text"
                placeholder="Add a skill (e.g., Java, React, Python)"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                className="flex-1 px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-500"
              />
              <button
                onClick={addSkill}
                className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700"
              >
                Add Skill
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Experience */}
        {currentStep === 4 && (
          <div>
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Work Experience</h2>
            <div className="space-y-4 mb-6">
              {resume.experience.map((exp, idx) => (
                <div key={idx} className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="font-bold text-slate-900">{exp.position}</div>
                      <div className="text-slate-600">{exp.company}</div>
                      {exp.duration && <div className="text-sm text-slate-500">{exp.duration}</div>}
                      {exp.description && <div className="mt-2 text-slate-700">{exp.description}</div>}
                    </div>
                    <button
                      onClick={() => removeExperience(idx)}
                      className="text-red-600 hover:text-red-700"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="space-y-4 mb-4">
              <div className="grid md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Company Name"
                  value={newExperience.company}
                  onChange={(e) => setNewExperience(prev => ({ ...prev, company: e.target.value }))}
                  className="px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-500"
                />
                <input
                  type="text"
                  placeholder="Position/Title"
                  value={newExperience.position}
                  onChange={(e) => setNewExperience(prev => ({ ...prev, position: e.target.value }))}
                  className="px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-500"
                />
              </div>
              <input
                type="text"
                placeholder="Duration (e.g., Jan 2023 - Present)"
                value={newExperience.duration}
                onChange={(e) => setNewExperience(prev => ({ ...prev, duration: e.target.value }))}
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-500"
              />
              <textarea
                placeholder="Description of your role and achievements..."
                value={newExperience.description}
                onChange={(e) => setNewExperience(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-500"
                rows={3}
              />
            </div>
            <button
              onClick={addExperience}
              className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700"
            >
              + Add Experience
            </button>
          </div>
        )}

        {/* Step 5: Projects */}
        {currentStep === 5 && (
          <div>
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Projects</h2>
            <div className="space-y-4 mb-6">
              {resume.projects.map((proj, idx) => (
                <div key={idx} className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="font-bold text-slate-900">{proj.name}</div>
                      <div className="text-slate-700 mt-1">{proj.description}</div>
                      {proj.tech && <div className="text-sm text-slate-500 mt-1">Tech: {proj.tech}</div>}
                    </div>
                    <button
                      onClick={() => removeProject(idx)}
                      className="text-red-600 hover:text-red-700"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="space-y-4 mb-4">
              <input
                type="text"
                placeholder="Project Name"
                value={newProject.name}
                onChange={(e) => setNewProject(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-500"
              />
              <textarea
                placeholder="Project Description"
                value={newProject.description}
                onChange={(e) => setNewProject(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-500"
                rows={3}
              />
              <input
                type="text"
                placeholder="Technologies Used (e.g., React, Node.js, MongoDB)"
                value={newProject.tech}
                onChange={(e) => setNewProject(prev => ({ ...prev, tech: e.target.value }))}
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-500"
              />
            </div>
            <button
              onClick={addProject}
              className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700"
            >
              + Add Project
            </button>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8 pt-6 border-t border-slate-200">
          <button
            onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
            disabled={currentStep === 1}
            className="px-8 py-4 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          {currentStep < steps.length ? (
            <button
              onClick={() => setCurrentStep(currentStep + 1)}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl hover:shadow-xl"
            >
              Next Step
            </button>
          ) : (
            <button
              onClick={handleSave}
              disabled={loading}
              className="px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold rounded-xl hover:shadow-xl disabled:opacity-60"
            >
              {loading ? 'Saving...' : 'Save Resume'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
