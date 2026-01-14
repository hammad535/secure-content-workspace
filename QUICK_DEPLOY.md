# Quick Deployment Checklist

Use this checklist to deploy the Secure Content Workspace in order.

## ✅ Pre-Deployment Checklist

- [x] Code pushed to GitHub: `https://github.com/hammad535/secure-content-workspace`
- [x] All environment files gitignored
- [x] Production configuration ready
- [x] CORS configured for production
- [x] Prisma schema includes binaryTargets

## 📋 Deployment Order

### 1. Database (5 minutes)

**Choose one:**
- [ ] PlanetScale: https://planetscale.com
- [ ] Railway: https://railway.app  
- [ ] Aiven: https://aiven.io

**Steps:**
1. Create MySQL database
2. Name: `secure_content_workspace`
3. Copy connection string → Save as `DATABASE_URL`

**Connection String Format:**
```
mysql://USER:PASSWORD@HOST:PORT/secure_content_workspace
```

---

### 2. Backend - Render (10 minutes)

**URL:** https://dashboard.render.com

**Steps:**
1. New + → Web Service
2. Connect GitHub → Select `secure-content-workspace`
3. Configure:
   - Name: `secure-content-workspace-api`
   - Root Directory: `backend`
   - Build: `npm install && npm run build`
   - Start: `npm start`
4. Environment Variables:
   ```
   PORT=5000
   DATABASE_URL=<from step 1>
   JWT_SECRET=<generate with: openssl rand -base64 32>
   JWT_EXPIRES_IN=1h
   FRONTEND_URL=https://placeholder.vercel.app
   NODE_ENV=production
   ```
5. Deploy → Wait for build
6. Note backend URL: `https://xxx.onrender.com`
7. Shell → Run: `npx prisma migrate deploy`

**Backend URL:** `https://____________________.onrender.com`

---

### 3. Frontend - Vercel (5 minutes)

**URL:** https://vercel.com/dashboard

**Steps:**
1. Add New → Project
2. Import `secure-content-workspace`
3. Configure:
   - Root Directory: `frontend`
   - Framework: Vite
4. Environment Variable:
   ```
   VITE_API_URL=<backend URL from step 2>
   ```
5. Deploy → Wait for build
6. Note frontend URL: `https://xxx.vercel.app`

**Frontend URL:** `https://____________________.vercel.app`

---

### 4. Update Backend CORS (2 minutes)

**In Render Dashboard:**
1. Open backend service
2. Environment tab
3. Update `FRONTEND_URL` with Vercel URL from step 3
4. Save → Auto-redeploys

---

### 5. Verification (10 minutes)

**Test Backend:**
- [ ] Visit: `https://your-backend.onrender.com/api/health`
- [ ] Should return: `{"success":true,"message":"Server is running"}`

**Test Frontend:**
- [ ] Visit Vercel URL
- [ ] See login page

**Test Authentication:**
- [ ] Register first user (becomes ADMIN)
- [ ] Login works
- [ ] Dashboard loads

**Test RBAC:**
- [ ] ADMIN: Create, edit, delete articles ✅
- [ ] EDITOR: Create, edit own articles only ✅
- [ ] VIEWER: Read-only ✅

**Security:**
- [ ] No CORS errors in console
- [ ] No exposed secrets
- [ ] JWT tokens work

---

## 📝 Final URLs

After deployment, update these:

**Frontend:** https://____________________.vercel.app
**Backend:** https://____________________.onrender.com
**Database:** Cloud MySQL (PlanetScale/Railway/Aiven)

---

## 🆘 Quick Troubleshooting

**Backend won't start:**
- Check DATABASE_URL format
- Run `npx prisma migrate deploy` in Render shell
- Check Render logs

**CORS errors:**
- Verify FRONTEND_URL matches Vercel URL exactly
- No trailing slashes
- Redeploy backend after updating

**Frontend can't connect:**
- Verify VITE_API_URL in Vercel
- Check backend is running
- Test backend health endpoint

---

## 📚 Full Documentation

- **Detailed Steps:** See `DEPLOYMENT_STEPS.md`
- **General Guide:** See `DEPLOYMENT.md`
- **Project README:** See `README.md`

---

**Total Time:** ~30 minutes
**Difficulty:** Medium
**Result:** Fully deployed production application
