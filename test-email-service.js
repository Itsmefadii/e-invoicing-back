import emailService from './modules/email/services.js';

// Test email service functionality
async function testEmailService() {
  console.log('Testing Email Service...\n');

  // Test 1: Send a simple email
  console.log('1. Testing simple email...');
  const simpleEmailResult = await emailService.sendEmail({
    to: 'test@example.com',
    subject: 'Test Email from E-Invoicing',
    text: 'This is a test email from the E-Invoicing system.',
    html: '<h2>Test Email</h2><p>This is a test email from the E-Invoicing system.</p>'
  });
  console.log('Simple email result:', simpleEmailResult);

  // Test 2: Send welcome email
  console.log('\n2. Testing welcome email...');
  const welcomeEmailResult = await emailService.sendWelcomeEmail('newuser@example.com', 'John Doe');
  console.log('Welcome email result:', welcomeEmailResult);

  // Test 3: Send invoice notification
  console.log('\n3. Testing invoice notification...');
  const invoiceData = {
    invoiceNumber: 'INV-2024-001',
    amount: 299.99,
    date: '2024-01-15',
    status: 'Paid'
  };
  const invoiceEmailResult = await emailService.sendInvoiceNotificationEmail('customer@example.com', invoiceData);
  console.log('Invoice notification result:', invoiceEmailResult);

  // Test 4: Send password reset email
  console.log('\n4. Testing password reset email...');
  const resetToken = 'abc123def456ghi789';
  const resetEmailResult = await emailService.sendPasswordResetEmail('user@example.com', resetToken);
  console.log('Password reset email result:', resetEmailResult);

  console.log('\nEmail service testing completed!');
}

// Run the test if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  testEmailService().catch(console.error);
}

export { testEmailService };
