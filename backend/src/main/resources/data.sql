-- Database seed script for IntelliHire
-- Creates 10 recruiters, 30 jobs (2-3 per recruiter), 50 students, and realistic applications

-- Note: Passwords are hashed with BCrypt (password = "password123")
-- All users have password: password123
-- BCrypt hash: $2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy

-- Insert 10 Recruiters
INSERT INTO users (email, password, full_name, role, phone, bio, created_at) VALUES
('recruiter1@techcorp.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'John Smith', 'RECRUITER', '+1-555-0101', 'Senior HR Manager at TechCorp with 10+ years of experience in tech recruitment', NOW() - INTERVAL '30 days'),
('recruiter2@startup.io', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Sarah Johnson', 'RECRUITER', '+1-555-0102', 'Talent Acquisition Lead specializing in startup hiring', NOW() - INTERVAL '25 days'),
('recruiter3@bigtech.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Michael Chen', 'RECRUITER', '+1-555-0103', 'Recruitment Specialist focused on engineering roles', NOW() - INTERVAL '20 days'),
('recruiter4@finance.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Emily Rodriguez', 'RECRUITER', '+1-555-0104', 'HR Director with expertise in financial services recruitment', NOW() - INTERVAL '15 days'),
('recruiter5@consulting.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'David Lee', 'RECRUITER', '+1-555-0105', 'Senior Recruiter specializing in consulting and strategy roles', NOW() - INTERVAL '10 days'),
('recruiter6@healthcare.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Lisa Wang', 'RECRUITER', '+1-555-0106', 'Talent Manager for healthcare technology positions', NOW() - INTERVAL '8 days'),
('recruiter7@retail.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Robert Brown', 'RECRUITER', '+1-555-0107', 'HR Business Partner with retail and e-commerce experience', NOW() - INTERVAL '6 days'),
('recruiter8@education.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Jennifer Taylor', 'RECRUITER', '+1-555-0108', 'Recruitment Coordinator for EdTech companies', NOW() - INTERVAL '4 days'),
('recruiter9@manufacturing.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'James Wilson', 'RECRUITER', '+1-555-0109', 'Senior Talent Acquisition for industrial technology', NOW() - INTERVAL '2 days'),
('recruiter10@media.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Maria Garcia', 'RECRUITER', '+1-555-0110', 'HR Manager specializing in media and entertainment tech', NOW() - INTERVAL '1 day');

-- Insert 50 Students (Candidates)
INSERT INTO users (email, password, full_name, role, phone, bio, created_at) VALUES
('student1@university.edu', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Alex Thompson', 'STUDENT', '+1-555-1001', 'Computer Science student passionate about software development and open-source', NOW() - INTERVAL '60 days'),
('student2@university.edu', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Jessica Martinez', 'STUDENT', '+1-555-1002', 'Data Science major with ML expertise and research experience', NOW() - INTERVAL '58 days'),
('student3@university.edu', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Ryan Anderson', 'STUDENT', '+1-555-1003', 'Full-stack developer and open-source contributor', NOW() - INTERVAL '55 days'),
('student4@university.edu', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Sophia Chen', 'STUDENT', '+1-555-1004', 'Cybersecurity enthusiast and ethical hacker', NOW() - INTERVAL '52 days'),
('student5@university.edu', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Daniel Kim', 'STUDENT', '+1-555-1005', 'Mobile app developer specializing in React Native and Flutter', NOW() - INTERVAL '50 days'),
('student6@university.edu', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Emma Wilson', 'STUDENT', '+1-555-1006', 'Backend engineer with expertise in microservices and cloud', NOW() - INTERVAL '48 days'),
('student7@university.edu', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Lucas Brown', 'STUDENT', '+1-555-1007', 'Frontend developer passionate about UI/UX design', NOW() - INTERVAL '46 days'),
('student8@university.edu', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Olivia Davis', 'STUDENT', '+1-555-1008', 'DevOps engineer with Kubernetes and Docker experience', NOW() - INTERVAL '44 days'),
('student9@university.edu', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Noah Miller', 'STUDENT', '+1-555-1009', 'Machine Learning engineer with research publications', NOW() - INTERVAL '42 days'),
('student10@university.edu', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Ava Garcia', 'STUDENT', '+1-555-1010', 'Blockchain developer with DeFi and smart contract experience', NOW() - INTERVAL '40 days'),
('student11@university.edu', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Ethan Rodriguez', 'STUDENT', '+1-555-1011', 'Game developer with Unity and Unreal Engine skills', NOW() - INTERVAL '38 days'),
('student12@university.edu', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Isabella Lopez', 'STUDENT', '+1-555-1012', 'QA engineer with automation testing expertise', NOW() - INTERVAL '36 days'),
('student13@university.edu', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Mason Lee', 'STUDENT', '+1-555-1013', 'Cloud architect with AWS and Azure certifications', NOW() - INTERVAL '34 days'),
('student14@university.edu', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Charlotte White', 'STUDENT', '+1-555-1014', 'Database administrator with PostgreSQL and MongoDB', NOW() - INTERVAL '32 days'),
('student15@university.edu', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Logan Harris', 'STUDENT', '+1-555-1015', 'Security engineer with penetration testing skills', NOW() - INTERVAL '30 days'),
('student16@university.edu', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Amelia Clark', 'STUDENT', '+1-555-1016', 'Product manager with technical background', NOW() - INTERVAL '28 days'),
('student17@university.edu', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Benjamin Lewis', 'STUDENT', '+1-555-1017', 'API developer with REST and GraphQL experience', NOW() - INTERVAL '26 days'),
('student18@university.edu', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Harper Walker', 'STUDENT', '+1-555-1018', 'Data engineer with ETL and data pipeline expertise', NOW() - INTERVAL '24 days'),
('student19@university.edu', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Henry Hall', 'STUDENT', '+1-555-1019', 'Embedded systems engineer with IoT experience', NOW() - INTERVAL '22 days'),
('student20@university.edu', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Mia Allen', 'STUDENT', '+1-555-1020', 'Full-stack developer with MERN stack expertise', NOW() - INTERVAL '20 days'),
('student21@university.edu', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Alexander Young', 'STUDENT', '+1-555-1021', 'Python developer with Django and Flask experience', NOW() - INTERVAL '18 days'),
('student22@university.edu', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Ella King', 'STUDENT', '+1-555-1022', 'React developer with TypeScript and Redux', NOW() - INTERVAL '16 days'),
('student23@university.edu', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Sebastian Wright', 'STUDENT', '+1-555-1023', 'Java developer with Spring Boot and Hibernate', NOW() - INTERVAL '14 days'),
('student24@university.edu', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Scarlett Green', 'STUDENT', '+1-555-1024', 'Node.js developer with Express and MongoDB', NOW() - INTERVAL '12 days'),
('student25@university.edu', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Jack Adams', 'STUDENT', '+1-555-1025', 'C++ developer with systems programming experience', NOW() - INTERVAL '10 days'),
('student26@university.edu', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Lily Baker', 'STUDENT', '+1-555-1026', 'Vue.js developer with Nuxt.js framework', NOW() - INTERVAL '8 days'),
('student27@university.edu', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Owen Nelson', 'STUDENT', '+1-555-1027', 'Go developer with microservices architecture', NOW() - INTERVAL '6 days'),
('student28@university.edu', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Chloe Hill', 'STUDENT', '+1-555-1028', 'Ruby developer with Rails framework', NOW() - INTERVAL '4 days'),
('student29@university.edu', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Wyatt Campbell', 'STUDENT', '+1-555-1029', 'PHP developer with Laravel and Symfony', NOW() - INTERVAL '2 days'),
('student30@university.edu', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Grace Mitchell', 'STUDENT', '+1-555-1030', 'Swift developer for iOS applications', NOW() - INTERVAL '1 day'),
('student31@university.edu', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Lucas Roberts', 'STUDENT', '+1-555-1031', 'Kotlin developer for Android applications', NOW() - INTERVAL '59 days'),
('student32@university.edu', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Zoe Turner', 'STUDENT', '+1-555-1032', 'Angular developer with RxJS and NgRx', NOW() - INTERVAL '57 days'),
('student33@university.edu', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Aiden Phillips', 'STUDENT', '+1-555-1033', 'Rust developer with systems programming', NOW() - INTERVAL '55 days'),
('student34@university.edu', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Layla Parker', 'STUDENT', '+1-555-1034', 'Scala developer with functional programming', NOW() - INTERVAL '53 days'),
('student35@university.edu', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Carter Evans', 'STUDENT', '+1-555-1035', 'Elixir developer with Phoenix framework', NOW() - INTERVAL '51 days'),
('student36@university.edu', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Nora Collins', 'STUDENT', '+1-555-1036', 'Data analyst with SQL and Tableau', NOW() - INTERVAL '49 days'),
('student37@university.edu', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Julian Stewart', 'STUDENT', '+1-555-1037', 'Business intelligence developer', NOW() - INTERVAL '47 days'),
('student38@university.edu', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Riley Sanchez', 'STUDENT', '+1-555-1038', 'ETL developer with Informatica', NOW() - INTERVAL '45 days'),
('student39@university.edu', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Aria Morris', 'STUDENT', '+1-555-1039', 'Big Data engineer with Hadoop and Spark', NOW() - INTERVAL '43 days'),
('student40@university.edu', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Hudson Rogers', 'STUDENT', '+1-555-1040', 'Data scientist with R and Python', NOW() - INTERVAL '41 days'),
('student41@university.edu', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Aurora Reed', 'STUDENT', '+1-555-1041', 'ML engineer with TensorFlow and PyTorch', NOW() - INTERVAL '39 days'),
('student42@university.edu', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Eli Cook', 'STUDENT', '+1-555-1042', 'NLP engineer with transformer models', NOW() - INTERVAL '37 days'),
('student43@university.edu', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Natalie Morgan', 'STUDENT', '+1-555-1043', 'Computer vision engineer with OpenCV', NOW() - INTERVAL '35 days'),
('student44@university.edu', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Levi Bell', 'STUDENT', '+1-555-1044', 'Deep learning researcher', NOW() - INTERVAL '33 days'),
('student45@university.edu', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Violet Murphy', 'STUDENT', '+1-555-1045', 'AI engineer with reinforcement learning', NOW() - INTERVAL '31 days'),
('student46@university.edu', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Nathan Bailey', 'STUDENT', '+1-555-1046', 'SRE with monitoring and alerting', NOW() - INTERVAL '29 days'),
('student47@university.edu', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Savannah Rivera', 'STUDENT', '+1-555-1047', 'Infrastructure engineer with Terraform', NOW() - INTERVAL '27 days'),
('student48@university.edu', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Stella Cooper', 'STUDENT', '+1-555-1048', 'CI/CD engineer with Jenkins and GitLab', NOW() - INTERVAL '25 days'),
('student49@university.edu', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Hazel Richardson', 'STUDENT', '+1-555-1049', 'Site reliability engineer', NOW() - INTERVAL '23 days'),
('student50@university.edu', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Penelope Cox', 'STUDENT', '+1-555-1050', 'Platform engineer with Kubernetes', NOW() - INTERVAL '21 days');

-- Insert 30 Jobs (3 per recruiter) - ALL ACTIVE so students can see and apply
INSERT INTO jobs (title, description, location, company, status, salary_min, salary_max, recruiter_id, created_at, updated_at) VALUES
-- TechCorp Jobs (Recruiter 1) - 3 jobs
('Senior Software Engineer', 'We are looking for an experienced software engineer to join our team. You will work on cutting-edge projects using Java, Spring Boot, and microservices architecture. Experience with cloud platforms and containerization preferred.', 'San Francisco, CA', 'TechCorp', 'ACTIVE', 120000, 180000, 1, NOW() - INTERVAL '20 days', NOW() - INTERVAL '20 days'),
('Frontend Developer', 'Join our frontend team to build beautiful and responsive web applications. Experience with React, TypeScript, and modern CSS frameworks required. Knowledge of state management and testing frameworks is a plus.', 'Remote', 'TechCorp', 'ACTIVE', 90000, 140000, 1, NOW() - INTERVAL '18 days', NOW() - INTERVAL '18 days'),
('DevOps Engineer', 'We need a DevOps engineer to manage our cloud infrastructure and CI/CD pipelines. AWS, Kubernetes, and Terraform experience preferred. You will work on automating deployments and improving system reliability.', 'New York, NY', 'TechCorp', 'ACTIVE', 110000, 170000, 1, NOW() - INTERVAL '15 days', NOW() - INTERVAL '15 days'),

-- Startup.io Jobs (Recruiter 2) - 3 jobs
('Full Stack Developer', 'Early-stage startup looking for a full-stack developer. You will work on both frontend and backend, so versatility is key. React, Node.js, and PostgreSQL experience required.', 'Remote', 'Startup.io', 'ACTIVE', 80000, 120000, 2, NOW() - INTERVAL '16 days', NOW() - INTERVAL '16 days'),
('Product Manager', 'We need a product manager to drive our product roadmap and work closely with engineering and design teams. Technical background and agile experience preferred.', 'San Francisco, CA', 'Startup.io', 'ACTIVE', 100000, 150000, 2, NOW() - INTERVAL '14 days', NOW() - INTERVAL '14 days'),
('Mobile Developer', 'Looking for a mobile developer to build iOS and Android apps. React Native or Flutter experience preferred. Published apps in app stores is a plus.', 'Los Angeles, CA', 'Startup.io', 'ACTIVE', 90000, 140000, 2, NOW() - INTERVAL '8 days', NOW() - INTERVAL '8 days'),

-- BigTech Jobs (Recruiter 3) - 3 jobs
('Cloud Architect', 'Senior cloud architect position to design and implement scalable cloud solutions. AWS, Azure, or GCP certification preferred. Experience with multi-cloud architectures is a plus.', 'Seattle, WA', 'BigTech', 'ACTIVE', 140000, 200000, 3, NOW() - INTERVAL '22 days', NOW() - INTERVAL '22 days'),
('Security Engineer', 'Cybersecurity engineer to protect our systems and data. Experience with security tools and penetration testing required. CISSP or similar certification preferred.', 'San Francisco, CA', 'BigTech', 'ACTIVE', 130000, 190000, 3, NOW() - INTERVAL '19 days', NOW() - INTERVAL '19 days'),
('Machine Learning Engineer', 'ML engineer to develop and deploy machine learning models at scale. TensorFlow, PyTorch, and MLOps experience required. Experience with production ML systems preferred.', 'Mountain View, CA', 'BigTech', 'ACTIVE', 135000, 195000, 3, NOW() - INTERVAL '17 days', NOW() - INTERVAL '17 days'),

-- Finance.com Jobs (Recruiter 4) - 3 jobs
('Financial Software Developer', 'Develop trading platforms and financial software. C++, Java, and financial markets knowledge preferred. Experience with low-latency systems is a plus.', 'New York, NY', 'Finance.com', 'ACTIVE', 130000, 200000, 4, NOW() - INTERVAL '21 days', NOW() - INTERVAL '21 days'),
('Quantitative Analyst', 'Quant analyst to develop trading strategies and risk models. Strong math, statistics, and programming skills required. Python or R experience essential.', 'New York, NY', 'Finance.com', 'ACTIVE', 120000, 180000, 4, NOW() - INTERVAL '17 days', NOW() - INTERVAL '17 days'),
('Blockchain Developer', 'Blockchain developer to work on cryptocurrency and DeFi projects. Solidity, Ethereum, and smart contracts experience required. Knowledge of DeFi protocols preferred.', 'Remote', 'Finance.com', 'ACTIVE', 110000, 170000, 4, NOW() - INTERVAL '11 days', NOW() - INTERVAL '11 days'),

-- Consulting.com Jobs (Recruiter 5) - 3 jobs
('IT Consultant', 'IT consultant to help clients with digital transformation. Strong communication and problem-solving skills required. Experience with enterprise systems preferred.', 'Multiple Locations', 'Consulting.com', 'ACTIVE', 100000, 160000, 5, NOW() - INTERVAL '20 days', NOW() - INTERVAL '20 days'),
('Business Analyst', 'Business analyst to gather requirements and analyze business processes. SQL, Excel, and documentation skills required. Experience with agile methodologies preferred.', 'Remote', 'Consulting.com', 'ACTIVE', 85000, 130000, 5, NOW() - INTERVAL '16 days', NOW() - INTERVAL '16 days'),
('Project Manager', 'Project manager to lead IT projects and coordinate teams. PMP certification and Agile experience preferred. Experience managing cross-functional teams essential.', 'Chicago, IL', 'Consulting.com', 'ACTIVE', 105000, 155000, 5, NOW() - INTERVAL '12 days', NOW() - INTERVAL '12 days'),

-- Healthcare.com Jobs (Recruiter 6) - 3 jobs
('Healthcare Software Developer', 'Develop healthcare applications and EHR systems. HIPAA compliance knowledge required. Experience with HL7 and FHIR standards preferred.', 'Boston, MA', 'Healthcare.com', 'ACTIVE', 110000, 170000, 6, NOW() - INTERVAL '19 days', NOW() - INTERVAL '19 days'),
('Health Data Analyst', 'Analyze healthcare data and improve patient outcomes. SQL and statistical analysis skills required. Experience with healthcare datasets preferred.', 'Remote', 'Healthcare.com', 'ACTIVE', 90000, 140000, 6, NOW() - INTERVAL '15 days', NOW() - INTERVAL '15 days'),
('Telemedicine Developer', 'Build telemedicine platforms and video consultation systems. WebRTC and video streaming experience preferred. Healthcare domain knowledge is a plus.', 'Remote', 'Healthcare.com', 'ACTIVE', 100000, 160000, 6, NOW() - INTERVAL '11 days', NOW() - INTERVAL '11 days'),

-- Retail.com Jobs (Recruiter 7) - 3 jobs
('E-Commerce Developer', 'Develop and maintain e-commerce platforms. Experience with Shopify, Magento, or custom solutions required. Payment gateway integration knowledge preferred.', 'Remote', 'Retail.com', 'ACTIVE', 95000, 145000, 7, NOW() - INTERVAL '18 days', NOW() - INTERVAL '18 days'),
('Supply Chain Analyst', 'Optimize supply chain operations using data analytics. SQL and Excel skills required. Experience with supply chain management systems preferred.', 'Atlanta, GA', 'Retail.com', 'ACTIVE', 85000, 130000, 7, NOW() - INTERVAL '14 days', NOW() - INTERVAL '14 days'),
('Digital Marketing Analyst', 'Analyze digital marketing campaigns and customer behavior. Google Analytics and SQL skills required. Experience with marketing automation tools preferred.', 'Remote', 'Retail.com', 'ACTIVE', 75000, 115000, 7, NOW() - INTERVAL '6 days', NOW() - INTERVAL '6 days'),

-- Education.com Jobs (Recruiter 8) - 3 jobs
('EdTech Developer', 'Develop educational software and learning management systems. Experience with LMS platforms preferred. Understanding of pedagogy is a plus.', 'Remote', 'Education.com', 'ACTIVE', 90000, 140000, 8, NOW() - INTERVAL '17 days', NOW() - INTERVAL '17 days'),
('Learning Analytics Specialist', 'Analyze learning data to improve educational outcomes. SQL and data visualization skills required. Experience with educational research preferred.', 'Remote', 'Education.com', 'ACTIVE', 85000, 130000, 8, NOW() - INTERVAL '13 days', NOW() - INTERVAL '13 days'),
('Student Information Systems Developer', 'Develop and maintain student information systems. Database and web development skills required. Experience with SIS platforms preferred.', 'Remote', 'Education.com', 'ACTIVE', 95000, 145000, 8, NOW() - INTERVAL '9 days', NOW() - INTERVAL '9 days'),

-- Manufacturing.com Jobs (Recruiter 9) - 3 jobs
('Industrial IoT Developer', 'Develop IoT solutions for manufacturing. Embedded systems and sensor integration experience required. Knowledge of industrial protocols preferred.', 'Detroit, MI', 'Manufacturing.com', 'ACTIVE', 105000, 160000, 9, NOW() - INTERVAL '16 days', NOW() - INTERVAL '16 days'),
('Manufacturing Systems Analyst', 'Analyze manufacturing processes and optimize operations. SQL and data analysis skills required. Experience with MES systems preferred.', 'Cleveland, OH', 'Manufacturing.com', 'ACTIVE', 90000, 140000, 9, NOW() - INTERVAL '12 days', NOW() - INTERVAL '12 days'),
('Robotics Software Engineer', 'Develop software for industrial robots and automation systems. C++ and robotics frameworks experience required. ROS knowledge preferred.', 'Pittsburgh, PA', 'Manufacturing.com', 'ACTIVE', 110000, 170000, 9, NOW() - INTERVAL '8 days', NOW() - INTERVAL '8 days'),

-- Media.com Jobs (Recruiter 10) - 3 jobs
('Streaming Platform Developer', 'Develop video streaming platforms and content delivery systems. Video encoding and CDN experience preferred. Knowledge of streaming protocols essential.', 'Los Angeles, CA', 'Media.com', 'ACTIVE', 110000, 170000, 10, NOW() - INTERVAL '15 days', NOW() - INTERVAL '15 days'),
('Content Management System Developer', 'Build CMS for media companies. Experience with headless CMS preferred. Knowledge of content workflows essential.', 'New York, NY', 'Media.com', 'ACTIVE', 95000, 145000, 10, NOW() - INTERVAL '11 days', NOW() - INTERVAL '11 days'),
('Media Analytics Engineer', 'Analyze viewer behavior and content performance. SQL and data visualization skills required. Experience with media analytics tools preferred.', 'Remote', 'Media.com', 'ACTIVE', 100000, 150000, 10, NOW() - INTERVAL '7 days', NOW() - INTERVAL '7 days');

-- Insert Job Required Skills (3-5 skills per job)
INSERT INTO job_required_skills (job_id, skill) VALUES
-- TechCorp Jobs (1-3)
(1, 'Java'), (1, 'Spring Boot'), (1, 'Microservices'), (1, 'PostgreSQL'), (1, 'Docker'),
(2, 'React'), (2, 'TypeScript'), (2, 'CSS'), (2, 'JavaScript'), (2, 'Redux'),
(3, 'AWS'), (3, 'Kubernetes'), (3, 'Terraform'), (3, 'Docker'), (3, 'CI/CD'),
-- Startup.io Jobs (4-6)
(4, 'React'), (4, 'Node.js'), (4, 'PostgreSQL'), (4, 'Full Stack'), (4, 'JavaScript'),
(5, 'Product Management'), (5, 'Agile'), (5, 'Scrum'), (5, 'Roadmap'), (5, 'Stakeholder Management'),
(6, 'React Native'), (6, 'Flutter'), (6, 'Mobile Development'), (6, 'iOS'), (6, 'Android'),
-- BigTech Jobs (7-9)
(7, 'AWS'), (7, 'Azure'), (7, 'GCP'), (7, 'Cloud Architecture'), (7, 'Terraform'),
(8, 'Cybersecurity'), (8, 'Penetration Testing'), (8, 'Security'), (8, 'CISSP'), (8, 'Network Security'),
(9, 'TensorFlow'), (9, 'PyTorch'), (9, 'MLOps'), (9, 'Machine Learning'), (9, 'Python'),
-- Finance.com Jobs (10-12)
(10, 'C++'), (10, 'Java'), (10, 'Financial Markets'), (10, 'Trading Systems'), (10, 'Low Latency'),
(11, 'Python'), (11, 'R'), (11, 'Quantitative Analysis'), (11, 'Statistics'), (11, 'Risk Modeling'),
(12, 'Solidity'), (12, 'Ethereum'), (12, 'Blockchain'), (12, 'Smart Contracts'), (12, 'DeFi'),
-- Consulting.com Jobs (13-15)
(13, 'IT Consulting'), (13, 'Digital Transformation'), (13, 'Enterprise Systems'), (13, 'Communication'), (13, 'Problem Solving'),
(14, 'Business Analysis'), (14, 'SQL'), (14, 'Excel'), (14, 'Requirements Gathering'), (14, 'Documentation'),
(15, 'Project Management'), (15, 'PMP'), (15, 'Agile'), (15, 'Scrum'), (15, 'Team Leadership'),
-- Healthcare.com Jobs (16-18)
(16, 'Healthcare'), (16, 'HIPAA'), (16, 'HL7'), (16, 'FHIR'), (16, 'EHR'),
(17, 'SQL'), (17, 'Data Analysis'), (17, 'Healthcare Data'), (17, 'Statistics'), (17, 'Patient Outcomes'),
(18, 'WebRTC'), (18, 'Video Streaming'), (18, 'Telemedicine'), (18, 'Healthcare'), (18, 'Video Consultation'),
-- Retail.com Jobs (19-21)
(19, 'E-Commerce'), (19, 'Shopify'), (19, 'Magento'), (19, 'Payment Gateway'), (19, 'Online Retail'),
(20, 'SQL'), (20, 'Supply Chain'), (20, 'Data Analytics'), (20, 'Optimization'), (20, 'Logistics'),
(21, 'Digital Marketing'), (21, 'Google Analytics'), (21, 'Marketing Analytics'), (21, 'SQL'), (21, 'Customer Behavior'),
-- Education.com Jobs (22-24)
(22, 'EdTech'), (22, 'LMS'), (22, 'Educational Software'), (22, 'Learning Platforms'), (22, 'Pedagogy'),
(23, 'Learning Analytics'), (23, 'SQL'), (23, 'Data Visualization'), (23, 'Educational Research'), (23, 'Student Outcomes'),
(24, 'Student Information Systems'), (24, 'SIS'), (24, 'Database'), (24, 'Web Development'), (24, 'Student Data'),
-- Manufacturing.com Jobs (25-27)
(25, 'IoT'), (25, 'Embedded Systems'), (25, 'Sensors'), (25, 'Industrial Protocols'), (25, 'Manufacturing'),
(26, 'Manufacturing Systems'), (26, 'MES'), (26, 'SQL'), (26, 'Process Optimization'), (26, 'Data Analysis'),
(27, 'Robotics'), (27, 'C++'), (27, 'ROS'), (27, 'Automation'), (27, 'Industrial Robots'),
-- Media.com Jobs (28-30)
(28, 'Video Streaming'), (28, 'CDN'), (28, 'Video Encoding'), (28, 'Streaming Protocols'), (28, 'Content Delivery'),
(29, 'CMS'), (29, 'Headless CMS'), (29, 'Content Management'), (29, 'Content Workflows'), (29, 'Media'),
(30, 'Media Analytics'), (30, 'SQL'), (30, 'Data Visualization'), (30, 'Viewer Analytics'), (30, 'Content Performance');

-- Insert Resumes for Students (10 resumes with realistic data)
INSERT INTO resumes (student_id, summary, education, experience, projects, created_at, updated_at) VALUES
(6, 'Computer Science student with strong foundation in software development. Passionate about building scalable applications and learning new technologies. Experienced in full-stack development with Java, Spring Boot, React, and PostgreSQL.', 
 '[{"degree": "Bachelor of Science", "field": "Computer Science", "institution": "State University", "year": "2024", "gpa": "3.8"}]',
 '[{"company": "Tech Internship Co", "position": "Software Development Intern", "duration": "Summer 2023", "description": "Developed features using React and Node.js. Worked on REST API development and database optimization."}]',
 '[{"name": "E-Commerce Platform", "description": "Full-stack e-commerce application with payment integration", "tech": "React, Node.js, MongoDB, Stripe API"}, {"name": "Task Management App", "description": "Collaborative task management platform with real-time updates", "tech": "React, Socket.io, PostgreSQL"}]',
 NOW() - INTERVAL '40 days', NOW() - INTERVAL '40 days'),

(7, 'Data Science major specializing in machine learning and data analytics. Experienced with Python, TensorFlow, and statistical analysis. Published research papers on predictive modeling.',
 '[{"degree": "Master of Science", "field": "Data Science", "institution": "Tech University", "year": "2024", "gpa": "3.9"}]',
 '[{"company": "Data Analytics Inc", "position": "Data Science Intern", "duration": "Fall 2023", "description": "Built ML models for predictive analytics. Worked on feature engineering and model optimization."}]',
 '[{"name": "Customer Churn Prediction", "description": "ML model to predict customer churn with 85% accuracy", "tech": "Python, Scikit-learn, Pandas, XGBoost"}, {"name": "Sentiment Analysis Tool", "description": "NLP model for analyzing customer reviews", "tech": "Python, NLTK, TensorFlow"}]',
 NOW() - INTERVAL '35 days', NOW() - INTERVAL '35 days'),

(8, 'Full-stack developer with expertise in modern web technologies. Open-source contributor and tech enthusiast. Strong problem-solving skills and passion for clean code.',
 '[{"degree": "Bachelor of Science", "field": "Software Engineering", "institution": "Engineering College", "year": "2025", "gpa": "3.7"}]',
 '[{"company": "WebDev Startup", "position": "Frontend Developer", "duration": "Part-time 2023", "description": "Built responsive web applications using React and TypeScript. Improved performance by 40%."}]',
 '[{"name": "Task Management App", "description": "Collaborative task management platform", "tech": "React, Node.js, MongoDB, WebSocket"}, {"name": "Portfolio Website", "description": "Personal portfolio with blog functionality", "tech": "Next.js, Tailwind CSS, MDX"}]',
 NOW() - INTERVAL '30 days', NOW() - INTERVAL '30 days'),

(9, 'Cybersecurity enthusiast and ethical hacker. Certified in security fundamentals. Experience with penetration testing and vulnerability assessment.',
 '[{"degree": "Bachelor of Science", "field": "Cybersecurity", "institution": "Security University", "year": "2024", "gpa": "3.6"}]',
 '[{"company": "Security Firm", "position": "Security Intern", "duration": "Summer 2023", "description": "Performed penetration testing and security audits. Identified and reported vulnerabilities."}]',
 '[{"name": "Vulnerability Scanner", "description": "Automated tool for scanning web vulnerabilities", "tech": "Python, Nmap, SQLMap"}, {"name": "Security Dashboard", "description": "Real-time security monitoring dashboard", "tech": "React, Node.js, Security APIs"}]',
 NOW() - INTERVAL '28 days', NOW() - INTERVAL '28 days'),

(10, 'Mobile app developer specializing in React Native and Flutter. Published multiple apps on app stores. Passionate about creating intuitive user experiences.',
 '[{"degree": "Bachelor of Science", "field": "Computer Science", "institution": "Mobile Tech University", "year": "2024", "gpa": "3.8"}]',
 '[{"company": "Mobile App Agency", "position": "Mobile Developer Intern", "duration": "Spring 2023", "description": "Developed cross-platform mobile apps using React Native. Collaborated with design team."}]',
 '[{"name": "Fitness Tracker App", "description": "Mobile app for tracking workouts and nutrition", "tech": "React Native, Firebase, Charts"}, {"name": "Social Media App", "description": "Photo-sharing social media application", "tech": "Flutter, Firebase, Cloud Storage"}]',
 NOW() - INTERVAL '26 days', NOW() - INTERVAL '26 days'),

(11, 'Backend engineer with expertise in microservices and cloud architecture. Experienced in designing scalable systems and optimizing database performance.',
 '[{"degree": "Bachelor of Science", "field": "Computer Science", "institution": "Cloud University", "year": "2025", "gpa": "3.9"}]',
 '[{"company": "Cloud Services Co", "position": "Backend Developer Intern", "duration": "Summer 2023", "description": "Developed microservices using Spring Boot. Implemented caching strategies."}]',
 '[{"name": "Microservices Architecture", "description": "E-commerce platform with microservices", "tech": "Spring Boot, Docker, Kubernetes, PostgreSQL"}, {"name": "API Gateway", "description": "Centralized API gateway for multiple services", "tech": "Spring Cloud Gateway, Redis, OAuth2"}]',
 NOW() - INTERVAL '24 days', NOW() - INTERVAL '24 days'),

(12, 'Frontend developer passionate about UI/UX design. Strong eye for detail and user experience. Experienced in creating responsive and accessible web applications.',
 '[{"degree": "Bachelor of Science", "field": "Computer Science", "institution": "Design University", "year": "2024", "gpa": "3.7"}]',
 '[{"company": "Design Agency", "position": "Frontend Developer", "duration": "Part-time 2023", "description": "Built responsive web applications. Collaborated with designers on UI implementation."}]',
 '[{"name": "E-Commerce Website", "description": "Modern e-commerce site with smooth animations", "tech": "React, Tailwind CSS, Framer Motion"}, {"name": "Dashboard UI", "description": "Analytics dashboard with data visualization", "tech": "React, Chart.js, Material-UI"}]',
 NOW() - INTERVAL '22 days', NOW() - INTERVAL '22 days'),

(13, 'DevOps engineer with Kubernetes and Docker experience. Passionate about automation and infrastructure as code. Strong background in CI/CD pipelines.',
 '[{"degree": "Bachelor of Science", "field": "Computer Science", "institution": "DevOps University", "year": "2024", "gpa": "3.8"}]',
 '[{"company": "Tech Startup", "position": "DevOps Intern", "duration": "Fall 2023", "description": "Set up CI/CD pipelines. Managed Kubernetes clusters and containerized applications."}]',
 '[{"name": "Infrastructure as Code", "description": "Automated infrastructure provisioning", "tech": "Terraform, AWS, Ansible"}, {"name": "CI/CD Pipeline", "description": "Complete CI/CD setup with testing", "tech": "Jenkins, Docker, Kubernetes, GitLab"}]',
 NOW() - INTERVAL '20 days', NOW() - INTERVAL '20 days'),

(14, 'Machine Learning engineer with research publications. Specialized in deep learning and neural networks. Experience with computer vision and NLP.',
 '[{"degree": "Master of Science", "field": "Machine Learning", "institution": "AI University", "year": "2024", "gpa": "4.0"}]',
 '[{"company": "AI Research Lab", "position": "ML Research Intern", "duration": "Summer 2023", "description": "Developed deep learning models. Published research paper on transformer architectures."}]',
 '[{"name": "Image Classification Model", "description": "CNN model for medical image classification", "tech": "Python, TensorFlow, Keras, OpenCV"}, {"name": "NLP Chatbot", "description": "Conversational AI chatbot using transformers", "tech": "Python, PyTorch, Transformers, Flask"}]',
 NOW() - INTERVAL '18 days', NOW() - INTERVAL '18 days'),

(15, 'Blockchain developer with DeFi and smart contract experience. Active contributor to open-source blockchain projects. Knowledgeable in Ethereum ecosystem.',
 '[{"degree": "Bachelor of Science", "field": "Computer Science", "institution": "Blockchain University", "year": "2024", "gpa": "3.7"}]',
 '[{"company": "DeFi Startup", "position": "Blockchain Developer", "duration": "Part-time 2023", "description": "Developed smart contracts for DeFi protocols. Conducted security audits."}]',
 '[{"name": "DeFi Lending Protocol", "description": "Decentralized lending platform", "tech": "Solidity, Ethereum, Web3.js, React"}, {"name": "NFT Marketplace", "description": "NFT trading platform with auctions", "tech": "Solidity, IPFS, React, MetaMask"}]',
 NOW() - INTERVAL '16 days', NOW() - INTERVAL '16 days');

-- Insert Resume Skills
INSERT INTO resume_skills (resume_id, skill) VALUES
-- Student 1 (Resume 1) - Full Stack Developer
(1, 'Java'), (1, 'Spring Boot'), (1, 'React'), (1, 'Node.js'), (1, 'PostgreSQL'), (1, 'MongoDB'), (1, 'JavaScript'), (1, 'REST API'),
-- Student 2 (Resume 2) - Data Scientist
(2, 'Python'), (2, 'TensorFlow'), (2, 'Machine Learning'), (2, 'SQL'), (2, 'Pandas'), (2, 'Scikit-learn'), (2, 'Data Analysis'), (2, 'Statistics'),
-- Student 3 (Resume 3) - Full Stack Developer
(3, 'React'), (3, 'Node.js'), (3, 'MongoDB'), (3, 'JavaScript'), (3, 'TypeScript'), (3, 'WebSocket'), (3, 'Full Stack'), (3, 'PostgreSQL'),
-- Student 4 (Resume 4) - Security Engineer
(4, 'Cybersecurity'), (4, 'Penetration Testing'), (4, 'Python'), (4, 'Network Security'), (4, 'Vulnerability Assessment'), (4, 'Security'), (4, 'Ethical Hacking'),
-- Student 5 (Resume 5) - Mobile Developer
(5, 'React Native'), (5, 'Flutter'), (5, 'Mobile Development'), (5, 'JavaScript'), (5, 'Dart'), (5, 'Firebase'), (5, 'iOS'), (5, 'Android'),
-- Student 6 (Resume 6) - Backend Engineer
(6, 'Java'), (6, 'Spring Boot'), (6, 'Microservices'), (6, 'PostgreSQL'), (6, 'Docker'), (6, 'Kubernetes'), (6, 'Cloud'), (6, 'REST API'),
-- Student 7 (Resume 7) - Frontend Developer
(7, 'React'), (7, 'TypeScript'), (7, 'CSS'), (7, 'JavaScript'), (7, 'UI/UX'), (7, 'Tailwind CSS'), (7, 'Responsive Design'), (7, 'Frontend'),
-- Student 8 (Resume 8) - DevOps Engineer
(8, 'Kubernetes'), (8, 'Docker'), (8, 'AWS'), (8, 'Terraform'), (8, 'CI/CD'), (8, 'Jenkins'), (8, 'DevOps'), (8, 'Infrastructure'),
-- Student 9 (Resume 9) - ML Engineer
(9, 'Python'), (9, 'TensorFlow'), (9, 'PyTorch'), (9, 'Machine Learning'), (9, 'Deep Learning'), (9, 'Neural Networks'), (9, 'Computer Vision'), (9, 'NLP'),
-- Student 10 (Resume 10) - Blockchain Developer
(10, 'Solidity'), (10, 'Ethereum'), (10, 'Blockchain'), (10, 'Smart Contracts'), (10, 'DeFi'), (10, 'Web3.js'), (10, 'Cryptography'), (10, 'DApps');

-- Insert Applications (realistic applications linking students to jobs)
INSERT INTO applications (student_id, job_id, cover_letter, status, matching_score, recruiter_notes, created_at, updated_at) VALUES
-- Student 1 (Alex) - Full Stack Developer
(6, 1, 'I am very interested in this Senior Software Engineer position. My experience with Java and Spring Boot aligns perfectly with your requirements. I have worked on microservices architecture and PostgreSQL databases.', 'SHORTLISTED', 85, 'Strong technical background, good fit for the role', NOW() - INTERVAL '10 days', NOW() - INTERVAL '5 days'),
(6, 2, 'As a frontend developer, I am excited about this opportunity. I have extensive experience with React and TypeScript, and I am passionate about creating beautiful user interfaces.', 'APPLIED', 90, NULL, NOW() - INTERVAL '8 days', NOW() - INTERVAL '8 days'),
(6, 4, 'I am a full-stack developer and would love to contribute to your startup. My skills with React, Node.js, and PostgreSQL match your requirements perfectly.', 'INTERVIEW', 88, 'Scheduled for technical interview', NOW() - INTERVAL '6 days', NOW() - INTERVAL '3 days'),

-- Student 2 (Jessica) - Data Scientist
(7, 9, 'My background in data science and machine learning makes me a great fit for this position. I have hands-on experience with TensorFlow and Python, and I have published research in predictive modeling.', 'SHORTLISTED', 92, 'Excellent ML background, strong candidate', NOW() - INTERVAL '9 days', NOW() - INTERVAL '4 days'),
(7, 17, 'I am interested in analyzing healthcare data to improve patient outcomes. My data science skills and passion for healthcare make me a strong candidate.', 'APPLIED', 75, NULL, NOW() - INTERVAL '5 days', NOW() - INTERVAL '5 days'),

-- Student 3 (Ryan) - Full Stack Developer
(8, 4, 'As a full-stack developer, I am excited about this opportunity. I have experience with React, Node.js, and PostgreSQL, and I am passionate about building scalable applications.', 'SELECTED', 95, 'Excellent candidate, offer extended', NOW() - INTERVAL '12 days', NOW() - INTERVAL '2 days'),
(8, 2, 'I have strong frontend development skills and would love to join your team. My React and TypeScript experience matches your requirements perfectly.', 'REJECTED', 75, 'Good candidate but not the right fit', NOW() - INTERVAL '11 days', NOW() - INTERVAL '10 days'),

-- Student 4 (Sophia) - Security Engineer
(9, 8, 'As a cybersecurity enthusiast, I am excited about this Security Engineer position. My experience with penetration testing and vulnerability assessment aligns with your requirements.', 'SHORTLISTED', 88, 'Strong security background', NOW() - INTERVAL '9 days', NOW() - INTERVAL '4 days'),

-- Student 5 (Daniel) - Mobile Developer
(10, 6, 'I am a mobile developer with extensive experience in React Native and Flutter. I have published multiple apps on app stores and I am passionate about creating intuitive mobile experiences.', 'SHORTLISTED', 90, 'Strong mobile development background', NOW() - INTERVAL '8 days', NOW() - INTERVAL '3 days'),
(10, 18, 'I am interested in building telemedicine mobile applications. My mobile development skills and interest in healthcare make me a good fit.', 'APPLIED', 75, NULL, NOW() - INTERVAL '6 days', NOW() - INTERVAL '6 days'),

-- Student 6 (Emma) - Backend Engineer
(11, 1, 'I am a backend engineer with expertise in microservices and cloud architecture. My experience with Spring Boot and Kubernetes aligns perfectly with your requirements.', 'SHORTLISTED', 88, 'Strong backend and cloud experience', NOW() - INTERVAL '10 days', NOW() - INTERVAL '5 days'),
(11, 3, 'I am interested in this DevOps Engineer position. My experience with Kubernetes, Docker, and CI/CD pipelines makes me a strong candidate.', 'APPLIED', 85, NULL, NOW() - INTERVAL '8 days', NOW() - INTERVAL '8 days'),

-- Student 7 (Lucas) - Frontend Developer
(12, 2, 'I am a frontend developer passionate about UI/UX design. My experience with React, TypeScript, and modern CSS frameworks makes me a great fit for this role.', 'SHORTLISTED', 92, 'Excellent UI/UX skills', NOW() - INTERVAL '9 days', NOW() - INTERVAL '4 days'),

-- Student 8 (Olivia) - DevOps Engineer
(13, 3, 'I am a DevOps engineer with Kubernetes and Docker experience. I am passionate about automation and infrastructure as code, and I have set up multiple CI/CD pipelines.', 'SHORTLISTED', 90, 'Strong DevOps background', NOW() - INTERVAL '10 days', NOW() - INTERVAL '5 days'),
(13, 7, 'I am interested in this Cloud Architect position. My DevOps experience and cloud platform knowledge make me a good fit.', 'APPLIED', 82, NULL, NOW() - INTERVAL '8 days', NOW() - INTERVAL '8 days'),

-- Student 9 (Noah) - ML Engineer
(14, 9, 'I am a machine learning engineer with research publications. My experience with TensorFlow and deep learning makes me a great fit for this ML Engineer position.', 'SHORTLISTED', 92, 'Excellent ML engineer, strong candidate', NOW() - INTERVAL '8 days', NOW() - INTERVAL '3 days'),

-- Student 10 (Ava) - Blockchain Developer
(15, 12, 'I am a blockchain developer with DeFi and smart contract experience. My knowledge of Solidity, Ethereum, and DeFi protocols makes me a strong candidate for this role.', 'SHORTLISTED', 88, 'Strong blockchain background', NOW() - INTERVAL '9 days', NOW() - INTERVAL '4 days'),
(15, 11, 'I am interested in this Quantitative Analyst position. My blockchain and programming skills, combined with my interest in finance, make me a good fit.', 'APPLIED', 70, NULL, NOW() - INTERVAL '7 days', NOW() - INTERVAL '7 days');

-- Insert Interviews (for applications in INTERVIEW or SHORTLISTED status)
INSERT INTO interviews (application_id, scheduled_at, mode, location, meeting_link, notes, created_at, updated_at) VALUES
(3, NOW() + INTERVAL '3 days', 'ONLINE', NULL, 'https://meet.google.com/abc-defg-hij', 'Technical interview focusing on full-stack development skills. Prepare for coding challenge.', NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days'),
(1, NOW() + INTERVAL '5 days', 'ONLINE', NULL, 'https://zoom.us/j/123456789', 'Technical interview for Senior Software Engineer role. Will discuss Java and Spring Boot experience.', NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day'),
(4, NOW() + INTERVAL '4 days', 'ONLINE', NULL, 'https://teams.microsoft.com/l/meetup-join/xyz', 'Interview for ML Engineer position. Will discuss ML projects and research experience.', NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days'),
(5, NOW() + INTERVAL '6 days', 'ONLINE', NULL, 'https://meet.google.com/mobile-dev-interview', 'Technical interview for Mobile Developer position. Prepare to discuss React Native projects.', NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day'),
(7, NOW() + INTERVAL '7 days', 'HYBRID', 'San Francisco, CA', 'https://meet.google.com/frontend-interview', 'On-site interview with option to join remotely. Will discuss UI/UX portfolio.', NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day'),
(8, NOW() + INTERVAL '5 days', 'ONLINE', NULL, 'https://zoom.us/j/devops-interview', 'DevOps interview focusing on Kubernetes and CI/CD experience.', NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days'),
(9, NOW() + INTERVAL '4 days', 'ONLINE', NULL, 'https://teams.microsoft.com/l/ml-interview', 'ML Engineer interview. Will discuss research papers and production ML systems.', NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day'),
(10, NOW() + INTERVAL '6 days', 'ONLINE', NULL, 'https://meet.google.com/blockchain-interview', 'Blockchain developer interview. Prepare to discuss DeFi projects and smart contracts.', NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day');
