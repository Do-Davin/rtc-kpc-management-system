# RTC-KPC Management System

A full-stack web application for managing attendance and user data at RTC-KPC (Regional Training Center for health KPC). Built with NestJS backend, Vue.js frontend, and PostgreSQL database, all containerized with Docker.

## 🚀 Features

- **User Management**: Create, read, update, and delete user records
- **Authentication & Authorization**: JWT-based authentication with role-based access control
- **Attendance Tracking**: Record and manage attendance data
- **Modern UI**: Responsive Vue.js frontend with Vue Router
- **RESTful API**: Well-structured NestJS backend with TypeORM
- **Dockerized**: Easy deployment with Docker Compose

## 🏗️ Tech Stack

### Backend
- **Framework**: NestJS 11.x
- **Language**: TypeScript
- **Database ORM**: TypeORM
- **Database**: PostgreSQL 16
- **Authentication**: Passport JWT
- **Validation**: class-validator, class-transformer
- **Password Hashing**: bcrypt

### Frontend
- **Framework**: Vue.js 3.x
- **Router**: Vue Router 4.x
- **State Management**: Pinia 3.x
- **HTTP Client**: Axios
- **Build Tool**: Vite 7.x
- **Styling**: CSS

### DevOps
- **Containerization**: Docker & Docker Compose
- **Node Version**: 20.x

## 📋 Prerequisites

- Docker Desktop (or Docker Engine + Docker Compose)
- Node.js 20.x or higher (for local development without Docker)
- Git

## 🛠️ Installation & Setup

### Using Docker (Recommended)

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd rtc-kpc-management-system
   ```

2. **Set up environment variables**
   
   Create a `.env` file in the `backend` directory:
   ```bash
   cd backend
   cp .env.example .env
   ```
   
   Configure your `.env` file:
   ```env
   DB_HOST=postgres
   DB_PORT=5432
   DB_USER=your_db_user
   DB_PASSWORD=your_db_password
   DB_NAME=rtc_kpc_db
   
   JWT_SECRET=your_jwt_secret_key_here
   JWT_EXPIRATION=1d
   ```

   Create a `.env` file in the root directory for Docker Compose:
   ```env
   DB_NAME=rtc_kpc_db
   DB_USER=your_db_user
   DB_PASSWORD=your_db_password
   ```

3. **Start the application**
   ```bash
   cd ..
   docker compose up -d
   ```

4. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3000
   - PostgreSQL: localhost:5434

### Local Development (Without Docker)

#### Backend Setup
```bash
cd backend
npm install
npm run start:dev
```

#### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## 📁 Project Structure

```
rtc-kpc-management-system/
├── backend/                    # NestJS backend application
│   ├── src/
│   │   ├── modules/
│   │   │   ├── attendance/    # Attendance module
│   │   │   ├── auth/          # Authentication module
│   │   │   └── users/         # Users module
│   │   ├── app.module.ts
│   │   └── main.ts
│   ├── test/                  # E2E tests
│   ├── Dockerfile
│   └── package.json
├── frontend/                   # Vue.js frontend application
│   ├── src/
│   │   ├── modules/
│   │   │   ├── attendance/    # Attendance feature
│   │   │   └── example/       # Example feature
│   │   ├── components/        # Shared components
│   │   ├── router/            # Vue Router configuration
│   │   ├── views/             # Page views
│   │   ├── App.vue
│   │   └── main.js
│   └── package.json
└── docker-compose.yml         # Docker Compose configuration
```

## 🔧 Available Scripts

### Backend
```bash
npm run start          # Start the application
npm run start:dev      # Start in development mode with watch
npm run start:debug    # Start in debug mode
npm run build          # Build the application
npm run test           # Run unit tests
npm run test:e2e       # Run end-to-end tests
npm run lint           # Lint and fix code
npm run format         # Format code with Prettier
```

### Frontend
```bash
npm run dev            # Start development server
npm run build          # Build for production
npm run preview        # Preview production build
npm run lint           # Lint and fix code
npm run format         # Format code with Prettier
```

### Docker
```bash
docker compose up -d              # Start all services
docker compose down               # Stop all services
docker compose logs -f            # View logs
docker compose logs -f backend    # View backend logs
docker compose logs -f frontend   # View frontend logs
docker compose restart            # Restart all services
```

## 🔐 API Endpoints

### Authentication
- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login user
- `GET /auth/profile` - Get current user profile (protected)

### Users
- `GET /users` - Get all users (protected)
- `GET /users/:id` - Get user by ID (protected)
- `POST /users` - Create a new user (protected)
- `PATCH /users/:id` - Update user (protected)
- `DELETE /users/:id` - Delete user (protected)

### Attendance
- `GET /attendance` - Get all attendance records (protected)
- `POST /attendance` - Create attendance record (protected)
- Additional endpoints based on implementation

## 🧪 Testing

### Backend Tests
```bash
cd backend
npm run test              # Unit tests
npm run test:watch        # Watch mode
npm run test:cov          # Coverage report
npm run test:e2e          # E2E tests
```

## 🌐 Environment Variables

### Backend (.env)
| Variable | Description | Default |
|----------|-------------|---------|
| `DB_HOST` | Database host | `postgres` |
| `DB_PORT` | Database port | `5432` |
| `DB_USER` | Database username | - |
| `DB_PASSWORD` | Database password | - |
| `DB_NAME` | Database name | - |
| `JWT_SECRET` | JWT secret key | - |
| `JWT_EXPIRATION` | JWT token expiration | `1d` |

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 Code Style

This project uses:
- **ESLint** for code linting
- **Prettier** for code formatting

Run linting before committing:
```bash
# Backend
cd backend && npm run lint

# Frontend
cd frontend && npm run lint
```

## 🐛 Troubleshooting

### Docker Issues
- **Port conflicts**: If ports 3000, 5173, or 5434 are in use, modify the port mappings in `docker-compose.yml`
- **Container won't start**: Check logs with `docker compose logs -f [service-name]`
- **Database connection issues**: Ensure `.env` variables match in both root and backend directories

### Development Issues
- **Module not found**: Run `npm install` in the respective directory
- **Database connection failed**: Verify PostgreSQL is running and credentials are correct
- **CORS errors**: Check backend CORS configuration in `main.ts`

## 👥 Developers

- Do Davin ID: p20230018
- Huoth Sitha ID: p20230039
- Thy Sethasarakvath ID: p20230035
- Tat Chansereyvong ID: p20230021

## 🙏 Acknowledgments

- RTC-KPC (Regional Training Center for health KPC)
- NestJS Team
- Vue.js Team
