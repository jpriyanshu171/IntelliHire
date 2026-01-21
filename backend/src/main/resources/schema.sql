-- Users table
CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    role VARCHAR(50) NOT NULL,
    phone VARCHAR(20),
    bio TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Jobs table
CREATE TABLE IF NOT EXISTS jobs (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    location VARCHAR(255),
    company VARCHAR(255),
    status VARCHAR(50) DEFAULT 'DRAFT',
    salary_min DECIMAL(10, 2),
    salary_max DECIMAL(10, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    recruiter_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE
);

-- Safe migrations for jobs table (PostgreSQL 9.6+)
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'DRAFT';
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS salary_min DECIMAL(10, 2);
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS salary_max DECIMAL(10, 2);
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

-- Job required skills
CREATE TABLE IF NOT EXISTS job_required_skills (
    job_id BIGINT NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    skill VARCHAR(255) NOT NULL,
    PRIMARY KEY (job_id, skill)
);

-- Resumes table
CREATE TABLE IF NOT EXISTS resumes (
    id BIGSERIAL PRIMARY KEY,
    student_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    file_path VARCHAR(500),
    file_name VARCHAR(255),
    education JSONB,
    experience JSONB,
    projects JSONB,
    summary TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_resumes_student UNIQUE (student_id)
);

-- Resume skills
CREATE TABLE IF NOT EXISTS resume_skills (
    resume_id BIGINT NOT NULL REFERENCES resumes(id) ON DELETE CASCADE,
    skill VARCHAR(255) NOT NULL,
    PRIMARY KEY (resume_id, skill)
);

-- Applications table
CREATE TABLE IF NOT EXISTS applications (
    id BIGSERIAL PRIMARY KEY,
    cover_letter TEXT,
    status VARCHAR(50) DEFAULT 'APPLIED',
    matching_score INTEGER DEFAULT 0,
    recruiter_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    student_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    job_id BIGINT NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    CONSTRAINT uq_applications_student_job UNIQUE (student_id, job_id)
);

-- Safe migrations for applications table
ALTER TABLE applications ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'APPLIED';
ALTER TABLE applications ADD COLUMN IF NOT EXISTS matching_score INTEGER DEFAULT 0;
ALTER TABLE applications ADD COLUMN IF NOT EXISTS recruiter_notes TEXT;
ALTER TABLE applications ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

-- Interviews table
CREATE TABLE IF NOT EXISTS interviews (
    id BIGSERIAL PRIMARY KEY,
    application_id BIGINT NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
    scheduled_at TIMESTAMP NOT NULL,
    mode VARCHAR(50) NOT NULL,
    location VARCHAR(255),
    meeting_link VARCHAR(500),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_jobs_recruiter ON jobs(recruiter_id);
CREATE INDEX IF NOT EXISTS idx_jobs_status ON jobs(status);
CREATE INDEX IF NOT EXISTS idx_applications_student ON applications(student_id);
CREATE INDEX IF NOT EXISTS idx_applications_job ON applications(job_id);
CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status);
CREATE INDEX IF NOT EXISTS idx_resumes_student ON resumes(student_id);
CREATE INDEX IF NOT EXISTS idx_interviews_application ON interviews(application_id);
