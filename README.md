# Smart Utility App

A MERN stack application for managing electricity and water usage with modern UI/UX, designed for South African households and small industries.

## 🚀 Features

- **💡 Electricity Management**: Track usage, view remaining kWh, monitor consumption with smart alerts
- **💧 Water Management**: Monitor water levels, quality scores, and usage patterns by category
- **🏠 Appliance Control**: Smart management of washing machines, refrigerators, geysers, pool pumps, and more
- **📊 Advanced Analytics**: Interactive charts, efficiency scores, and usage predictions
- **💰 Cost Tracking**: All costs in South African Rands (R) with savings analytics
- **📱 Responsive Design**: Optimized for mobile, tablet, and desktop devices
- **🔐 Secure Authentication**: JWT-based login/registration system

## 🛠️ Tech Stack

**Frontend:**
- React 19 with TypeScript and Vite
- Tailwind CSS for modern styling
- Chart.js for interactive data visualization
- Lucide React for beautiful icons
- Axios for API communication

**Backend:**
- Node.js with Express.js
- MongoDB Atlas with Mongoose ODM
- JWT for secure authentication
- bcrypt for password hashing
- Comprehensive API validation

## 📁 Project Structure

```
smart-utility-app/
├── frontend/          # React application with modern UI
│   ├── src/
│   │   ├── components/  # Enhanced utility management components
│   │   ├── services/    # API service layer
│   │   └── ...
│   ├── netlify.toml    # Netlify deployment config
│   └── .env            # Environment variables
├── backend/           # Node.js API server
│   ├── models/        # MongoDB schemas
│   ├── routes/        # API endpoints
│   ├── middleware/    # Authentication & validation
│   └── ...
└── README.md         # This file
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- MongoDB Atlas account
- Git

### Local Development

#### 1. Clone the repository
```bash
git clone <your-repo-url>
cd "smart utility app"
```

#### 2. Backend Setup
```bash
cd backend
npm install

# Create .env file with:
NODE_ENV=development
PORT=5001
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/smart_utility_db
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRE=30d

npm run dev  # Starts on http://localhost:5001
```

#### 3. Frontend Setup
```bash
cd frontend
npm install

# Environment is auto-configured for development
npm run dev  # Starts on http://localhost:5173
```

## 🌐 Deployment to Netlify

### Step 1: Prepare Backend (Deploy First)
Deploy your backend to a service like Railway, Render, or Heroku:

1. **Railway Deployment:**
   ```bash
   # Install Railway CLI
   npm install -g @railway/cli
   
   # Login and deploy
   railway login
   railway init
   railway up
   ```

2. **Environment Variables for Backend:**
   - `MONGODB_URI`: Your MongoDB Atlas connection string
   - `JWT_SECRET`: Secure random string
   - `NODE_ENV=production`
   - `PORT`: Provided by hosting service

### Step 2: Update Frontend Environment
1. Update `frontend/.env.production`:
   ```env
   VITE_API_BASE_URL=https://your-backend-url.com/api
   ```

### Step 3: Deploy to Netlify

#### Option A: Netlify Dashboard (Recommended)
1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Connect to Netlify:**
   - Go to [netlify.com](https://netlify.com)
   - Click "New site from Git"
   - Connect your GitHub repository
   - Set build settings:
     - **Base directory:** `frontend`
     - **Build command:** `npm run build`
     - **Publish directory:** `frontend/dist`

3. **Environment Variables:**
   - In Netlify dashboard: Site settings → Environment variables
   - Add: `VITE_API_BASE_URL=https://your-backend-url.com/api`

#### Option B: Netlify CLI
```bash
# Install Netlify CLI
npm install -g netlify-cli

# In the frontend directory
cd frontend
npm run build

# Deploy
netlify login
netlify init
netlify deploy --prod --dir=dist
```

## 🔧 Configuration Files

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

### Environment Variables Summary
**Frontend (.env.production):**
- `VITE_API_BASE_URL`: Your deployed backend URL + `/api`

**Backend (Production):**
- `MONGODB_URI`: MongoDB Atlas connection string
- `JWT_SECRET`: Secure random string (min 32 characters)
- `NODE_ENV=production`
- `PORT`: Usually provided by hosting service

## 🌟 Key Features Highlights

### Enhanced Components
- **Dashboard**: Overview with real-time stats and beautiful charts
- **Electricity Monitor**: kWh tracking, cost analysis, efficiency scores
- **Water Monitor**: Usage by category (bathroom, kitchen, laundry, garden)
- **Appliance Manager**: Smart control by category (essential, high-usage, convenience)

### South African Specific
- All currency in South African Rands (R)
- Load shedding alerts and appliance prioritization
- Local utility rate considerations
- Prepaid electricity management

## 🚦 Troubleshooting Deployment

### Common Issues:

1. **Build Fails:**
   ```bash
   # Check dependencies
   npm install
   npm run build
   ```

2. **API Not Connecting:**
   - Verify `VITE_API_BASE_URL` is correct
   - Check backend is deployed and accessible
   - Verify CORS settings in backend

3. **Authentication Issues:**
   - Ensure JWT_SECRET is set in backend
   - Check token storage in localStorage

4. **Netlify Redirects:**
   - Ensure `netlify.toml` is in frontend root
   - Check redirect rules for SPA routing

## 📱 PWA & Future Enhancements

- Real-time WebSocket updates
- Progressive Web App capabilities  
- Push notifications for alerts
- IoT device integration
- Predictive analytics
- Multi-tenant support

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

---

**Live Demo:** `https://your-app-name.netlify.app`  
**API Documentation:** `https://your-backend-url.com/api/health`