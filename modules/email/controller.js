import emailService from './services.js';
import { sendSuccess, sendError, sendCreated } from '../../lib/utils/response.js';

export class EmailController {
  async submitQuoteRequest(req, reply) {
    try {
      const { fullName, email, companyName, phoneNumber, invoicingNeeds } = req.body;

      // Validate required fields
      if (!fullName || !email || !invoicingNeeds) {
        return sendError(reply, 'Missing required fields: fullName, email, and invoicingNeeds are required', 400);
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return sendError(reply, 'Invalid email format', 400);
      }

      const quoteData = {
        fullName: fullName.trim(),
        email: email.trim().toLowerCase(),
        companyName: companyName ? companyName.trim() : '',
        phoneNumber: phoneNumber ? phoneNumber.trim() : '',
        invoicingNeeds: invoicingNeeds.trim()
      };

      // Send quote request email to business
      const quoteRequestResult = await emailService.sendQuoteRequestEmail(quoteData);
      
      if (!quoteRequestResult.success) {
        // If email service is not configured, still return success but with a warning
        if (quoteRequestResult.error === 'Email service not configured') {
          console.warn('Quote request received but email service not configured:', quoteData);
          return sendSuccess(reply, {
            quoteRequestId: 'email-service-disabled',
            confirmationId: 'email-service-disabled',
            warning: 'Quote request received but email notifications are disabled due to missing email configuration'
          }, 'Quote request submitted successfully (email notifications disabled)');
        }
        return sendError(reply, 'Failed to send quote request', 500, quoteRequestResult.error);
      }

      // Send confirmation email to customer
      const confirmationResult = await emailService.sendQuoteConfirmationEmail(quoteData);
      
      if (!confirmationResult.success) {
        console.warn('Quote request sent but confirmation email failed:', confirmationResult.error);
        // Don't fail the request if confirmation email fails
      }

      return sendSuccess(reply, {
        quoteRequestId: quoteRequestResult.messageId,
        confirmationId: confirmationResult.messageId
      }, 'Quote request submitted successfully');

    } catch (error) {
      console.error('Error in submitQuoteRequest controller:', error);
      return sendError(reply, 'Internal server error', 500, error.message);
    }
  }

  async testEmailConnection(req, reply) {
    try {
      // Check if transporter is available
      if (!emailService.transporter) {
        return sendError(reply, 'Email service not configured. Please set EMAIL_USER and EMAIL_PASS environment variables.', 500);
      }

      // Test the email service connection
      const testResult = await emailService.transporter.verify();
      
      if (testResult) {
        return sendSuccess(reply, { connected: true }, 'Email service connection successful');
      } else {
        return sendError(reply, 'Email service connection failed', 500);
      }
    } catch (error) {
      console.error('Error testing email connection:', error);
      return sendError(reply, 'Email service connection failed', 500, error.message);
    }
  }
}

export default new EmailController();
