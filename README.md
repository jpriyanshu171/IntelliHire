# IntelliHire – AI-Driven Recruitment & Career Platform

A comprehensive full-stack job portal application built with Spring Boot and React, featuring AI-powered skill matching, resume management, and complete application lifecycle tracking.

## 🎯 Project Overview

IntelliHire is a final-year engineering project that connects talented students with recruiters through an intelligent, AI-driven matching system. The platform provides separate dashboards for students and recruiters, enabling seamless job application management and hiring processes.

## 🏗️ Architecture

### System Architecture

```
┌─────────────────┐
│   React Frontend │
│   (Port 5173)   │
└────────┬─────────┘
         │ HTTP/REST API
         │ JWT Authentication
         ▼
┌─────────────────┐
│  Spring Boot    │
│  Backend API    │
│  (Port 8080)    │
└────────┬─────────┘
         │
         ▼
┌─────────────────┐
│   PostgreSQL    │
│   Database      │
│  (Port 5432)    │
└─────────────────┘
```

### Technology Stack

**Backend:**
- Spring Boot 3.2.5
- Spring Security (JWT Authentication)
- Spring Data JPA
- PostgreSQL Database
- Java 17
- Maven

**Frontend:**
- React 19.2.0
- React Router DOM 7.1.5
- Tailwind CSS 3.4.19
- Axios 1.7.9
- Vite 7.2.4

## 📊 Database Schema

### Core Tables

#### Users
- **id** (BIGSERIAL PRIMARY KEY)
- **email** (VARCHAR, UNIQUE, NOT NULL)
- **password** (VARCHAR, NOT NULL) - BCrypt hashed
- **full_name** (VARCHAR)
- **role** (ENUM: STUDENT, RECRUITER)
- **phone** (VARCHAR)
- **bio** (TEXT)
- **created_at** (TIMESTAMP)

#### Jobs
- **id** (BIGSERIAL PRIMARY KEY)
- **title** (VARCHAR, NOT NULL)
- **description** (TEXT, NOT NULL)
- **location** (VARCHAR)
- **company** (VARCHAR)
- **status** (ENUM: DRAFT, ACTIVE, CLOSED)
- **required_skills** (TEXT[]) - Array of skills
- **salary_min** (DECIMAL)
- **salary_max** (DECIMAL)
- **recruiter_id** (BIGINT, FK → users.id)
- **created_at** (TIMESTAMP)
- **updated_at** (TIMESTAMP)

#### Resumes
- **id** (BIGSERIAL PRIMARY KEY)
- **student_id** (BIGINT, FK → users.id, UNIQUE)
- **file_path** (VARCHAR) - PDF upload path
- **file_name** (VARCHAR)
- **summary** (TEXT)
- **education** (JSONB) - Array of education entries
- **skills** (TEXT[]) - Array of skills
- **experience** (JSONB) - Array of work experience
- **projects** (JSONB) - Array of projects
- **created_at** (TIMESTAMP)
- **updated_at** (TIMESTAMP)

#### Applications
- **id** (BIGSERIAL PRIMARY KEY)
- **student_id** (BIGINT, FK → users.id)
- **job_id** (BIGINT, FK → jobs.id)
- **cover_letter** (TEXT)
- **status** (ENUM: APPLIED, SHORTLISTED, INTERVIEW, SELECTED, REJECTED)
- **matching_score** (INTEGER) - 0-100 percentage
- **recruiter_notes** (TEXT)
- **created_at** (TIMESTAMP)
- **updated_at** (TIMESTAMP)
- **UNIQUE(student_id, job_id)**

#### Interviews
- **id** (BIGSERIAL PRIMARY KEY)
- **application_id** (BIGINT, FK → applications.id)
- **scheduled_at** (TIMESTAMP, NOT NULL)
- **mode** (ENUM: ONLINE, OFFLINE, HYBRID)
- **location** (VARCHAR) - For offline/hybrid
- **meeting_link** (VARCHAR) - For online/hybrid
- **notes** (TEXT)
- **created_at** (TIMESTAMP)
- **updated_at** (TIMESTAMP)

## 🔄 API Flow

### Authentication Flow
```
1. User registers/logs in → POST /api/auth/register or /api/auth/login
2. Backend validates credentials → Returns JWT token
3. Frontend stores token → localStorage
4. Subsequent requests → Include token in Authorization header
5. Backend validates token → Spring Security JWT filter
```

### Application Flow (Student)
```
1. Student creates resume → POST /api/resumes
2. Student browses jobs → GET /api/jobs (only ACTIVE jobs)
3. Student applies → POST /api/applications/jobs/{jobId}
   - System calculates matching score automatically
4. Student tracks status → GET /api/applications/me
5. If shortlisted → Status changes to SHORTLISTED
6. If interview scheduled → Status changes to INTERVIEW
7. Final decision → SELECTED or REJECTED
```

### Recruiter Flow
```
1. Recruiter creates job → POST /api/jobs (status: DRAFT)
2. Recruiter activates job → PUT /api/jobs/{id} (status: ACTIVE)
3. View applications → GET /api/applications/job/{jobId}
4. Review applicants → See matching scores and resumes
5. Update status → PUT /api/applications/{id}/status
6. Schedule interview → POST /api/interviews
7. Make final decision → SELECTED or REJECTED
```

## 🤖 AI Matching Algorithm

The skill matching algorithm calculates a compatibility score between a student's resume and a job's requirements:

```java
Matching Score = (Common Skills / Required Skills) × 100

Example:
- Job requires: [Java, Spring Boot, PostgreSQL, Docker, React]
- Student has: [Java, Spring Boot, PostgreSQL, Python]
- Common: [Java, Spring Boot, PostgreSQL] = 3 skills
- Required: 5 skills
- Score: (3/5) × 100 = 60%
```

**Features:**
- Case-insensitive matching
- Normalized skill comparison
- Score capped at 100%
- Default score of 50% if no skills specified

## 🚀 Getting Started

### Prerequisites
- Java 17+
- Maven 3.8+
- PostgreSQL 12+
- Node.js 18+
- npm or yarn

### Backend Setup

1. **Create PostgreSQL Database**
```sql
CREATE DATABASE intellihire;
```

2. **Update Database Credentials**
Edit `backend/src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/intellihire
spring.datasource.username=postgres
spring.datasource.password=your_password
```

3. **Run Backend**
```bash
cd backend
mvn spring-boot:run
```

Backend will start on `http://localhost:8080`

### Frontend Setup

1. **Install Dependencies**
```bash
cd frontend
npm install
```

2. **Start Development Server**
```bash
npm run dev
```

Frontend will start on `http://localhost:5173`

### Database Seeding

The application automatically seeds the database with:
- 10 recruiters
- 50 job postings (across different companies and statuses)
- 200 students (sample data)
- Realistic applications with matching scores

**Default Credentials:**
- All users have password: `password123`
- Recruiters: `recruiter1@techcorp.com` to `recruiter10@media.com`
- Students: `student1@university.edu` to `student200@university.edu`

## 📁 Project Structure

```
IntelliHire/
├── backend/
│   ├── src/
│   │   └── main/
│   │       ├── java/com/intellihire/
│   │       │   ├── config/          # Security configuration
│   │       │   ├── controller/      # REST controllers
│   │       │   ├── dto/             # Data Transfer Objects
│   │       │   ├── entity/          # JPA entities
│   │       │   ├── repository/      # Data repositories
│   │       │   ├── security/        # JWT and security
│   │       │   └── service/         # Business logic
│   │       └── resources/
│   │           ├── application.properties
│   │           ├── schema.sql       # Database schema
│   │           └── data.sql         # Seed data
│   └── pom.xml
│
└── frontend/
    ├── src/
    │   ├── components/             # Reusable components
    │   ├── context/                 # React context (Auth)
    │   ├── pages/                   # Page components
    │   ├── routes/                  # Route protection
    │   ├── services/                # API services
    │   └── App.jsx                  # Main app component
    └── package.json
```

## 🔐 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Role-Based Access Control**: Separate permissions for STUDENT and RECRUITER
- **Password Encryption**: BCrypt password hashing
- **CORS Configuration**: Configured for frontend-backend communication
- **Input Validation**: Jakarta Validation annotations

## ✨ Key Features

### Student Features
- ✅ Resume Builder (form-based with stepper UI)
- ✅ Resume PDF Upload
- ✅ Job Browsing (only active jobs)
- ✅ Application Tracking with Status Flow
- ✅ Matching Score Display
- ✅ Interview Schedule View
- ✅ Profile Management
- ✅ Dashboard with Statistics

### Recruiter Features
- ✅ Job Posting Management (Draft → Active → Closed)
- ✅ Applicant Management
- ✅ Resume Preview
- ✅ Application Status Updates
- ✅ Interview Scheduling (Online/Offline/Hybrid)
- ✅ Skill Matching Score View
- ✅ Dashboard with Analytics
- ✅ Recruiter Notes

## 📝 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Jobs
- `GET /api/jobs` - Get all active jobs (public)
- `GET /api/jobs/me` - Get recruiter's jobs (RECRUITER only)
- `GET /api/jobs/{id}` - Get job by ID
- `POST /api/jobs` - Create job (RECRUITER only)
- `PUT /api/jobs/{id}` - Update job (RECRUITER only)
- `DELETE /api/jobs/{id}` - Delete job (RECRUITER only)

### Applications
- `POST /api/applications/jobs/{jobId}` - Apply to job (STUDENT only)
- `GET /api/applications/me` - Get student's applications (STUDENT only)
- `GET /api/applications/job/{jobId}` - Get applications for job (RECRUITER only)
- `PUT /api/applications/{id}/status` - Update application status (RECRUITER only)

### Resumes
- `POST /api/resumes` - Create/update resume (STUDENT only)
- `POST /api/resumes/upload` - Upload resume PDF (STUDENT only)
- `GET /api/resumes/me` - Get student's resume (STUDENT only)
- `GET /api/resumes/student/{studentId}` - Get resume by student ID (RECRUITER only)

### Interviews
- `POST /api/interviews` - Schedule interview (RECRUITER only)
- `GET /api/interviews/application/{applicationId}` - Get interview by application
- `GET /api/interviews/me` - Get student's interviews (STUDENT only)

### Users
- `GET /api/users/me` - Get current user profile
- `PUT /api/users/me` - Update user profile

## 🎨 UI/UX Highlights

- **Modern SaaS Design**: Gradient backgrounds, smooth animations
- **Responsive Layout**: Mobile-first approach with Tailwind CSS
- **Status Badges**: Color-coded status indicators
- **Timeline Visualization**: Application status flow
- **Modal Dialogs**: Interview scheduling, applicant management
- **Stepper Forms**: Resume builder with step-by-step guidance
- **Real-time Updates**: Live statistics and status changes

## 🧪 Testing

### Manual Testing Checklist

**Student Flow:**
- [ ] Register as student
- [ ] Create resume via builder
- [ ] Upload resume PDF
- [ ] Browse and apply to jobs
- [ ] View application status
- [ ] View interview details

**Recruiter Flow:**
- [ ] Register as recruiter
- [ ] Create job posting (Draft)
- [ ] Activate job
- [ ] View applications
- [ ] Update application status
- [ ] Schedule interview
- [ ] View matching scores

## 📚 Documentation for Viva

### Architecture Decisions

1. **Layered Architecture**: Clear separation of concerns (Controller → Service → Repository)
2. **DTO Pattern**: Data Transfer Objects for API communication
3. **JWT Authentication**: Stateless authentication for scalability
4. **Enum Types**: Type-safe status management
5. **JSONB Storage**: Flexible resume data storage in PostgreSQL

### AI Matching Logic

The matching algorithm uses a simple but effective approach:
- Extracts skills from resume and job requirements
- Calculates intersection of common skills
- Normalizes to percentage score (0-100)
- Provides instant feedback to both students and recruiters

### Database Design

- **Normalized Schema**: Proper foreign key relationships
- **Enum Types**: PostgreSQL enums for type safety
- **Array Fields**: PostgreSQL arrays for skills
- **JSONB**: Flexible JSON storage for complex data
- **Indexes**: Optimized queries on frequently accessed fields

## 🐛 Known Limitations & Future Enhancements

### Current Limitations
- Resume PDF parsing not implemented (manual skill entry required)
- No email notifications
- No real-time chat
- Basic matching algorithm (can be enhanced with ML)

### Future Enhancements
- Advanced AI matching with ML models
- Resume PDF parsing and skill extraction
- Email notifications for status changes
- Real-time notifications
- Advanced analytics dashboard
- Multi-file resume upload
- Video interview integration

## 👥 Contributors

Final Year Engineering Project - IntelliHire Team

## 📄 License

This project is developed for educational purposes as part of a final year engineering project.

---

**Built with ❤️ for students and recruiters**
