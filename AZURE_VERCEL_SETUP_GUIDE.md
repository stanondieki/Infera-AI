# 🚀 Taskify Environment Variables Setup Guide
## Azure Portal & Vercel Configuration

## 🌐 Azure Portal Setup (Backend)

### Step 1: Access Azure Portal
1. Go to [portal.azure.com](https://portal.azure.com)
2. Sign in with your Azure account
3. Find your **App Service** (where your backend is deployed)

### Step 2: Configure Environment Variables
1. Navigate to your App Service → **Configuration** → **Application settings**
2. Click **+ New application setting** for each variable:

#### Required Environment Variables for Taskify Backend:

```env
# Database Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/taskify_db

# Authentication
JWT_SECRET=your-super-secure-jwt-secret-key-for-production
JWT_EXPIRES_IN=7d

# Server Configuration  
PORT=8000
NODE_ENV=production

# Frontend URL (Your Vercel domain)
FRONTEND_URL=https://task-ify.com

# Email Configuration (Choose one provider)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-gmail-app-password
EMAIL_FROM=noreply@taskify.com

# Admin Settings
INITIAL_ADMIN_EMAIL=admin@taskify.com
INITIAL_ADMIN_PASSWORD=SecureAdmin123!

# File Upload
MAX_FILE_SIZE=10MB
UPLOAD_PATH=uploads/
```

### Step 3: Azure Portal Instructions
1. **Add each variable individually:**
   - Name: `MONGODB_URI`
   - Value: `mongodb+srv://username:password@cluster.mongodb.net/taskify_db`
   - Click **OK**

2. **Repeat for all variables above**

3. **Click Save** at the top of the Configuration page

4. **Restart your App Service** for changes to take effect

---

## ⚡ Vercel Setup (Frontend)

### Step 1: Access Vercel Dashboard
1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Select your Taskify frontend project

### Step 2: Configure Environment Variables
1. Go to **Settings** → **Environment Variables**
2. Add the following variables:

#### Required Environment Variables for Taskify Frontend:

```env
# Backend API URL (Your Azure backend URL)
NEXT_PUBLIC_API_URL=https://your-taskify-backend.azurewebsites.net/api

# Frontend URL (for callbacks and redirects)
NEXT_PUBLIC_FRONTEND_URL=https://task-ify.com

# Environment
NODE_ENV=production

# Optional: Analytics/Tracking
NEXT_PUBLIC_GA_ID=your-google-analytics-id
```

### Step 3: Vercel Setup Instructions
1. **Click "Add New"**
2. **For each variable:**
   - Name: `NEXT_PUBLIC_API_URL`
   - Value: `https://your-backend-url.azurewebsites.net/api`
   - Environment: Select **Production** (and Preview if needed)
   - Click **Save**

3. **Redeploy your frontend** after adding variables

---

## 📧 Email Provider Setup Options

### Option 1: Gmail (For Testing)
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-16-character-app-password
```

**Setup Steps:**
1. Enable 2-Factor Authentication on Gmail
2. Go to Google Account → Security → 2-Step Verification → App passwords
3. Generate password for "Mail"
4. Use the 16-character password (not your regular password)

### Option 2: SendGrid (Production Recommended)
```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=SG.your-sendgrid-api-key
```

**Setup Steps:**
1. Create account at [sendgrid.com](https://sendgrid.com)
2. Verify your domain (task-ify.com)
3. Generate API key
4. Use "apikey" as username and API key as password

### Option 3: Outlook/Hotmail
```env
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_USER=your-email@outlook.com
SMTP_PASS=your-outlook-password
```

---

## 🔧 Step-by-Step Azure Configuration

### 1. Navigate to Configuration
```
Azure Portal → App Services → [Your Taskify Backend] → Configuration → Application settings
```

### 2. Add Variables One by One
Click **+ New application setting** and add:

| Name | Value |
|------|-------|
| `MONGODB_URI` | `mongodb+srv://user:pass@cluster.mongodb.net/taskify_db` |
| `JWT_SECRET` | `taskify-super-secret-jwt-key-2025-production` |
| `NODE_ENV` | `production` |
| `FRONTEND_URL` | `https://task-ify.com` |
| `SMTP_HOST` | `smtp.gmail.com` |
| `SMTP_PORT` | `587` |
| `SMTP_USER` | `your-email@gmail.com` |
| `SMTP_PASS` | `your-app-password` |
| `EMAIL_FROM` | `noreply@taskify.com` |

### 3. Save and Restart
- Click **Save** at the top
- Go to **Overview** → **Restart**

---

## ⚡ Step-by-Step Vercel Configuration

### 1. Navigate to Environment Variables
```
Vercel Dashboard → [Your Taskify Project] → Settings → Environment Variables
```

### 2. Add Frontend Variables
Click **Add New** for each:

| Name | Value | Environment |
|------|-------|-------------|
| `NEXT_PUBLIC_API_URL` | `https://your-backend.azurewebsites.net/api` | Production |
| `NEXT_PUBLIC_FRONTEND_URL` | `https://task-ify.com` | Production |
| `NODE_ENV` | `production` | Production |

### 3. Redeploy
- Go to **Deployments** tab
- Click **Redeploy** on latest deployment

---

## 🧪 Testing Your Setup

### 1. Test Backend Environment Variables
```bash
# Check if your backend is running with correct env vars
curl https://your-backend.azurewebsites.net/health
```

### 2. Test Email Functionality
```bash
# Send test email
curl -X POST https://your-backend.azurewebsites.net/api/applications/test-email \
  -H "Content-Type: application/json" \
  -d '{"email": "your-test-email@gmail.com"}'
```

### 3. Test Frontend Connection
1. Visit your Vercel deployment: `https://task-ify.com`
2. Try to apply for a position
3. Check if email is received

---

## 🚨 Troubleshooting

### Common Issues:

#### Azure Variables Not Working
- ✅ Check variable names (case-sensitive)
- ✅ Restart App Service after changes
- ✅ Check Application Insights logs for errors

#### Vercel Variables Not Working
- ✅ Variables must start with `NEXT_PUBLIC_` for client-side
- ✅ Redeploy after adding variables
- ✅ Check build logs for errors

#### Email Not Sending
- ✅ Verify Gmail App Password (16 characters)
- ✅ Check Azure logs for SMTP errors
- ✅ Test SMTP credentials locally first

### Debug Steps:
1. **Check Azure logs:** App Service → Log stream
2. **Check Vercel logs:** Deployment → Function logs  
3. **Test locally first** with same environment variables

---

## ✅ Final Checklist

### Azure Backend:
- [ ] All environment variables added
- [ ] App Service restarted
- [ ] CORS configured for frontend domain
- [ ] Database connection working
- [ ] Email credentials tested

### Vercel Frontend:
- [ ] API URL pointing to Azure backend
- [ ] Environment variables added
- [ ] Project redeployed
- [ ] Custom domain configured (task-ify.com)
- [ ] SSL certificate active

### Domain Setup:
- [ ] DNS pointing to Vercel
- [ ] Custom domain added in Vercel
- [ ] SSL certificate issued
- [ ] Backend CORS updated for new domain

Your Taskify platform will be fully live with email functionality once these steps are completed! 🚀