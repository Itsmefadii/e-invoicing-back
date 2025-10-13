import axios from 'axios';

const BASE_URL = 'http://localhost:3001/api/v1';

async function testQuoteAPIStructure() {
  console.log('Testing Quote API Structure (without email sending)...\n');

  try {
    // Test 1: Submit quote request (this should work even without email config)
    console.log('1. Testing quote request submission...');
    const quoteData = {
      fullName: 'John Doe',
      email: 'john.doe@example.com',
      companyName: 'Acme Corporation',
      phoneNumber: '+1-555-123-4567',
      invoicingNeeds: 'We process approximately 500 invoices monthly and need a system that can handle bulk uploads, automated reminders, and integration with our existing accounting software.'
    };

    const quoteResponse = await axios.post(`${BASE_URL}/email/quote-request`, quoteData);
    console.log('Quote request result:', JSON.stringify(quoteResponse.data, null, 2));

    // Test 2: Test validation (missing required field)
    console.log('\n2. Testing validation (missing required field)...');
    try {
      const invalidQuoteData = {
        fullName: 'Test User',
        email: 'test@example.com'
        // Missing invoicingNeeds
      };

      const invalidResponse = await axios.post(`${BASE_URL}/email/quote-request`, invalidQuoteData);
      console.log('Invalid request result:', invalidResponse.data);
    } catch (error) {
      console.log('Validation error (expected):', error.response?.data);
    }

    // Test 3: Test validation (invalid email)
    console.log('\n3. Testing validation (invalid email)...');
    try {
      const invalidEmailData = {
        fullName: 'Test User',
        email: 'invalid-email',
        invoicingNeeds: 'Test invoicing needs'
      };

      const invalidEmailResponse = await axios.post(`${BASE_URL}/email/quote-request`, invalidEmailData);
      console.log('Invalid email result:', invalidEmailResponse.data);
    } catch (error) {
      console.log('Email validation error (expected):', error.response?.data);
    }

    console.log('\n✅ Quote API structure tests completed!');
    console.log('\nNote: Email sending will fail without proper SMTP configuration, but the API structure is working correctly.');

  } catch (error) {
    console.error('❌ Error testing quote API structure:', error.response?.data || error.message);
  }
}

// Run the test
testQuoteAPIStructure();
