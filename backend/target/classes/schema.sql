-- Create enums (only if they don't exist)
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('STUDENT', 'RECRUITER');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE application_status AS ENUM ('APPLIED', 'SHORTLISTED', 'INTERVIEW', 'SELECTED', 'REJECTED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE job_status AS ENUM ('DRAFT', 'ACTIVE', 'CLOSED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE interview_mode AS ENUM ('ONLINE', 'OFFLINE', 'HYBRID');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    role user_role NOT NULL,
    phone VARCHAR(20),
    bio TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Jobs table with status and skills
CREATE TABLE IF NOT EXISTS jobs (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    location VARCHAR(255),
    company VARCHAR(255),
    status job_status DEFAULT 'DRAFT',
    salary_min DECIMAL(10, 2),
    salary_max DECIMAL(10, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    recruiter_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE
);

-- Add missing columns to jobs table if they don't exist (for existing tables)
DO $$ 
BEGIN
    -- Check if table exists first
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name='jobs') THEN
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                       WHERE table_name='jobs' AND column_name='status') THEN
            ALTER TABLE jobs ADD COLUMN status job_status DEFAULT 'DRAFT';
        END IF;
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                       WHERE table_name='jobs' AND column_name='salary_min') THEN
            ALTER TABLE jobs ADD COLUMN salary_min DECIMAL(10, 2);
        END IF;
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                       WHERE table_name='jobs' AND column_name='salary_max') THEN
            ALTER TABLE jobs ADD COLUMN salary_max DECIMAL(10, 2);
        END IF;
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                       WHERE table_name='jobs' AND column_name='updated_at') THEN
            ALTER TABLE jobs ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
        END IF;
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        -- Ignore errors during migration
        NULL;
END $$;

-- Job required skills (separate table for @ElementCollection)
CREATE TABLE IF NOT EXISTS job_required_skills (
    job_id BIGINT NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    skill VARCHAR(255) NOT NULL,
    PRIMARY KEY (job_id, skill)
);

-- Resumes table
CREATE TABLE IF NOT EXISTS resumes (
    id BIGSERIAL PRIMARY KEY,
    student_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    file_path VARCHAR(500), -- Path to uploaded PDF
    file_name VARCHAR(255),
    education JSONB, -- Array of education entries
    experience JSONB, -- Array of work experience entries
    projects JSONB, -- Array of project entries
    summary TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_resumes_student UNIQUE (student_id)
);

-- Resume skills (separate table for @ElementCollection)
CREATE TABLE IF NOT EXISTS resume_skills (
    resume_id BIGINT NOT NULL REFERENCES resumes(id) ON DELETE CASCADE,
    skill VARCHAR(255) NOT NULL,
    PRIMARY KEY (resume_id, skill)
);

-- Applications table with status and matching score
CREATE TABLE IF NOT EXISTS applications (
    id BIGSERIAL PRIMARY KEY,
    cover_letter TEXT,
    status application_status DEFAULT 'APPLIED',
    matching_score INTEGER DEFAULT 0, -- 0-100 percentage
    recruiter_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    student_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    job_id BIGINT NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    CONSTRAINT uq_applications_student_job UNIQUE (student_id, job_id)
);

-- Add missing columns to applications table if they don't exist
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name='applications') THEN
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                       WHERE table_name='applications' AND column_name='status') THEN
            ALTER TABLE applications ADD COLUMN status application_status DEFAULT 'APPLIED';
        END IF;
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                       WHERE table_name='applications' AND column_name='matching_score') THEN
            ALTER TABLE applications ADD COLUMN matching_score INTEGER DEFAULT 0;
        END IF;
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                       WHERE table_name='applications' AND column_name='recruiter_notes') THEN
            ALTER TABLE applications ADD COLUMN recruiter_notes TEXT;
        END IF;
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                       WHERE table_name='applications' AND column_name='updated_at') THEN
            ALTER TABLE applications ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
        END IF;
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        -- Ignore errors during migration
        NULL;
END $$;

-- Interviews table
CREATE TABLE IF NOT EXISTS interviews (
    id BIGSERIAL PRIMARY KEY,
    application_id BIGINT NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
    scheduled_at TIMESTAMP NOT NULL,
    mode interview_mode NOT NULL,
    location VARCHAR(255), -- For offline/hybrid
    meeting_link VARCHAR(500), -- For online/hybrid
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for better query performance (only create if they don't exist and columns exist)
DO $$ 
BEGIN
    -- Jobs indexes
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name='jobs') THEN
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='jobs' AND column_name='recruiter_id') THEN
            IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname='idx_jobs_recruiter') THEN
                CREATE INDEX idx_jobs_recruiter ON jobs(recruiter_id);
            END IF;
        END IF;
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='jobs' AND column_name='status') THEN
            IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname='idx_jobs_status') THEN
                CREATE INDEX idx_jobs_status ON jobs(status);
            END IF;
        END IF;
    END IF;
    
    -- Applications indexes
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name='applications') THEN
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='applications' AND column_name='student_id') THEN
            IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname='idx_applications_student') THEN
                CREATE INDEX idx_applications_student ON applications(student_id);
            END IF;
        END IF;
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='applications' AND column_name='job_id') THEN
            IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname='idx_applications_job') THEN
                CREATE INDEX idx_applications_job ON applications(job_id);
            END IF;
        END IF;
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='applications' AND column_name='status') THEN
            IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname='idx_applications_status') THEN
                CREATE INDEX idx_applications_status ON applications(status);
            END IF;
        END IF;
    END IF;
    
    -- Resumes indexes
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name='resumes') THEN
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='resumes' AND column_name='student_id') THEN
            IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname='idx_resumes_student') THEN
                CREATE INDEX idx_resumes_student ON resumes(student_id);
            END IF;
        END IF;
    END IF;
    
    -- Interviews indexes
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name='interviews') THEN
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='interviews' AND column_name='application_id') THEN
            IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname='idx_interviews_application') THEN
                CREATE INDEX idx_interviews_application ON interviews(application_id);
            END IF;
        END IF;
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        -- Ignore errors during index creation
        NULL;
END $$;

