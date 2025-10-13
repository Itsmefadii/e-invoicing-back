# Email Service Configuration

This document explains how to configure the email service for the E-Invoicing backend quote request system.

## Environment Variables

Add the following environment variables to your `.env` file:

```env
# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=your-email@gmail.com

# Quote Request Email (where quote requests are sent)
QUOTE_EMAIL=quotes@yourcompany.com
```

## Email Provider Setup

### Gmail Setup
1. Enable 2-Factor Authentication on your Google account
2. Generate an App Password:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate a new app password for "Mail"
   - Use this password in `EMAIL_PASS`

### Other Email Providers

#### Outlook/Hotmail
```env
EMAIL_HOST=smtp-mail.outlook.com
EMAIL_PORT=587
EMAIL_SECURE=false
```

#### Yahoo Mail
```env
EMAIL_HOST=smtp.mail.yahoo.com
EMAIL_PORT=587
EMAIL_SECURE=false
```

#### Custom SMTP Server
```env
EMAIL_HOST=your-smtp-server.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-username
EMAIL_PASS=your-password
```

## API Endpoints

The email service provides the following endpoints:

### 1. Test Connection
- **GET** `/email/test-connection`
- Tests if the email service is properly configured

### 2. Submit Quote Request
- **POST** `/email/quote-request`
- Submit a quote request form
- Body: `{ fullName, email, companyName?, phoneNumber?, invoicingNeeds }`

## Usage Examples

### Test Email Connection
```bash
curl -X GET http://localhost:3001/api/v1/email/test-connection
```

### Submit Quote Request
```bash
curl -X POST http://localhost:3001/api/v1/email/quote-request \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "John Doe",
    "email": "john.doe@example.com",
    "companyName": "Acme Corporation",
    "phoneNumber": "+1-555-123-4567",
    "invoicingNeeds": "We process approximately 500 invoices monthly and need a system that can handle bulk uploads, automated reminders, and integration with our existing accounting software."
  }'
```

### Submit Minimal Quote Request (only required fields)
```bash
curl -X POST http://localhost:3001/api/v1/email/quote-request \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Jane Smith",
    "email": "jane.smith@example.com",
    "invoicingNeeds": "Looking for a simple invoicing solution for my small business."
  }'
```

## Error Handling

The email service includes comprehensive error handling:
- Connection verification on startup
- Validation of required fields
- Detailed error messages for debugging
- Graceful fallback for configuration issues

## Security Notes

1. Never commit your `.env` file to version control
2. Use app-specific passwords for Gmail
3. Consider using environment-specific configurations
4. Regularly rotate your email credentials
5. Monitor email sending limits and quotas
