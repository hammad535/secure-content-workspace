# Deployment Guide

This guide walks you through deploying the Secure Content Workspace to production.

## Prerequisites

- GitHub account with repository access
- Render account (for backend)
- Vercel account (for frontend)
- Cloud MySQL database (Render, PlanetScale, or similar)

## Step 1: Deploy Backend to Render

### 1.1 Create MySQL Database

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **New +** → **PostgreSQL** (or use external MySQL)
3. For external MySQL, use services like:
   - PlanetScale
   - AWS RDS
   - Google Cloud SQL
   - Azure Database for MySQL

### 1.2 Create Web Service

1. In Render Dashboard, click **New +** → **Web Service**
2. Connect your GitHub repository
3. Select the repository: `secure-content-workspace`
4. Configure settings:
   - **Name**: `secure-content-workspace-api`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`

### 1.3 Set Environment Variables

Add these environment variables in Render:

```
PORT=5000
DATABASE_URL=mysql://user:password@host:port/database
JWT_SECRET=your_very_secure_jwt_secret_here_change_this
JWT_EXPIRES_IN=1h
FRONTEND_URL=https://your-frontend.vercel.app
NODE_ENV=production
```

**Important**: 
- Replace `DATABASE_URL` with your actual MySQL connection string
- Use a strong, random `JWT_SECRET` (you can generate one with: `openssl rand -base64 32`)
- Set `FRONTEND_URL` after deploying frontend (you can update it later)

### 1.4 Deploy

1. Click **Create Web Service**
2. Wait for build to complete
3. Note your backend URL (e.g., `https://secure-content-workspace-api.onrender.com`)

### 1.5 Run Database Migrations

After first deployment:

1. Go to your service in Render
2. Click **Shell** tab
3. Run: `npx prisma migrate deploy`
4. This will create all database tables

## Step 2: Deploy Frontend to Vercel

### 2.1 Import Repository

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **Add New** → **Project**
3. Import your GitHub repository: `secure-content-workspace`
4. Configure settings:
   - **Framework Preset**: React (Vite)
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### 2.2 Set Environment Variables

Add this environment variable in Vercel:

```
VITE_API_URL=https://your-backend.onrender.com
```

Replace `https://your-backend.onrender.com` with your actual Render backend URL.

### 2.3 Deploy

1. Click **Deploy**
2. Wait for build to complete
3. Note your frontend URL (e.g., `https://secure-content-workspace.vercel.app`)

### 2.4 Update Backend CORS

After frontend is deployed:

1. Go back to Render dashboard
2. Update the `FRONTEND_URL` environment variable with your Vercel URL
3. Redeploy the backend service

## Step 3: Verify Deployment

### 3.1 Test Backend

Visit: `https://your-backend.onrender.com/api/health`

Should return: `{"success":true,"message":"Server is running"}`

### 3.2 Test Frontend

1. Visit your Vercel URL
2. Register a new user (first user becomes ADMIN)
3. Test login
4. Create an article
5. Verify RBAC permissions

### 3.3 Test RBAC

- **ADMIN**: Should be able to delete any article
- **EDITOR**: Should only edit own articles, cannot delete
- **VIEWER**: Read-only, cannot create/edit/delete

## Troubleshooting

### Backend Issues

**Database Connection Error**:
- Verify `DATABASE_URL` is correct
- Check database is accessible from Render
- Ensure database user has proper permissions

**CORS Errors**:
- Verify `FRONTEND_URL` matches your Vercel URL exactly
- Check for trailing slashes
- Ensure backend is redeployed after changing `FRONTEND_URL`

**Prisma Errors**:
- Run `npx prisma migrate deploy` in Render shell
- Check `binaryTargets` in `schema.prisma` includes deployment platform

### Frontend Issues

**API Connection Error**:
- Verify `VITE_API_URL` is set correctly in Vercel
- Check backend is running and accessible
- Ensure CORS is configured properly

**Build Errors**:
- Check Node version compatibility
- Verify all dependencies are in `package.json`
- Check build logs in Vercel dashboard

## Environment Variables Reference

### Backend (Render)

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port | `5000` |
| `DATABASE_URL` | MySQL connection string | `mysql://user:pass@host:3306/db` |
| `JWT_SECRET` | Secret for JWT tokens | `your-secret-key` |
| `JWT_EXPIRES_IN` | Token expiration | `1h` |
| `FRONTEND_URL` | Frontend URL for CORS | `https://app.vercel.app` |
| `NODE_ENV` | Environment | `production` |

### Frontend (Vercel)

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `https://api.onrender.com` |

## Security Checklist

- [ ] Strong `JWT_SECRET` is set (not default)
- [ ] Database credentials are secure
- [ ] CORS is restricted to frontend URL
- [ ] Environment variables are not committed to Git
- [ ] HTTPS is enforced (automatic on Render/Vercel)
- [ ] Database is not publicly accessible

## Next Steps

After successful deployment:

1. Test all features thoroughly
2. Monitor error logs in both platforms
3. Set up monitoring/alerting if needed
4. Consider adding rate limiting
5. Set up automated backups for database

## Support

If you encounter issues:

1. Check Render/Vercel build logs
2. Verify environment variables are set correctly
3. Test API endpoints directly with curl/Postman
4. Check browser console for frontend errors
5. Review server logs in Render dashboard
