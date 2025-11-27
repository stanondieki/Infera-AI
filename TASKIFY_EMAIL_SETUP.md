# 📧 Taskify Live Email Setup Guide

## Overview
This guide will help you set up live email functionality for Taskify so users receive real emails when they apply.

## 🚀 Quick Setup Options

### Option 1: Gmail (Recommended for Testing)
1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate App Password:**
   - Go to Google Account → Security → 2-Step Verification → App passwords
   - Generate password for "Mail"
3. **Update .env file:**
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-16-character-app-password
EMAIL_FROM=noreply@taskify.com
```

### Option 2: Professional Email Service (Recommended for Production)

#### SendGrid (Free: 100 emails/day)
```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=your-sendgrid-api-key
EMAIL_FROM=noreply@task-ify.com
```

#### Mailgun (Free: 5,000 emails/month)
```env
SMTP_HOST=smtp.mailgun.org
SMTP_PORT=587
SMTP_USER=postmaster@your-domain.mailgun.org
SMTP_PASS=your-mailgun-password
EMAIL_FROM=noreply@task-ify.com
```

## 📝 Environment Variables Setup

### Backend (.env file)
```env
# Email Configuration - REQUIRED for live emails
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
EMAIL_FROM=noreply@taskify.com
FRONTEND_URL=https://task-ify.com

# Database
MONGODB_URI=mongodb://localhost:27017/taskify_db

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Server
PORT=5000
NODE_ENV=production
```

## 🧪 Testing Email Functionality

### 1. Start Backend Server
```bash
cd backend
npm run dev
```

### 2. Test Email Endpoint
```bash
# Test welcome email
curl -X POST http://localhost:5000/api/applications \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Test",
    "lastName": "User", 
    "email": "your-test-email@gmail.com",
    "expertise": "AI Training",
    "experience": "2-5 years",
    "skills": ["Data Annotation"],
    "hoursPerWeek": "20-30",
    "motivation": "I want to contribute to AI development and earn flexible income."
  }'
```

## 📧 Email Templates Included

### 1. Welcome Email
- Sent immediately when user applies
- Includes login credentials
- Application summary
- Next steps

### 2. Status Update Emails
- Application accepted
- Application under review  
- Application rejected (with feedback)

## 🔧 Troubleshooting

### Common Issues:

#### Gmail "Less Secure App" Error
**Solution:** Use App Password instead of regular password

#### Connection Refused Error
**Solution:** Check SMTP settings and firewall

#### Authentication Failed
**Solution:** Verify username/password are correct

### Email Not Sending?
1. **Check logs:** Look for error messages in terminal
2. **Verify credentials:** Test SMTP settings
3. **Check spam folder:** Emails might be filtered
4. **Environment variables:** Ensure all variables are set

## 🌟 Production Deployment

### For task-ify.com Domain:

#### 1. Set Up Professional Email
- Use your domain: noreply@task-ify.com
- Set up SPF, DKIM, DMARC records
- Use services like SendGrid, Mailgun, or Amazon SES

#### 2. Environment Variables (Production)
```env
SMTP_HOST=smtp.sendgrid.net
SMTP_USER=apikey
SMTP_PASS=SG.your-sendgrid-api-key
EMAIL_FROM=noreply@task-ify.com
FRONTEND_URL=https://task-ify.com
NODE_ENV=production
```

#### 3. DNS Records (Add to your domain)
```
# SPF Record
TXT @ "v=spf1 include:sendgrid.net ~all"

# DKIM Record (from SendGrid)
CNAME s1._domainkey sg.domainkey.com

# DMARC Record  
TXT _dmarc "v=DMARC1; p=quarantine; rua=mailto:dmarc@task-ify.com"
```

## ✅ Email Features Implemented

- ✅ Welcome email with login credentials
- ✅ Application status updates
- ✅ Responsive HTML email design
- ✅ Error handling and logging
- ✅ Taskify branding throughout
- ✅ Professional email templates

## 🎯 Next Steps

1. **Choose email provider** (Gmail for testing, SendGrid for production)
2. **Update .env file** with credentials  
3. **Test application flow** 
4. **Deploy with live email** to task-ify.com

Your users will now receive professional emails when they apply to Taskify! 🚀