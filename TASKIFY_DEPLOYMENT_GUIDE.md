# 🚀 Taskify Deployment Guide - task-ify.com

## Overview
This guide will help you deploy your Taskify platform to your purchased domain **task-ify.com** with multiple hosting options and production configurations.

---

## 🏗️ **Deployment Options**

### **Option 1: Vercel (Recommended for Frontend)**
Best for: Fast deployment, automatic CI/CD, global CDN

#### Frontend Deployment:
1. **Connect to Vercel:**
   ```bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Login to Vercel
   vercel login
   
   # Deploy from frontend directory
   cd frontend
   vercel --prod
   ```

2. **Custom Domain Setup:**
   - Go to Vercel Dashboard → Project → Settings → Domains
   - Add `task-ify.com` and `www.task-ify.com`
   - Configure DNS records with your domain provider:
     ```
     Type: CNAME
     Name: www
     Value: cname.vercel-dns.com
     
     Type: A
     Name: @
     Value: 76.76.19.61
     ```

3. **Environment Variables:**
   ```env
   NEXT_PUBLIC_API_URL=https://api.task-ify.com
   NODE_ENV=production
   ```

---

### **Option 2: Railway (Great for Full Stack)**
Best for: Both frontend and backend, built-in database, easy scaling

#### Setup Steps:
1. **Connect GitHub Repository:**
   - Go to [Railway.app](https://railway.app)
   - Connect your GitHub account
   - Import `Infera-AI` repository

2. **Deploy Frontend:**
   ```bash
   # Railway will auto-detect Next.js
   # Set root directory to: frontend
   ```

3. **Deploy Backend:**
   ```bash
   # Set root directory to: backend
   # Railway will auto-detect Node.js
   ```

4. **Custom Domain:**
   - Railway Dashboard → Project → Settings → Domains
   - Add `task-ify.com` for frontend
   - Add `api.task-ify.com` for backend

---

### **Option 3: Digital Ocean App Platform**
Best for: Scalable production deployment, database integration

#### Deployment Steps:
1. **Create App:**
   ```yaml
   # .do/app.yaml
   name: taskify
   services:
   - name: frontend
     source_dir: /frontend
     github:
       repo: stanondieki/Infera-AI
       branch: main
     run_command: npm start
     environment_slug: node-js
     instance_count: 1
     instance_size_slug: basic-xxs
     domains:
     - domain: task-ify.com
       type: PRIMARY
   
   - name: backend
     source_dir: /backend
     github:
       repo: stanondieki/Infera-AI
       branch: main
     run_command: npm start
     environment_slug: node-js
     instance_count: 1
     instance_size_slug: basic-xxs
     domains:
     - domain: api.task-ify.com
       type: PRIMARY
   ```

---

## 🗄️ **Database Setup**

### **MongoDB Atlas (Recommended)**
1. **Create Cluster:**
   - Go to [MongoDB Atlas](https://cloud.mongodb.com)
   - Create free cluster
   - Choose region closest to your users

2. **Connection String:**
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/taskify
   ```

3. **Network Access:**
   - Add `0.0.0.0/0` for production access
   - Or specific IP ranges for security

---

## 🌐 **DNS Configuration**

### **Domain Settings for task-ify.com:**
Configure these DNS records with your domain registrar:

```dns
# Main domain
Type: A
Name: @
Value: [Your hosting provider IP]
TTL: 300

# WWW subdomain
Type: CNAME
Name: www
Value: task-ify.com
TTL: 300

# API subdomain
Type: CNAME
Name: api
Value: [Your backend hosting domain]
TTL: 300

# CDN (optional)
Type: CNAME
Name: cdn
Value: [CDN provider domain]
TTL: 300
```

---

## 🔐 **Environment Variables**

### **Frontend (.env.production):**
```env
# API Configuration
NEXT_PUBLIC_API_URL=https://api.task-ify.com
NEXT_PUBLIC_DOMAIN=https://task-ify.com

# Authentication
NEXT_PUBLIC_JWT_SECRET=your-super-secure-jwt-secret-key

# Analytics (optional)
NEXT_PUBLIC_GOOGLE_ANALYTICS=GA-XXXXXXXXX
```

### **Backend (.env.production):**
```env
# Server Configuration
NODE_ENV=production
PORT=5000
DOMAIN=https://task-ify.com
API_DOMAIN=https://api.task-ify.com

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/taskify

# Authentication
JWT_SECRET=your-super-secure-jwt-secret-key
JWT_EXPIRY=7d

# CORS
CORS_ORIGIN=https://task-ify.com,https://www.task-ify.com

# Email Service (optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

---

## 🚀 **Quick Deploy Commands**

### **Deploy to Vercel:**
```bash
# Frontend
cd frontend
npm run build
vercel --prod

# Custom domain
vercel domains add task-ify.com
```

### **Deploy to Railway:**
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway link
railway up
```

### **Deploy to Digital Ocean:**
```bash
# Install doctl
# https://docs.digitalocean.com/reference/doctl/how-to/install/

doctl apps create --spec .do/app.yaml
```

---

## 📊 **Production Optimizations**

### **Performance:**
```javascript
// next.config.ts
const nextConfig = {
  compress: true,
  poweredByHeader: false,
  generateEtags: false,
  images: {
    domains: ['task-ify.com', 'cdn.task-ify.com'],
    formats: ['image/webp', 'image/avif'],
  },
  experimental: {
    optimizeCss: true,
  },
};
```

### **Security Headers:**
```javascript
// middleware.ts
export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'origin-when-cross-origin');
  
  return response;
}
```

---

## 🔧 **SSL Certificate**

### **Automatic SSL (Recommended):**
- **Vercel**: Automatic SSL via Let's Encrypt
- **Railway**: Automatic SSL included
- **Digital Ocean**: Automatic SSL via Let's Encrypt

### **Manual SSL Setup:**
If using custom hosting:
```bash
# Using Certbot
sudo certbot --nginx -d task-ify.com -d www.task-ify.com
```

---

## 📱 **Mobile App Considerations**

### **PWA Configuration:**
```json
// public/manifest.json
{
  "name": "Taskify - AI Training Platform",
  "short_name": "Taskify",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#8b5cf6",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    }
  ]
}
```

---

## 🚦 **Go Live Checklist**

### **Pre-Launch:**
- [ ] Domain DNS configured
- [ ] SSL certificate active
- [ ] Environment variables set
- [ ] Database connected and tested
- [ ] Email service configured
- [ ] Analytics tracking setup
- [ ] Error monitoring (Sentry)
- [ ] Backup strategy configured

### **Post-Launch:**
- [ ] Monitor performance
- [ ] Check error logs
- [ ] Test all user flows
- [ ] Monitor database performance
- [ ] Set up monitoring alerts

---

## 🆘 **Support & Troubleshooting**

### **Common Issues:**

1. **DNS Propagation:**
   ```bash
   # Check DNS propagation
   nslookup task-ify.com
   ```

2. **SSL Certificate Issues:**
   ```bash
   # Test SSL
   openssl s_client -connect task-ify.com:443
   ```

3. **API Connection:**
   ```bash
   # Test API endpoint
   curl https://api.task-ify.com/health
   ```

---

## 🎯 **Recommended Approach**

**For task-ify.com deployment:**

1. **Start with Vercel** for frontend (easiest setup)
2. **Use Railway** for backend (great developer experience)
3. **MongoDB Atlas** for database (reliable and scalable)
4. **Configure custom domains** once deployed
5. **Add monitoring** with Vercel Analytics + LogRocket

This setup will give you:
- ✅ Fast global CDN
- ✅ Automatic deployments
- ✅ SSL certificates
- ✅ Scalable infrastructure
- ✅ Professional domain setup

**Estimated deployment time:** 2-4 hours including domain configuration.

Would you like me to help you with any specific deployment step?