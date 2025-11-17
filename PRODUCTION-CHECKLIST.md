# Production Deployment Checklist

## ✅ Prerequisites Setup

### 1. Azure App Service
- [ ] Create Resource Group: `InferaAI-RG`
- [ ] Create App Service: `infera-ai-backend`
- [ ] Set Runtime: Node.js 18 LTS
- [ ] Configure Environment Variables in Azure Portal

### 2. MongoDB Atlas
- [ ] Create free MongoDB Atlas cluster
- [ ] Create database user
- [ ] Whitelist IP addresses (0.0.0.0/0 for global access)
- [ ] Get connection string
- [ ] Update MONGODB_URI in Azure App Service settings

### 3. GitHub Secrets Configuration
Go to GitHub Repository → Settings → Secrets and variables → Actions

Add these secrets:
- [ ] `AZURE_WEBAPP_PUBLISH_PROFILE` (download from Azure App Service)
- [ ] `VERCEL_TOKEN` (from Vercel dashboard)
- [ ] `VERCEL_ORG_ID` (from Vercel project settings)
- [ ] `VERCEL_PROJECT_ID` (from Vercel project settings)

## ✅ Azure App Service Environment Variables

Set these in Azure Portal → App Service → Configuration → Application Settings:

```
NODE_ENV=production
PORT=80
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/infera_ai
JWT_SECRET=your-super-secure-jwt-secret-key-here-min-32-characters
FRONTEND_URL=https://infera-ai-five.vercel.app
```

## ✅ Deployment Process

1. **Push to main branch** - triggers automatic deployment
2. **Monitor GitHub Actions** - check deployment status
3. **Verify deployment** - test endpoints
4. **Check logs** - Azure Portal → App Service → Log stream

## ✅ Testing URLs

- Backend Health: https://infera-ai-backend.azurewebsites.net/health
- Frontend: https://infera-ai-five.vercel.app
- API Test: https://infera-ai-backend.azurewebsites.net/api

## ✅ Post-Deployment Verification

- [ ] Backend health check returns 200
- [ ] Frontend loads correctly
- [ ] Application form submission works
- [ ] Database connections are successful
- [ ] CORS is configured correctly
- [ ] GitHub Actions run successfully

## 🔧 Troubleshooting

### Common Issues:
1. **CORS errors** - Check allowed origins in backend
2. **MongoDB connection** - Verify connection string and IP whitelist
3. **Environment variables** - Ensure all required vars are set in Azure
4. **Build failures** - Check GitHub Actions logs
5. **Deployment timeouts** - Azure cold start can take 60+ seconds

### Useful Commands:
```bash
# Test backend locally
cd backend && npm run dev

# Test frontend locally  
cd frontend && npm run dev

# Build for production
npm run build

# Check Azure logs
az webapp log tail --name infera-ai-backend --resource-group InferaAI-RG
```