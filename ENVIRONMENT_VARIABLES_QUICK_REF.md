# 🎯 Taskify Environment Variables Quick Reference

## 🔵 Azure Portal (Backend) - Copy & Paste Ready

### Navigate to: App Service → Configuration → Application settings

```
MONGODB_URI = mongodb+srv://username:password@cluster.mongodb.net/taskify_db
JWT_SECRET = taskify-super-secret-jwt-key-2025-production-change-this
JWT_EXPIRES_IN = 7d
PORT = 8000
NODE_ENV = production
FRONTEND_URL = https://task-ify.com
SMTP_HOST = smtp.gmail.com
SMTP_PORT = 587
SMTP_USER = your-email@gmail.com
SMTP_PASS = your-16-character-app-password
EMAIL_FROM = noreply@taskify.com
INITIAL_ADMIN_EMAIL = admin@taskify.com
INITIAL_ADMIN_PASSWORD = SecureAdmin123!
MAX_FILE_SIZE = 10MB
UPLOAD_PATH = uploads/
```

---

## ⚡ Vercel (Frontend) - Copy & Paste Ready

### Navigate to: Project → Settings → Environment Variables

```
NEXT_PUBLIC_API_URL = https://your-taskify-backend.azurewebsites.net/api
NEXT_PUBLIC_FRONTEND_URL = https://task-ify.com
NODE_ENV = production
```

---

## 📧 Email Setup (Choose One)

### Gmail Setup:
1. **Enable 2FA** on your Gmail account
2. **Generate App Password:**
   - Google Account → Security → 2-Step Verification → App passwords
   - Create password for "Mail"
3. **Use in Azure:**
```
SMTP_HOST = smtp.gmail.com
SMTP_PORT = 587
SMTP_USER = your-email@gmail.com
SMTP_PASS = abcd-efgh-ijkl-mnop  (16 character app password)
```

### SendGrid Setup (Recommended for Production):
1. **Create account** at sendgrid.com
2. **Verify domain** task-ify.com
3. **Generate API key**
4. **Use in Azure:**
```
SMTP_HOST = smtp.sendgrid.net
SMTP_PORT = 587
SMTP_USER = apikey
SMTP_PASS = SG.your-actual-sendgrid-api-key
```

---

## 🚀 Quick Setup Steps

### Azure Portal:
1. **Find your App Service** in Azure Portal
2. **Go to Configuration** → Application settings
3. **Click "+ New application setting"** for each variable above
4. **Save** and **Restart** your App Service

### Vercel:
1. **Go to vercel.com/dashboard**
2. **Select your Taskify project**
3. **Settings** → Environment Variables
4. **Add New** for each variable above
5. **Redeploy** your project

---

## 🧪 Test Commands

### Test Azure Backend:
```bash
curl https://your-backend-name.azurewebsites.net/health
```

### Test Email:
```bash
curl -X POST https://your-backend-name.azurewebsites.net/api/applications/test-email \
  -H "Content-Type: application/json" \
  -d '{"email": "your-test-email@gmail.com"}'
```

### Test Frontend:
Visit: `https://task-ify.com` and try applying

---

## 🔗 Important URLs to Update

Replace these with your actual URLs:
- `your-taskify-backend` → Your actual Azure App Service name
- `your-email@gmail.com` → Your actual Gmail address
- `task-ify.com` → Your actual domain

---

## ⚠️ Security Notes

- **Never commit** these values to GitHub
- **Use strong passwords** for production
- **Rotate secrets** regularly
- **Use different values** for staging vs production

Your Taskify platform will be live with email functionality once these are configured! 🎉