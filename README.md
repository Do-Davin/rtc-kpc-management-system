# RTC-KPC Management System

A full-stack web application for managing the Regional Training Center KPC (RTC-KPC). Built with **NestJS** (backend), **Vue.js** (frontend), and **PostgreSQL** (database), all containerized with **Docker**.

## Features

- **User Management** — Admin, Teacher, and Student roles
- **Attendance Tracking** — QR-code based attendance sessions
- **Course Management** — Admin and teacher course dashboards
- **E-Library** — Digital book management
- **Schedule Management** — Class scheduling
- **Department Management** — Organize departments
- **Authentication & Authorization** — JWT-based with role-based access control
- **Multi-language Support** — Khmer and English

## Tech Stack

| Layer      | Technology                                                    |
| ---------- | ------------------------------------------------------------- |
| Backend    | NestJS 11, TypeScript, TypeORM, Passport JWT, bcrypt          |
| Frontend   | Vue.js 3, Vue Router 4, Pinia 3, Axios, Vite 7               |
| Database   | PostgreSQL 16                                                 |
| DevOps     | Docker, Docker Compose, Node.js 20                            |

---

## Prerequisites

Make sure the following are installed on your machine:

- **Docker Desktop** — [Download here](https://www.docker.com/products/docker-desktop/)  
  _(includes Docker Engine + Docker Compose)_
- **Git** — [Download here](https://git-scm.com/downloads)

> **Note:** You do **not** need to install Node.js or PostgreSQL manually. Docker handles everything.

---

## Quick Start Guide (Step-by-Step)

Follow these steps **in order** to run the application after cloning.

### Step 1 — Clone the Repository

```bash
git clone https://github.com/Do-Davin/rtc-kpc-management-system.git
cd rtc-kpc-management-system
```

### Step 2 — Create the `docker-compose.yml` File

Create a file named `docker-compose.yml` in the **project root** with the following content:

```yaml
services:
  postgres:
    image: postgres:16
    container_name: rtc_pg
    restart: always
    environment:
      POSTGRES_DB: ${DB_NAME}
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    ports:
      - "5434:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data

  backend:
    image: node:20
    container_name: rtc_backend
    working_dir: /app
    build:
      context: ./backend
    ports:
      - "3000:3000"
    depends_on:
      - postgres
    env_file:
      - .env
      - ./backend/.env
    volumes:
      - ./backend:/app
      - /app/node_modules
    environment:
      - CHOKIDAR_USEPOLLING=true
    command: sh -c "npm install && npm run start:dev"

  frontend:
    image: node:20
    container_name: rtc_frontend
    working_dir: /app
    volumes:
      - ./frontend:/app
      - /app/node_modules
    ports:
      - "5173:5173"
    environment:
      - CHOKIDAR_USEPOLLING=true
      - WATCHPACK_POLLING=true
    command: sh -c "npm install && npm run dev -- --host 0.0.0.0"

volumes:
  pgdata:
```

### Step 3 — Create the Root `.env` File

Create a file named `.env` in the **project root** directory (same level as `docker-compose.yml`):

```env
DB_HOST=postgres
DB_CONTAINER_PORT=5432
DB_USER=rtc_user
DB_PASSWORD=rtc_pass
DB_NAME=rtc_db
```

### Step 4 — Create the Backend `.env` File

Create a file named `.env` inside the `backend/` folder:

```env
JWT_ACCESS_SECRET=rtc_access_secret_123
JWT_REFRESH_SECRET=rtc_refresh_secret_456
JWT_ACCESS_EXPIRES=15m
JWT_REFRESH_EXPIRES=7d

DATABASE_URL=postgresql://rtc_user:rtc_pass@postgres:5432/rtc_db
```

Create a file named `.env` inside the `frontend/` folder:

```env
VITE_API_URL=http://localhost:3000
```

> **Important:** The `DATABASE_URL` username/password must match `DB_USER`/`DB_PASSWORD` from the root `.env` file. The hostname must be `postgres` (the Docker service name).

### Step 5 — Start the Application

Open a terminal in the project root and run:

```bash
docker compose up -d
```

This will:
1. Pull the PostgreSQL 16 and Node.js 20 images (first time only)
2. Start the PostgreSQL database
3. Install backend dependencies and start the NestJS server
4. Install frontend dependencies and start the Vite dev server

> **First-time startup may take 2–5 minutes** while Docker downloads images and installs npm packages.

### Step 6 — Check That All Services Are Running

```bash
docker compose ps
```

You should see 3 containers running: `rtc_pg`, `rtc_backend`, `rtc_frontend`.

If a service is not running, check its logs:

```bash
docker compose logs -f backend
docker compose logs -f frontend
docker compose logs -f postgres
```

### Step 7 — Seed the Database (Create Test Accounts)

Once the backend is running, seed the database with test data:

```bash
docker compose exec backend npx ts-node -r tsconfig-paths/register src/seed.ts
```

This creates the following **test accounts**:

| Role    | Email              | Password      |
| ------- | ------------------ | ------------- |
| Admin   | admin@rtc.com      | Admin@123     |
| Teacher | teacher@rtc.com    | Teacher@123   |
| Student | student@rtc.com    | Student@123   |

It also creates a sample IT department and dummy attendance data.

### Step 8 — Open the Application

| Service    | URL                          |
| ---------- | ---------------------------- |
| Frontend   | http://localhost:5173         |
| Backend API| http://localhost:3000         |
| PostgreSQL | `localhost:5434` (port 5434) |

Log in using one of the test accounts from Step 7.

---

## Stopping & Restarting

```bash
# Stop all services
docker compose down

# Stop and remove all data (including database)
docker compose down -v

# Restart all services
docker compose up -d

# Rebuild after code changes (if containers are cached)
docker compose up -d --build
```

---

## Project Structure

```
rtc-kpc-management-system/
├── docker-compose.yml          # Docker services configuration
├── .env                        # Root env (DB credentials for Docker)
├── backend/                    # NestJS backend
│   ├── .env                    # Backend env (DATABASE_URL, JWT secrets)
│   ├── src/
│   │   ├── main.ts             # App entry point (port 3000)
│   │   ├── seed.ts             # Database seeder script
│   │   ├── app.module.ts       # Root module
│   │   └── modules/
│   │       ├── admin-courses/  # Admin course management
│   │       ├── attendance/     # Attendance tracking
│   │       ├── auth/           # Authentication (JWT)
│   │       ├── database/       # Database connection (TypeORM)
│   │       ├── departments/    # Department management
│   │       ├── elibrary/       # E-Library
│   │       ├── schedules/      # Schedule management
│   │       ├── students/       # Student management
│   │       ├── teachers/       # Teacher management
│   │       ├── teacher-courses/
│   │       ├── teacher-dashboard/
│   │       ├── student-dashboard/
│   │       └── users/          # User management
│   ├── uploads/                # Uploaded files (courses, books)
│   ├── public/                 # Static public files
│   ├── Dockerfile
│   └── package.json
├── frontend/                   # Vue.js frontend
│   ├── src/
│   │   ├── App.vue
│   │   ├── main.js
│   │   ├── components/         # UI components (admin, teacher, student)
│   │   ├── views/              # Layout views
│   │   ├── router/             # Vue Router
│   │   ├── stores/             # Pinia stores
│   │   ├── services/           # API service files
│   │   ├── composables/        # Vue composables
│   │   └── locales/            # i18n (en, km)
│   ├── package.json
|   └── .env                    # Frontend env (VITE URL)
└── README.md
```

---

## Environment Variables Reference

### Root `.env` (for Docker Compose)

| Variable      | Description             | Example Value   |
| ------------- | ----------------------- | --------------- |
| `DB_NAME`     | PostgreSQL database name| `rtc_db`    |
| `DB_USER`     | PostgreSQL username     | `rtc_user`      |
| `DB_PASSWORD` | PostgreSQL password     | `rtc_pass`   |

### Backend `.env` (for NestJS application)

| Variable             | Description                         | Example Value                                              |
| -------------------- | ----------------------------------- | ---------------------------------------------------------- |
| `DATABASE_URL`       | PostgreSQL connection string        | `postgresql://rtc_user:rtc_pass@postgres:5432/rtc_db` |
| `JWT_ACCESS_SECRET`  | Secret key for signing JWT tokens   | `rtc_access_secret_123`                             |
| `JWT_ACCESS_EXPIRES` | JWT token expiration duration       | `15m`                                                       |

---

## Troubleshooting

### "Cannot connect to database"
- Make sure the `DATABASE_URL` in `backend/.env` matches the credentials in the root `.env`
- The database host in `DATABASE_URL` must be `postgres` (the Docker service name), not `localhost`
- Wait for the PostgreSQL container to be ready before the backend starts (Docker handles this automatically via `depends_on`)

### "Port already in use"
- If ports `3000`, `5173`, or `5434` are occupied, either stop the conflicting process or change the port mapping in `docker-compose.yml`
- Find what's using a port: `lsof -i :3000` (macOS/Linux) or `netstat -ano | findstr :3000` (Windows)

### "Container keeps restarting"
- Check logs: `docker compose logs -f backend`
- Common cause: missing `.env` file or incorrect `DATABASE_URL`

### "npm install takes too long"
- First run downloads all dependencies. Subsequent runs use cached `node_modules` volumes
- If packages seem stuck, try: `docker compose down -v && docker compose up -d`

### "Frontend page is blank / API errors"
- Make sure the backend is running: `docker compose ps`
- Check browser console for CORS or network errors
- Backend CORS allows `http://localhost:5173` by default

---

## Developers

- **Do Davin** — ID: p20230018
- **Huoth Sitha** — ID: p20230039
- **Thy Sethasarakvath** — ID: p20230035
- **Tat Chansereyvong** — ID: p20230021

## Acknowledgments

- RTC-KPC (Regional Training Center for health KPC)
- NestJS & Vue.js communities
