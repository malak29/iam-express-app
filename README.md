# User Management API

A comprehensive REST API for user management with role-based authentication and authorization, built with Node.js, TypeScript, and Express.

# Architecture Diagram
![Architecture Diagram](https://github.com/malak29/iam-express-app/blob/master/out/plantuml/Architecture_diagram/Architecture_diagram.png?raw=true)

## 🚀 Features

- **🔐 JWT Authentication** - Secure token-based authentication
- **👥 User Management** - Complete CRUD operations for users
- **🛡️ Role-Based Authorization** - Admin, Department Head, and General user roles
- **🏢 Department Management** - Multi-department user organization
- **✅ Input Validation** - Comprehensive request validation with Zod
- **🐳 Docker Support** - Ready for containerized deployment
- **📝 API Documentation** - Postman collection included
- **🔒 Security Features** - Password hashing, permission checks, status management

## 📋 Table of Contents

- [Quick Start](#quick-start)
- [API Endpoints](#api-endpoints)
- [Authentication](#authentication)
- [User Roles & Permissions](#user-roles--permissions)
- [Installation](#installation)
- [Docker Deployment](#docker-deployment)
- [Environment Variables](#environment-variables)
- [API Testing](#api-testing)
- [Project Structure](#project-structure)
- [Contributing](#contributing)

## ⚡ Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Docker (optional)

### 1. Clone & Install
```bash
git clone https://github.com/yourusername/user-management-api.git
cd user-management-api
npm install
```

### 2. Setup Environment
```bash
cp .env.example .env
# Edit .env with your configuration
```

### 3. Seed Database
```bash
npm run seed
```

### 4. Start Development Server
```bash
npm run dev
```

The API will be available at `http://localhost:3000`

## 🔗 API Endpoints

### Authentication
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/login` | User login | ❌ |
| POST | `/api/auth/logout` | User logout | ❌ |
| GET | `/api/auth/me` | Get current user | ✅ |
| POST | `/api/auth/refresh` | Refresh JWT token | ✅ |
| POST | `/api/auth/change-password` | Change password | ✅ |

### User Management
| Method | Endpoint | Description | Auth Required | Permissions |
|--------|----------|-------------|---------------|-------------|
| POST | `/api/users` | Create new user | ✅ | Admin, Dept Head |
| GET | `/api/users/:id` | Get user by ID | ✅ | Based on role |
| GET | `/api/users/email/:email` | Get user by email | ✅ | Based on role |
| PUT | `/api/users/:id` | Update user | ✅ | Based on role |
| DELETE | `/api/users/:id` | Delete user | ✅ | Admin, Dept Head |
| PATCH | `/api/users/:id/status` | Change user status | ✅ | Based on role |

### Health Check
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/health` | API health status | ❌ |

## 🔐 Authentication

### Login
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "Admin123!"
}
```

### Using JWT Token
```bash
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 👥 User Roles & Permissions

### Role Hierarchy
1. **Admin** - Full system access
2. **Department Head** - Manage users in same department
3. **General** - Limited self-management

### Permission Matrix

| Action | Admin | Dept Head | General |
|--------|-------|-----------|---------|
| Create User | ✅ All | ✅ General users in same dept | ❌ |
| Read User | ✅ All | ✅ Same department | ✅ Self only |
| Update User | ✅ All | ✅ General users in same dept | ✅ Self only |
| Delete User | ✅ All | ✅ General users in same dept | ❌ |
| Change Status | ✅ All | ✅ Activate users in same dept | ✅ Deactivate self |

### User Types
- `GENERAL` - Standard user
- `DEPARTMENT_HEAD` - Department manager
- `ADMIN` - System administrator

### Departments
- `DEPARTMENT1` - Engineering
- `DEPARTMENT2` - Marketing
- `DEPARTMENT3` - Sales
- `DEPARTMENT4` - HR

### User Status
- `ACTIVE` - User can access system
- `INACTIVE` - User cannot access system

## 💻 Installation

### Development Setup

1. **Clone Repository**
   ```bash
   git clone https://github.com/yourusername/user-management-api.git
   cd user-management-api
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   ```bash
   cp .env.example .env
   ```

4. **Configure Environment Variables**
   ```bash
   # Required variables
   JWT_SECRET=your-super-secret-jwt-key-here
   ADMIN_PASSWORD=Admin123!
   
   # Optional variables
   PORT=3000
   NODE_ENV=development
   ```

5. **Initialize Database**
   ```bash
   npm run seed
   ```

6. **Start Development Server**
   ```bash
   npm run dev
   ```

### Production Setup

1. **Build Application**
   ```bash
   npm run build
   ```

2. **Start Production Server**
   ```bash
   npm start
   ```

## 🐳 Docker Deployment

### Development with Docker
```bash
cd cicd
./deploy-dev.sh
```

### Production with Docker
```bash
cd cicd
./deploy-prod.sh
```

### Manual Docker Commands
```bash
# Development
docker-compose -f cicd/docker-compose.dev.yml up -d

# Production
docker-compose -f cicd/docker-compose.prod.yml --env-file cicd/.env.prod up -d
```

## 🔧 Environment Variables

### Required Variables
| Variable | Description | Example |
|----------|-------------|---------|
| `JWT_SECRET` | Secret key for JWT tokens | `your-secret-key-min-32-chars` |
| `ADMIN_PASSWORD` | Initial admin password | `Admin123!` |

### Optional Variables
| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `3000` |
| `NODE_ENV` | Environment | `development` |
| `DB_PATH` | Database file path | `./db/users.json` |
| `JWT_EXPIRES_IN` | Token expiration | `24h` |
| `ADMIN_EMAIL` | Admin email | `admin@example.com` |
| `LOG_LEVEL` | Logging level | `debug` |

### Environment File Example
```bash
# .env
NODE_ENV=development
PORT=3000
DB_PATH=./db/users.json
JWT_SECRET=your-super-secret-jwt-key-here-minimum-32-characters-long
JWT_EXPIRES_IN=24h
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=Admin123!
LOG_LEVEL=debug
```

## 🧪 API Testing

### Postman Collection

1. **Import Collection**
   ```bash
   # Import file: postman/collections/user-management-api.json
   ```

2. **Import Environment**
   ```bash
   # Import file: postman/environments/development.json
   ```

3. **Test Flow**
   - Run `Login` request first
   - JWT token auto-saves to environment
   - Run other requests with automatic authentication

### Manual Testing with cURL

**Login:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"Admin123!"}'
```

**Create User:**
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "id": "user-001",
    "name": "John Doe", 
    "email": "john@example.com",
    "password": "password123",
    "userType": "GENERAL",
    "department": "DEPARTMENT1",
    "status": "ACTIVE"
  }'
```

## 📁 Project Structure

```
user-management-api/
├── src/
│   ├── config/
│   │   └── env.ts                 # Environment configuration
│   ├── controllers/
│   │   ├── AuthController.ts      # Authentication endpoints
│   │   └── UserController.ts      # User management endpoints
│   ├── middleware/
│   │   ├── authMiddleware.ts      # JWT authentication
│   │   └── errorMiddleware.ts     # Error handling
│   ├── models/
│   │   ├── User.ts               # User factory functions
│   │   └── UserModel.ts          # Database operations
│   ├── routes/
│   │   ├── authRoutes.ts         # Authentication routes
│   │   └── userRoutes.ts         # User management routes
│   ├── schemas/
│   │   ├── AuthSchemas.ts        # Authentication validation
│   │   ├── UserSchemas.ts        # User validation
│   │   └── shared/
│   │       └── EnumSchemas.ts    # Reusable enum schemas
│   ├── services/
│   │   ├── AuthService.ts        # Authentication business logic
│   │   ├── UserService.ts        # User business logic
│   │   └── PermissionService.ts  # Permission checking
│   ├── types/
│   │   ├── UserTypes.ts          # User type definitions
│   │   ├── AuthTypes.ts          # Auth type definitions
│   │   ├── ResponseTypes.ts      # API response types
│   │   └── ErrorTypes.ts         # Error type definitions
│   ├── utils/
│   │   ├── validationHelper.ts   # Zod validation utilities
│   │   ├── responseHelper.ts     # API response utilities
│   │   └── errorHelper.ts        # Error handling utilities
│   ├── scripts/
│   │   └── seed.ts              # Database seeding
│   ├── app.ts                   # Express app configuration
│   └── index.ts                 # Application entry point
├── cicd/
│   ├── Dockerfile               # Docker configuration
│   ├── docker-compose.dev.yml  # Development environment
│   ├── docker-compose.prod.yml # Production environment
│   ├── deploy-dev.sh           # Development deployment
│   └── deploy-prod.sh          # Production deployment
├── postman/
│   ├── collections/            # Postman API collections
│   └── environments/          # Postman environments
├── db/
│   └── users.json             # JSON database file
└── docs/
    └── API.md                 # Detailed API documentation
```

## 🛠️ Development

### Available Scripts

```bash
# Development
npm run dev          # Start development server with hot reload
npm run build        # Build TypeScript to JavaScript
npm start           # Start production server

# Database
npm run seed        # Create initial admin user

# Docker
npm run docker:dev  # Start development container
npm run docker:prod # Start production container

# Testing
npm run test        # Run tests (when implemented)
```

### Code Style & Quality

- **TypeScript** for type safety
- **ESLint** for code linting
- **Prettier** for code formatting
- **Zod** for runtime validation
- **Modular architecture** for maintainability

### Adding New Features

1. **Add types** in `src/types/`
2. **Create schemas** in `src/schemas/`
3. **Implement models** in `src/models/`
4. **Add services** in `src/services/`
5. **Create controllers** in `src/controllers/`
6. **Define routes** in `src/routes/`
7. **Update tests** and documentation

## 🔒 Security Features

- **JWT Authentication** with secure token generation
- **Password Hashing** using bcrypt with salt rounds
- **Input Validation** preventing injection attacks
- **Role-Based Access Control** limiting user actions
- **Request Rate Limiting** (in production with Nginx)
- **Security Headers** preventing common attacks
- **Environment Variable Protection** keeping secrets secure

## 🚦 API Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {
    "id": "user-001",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "path": "email",
      "message": "Invalid email format"
    }
  ]
}
```

## 📊 HTTP Status Codes

| Code | Meaning | Usage |
|------|---------|-------|
| 200 | OK | Successful GET, PUT, PATCH |
| 201 | Created | Successful POST |
| 400 | Bad Request | Validation errors |
| 401 | Unauthorized | Authentication required |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource not found |
| 409 | Conflict | Resource already exists |
| 422 | Unprocessable Entity | Invalid state change |
| 500 | Internal Server Error | Server error |

## 🤝 Contributing

1. **Fork the repository**
2. **Create feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit changes** (`git commit -m 'Add amazing feature'`)
4. **Push to branch** (`git push origin feature/amazing-feature`)
5. **Open Pull Request**

### Development Guidelines

- Follow TypeScript best practices
- Add proper error handling
- Include input validation
- Write descriptive commit messages
- Update documentation for new features
- Test thoroughly before submitting

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Your Name**
- GitHub: [@malak29](https://github.com/malak29)
- LinkedIn: [Malak Parmar](https://linkedin.com/in/malak29)
- Email: malakparmar.29@gmail.com

## 🙏 Acknowledgments

- [Express.js](https://expressjs.com/) - Web framework
- [TypeScript](https://www.typescriptlang.com/) - Type safety
- [Zod](https://zod.dev/) - Schema validation
- [JWT](https://jwt.io/) - Authentication tokens
- [bcrypt](https://www.npmjs.com/package/bcrypt) - Password hashing

## 📈 Roadmap

- [ ] Unit and integration tests
- [ ] Swagger/OpenAPI documentation
- [ ] Email notifications
- [ ] Password reset functionality
- [ ] User activity logging
- [ ] Real database integration (PostgreSQL/MongoDB)
- [ ] Rate limiting implementation
- [ ] File upload support
- [ ] WebSocket notifications
- [ ] Microservice architecture

---

**⭐ Star this repository if you found it helpful!**
