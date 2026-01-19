# PostgreSQL Database Setup Guide for IntelliHire

## Step-by-Step Instructions

### Step 1: Install PostgreSQL (if not already installed)

**Windows:**
1. Download PostgreSQL from: https://www.postgresql.org/download/windows/
2. Run the installer
3. During installation:
   - Remember the password you set for the `postgres` superuser (default username is `postgres`)
   - Note the port (default is `5432`)
   - Complete the installation

**Verify Installation:**
- PostgreSQL should be running as a Windows service
- Check in Services: Press `Win + R`, type `services.msc`, look for "postgresql" service

---

### Step 2: Start PostgreSQL Service

**Option A: Via Services (Windows)**
1. Press `Win + R`, type `services.msc`
2. Find "PostgreSQL" service
3. Right-click → Start (if not running)

**Option B: Via Command Line**
```bash
# Open PowerShell as Administrator
net start postgresql-x64-XX  # Replace XX with your version number
```

---

### Step 3: Access PostgreSQL

**Option A: Using pgAdmin (GUI - Recommended for beginners)**
1. Open **pgAdmin** (installed with PostgreSQL)
2. Connect to server:
   - Right-click "Servers" → Create → Server
   - General tab: Name = `Local PostgreSQL`
   - Connection tab:
     - Host: `localhost`
     - Port: `5432`
     - Username: `postgres`
     - Password: (the password you set during installation)
   - Click "Save"

**Option B: Using Command Line (psql)**
```bash
# Open Command Prompt or PowerShell
psql -U postgres
# Enter your password when prompted
```

---

### Step 4: Create the Database

**Using pgAdmin:**
1. In pgAdmin, expand "Servers" → "Local PostgreSQL" → "Databases"
2. Right-click "Databases" → Create → Database
3. Database name: `intellihire`
4. Click "Save"

**Using psql Command Line:**
```sql
-- Connect to PostgreSQL
psql -U postgres

-- Create the database
CREATE DATABASE intellihire;

-- Verify it was created
\l

-- Exit psql
\q
```

---

### Step 5: Update Application Configuration (if needed)

**Check your PostgreSQL credentials:**

1. Open: `backend/src/main/resources/application.properties`

2. **Current default settings:**
   ```properties
   spring.datasource.url=jdbc:postgresql://localhost:5432/intellihire
   spring.datasource.username=postgres
   spring.datasource.password=postgres
   ```

3. **Update if your credentials are different:**
   - If your PostgreSQL password is NOT `postgres`, change the `spring.datasource.password` value
   - If your PostgreSQL port is NOT `5432`, update the port in the URL
   - If your username is different, update `spring.datasource.username`

**Example (if your password is `mypassword123`):**
```properties
spring.datasource.password=mypassword123
```

---

### Step 6: Verify Database Connection

**The Spring Boot application will automatically:**
- Connect to the database when it starts
- Create tables automatically (because `spring.jpa.hibernate.ddl-auto=update`)
- Run the schema.sql file to ensure tables exist

**To verify manually:**

**Using pgAdmin:**
1. Expand: `Servers` → `Local PostgreSQL` → `Databases` → `intellihire` → `Schemas` → `public` → `Tables`
2. After running the Spring Boot app, you should see:
   - `users`
   - `jobs`
   - `applications`

**Using psql:**
```sql
-- Connect to intellihire database
psql -U postgres -d intellihire

-- List tables
\dt

-- Exit
\q
```

---

### Step 7: Start the Backend Application

Once the database is created and configured:

1. **Using IDE (IntelliJ/Eclipse):**
   - Open `backend/` folder
   - Run `IntelliHireApplication.java`
   - Check console for: "Started IntelliHireApplication"

2. **Using Maven (if installed):**
   ```bash
   cd backend
   mvn spring-boot:run
   ```

**Expected Output:**
- You should see: "Hibernate: create table users..."
- No database connection errors
- Application starts on `http://localhost:8080`

---

## Troubleshooting

### Error: "Connection refused" or "Connection to localhost:5432 refused"
- **Solution:** PostgreSQL service is not running. Start it via Services or command line.

### Error: "password authentication failed"
- **Solution:** Update `spring.datasource.password` in `application.properties` with your actual PostgreSQL password.

### Error: "database intellihire does not exist"
- **Solution:** Create the database using Step 4 above.

### Error: "FATAL: database intellihire does not exist"
- **Solution:** Make sure you created the database exactly as `intellihire` (lowercase, no spaces).

---

## Quick Reference

**Default Configuration:**
- Database Name: `intellihire`
- Username: `postgres`
- Password: `postgres` (change if different)
- Port: `5432`
- Host: `localhost`

**Files to Check:**
- `backend/src/main/resources/application.properties` - Database connection settings
- `backend/src/main/resources/schema.sql` - Table creation script (auto-run)

---

## Next Steps

After database setup:
1. ✅ Database created: `intellihire`
2. ✅ Credentials updated in `application.properties`
3. ✅ Start backend: Run `IntelliHireApplication`
4. ✅ Start frontend: `cd frontend` → `npm run dev`
5. ✅ Open browser: `http://localhost:5173`
