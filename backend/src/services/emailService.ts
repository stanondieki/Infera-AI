import nodemailer from 'nodemailer';
import { IApplication } from '../models/Application';

interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async sendWelcomeEmail(application: IApplication, password: string) {
    const emailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .credentials { background: #e8f4fd; padding: 15px; border-left: 4px solid #667eea; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎉 Welcome to Taskify!</h1>
          <p>Your application has been submitted successfully</p>
        </div>
        
        <div class="content">
          <h2>Hello ${application.firstName} ${application.lastName},</h2>
          
          <p>Congratulations! Your application to join Taskify has been submitted successfully. We've also created your account so you can start exploring opportunities right away.</p>
          
          <div class="credentials">
            <h3>Your Login Credentials:</h3>
            <p><strong>Email:</strong> ${application.email}</p>
            <p><strong>Password:</strong> ${password}</p>
            <p><strong>Dashboard URL:</strong> <a href="${process.env.FRONTEND_URL}/dashboard">Access Dashboard</a></p>
          </div>
          
          <h3>What's Next?</h3>
          <ul>
            <li>✅ <strong>Application Status:</strong> Under Review</li>
            <li>📧 <strong>Review Time:</strong> 24-48 hours</li>
            <li>🎯 <strong>Average Response:</strong> 95% of qualified applicants hear back within 2 days</li>
            <li>💰 <strong>Earning Potential:</strong> $25-80+ per hour based on your skills</li>
          </ul>
          
          <a href="${process.env.FRONTEND_URL}/dashboard" class="button">Access Your Dashboard</a>
          
          <h3>Your Application Summary:</h3>
          <ul>
            <li><strong>Expertise:</strong> ${application.expertise}</li>
            <li><strong>Experience:</strong> ${application.experience}</li>
            <li><strong>Skills:</strong> ${application.skills.join(', ')}</li>
            <li><strong>Availability:</strong> ${application.hoursPerWeek} hours/week</li>
          </ul>
          
          <p>While your application is being reviewed, you can:</p>
          <ul>
            <li>Complete your profile</li>
            <li>Browse available opportunities</li>
            <li>Join our community discussions</li>
            <li>Access training materials</li>
          </ul>
          
          <p>If you have any questions, feel free to reach out to our support team at <a href="mailto:support@taskify.com">support@taskify.com</a></p>
          
          <p>Best regards,<br>The Taskify Team</p>
        </div>
        
        <div class="footer">
          <p>© 2025 Taskify. All rights reserved.</p>
          <p>This email was sent to ${application.email}</p>
        </div>
      </div>
    </body>
    </html>
    `;

    const mailOptions = {
      from: `"Taskify" <${process.env.SMTP_USER}>`,
      to: application.email,
      subject: '🎉 Welcome to Taskify - Your Account is Ready!',
      html: emailHtml,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log('✅ Welcome email sent to:', application.email);
      return true;
    } catch (error) {
      console.error('❌ Failed to send welcome email:', error);
      console.log('📧 Email content that would have been sent:');
      console.log('📧 To:', mailOptions.to);
      console.log('📧 Subject:', mailOptions.subject);
      console.log('📧 HTML Content:');
      console.log(mailOptions.html);
      console.log('📧 ─────────────────────────────────────────────');
      return false;
    }
  }

  async sendApplicationStatusUpdate(application: IApplication, status: string, notes?: string) {
    let statusMessage = '';
    let statusColor = '#667eea';
    let statusIcon = '📋';

    switch (status) {
      case 'accepted':
        statusMessage = 'Congratulations! Your application has been accepted.';
        statusColor = '#10b981';
        statusIcon = '🎉';
        break;
      case 'rejected':
        statusMessage = 'Thank you for your interest. Unfortunately, your application was not selected at this time.';
        statusColor = '#ef4444';
        statusIcon = '📝';
        break;
      case 'reviewing':
        statusMessage = 'Your application is currently under review by our team.';
        statusColor = '#f59e0b';
        statusIcon = '👀';
        break;
      default:
        statusMessage = 'Your application status has been updated.';
    }

    const emailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: ${statusColor}; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .status-badge { background: ${statusColor}; color: white; padding: 8px 16px; border-radius: 20px; display: inline-block; margin: 10px 0; }
        .button { display: inline-block; background: ${statusColor}; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>${statusIcon} Application Status Update</h1>
        </div>
        
        <div class="content">
          <h2>Hello ${application.firstName},</h2>
          
          <div class="status-badge">Status: ${status.toUpperCase()}</div>
          
          <p>${statusMessage}</p>
          
          ${notes ? `<p><strong>Additional Notes:</strong><br>${notes}</p>` : ''}
          
          ${status === 'accepted' ? `
            <h3>🚀 Next Steps:</h3>
            <ul>
              <li>Access your dashboard to view available projects</li>
              <li>Complete any remaining profile sections</li>
              <li>Start earning with AI training tasks</li>
              <li>Join our community of AI experts</li>
            </ul>
            <a href="${process.env.FRONTEND_URL}/dashboard" class="button">Access Dashboard</a>
          ` : ''}
          
          ${status === 'rejected' ? `
            <p>We encourage you to:</p>
            <ul>
              <li>Gain more experience in AI/ML</li>
              <li>Build a stronger portfolio</li>
              <li>Consider reapplying in the future</li>
            </ul>
          ` : ''}
          
          <p>If you have any questions, please contact us at <a href="mailto:support@inferaai.com">support@inferaai.com</a></p>
          
          <p>Best regards,<br>The Infera AI Team</p>
        </div>
        
        <div class="footer">
          <p>© 2025 Infera AI. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
    `;

    const mailOptions = {
      from: `"Infera AI" <${process.env.SMTP_USER}>`,
      to: application.email,
      subject: `${statusIcon} Application Status Update - Infera AI`,
      html: emailHtml,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`✅ Status update email sent to: ${application.email} (${status})`);
      return true;
    } catch (error) {
      console.error('❌ Failed to send status update email:', error);
      console.log('📧 Email content that would have been sent:');
      console.log('📧 To:', mailOptions.to);
      console.log('📧 Subject:', mailOptions.subject);
      console.log('📧 HTML Content:');
      console.log(mailOptions.html);
      console.log('📧 ─────────────────────────────────────────────');
      return false;
    }
  }

  async sendPasswordResetEmail(email: string, resetToken: string) {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    
    const emailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #ef4444; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .button { display: inline-block; background: #ef4444; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .warning { background: #fef2f2; border: 1px solid #fecaca; padding: 15px; border-radius: 5px; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🔒 Password Reset Request</h1>
        </div>
        
        <div class="content">
          <h2>Password Reset</h2>
          
          <p>You requested a password reset for your Infera AI account.</p>
          
          <a href="${resetUrl}" class="button">Reset Password</a>
          
          <div class="warning">
            <p><strong>⚠️ Security Notice:</strong></p>
            <ul>
              <li>This link expires in 1 hour</li>
              <li>If you didn't request this reset, ignore this email</li>
              <li>Never share this link with anyone</li>
            </ul>
          </div>
          
          <p>If the button doesn't work, copy and paste this link:<br>
          <code>${resetUrl}</code></p>
          
          <p>Best regards,<br>The Infera AI Team</p>
        </div>
      </div>
    </body>
    </html>
    `;

    const mailOptions = {
      from: `"Infera AI" <${process.env.SMTP_USER}>`,
      to: email,
      subject: '🔒 Password Reset - Infera AI',
      html: emailHtml,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log('✅ Password reset email sent to:', email);
      return true;
    } catch (error) {
      console.error('❌ Failed to send password reset email:', error);
      console.log('📧 Email content that would have been sent:');
      console.log('📧 To:', mailOptions.to);
      console.log('📧 Subject:', mailOptions.subject);
      console.log('📧 HTML Content:');
      console.log(mailOptions.html);
      console.log('📧 ─────────────────────────────────────────────');
      return false;
    }
  }
}

export const emailService = new EmailService();