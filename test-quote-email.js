import axios from 'axios';

const BASE_URL = 'http://localhost:3001/api/v1';

async function testQuoteEmailAPI() {
  console.log('Testing Quote Email API...\n');

  try {
    // Test 1: Test connection
    console.log('1. Testing email connection...');
    const connectionResponse = await axios.get(`${BASE_URL}/email/test-connection`);
    console.log('Connection test result:', connectionResponse.data);

    // Test 2: Submit quote request
    console.log('\n2. Testing quote request submission...');
    const quoteData = {
      fullName: 'John Doe',
      email: 'john.doe@example.com',
      companyName: 'Acme Corporation',
      phoneNumber: '+1-555-123-4567',
      invoicingNeeds: 'We process approximately 500 invoices monthly and need a system that can handle bulk uploads, automated reminders, and integration with our existing accounting software. We also need multi-user access with different permission levels.'
    };

    const quoteResponse = await axios.post(`${BASE_URL}/email/quote-request`, quoteData);
    console.log('Quote request result:', quoteResponse.data);

    // Test 3: Test with minimal data (only required fields)
    console.log('\n3. Testing quote request with minimal data...');
    const minimalQuoteData = {
      fullName: 'Jane Smith',
      email: 'jane.smith@example.com',
      invoicingNeeds: 'Looking for a simple invoicing solution for my small business. I need to create and send invoices to about 50 clients monthly.'
    };

    const minimalQuoteResponse = await axios.post(`${BASE_URL}/email/quote-request`, minimalQuoteData);
    console.log('Minimal quote request result:', minimalQuoteResponse.data);

    // Test 4: Test validation (missing required field)
    console.log('\n4. Testing validation (missing required field)...');
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

    // Test 5: Test validation (invalid email)
    console.log('\n5. Testing validation (invalid email)...');
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

    console.log('\n✅ All quote email API tests completed!');

  } catch (error) {
    console.error('❌ Error testing quote email API:', error.response?.data || error.message);
  }
}

// Run the test
testQuoteEmailAPI();
