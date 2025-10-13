import axios from 'axios';

const BASE_URL = 'http://localhost:3000';

async function testEmailAPI() {
  console.log('Testing Email API Endpoints...\n');

  try {
    // Test 1: Test connection
    console.log('1. Testing email connection...');
    const connectionResponse = await axios.get(`${BASE_URL}/email/test-connection`);
    console.log('Connection test result:', connectionResponse.data);

    // Test 2: Send welcome email
    console.log('\n2. Testing welcome email...');
    const welcomeResponse = await axios.post(`${BASE_URL}/email/welcome`, {
      userEmail: 'test@example.com',
      userName: 'Test User'
    });
    console.log('Welcome email result:', welcomeResponse.data);

    // Test 3: Send custom email
    console.log('\n3. Testing custom email...');
    const customEmailResponse = await axios.post(`${BASE_URL}/email/send`, {
      to: 'test@example.com',
      subject: 'Test Email from API',
      text: 'This is a test email sent via the API.',
      html: '<h2>Test Email</h2><p>This is a test email sent via the API.</p>'
    });
    console.log('Custom email result:', customEmailResponse.data);

    // Test 4: Send invoice notification
    console.log('\n4. Testing invoice notification...');
    const invoiceResponse = await axios.post(`${BASE_URL}/email/invoice-notification`, {
      userEmail: 'customer@example.com',
      invoiceData: {
        invoiceNumber: 'INV-2024-001',
        amount: 299.99,
        date: '2024-01-15',
        status: 'Paid'
      }
    });
    console.log('Invoice notification result:', invoiceResponse.data);

    // Test 5: Send password reset
    console.log('\n5. Testing password reset email...');
    const resetResponse = await axios.post(`${BASE_URL}/email/password-reset`, {
      userEmail: 'user@example.com',
      resetToken: 'test-reset-token-123'
    });
    console.log('Password reset result:', resetResponse.data);

    console.log('\n✅ All email API tests completed successfully!');

  } catch (error) {
    console.error('❌ Error testing email API:', error.response?.data || error.message);
  }
}

// Run the test
testEmailAPI();
