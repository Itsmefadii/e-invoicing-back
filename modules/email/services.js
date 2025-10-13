import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

class EmailService {
  constructor() {
    this.transporter = null;
    this.initializeTransporter();
  }

  initializeTransporter() {
    // Check if email credentials are provided
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.warn('Email service: Missing EMAIL_USER or EMAIL_PASS environment variables. Email sending will be disabled.');
      this.transporter = null;
      return;
    }

    // Email configuration - you can customize this based on your email provider
    const emailConfig = {
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: process.env.EMAIL_PORT || 587,
      secure: process.env.EMAIL_SECURE === 'true' || false, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    };

    // Create transporter
    this.transporter = nodemailer.createTransport(emailConfig);

    // Verify connection configuration
    this.transporter.verify((error, success) => {
      if (error) {
        console.error('Email service configuration error:', error);
      } else {
        console.log('Email service is ready to send messages');
      }
    });
  }

  async sendEmail(emailData) {
    try {
      // Check if transporter is available
      if (!this.transporter) {
        console.warn('Email service: Transporter not initialized. Email sending is disabled.');
        return {
          success: false,
          error: 'Email service not configured',
          message: 'Email service is not configured. Please set EMAIL_USER and EMAIL_PASS environment variables.'
        };
      }

      const { to, from, replyTo, subject, text, html, attachments } = emailData;

      const mailOptions = {
        from: from || process.env.EMAIL_FROM || process.env.EMAIL_USER,
        to: Array.isArray(to) ? to.join(', ') : to,
        subject: subject,
        text: text,
        html: html,
        attachments: attachments || []
      };

      // Add replyTo if provided
      if (replyTo) {
        mailOptions.replyTo = replyTo;
      }

      const result = await this.transporter.sendMail(mailOptions);
      console.log('Email sent successfully:', result.messageId);
      return {
        success: true,
        messageId: result.messageId,
        message: 'Email sent successfully'
      };
    } catch (error) {
      console.error('Error sending email:', error);
      return {
        success: false,
        error: error.message,
        message: 'Failed to send email'
      };
    }
  }

  async sendWelcomeEmail(userEmail, userName) {
    const emailData = {
      to: userEmail,
      subject: 'Welcome to E-Invoicing System',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Welcome to E-Invoicing System!</h2>
          <p>Hello ${userName},</p>
          <p>Thank you for joining our e-invoicing platform. You can now start creating and managing your invoices efficiently.</p>
          <p>If you have any questions, please don't hesitate to contact our support team.</p>
          <br>
          <p>Best regards,<br>E-Invoicing Team</p>
        </div>
      `,
      text: `Welcome to E-Invoicing System!\n\nHello ${userName},\n\nThank you for joining our e-invoicing platform. You can now start creating and managing your invoices efficiently.\n\nIf you have any questions, please don't hesitate to contact our support team.\n\nBest regards,\nE-Invoicing Team`
    };

    return await this.sendEmail(emailData);
  }

  async sendInvoiceNotificationEmail(userEmail, invoiceData) {
    const emailData = {
      to: userEmail,
      subject: `Invoice ${invoiceData.invoiceNumber} - ${invoiceData.status}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Invoice Notification</h2>
          <p>Dear Customer,</p>
          <p>Your invoice <strong>${invoiceData.invoiceNumber}</strong> has been ${invoiceData.status}.</p>
          <div style="background-color: #f5f5f5; padding: 15px; margin: 20px 0;">
            <h3>Invoice Details:</h3>
            <p><strong>Invoice Number:</strong> ${invoiceData.invoiceNumber}</p>
            <p><strong>Amount:</strong> $${invoiceData.amount}</p>
            <p><strong>Date:</strong> ${invoiceData.date}</p>
            <p><strong>Status:</strong> ${invoiceData.status}</p>
          </div>
          <p>Thank you for your business!</p>
          <br>
          <p>Best regards,<br>E-Invoicing Team</p>
        </div>
      `,
      text: `Invoice Notification\n\nDear Customer,\n\nYour invoice ${invoiceData.invoiceNumber} has been ${invoiceData.status}.\n\nInvoice Details:\n- Invoice Number: ${invoiceData.invoiceNumber}\n- Amount: $${invoiceData.amount}\n- Date: ${invoiceData.date}\n- Status: ${invoiceData.status}\n\nThank you for your business!\n\nBest regards,\nE-Invoicing Team`
    };

    return await this.sendEmail(emailData);
  }

  async sendQuoteRequestEmail(quoteData) {
    const { fullName, email, companyName, phoneNumber, invoicingNeeds } = quoteData;
    
    const emailData = {
      to: process.env.QUOTE_EMAIL || process.env.EMAIL_USER, // Send to business email
      from: email, // Customer is the sender
      replyTo: email, // Replies go back to customer
      subject: `New Quote Request from ${fullName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9f9f9; padding: 20px;">
          <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h2 style="color: #333; text-align: center; margin-bottom: 30px;">Quote Request from ${fullName}</h2>
            
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <h3 style="color: #495057; margin-top: 0;">Contact Information</h3>
              <p style="margin: 8px 0;"><strong>Full Name:</strong> ${fullName}</p>
              <p style="margin: 8px 0;"><strong>Email:</strong> <a href="mailto:${email}" style="color: #007bff;">${email}</a></p>
              ${companyName ? `<p style="margin: 8px 0;"><strong>Company:</strong> ${companyName}</p>` : ''}
              ${phoneNumber ? `<p style="margin: 8px 0;"><strong>Phone:</strong> <a href="tel:${phoneNumber}" style="color: #007bff;">${phoneNumber}</a></p>` : ''}
            </div>
            
            <div style="background-color: #e3f2fd; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <h3 style="color: #1976d2; margin-top: 0;">Invoicing Needs</h3>
              <p style="margin: 0; line-height: 1.6; color: #424242;">${invoicingNeeds}</p>
            </div>
            
            <div style="text-align: center; margin-top: 30px;">
              <a href="mailto:${email}" style="background-color: #007bff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">Reply to ${fullName}</a>
            </div>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #dee2e6; text-align: center; color: #6c757d; font-size: 14px;">
              <p>This quote request was submitted through the E-Invoicing website.</p>
              <p>Timestamp: ${new Date().toLocaleString()}</p>
            </div>
          </div>
        </div>
      `,
      text: `Quote Request from ${fullName}\n\nContact Information:\n- Full Name: ${fullName}\n- Email: ${email}\n${companyName ? `- Company: ${companyName}\n` : ''}${phoneNumber ? `- Phone: ${phoneNumber}\n` : ''}\n\nInvoicing Needs:\n${invoicingNeeds}\n\nTimestamp: ${new Date().toLocaleString()}\n\nReply to: ${email}`
    };

    return await this.sendEmail(emailData);
  }

  async sendQuoteConfirmationEmail(quoteData) {
    const { fullName, email } = quoteData;
    
    const emailData = {
      to: email, // Send to customer
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER, // From your company
      replyTo: process.env.EMAIL_FROM || process.env.EMAIL_USER, // Replies go to your company
      subject: 'Thank you for your quote request - E-Invoicing System',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9f9f9; padding: 20px;">
          <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h2 style="color: #28a745; text-align: center; margin-bottom: 30px;">Thank You, ${fullName}!</h2>
            
            <div style="background-color: #d4edda; padding: 20px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #28a745;">
              <p style="margin: 0; color: #155724; font-weight: bold;">Your quote request has been received successfully!</p>
            </div>
            
            <p style="color: #333; line-height: 1.6;">We've received your quote request and our team will review your invoicing needs. We'll get back to you within 24 hours with a personalized quote tailored to your requirements.</p>
            
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #495057; margin-top: 0;">What happens next?</h3>
              <ul style="color: #6c757d; line-height: 1.8;">
                <li>Our team will review your specific invoicing needs</li>
                <li>We'll prepare a customized quote based on your requirements</li>
                <li>You'll receive a detailed proposal within 24 hours</li>
                <li>We'll schedule a call to discuss your needs in detail</li>
              </ul>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <p style="color: #6c757d; font-size: 14px;">Questions? Contact us at <a href="mailto:support@e-invoicing.com" style="color: #007bff;">support@e-invoicing.com</a></p>
            </div>
            
            <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #dee2e6;">
              <p style="color: #6c757d; font-size: 14px; margin: 0;">Best regards,<br><strong>E-Invoicing Team</strong></p>
            </div>
          </div>
        </div>
      `,
      text: `Thank You, ${fullName}!\n\nYour quote request has been received successfully!\n\nWe've received your quote request and our team will review your invoicing needs. We'll get back to you within 24 hours with a personalized quote tailored to your requirements.\n\nWhat happens next?\n- Our team will review your specific invoicing needs\n- We'll prepare a customized quote based on your requirements\n- You'll receive a detailed proposal within 24 hours\n- We'll schedule a call to discuss your needs in detail\n\nQuestions? Contact us at support@e-invoicing.com\n\nBest regards,\nE-Invoicing Team`
    };

    return await this.sendEmail(emailData);
  }
}

export default new EmailService();
