# Complete Deployment Steps - Secure Content Workspace

This document provides step-by-step instructions for deploying the entire application to production.

## Prerequisites

- GitHub account with repository access
- Render account (free tier available)
- Vercel account (free tier available)
- Cloud MySQL database account (PlanetScale, Railway, or Aiven)

## Step 1: Verify GitHub Repository

✅ **Status**: Repository is ready at `https://github.com/hammad535/secure-content-workspace`

All code is committed and pushed to main branch.

## Step 2: Create Cloud MySQL Database

### Option A: PlanetScale (Recommended - Free Tier)

1. Go to [PlanetScale](https://planetscale.com)
2. Sign up / Log in
3. Click **Create database**
4. Name: `secure_content_workspace`
5. Region: Choose closest to your users
6. Click **Create database**
7. Click **Connect** → **Prisma**
8. Copy the connection string (format: `mysql://...`)

### Option B: Railway

1. Go to [Railway](https://railway.app)
2. Sign up / Log in
3. Click **New Project** → **Provision MySQL**
4. Click on MySQL service → **Variables** tab
5. Copy `MYSQL_URL` or construct: `mysql://root:PASSWORD@HOST:PORT/railway`

### Option C: Aiven

1. Go to [Aiven](https://aiven.io)
2. Sign up / Log in
3. Create MySQL service
4. Copy connection string from service details

**Important**: Save your `DATABASE_URL` - you'll need it for Render.

## Step 3: Deploy Backend to Render

### 3.1 Create Web Service

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **New +** → **Web Service**
3. Connect GitHub account if not already connected
4. Select repository: `hammad535/secure-content-workspace`
5. Configure:
   - **Name**: `secure-content-workspace-api`
   - **Region**: Choose closest to your database
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`

### 3.2 Set Environment Variables

Click **Environment** tab and add:

```
PORT=5000
DATABASE_URL=mysql://user:password@host:port/secure_content_workspace
JWT_SECRET=<GENERATE_A_SECURE_SECRET>
JWT_EXPIRES_IN=1h
FRONTEND_URL=https://placeholder.vercel.app
NODE_ENV=production
```

**Generate JWT_SECRET**:
- Use: `openssl rand -base64 32` (in terminal)
- Or use: [Random Key Generator](https://randomkeygen.com/)

**Important**: 
- Replace `DATABASE_URL` with your actual cloud MySQL URL
- `FRONTEND_URL` will be updated after frontend deployment

### 3.3 Deploy

1. Click **Create Web Service**
2. Wait for build to complete (3-5 minutes)
3. Note your backend URL: `https://secure-content-workspace-api.onrender.com` (or your custom name)

### 3.4 Run Database Migrations

1. In Render dashboard, go to your service
2. Click **Shell** tab (or use **Logs** → **Shell**)
3. Run:
   ```bash
   npx prisma migrate deploy
   ```
4. Verify output shows migrations applied successfully
5. Verify tables created:
   ```bash
   npx prisma studio
   ```
   (This will show Prisma Studio URL - you can check tables there)

## Step 4: Deploy Frontend to Vercel

### 4.1 Import Project

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **Add New** → **Project**
3. Import Git Repository: `hammad535/secure-content-workspace`
4. Configure:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `dist` (auto-detected)

### 4.2 Set Environment Variables

Before deploying, click **Environment Variables** and add:

```
VITE_API_URL=https://secure-content-workspace-api.onrender.com
```

Replace with your actual Render backend URL.

### 4.3 Deploy

1. Click **Deploy**
2. Wait for build to complete (1-2 minutes)
3. Note your frontend URL: `https://secure-content-workspace.vercel.app` (or your custom name)

## Step 5: Update Backend CORS

1. Go back to Render dashboard
2. Open your backend service
3. Go to **Environment** tab
4. Update `FRONTEND_URL` with your actual Vercel URL:
   ```
   FRONTEND_URL=https://secure-content-workspace.vercel.app
   ```
5. Click **Save Changes**
6. Render will automatically redeploy

## Step 6: End-to-End Verification

### 6.1 Test Backend Health

Visit: `https://your-backend.onrender.com/api/health`

Expected: `{"success":true,"message":"Server is running"}`

### 6.2 Test Frontend

1. Visit your Vercel URL
2. You should see the login page

### 6.3 Test Authentication

1. Click **Register**
2. Create first user (will automatically become ADMIN)
3. Fill form:
   - Name: `Admin User`
   - Email: `admin@example.com`
   - Password: `password123`
   - Role: `ADMIN` (will be forced to ADMIN anyway)
4. Click **Register**
5. Should redirect to Dashboard
6. Verify you see "Welcome back, Admin User"

### 6.4 Test RBAC - ADMIN

1. As ADMIN, create an article:
   - Click **Create Article** in sidebar
   - Title: `Test Article`
   - Content: `This is a test article`
   - Status: `Published`
   - Click **Create Article**
2. Verify article appears in Articles list
3. Click on article → Verify **Edit** and **Delete** buttons are visible
4. Test delete: Click **Delete** → Confirm → Article should be removed

### 6.5 Test RBAC - EDITOR

1. Logout (click Logout in navbar)
2. Register new user:
   - Name: `Editor User`
   - Email: `editor@example.com`
   - Password: `password123`
   - Role: `EDITOR`
3. Login with editor credentials
4. Create an article (should work)
5. Try to edit your own article (should work)
6. Try to delete article (should NOT see delete button)
7. As ADMIN, create another article
8. As EDITOR, try to edit ADMIN's article (should fail or not show edit button)

### 6.6 Test RBAC - VIEWER

1. Logout
2. Register new user:
   - Name: `Viewer User`
   - Email: `viewer@example.com`
   - Password: `password123`
   - Role: `VIEWER`
3. Login with viewer credentials
4. Verify:
   - Cannot see **Create Article** in sidebar
   - Can view published articles
   - Cannot edit or delete articles
   - Cannot see draft articles (except own, but viewer can't create)

### 6.7 Security Checks

1. Open browser DevTools → Console
2. Verify no CORS errors
3. Verify no console errors
4. Check Network tab:
   - API calls go to Render backend
   - All requests include `Authorization: Bearer <token>` header
   - No 401/403 errors for valid requests

## Step 7: Update Documentation

Update `README.md` with your live URLs:

```markdown
## Live Deployment

- **Frontend**: https://your-frontend.vercel.app
- **Backend**: https://your-backend.onrender.com
- **Database**: Cloud MySQL (PlanetScale/Railway/Aiven)
```

## Troubleshooting

### Backend Won't Start

- Check Render logs for errors
- Verify `DATABASE_URL` is correct
- Ensure Prisma migrations ran: `npx prisma migrate deploy`
- Check `JWT_SECRET` is set

### Database Connection Errors

- Verify `DATABASE_URL` format: `mysql://user:pass@host:port/db`
- Check database is accessible (not IP-restricted)
- Verify database user has proper permissions
- Test connection locally with: `npx prisma db pull`

### CORS Errors

- Verify `FRONTEND_URL` in Render matches Vercel URL exactly
- No trailing slashes
- Include `https://` protocol
- Redeploy backend after changing `FRONTEND_URL`

### Frontend Can't Connect to Backend

- Verify `VITE_API_URL` in Vercel matches Render backend URL
- Check backend is running: Visit `/api/health` endpoint
- Verify CORS is configured correctly
- Check browser console for specific error messages

### Prisma Migration Errors

- Run `npx prisma migrate deploy` in Render shell
- Check `binaryTargets` in `schema.prisma` includes deployment platform
- Verify Prisma version compatibility

## Final Checklist

- [ ] Backend deployed on Render
- [ ] Frontend deployed on Vercel
- [ ] Database created and connected
- [ ] Prisma migrations applied
- [ ] Environment variables set correctly
- [ ] CORS configured
- [ ] ADMIN user can create/edit/delete
- [ ] EDITOR user can create/edit own articles
- [ ] VIEWER user is read-only
- [ ] No CORS errors
- [ ] No console errors
- [ ] README updated with live URLs

## Support

If you encounter issues:

1. Check Render build logs
2. Check Vercel build logs
3. Check browser console
4. Test API endpoints directly with curl/Postman
5. Verify all environment variables are set
6. Review `DEPLOYMENT.md` for detailed troubleshooting
