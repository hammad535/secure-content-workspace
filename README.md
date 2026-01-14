# Secure Content Workspace with RBAC

A production-grade MERN stack application implementing Role-Based Access Control (RBAC) for secure content management.

## Tech Stack

### Backend
- **Node.js** + **Express** - RESTful API server
- **Prisma ORM** - Type-safe database access
- **MySQL** - Relational database
- **JWT** - Token-based authentication
- **bcrypt** - Password hashing
- **Zod** - Schema validation

### Frontend
- **React** - UI library
- **React Router** - Client-side routing
- **Zustand** - State management
- **React Quill** - Rich text editor
- **Axios** - HTTP client
- **Tailwind CSS** - Utility-first CSS framework

## Project Architecture

### Backend Structure
```
backend/
├── prisma/
│   └── schema.prisma          # Database schema
├── src/
│   ├── config/                # Configuration (DB, etc.)
│   ├── controllers/           # Request handlers
│   ├── services/              # Business logic
│   ├── routes/                # API routes
│   ├── middlewares/           # Auth, validation, error handling
│   ├── validations/           # Zod schemas
│   └── utils/                 # Helper functions
```

### Frontend Structure
```
frontend/
├── src/
│   ├── components/            # Reusable components
│   ├── layouts/               # Layout components
│   ├── pages/                 # Page components
│   ├── store/                 # Zustand stores
│   ├── services/              # API service layer
│   └── router.jsx             # Route configuration
```

## Authentication Flow

1. User registers/logs in via `/api/auth/register` or `/api/auth/login`
2. Server validates credentials and returns JWT token
3. Frontend stores token in localStorage and Zustand store
4. Subsequent requests include token in `Authorization: Bearer <token>` header
5. Backend middleware validates token and attaches user to request object

## Role Registration Strategy

### How Roles Are Assigned

1. **First User Bootstrap**: When the database has zero users, the first registered user automatically becomes **ADMIN**, regardless of the role selected during registration. This ensures the system always has at least one administrator.

2. **Subsequent Users**: After the first user is created, new users can register with any role:
   - **ADMIN** - Full system access
   - **EDITOR** - Can create and edit their own articles
   - **VIEWER** - Read-only access

3. **Default Role**: If no role is specified during registration, the default role is **VIEWER**.

### Role Assignment Flow

```
Registration Request
    ↓
Check if database is empty
    ↓
If empty → Force ADMIN role
If not empty → Use selected role (or default VIEWER)
    ↓
Validate role with Zod schema
    ↓
Create user with assigned role
```

## Role & Permission Logic

### Permission Matrix

| Action | ADMIN | EDITOR | VIEWER |
|--------|-------|--------|--------|
| **View Published Articles** | ✅ | ✅ | ✅ |
| **View Draft Articles** | ✅ (all) | ✅ (own only) | ❌ |
| **Create Articles** | ✅ | ✅ | ❌ |
| **Edit Own Articles** | ✅ | ✅ | ❌ |
| **Edit Other's Articles** | ✅ | ❌ | ❌ |
| **Delete Articles** | ✅ (all) | ❌ | ❌ |

### Detailed Permissions

#### ADMIN
- ✅ Full access to all articles (view, create, edit, delete)
- ✅ Can view all draft articles
- ✅ Can edit any article regardless of ownership
- ✅ Can delete any article

#### EDITOR
- ✅ Can create new articles
- ✅ Can view published articles
- ✅ Can view and edit only their own draft articles
- ✅ Can edit only their own articles (ownership check enforced)
- ❌ Cannot delete articles
- ❌ Cannot edit articles created by other users

#### VIEWER
- ✅ Can view published articles only
- ❌ Cannot create articles
- ❌ Cannot edit articles
- ❌ Cannot delete articles
- ❌ Cannot view draft articles

### Permission Enforcement

- **Article Creation**: ADMIN, EDITOR (enforced via `authorize('ADMIN', 'EDITOR')` middleware)
- **Article Update**: ADMIN (all), EDITOR (own only) - Ownership check in service layer
- **Article Deletion**: ADMIN only (enforced via `authorize('ADMIN')` middleware)
- **Article Visibility**:
  - Published articles: visible to all authenticated users
  - Draft articles: visible only to owner and ADMIN (enforced in service layer)

### Ownership Checks

- Editors can only edit articles where `authorId === userId`
- Service layer enforces ownership before allowing updates
- Frontend conditionally renders edit/delete buttons based on role and ownership
- **Backend always validates permissions** - UI hiding is for UX only, not security

## Setup Instructions

### Prerequisites
- Node.js (v18+)
- MySQL (v8+)
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file (if not already created):
```env
PORT=5000
DATABASE_URL="mysql://task_user:securePassword123@localhost:3306/secure_content_workspace"
JWT_SECRET=super_secure_jwt_secret_change_later
JWT_EXPIRES_IN=1h
```

4. Generate Prisma client:
```bash
npm run prisma:generate
```

5. Run database migrations:
```bash
npm run prisma:migrate
```

6. Start development server:
```bash
npm run dev
```

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm run dev
```

### Database Setup

Ensure MySQL is running and the database `secure_content_workspace` exists with the user `task_user` having appropriate permissions.

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Articles
- `GET /api/articles` - Get all articles (public, filtered by role)
- `GET /api/articles/:id` - Get article by ID
- `POST /api/articles` - Create article (ADMIN, EDITOR)
- `PUT /api/articles/:id` - Update article (ADMIN or owner)
- `DELETE /api/articles/:id` - Delete article (ADMIN only)

## Assumptions & Trade-offs

### Assumptions
1. Single database instance (no read replicas)
2. JWT tokens stored in localStorage (consider httpOnly cookies for production)
3. First user automatically becomes ADMIN (bootstrap pattern)
4. Subsequent users can self-register with any role (including ADMIN)
5. Pagination defaults to 10 items per page
6. Role selection is available during registration (not admin-only assignment)

### Trade-offs
1. **State Management**: Chose Zustand over Redux Toolkit for simplicity and less boilerplate
2. **Rich Text Editor**: React Quill chosen for ease of integration (TipTap is more modern but requires more setup)
3. **Validation**: Zod used for both request validation and type safety
4. **Error Handling**: Centralized error middleware for consistent error responses

## Security Considerations

### Implemented
- ✅ Password hashing with bcrypt (10 rounds)
- ✅ JWT token expiration (1 hour)
- ✅ Role-based authorization middleware
- ✅ Ownership checks in service layer
- ✅ Input validation with Zod
- ✅ SQL injection prevention (Prisma parameterized queries)
- ✅ CORS configuration

### Production Recommendations
1. **JWT Storage**: Move tokens to httpOnly cookies to prevent XSS attacks
2. **Rate Limiting**: Implement rate limiting on auth endpoints
3. **HTTPS**: Enforce HTTPS in production
4. **Environment Variables**: Use secrets management (AWS Secrets Manager, etc.)
5. **Token Refresh**: Implement refresh token mechanism
6. **Audit Logging**: Log all sensitive operations (create, update, delete)
7. **Input Sanitization**: Sanitize rich text content to prevent XSS
8. **CORS**: Restrict CORS to specific origins in production

## Testing

### Manual Testing Checklist
- [ ] User registration and login
- [ ] Role-based article visibility
- [ ] Editor can only edit own articles
- [ ] Admin can edit/delete all articles
- [ ] Draft articles hidden from non-owners
- [ ] Pagination works correctly
- [ ] Rich text editor saves content properly

## Deployment

### Production Deployment

The application is configured for production deployment on:

- **Frontend**: Vercel
- **Backend**: Render
- **Database**: MySQL (cloud-hosted)

### Backend Deployment (Render)

1. **Create a new Web Service** on Render
2. **Connect your GitHub repository**
3. **Configure environment variables**:
   ```
   PORT=5000
   DATABASE_URL=mysql://user:password@host:port/database
   JWT_SECRET=your_secure_jwt_secret_here
   JWT_EXPIRES_IN=1h
   FRONTEND_URL=https://your-frontend.vercel.app
   ```
4. **Build Command**: `npm install && npm run build`
5. **Start Command**: `npm start`
6. **Run migrations**: After first deployment, run `npx prisma migrate deploy` in Render's shell

### Frontend Deployment (Vercel)

1. **Import your GitHub repository** to Vercel
2. **Set root directory** to `frontend`
3. **Configure environment variables**:
   ```
   VITE_API_URL=https://your-backend.onrender.com
   ```
4. **Build settings**:
   - Framework: React (Vite)
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. **Deploy**

### Environment Variables

#### Backend (Render)
- `PORT` - Server port (default: 5000)
- `DATABASE_URL` - MySQL connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `JWT_EXPIRES_IN` - Token expiration time
- `FRONTEND_URL` - Frontend URL for CORS

#### Frontend (Vercel)
- `VITE_API_URL` - Backend API URL

### Post-Deployment Verification

After deployment, verify:
- [ ] User registration works
- [ ] Login and JWT authentication works
- [ ] RBAC permissions are enforced
- [ ] Admin can delete articles
- [ ] Editor can edit own articles only
- [ ] Viewer is read-only
- [ ] No CORS errors
- [ ] API calls work from frontend

## Future Enhancements
- Unit and integration tests
- Docker containerization
- CI/CD pipeline
- Real-time notifications
- Article versioning
- Advanced search functionality
- File uploads for images
- Comment system
- User profile management

## License

This project is for evaluation purposes.
