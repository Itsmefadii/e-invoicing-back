# Email Service API Documentation

This document provides comprehensive API documentation for the email service endpoints in the E-Invoicing backend.

## Base URL
All email endpoints are prefixed with `/email`

## Authentication
Currently, no authentication is required for email endpoints. Consider adding authentication middleware for production use.

## Endpoints

### 1. Test Email Connection

**GET** `/email/test-connection`

Tests if the email service is properly configured and can connect to the SMTP server.

#### Response
```json
{
  "success": true,
  "message": "Email service connection successful",
  "data": {
    "connected": true
  }
}
```

#### Error Response
```json
{
  "success": false,
  "message": "Email service connection failed",
  "error": "Error details"
}
```

---

### 2. Send Custom Email

**POST** `/email/send`

Sends a custom email with HTML and/or text content.

#### Request Body
```json
{
  "to": "recipient@example.com", // or ["email1@example.com", "email2@example.com"]
  "subject": "Email Subject",
  "text": "Plain text content (optional if html is provided)",
  "html": "<h1>HTML content</h1> (optional if text is provided)",
  "attachments": [ // optional
    {
      "filename": "document.pdf",
      "content": "base64-encoded-content",
      "path": "/path/to/file.pdf"
    }
  ]
}
```

#### Response
```json
{
  "success": true,
  "message": "Email sent successfully",
  "data": {
    "messageId": "message-id-from-smtp-server"
  }
}
```

#### Error Response
```json
{
  "success": false,
  "message": "Missing required fields: to, subject, and either text or html"
}
```

---

### 3. Send Welcome Email

**POST** `/email/welcome`

Sends a welcome email to new users with a pre-designed template.

#### Request Body
```json
{
  "userEmail": "newuser@example.com",
  "userName": "John Doe"
}
```

#### Response
```json
{
  "success": true,
  "message": "Welcome email sent successfully",
  "data": {
    "messageId": "message-id-from-smtp-server"
  }
}
```

---

### 4. Send Invoice Notification

**POST** `/email/invoice-notification`

Sends an invoice status notification email with invoice details.

#### Request Body
```json
{
  "userEmail": "customer@example.com",
  "invoiceData": {
    "invoiceNumber": "INV-2024-001",
    "amount": 299.99,
    "date": "2024-01-15",
    "status": "Paid"
  }
}
```

#### Response
```json
{
  "success": true,
  "message": "Invoice notification email sent successfully",
  "data": {
    "messageId": "message-id-from-smtp-server"
  }
}
```

---

### 5. Send Password Reset Email

**POST** `/email/password-reset`

Sends a password reset email with a secure reset link.

#### Request Body
```json
{
  "userEmail": "user@example.com",
  "resetToken": "secure-reset-token-here"
}
```

#### Response
```json
{
  "success": true,
  "message": "Password reset email sent successfully",
  "data": {
    "messageId": "message-id-from-smtp-server"
  }
}
```

---

## Error Codes

| Status Code | Description |
|-------------|-------------|
| 200 | Success |
| 400 | Bad Request - Missing or invalid parameters |
| 500 | Internal Server Error - Email service error |

## Common Error Messages

- `Missing required fields: to, subject, and either text or html`
- `Missing required fields: userEmail and userName`
- `Missing required fields: userEmail and invoiceData`
- `Missing invoice data fields: invoiceNumber, amount, date, status`
- `Missing required fields: userEmail and resetToken`
- `Email service connection failed`
- `Failed to send email`

## Usage Examples

### cURL Examples

#### Test Connection
```bash
curl -X GET http://localhost:3000/email/test-connection
```

#### Send Welcome Email
```bash
curl -X POST http://localhost:3000/email/welcome \
  -H "Content-Type: application/json" \
  -d '{
    "userEmail": "john.doe@example.com",
    "userName": "John Doe"
  }'
```

#### Send Custom Email
```bash
curl -X POST http://localhost:3000/email/send \
  -H "Content-Type: application/json" \
  -d '{
    "to": ["user1@example.com", "user2@example.com"],
    "subject": "Important Update",
    "html": "<h1>Important Update</h1><p>Please review the attached document.</p>",
    "attachments": [
      {
        "filename": "update.pdf",
        "path": "/path/to/update.pdf"
      }
    ]
  }'
```

#### Send Invoice Notification
```bash
curl -X POST http://localhost:3000/email/invoice-notification \
  -H "Content-Type: application/json" \
  -d '{
    "userEmail": "customer@example.com",
    "invoiceData": {
      "invoiceNumber": "INV-2024-001",
      "amount": 150.00,
      "date": "2024-01-15",
      "status": "Pending Payment"
    }
  }'
```

### JavaScript/Node.js Examples

```javascript
// Test connection
const testConnection = async () => {
  const response = await fetch('http://localhost:3000/email/test-connection');
  const result = await response.json();
  console.log(result);
};

// Send welcome email
const sendWelcomeEmail = async () => {
  const response = await fetch('http://localhost:3000/email/welcome', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      userEmail: 'newuser@example.com',
      userName: 'Jane Smith'
    })
  });
  const result = await response.json();
  console.log(result);
};

// Send custom email
const sendCustomEmail = async () => {
  const response = await fetch('http://localhost:3000/email/send', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      to: 'recipient@example.com',
      subject: 'Test Email',
      html: '<h1>Hello World!</h1><p>This is a test email.</p>',
      text: 'Hello World! This is a test email.'
    })
  });
  const result = await response.json();
  console.log(result);
};
```

## Rate Limiting

Currently, there are no rate limits implemented. Consider implementing rate limiting for production use to prevent abuse.

## Security Considerations

1. **Input Validation**: All inputs are validated before processing
2. **Email Validation**: Email addresses are validated using format validation
3. **Error Handling**: Sensitive information is not exposed in error messages
4. **Configuration**: Email credentials should be stored securely in environment variables

## Monitoring and Logging

The email service includes:
- Connection verification on startup
- Detailed logging of email sending attempts
- Error logging for debugging
- Success/failure tracking

## Future Enhancements

- Email templates management
- Email scheduling
- Email tracking and analytics
- Bulk email sending
- Email queue system
- Template customization via API
