# SMTP Setup Guide for E-Invoicing Email Service

## Quick Setup (Gmail - Recommended)

### Step 1: Enable 2-Factor Authentication
1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Click "2-Step Verification"
3. Follow the setup process

### Step 2: Generate App Password
1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Click "2-Step Verification"
3. Scroll down to "App passwords"
4. Select "Mail" from dropdown
5. Click "Generate"
6. Copy the 16-character password (e.g., `abcd efgh ijkl mnop`)

### Step 3: Create .env file
Create a `.env` file in your project root with:

```env
# Email Configuration (SMTP)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-16-character-app-password
EMAIL_FROM=your-email@gmail.com
QUOTE_EMAIL=your-email@gmail.com

# Database Configuration (existing)
DB_HOST=localhost
DB_PORT=3306
DB_NAME=e_invoicing
DB_USER=root
DB_PASS=your-database-password

# JWT Configuration (existing)
JWT_SECRET=your-jwt-secret-key
JWT_EXPIRES_IN=24h

# Server Configuration
PORT=3001
HOST=0.0.0.0
```

## Alternative Email Providers

### Outlook/Hotmail
```env
EMAIL_HOST=smtp-mail.outlook.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@outlook.com
EMAIL_PASS=your-password
EMAIL_FROM=your-email@outlook.com
QUOTE_EMAIL=your-email@outlook.com
```

### Yahoo Mail
```env
EMAIL_HOST=smtp.mail.yahoo.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@yahoo.com
EMAIL_PASS=your-app-password
EMAIL_FROM=your-email@yahoo.com
QUOTE_EMAIL=your-email@yahoo.com
```

### Custom SMTP Server
```env
EMAIL_HOST=your-smtp-server.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-username
EMAIL_PASS=your-password
EMAIL_FROM=your-email@yourdomain.com
QUOTE_EMAIL=quotes@yourdomain.com
```

## Testing Your Setup

After setting up your .env file:

1. **Restart your server:**
   ```bash
   npm run dev
   ```

2. **Test the email connection:**
   ```bash
   curl -X GET http://localhost:3001/api/v1/email/test-connection
   ```

3. **Test quote request:**
   ```bash
   curl -X POST http://localhost:3001/api/v1/email/quote-request \
     -H "Content-Type: application/json" \
     -d '{
       "fullName": "Test User",
       "email": "test@example.com",
       "invoicingNeeds": "Testing email functionality"
     }'
   ```

## Troubleshooting

### Common Issues:

1. **"Invalid login"** - Check your app password
2. **"Less secure app access"** - Use app password instead
3. **"Connection timeout"** - Check firewall/network settings
4. **"Authentication failed"** - Verify 2FA is enabled

### Gmail Specific:
- Must use App Password, not regular password
- 2-Factor Authentication must be enabled
- App Password format: `abcd efgh ijkl mnop` (16 characters)

## Security Notes

- Never commit your `.env` file to version control
- Use App Passwords instead of regular passwords
- Consider using environment-specific configurations
- Regularly rotate your email credentials
