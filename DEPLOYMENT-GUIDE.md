# Smart Utility App - Netlify Deployment Guide

Complete step-by-step guide for deploying your Smart Utility App to Netlify.

## 📋 Pre-Deployment Checklist

- [x] ✅ Frontend ready with modern React + TypeScript
- [x] ✅ Backend API server ready  
- [x] ✅ Environment variables configured
- [x] ✅ Build process working locally
- [x] ✅ API service centralized
- [x] ✅ Currency converted to South African Rands (R)
- [x] ✅ Netlify configuration files created

## 🚀 Deployment Steps

### Step 1: Deploy Backend First

Your frontend needs a deployed backend to connect to. Choose one of these options:

#### Option A: Railway (Recommended)
```bash
# Install Railway CLI
npm install -g @railway/cli

# Navigate to backend folder
cd backend

# Login and initialize
railway login
railway init

# Set environment variables
railway variables:set NODE_ENV=production
railway variables:set MONGODB_URI="your_mongodb_atlas_connection_string"
railway variables:set JWT_SECRET="your_super_secure_jwt_secret_min_32_chars"
railway variables:set PORT=5001

# Deploy
railway up
```

#### Option B: Render
1. Go to [render.com](https://render.com)
2. Connect your GitHub repository
3. Create a new Web Service
4. Set **Root Directory**: `backend`
5. Set **Build Command**: `npm install`
6. Set **Start Command**: `npm start`
7. Add environment variables in Render dashboard

#### Option C: Heroku
```bash
# Install Heroku CLI
# Navigate to backend folder
cd backend

# Create Heroku app
heroku create your-smart-utility-backend

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set MONGODB_URI="your_mongodb_atlas_connection_string"
heroku config:set JWT_SECRET="your_super_secure_jwt_secret_min_32_chars"

# Deploy
git subtree push --prefix backend heroku main
```

### Step 2: Update Frontend Environment

Once your backend is deployed, update the frontend environment:

1. **Get your backend URL** (e.g., `https://your-app-name.up.railway.app`)

2. **Update `.env.production`**:
```env
VITE_API_BASE_URL=https://your-backend-url.com/api
```

### Step 3: Deploy Frontend to Netlify

#### Option A: Netlify Dashboard (Easiest)

1. **Push to GitHub**:
```bash
# In project root
git add .
git commit -m "Ready for Netlify deployment"
git push origin main
```

2. **Deploy via Netlify Dashboard**:
   - Go to [netlify.com](https://netlify.com) and log in
   - Click **"New site from Git"**
   - Choose **GitHub** and select your repository
   - Configure build settings:
     - **Branch to deploy**: `main`
     - **Base directory**: `frontend`
     - **Build command**: `npm run build`
     - **Publish directory**: `frontend/dist`

3. **Add Environment Variables**:
   - In Netlify: Site settings → Environment variables
   - Click **"Add variable"**:
     - **Key**: `VITE_API_BASE_URL`
     - **Value**: `https://your-backend-url.com/api`

4. **Deploy**: Click **"Deploy site"**

#### Option B: Netlify CLI (Advanced)

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Navigate to frontend
cd frontend

# Build the project
npm run build

# Login to Netlify
netlify login

# Initialize site
netlify init

# Set environment variables
netlify env:set VITE_API_BASE_URL https://your-backend-url.com/api

# Deploy
netlify deploy --prod --dir=dist
```

## 🔧 Configuration Files Summary

### `frontend/netlify.toml`
```toml
[[redirects]]
  from = "/*"
  to = "/index.html"  
  status = 200

[build]
  publish = "dist"
  command = "npm run build"
  
[build.environment]
  NODE_VERSION = "18"
```

### `frontend/.env` (Development)
```env
VITE_API_BASE_URL=http://localhost:5001/api
```

### `frontend/.env.production` (Production)
```env
VITE_API_BASE_URL=https://your-backend-url.com/api
```

## ✅ Post-Deployment Testing

### 1. Test Your Deployed App
- Visit your Netlify URL: `https://your-app-name.netlify.app`
- Test user registration and login
- Verify all features work (Dashboard, Electricity, Water, Appliances)
- Check browser developer tools for any console errors

### 2. Verify Backend Connection
- Open browser dev tools → Network tab
- Login/register and verify API calls reach your backend
- Check that data loads correctly on Dashboard

### 3. Test Mobile Responsiveness
- Test on different screen sizes
- Verify navigation works on mobile
- Check that all charts and components display properly

## 🐛 Common Issues & Solutions

### Build Fails
```bash
# Clear cache and rebuild
cd frontend
rm -rf node_modules package-lock.json
npm install
npm run build
```

### API Connection Issues
1. **Check Environment Variable**: Ensure `VITE_API_BASE_URL` is set correctly
2. **Check Backend CORS**: Verify backend allows your Netlify domain
3. **Check Backend Status**: Visit `https://your-backend-url.com/api/health`

### Authentication Problems
1. **JWT Secret**: Ensure JWT_SECRET is set in backend environment
2. **Token Storage**: Check if login stores token in localStorage
3. **API Headers**: Verify API service includes Authorization headers

### Routing Issues (404 on Refresh)
- Ensure `netlify.toml` has the redirect rule for single-page app
- Check that `netlify.toml` is in the `frontend` directory

### Environment Variables Not Working
1. **Prefix**: All frontend env vars must start with `VITE_`
2. **Rebuild**: After changing env vars, trigger a new build in Netlify
3. **Case Sensitive**: Environment variable names are case-sensitive

## 📈 Performance Optimization

### Frontend Optimizations Already Included:
- ✅ Vite for fast builds and hot reloading
- ✅ React lazy loading ready for code splitting
- ✅ Tailwind CSS for optimized styling
- ✅ Modern Chart.js for efficient data visualization

### Recommended Next Steps:
1. **Add Code Splitting**: Implement lazy loading for route components
2. **Add Service Worker**: Enable PWA features for offline functionality  
3. **Optimize Images**: Use WebP format and responsive images
4. **Add Caching**: Implement proper caching headers

## 🔐 Security Considerations

### Already Implemented:
- ✅ JWT authentication with secure token handling
- ✅ Environment variables for sensitive data
- ✅ HTTPS deployment on Netlify
- ✅ Input validation and sanitization

### Additional Security (Optional):
1. **Rate Limiting**: Add rate limiting to backend APIs
2. **CORS Configuration**: Restrict CORS to specific domains
3. **Content Security Policy**: Add CSP headers
4. **API Key Rotation**: Regularly rotate JWT secrets

## 📊 Monitoring & Analytics

### Add to Your Deployed App:
1. **Netlify Analytics**: Enable in Netlify dashboard
2. **Error Tracking**: Consider Sentry for error monitoring
3. **Performance Monitoring**: Use Lighthouse CI for performance checks
4. **Uptime Monitoring**: Monitor backend API availability

## 🎯 Success Indicators

Your deployment is successful when:
- ✅ App loads at your Netlify URL
- ✅ Users can register and login successfully  
- ✅ Dashboard displays with South African Rand currency (R)
- ✅ All navigation works (Electricity, Water, Appliances)
- ✅ Charts and data visualizations render correctly
- ✅ Mobile responsive design works properly
- ✅ No console errors in browser dev tools

## 🆘 Getting Help

### Documentation Links:
- [Netlify Docs](https://docs.netlify.com/)
- [Railway Docs](https://docs.railway.app/)
- [MongoDB Atlas](https://docs.atlas.mongodb.com/)
- [Vite Deployment](https://vitejs.dev/guide/static-deploy.html)

### Debug Commands:
```bash
# Check build locally
cd frontend && npm run build && npm run preview

# Test environment variables
npm run dev
# Check console.log(import.meta.env.VITE_API_BASE_URL)

# Check backend health
curl https://your-backend-url.com/api/health
```

---

**🎉 Congratulations!** Your Smart Utility App should now be live on Netlify!

**Next Steps:**
1. Share your app URL: `https://your-app-name.netlify.app`
2. Monitor usage and performance
3. Plan for future enhancements (IoT integration, real-time updates, etc.)