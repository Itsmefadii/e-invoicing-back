/**
 * Test script to demonstrate Dashboard API
 * Run this after starting your server to test the dashboard statistics
 */

const BASE_URL = 'http://localhost:3001/api/v1';

// Test data
const testCredentials = {
  email: 'admin@example.com',
  password: 'password123'
};

async function testDashboardAPI() {
  console.log('📊 Testing Dashboard API\n');

  try {
    // Step 1: Login to get token
    console.log('1. Logging in to get authentication token...');
    const loginResponse = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testCredentials)
    });

    const loginData = await loginResponse.json();
    console.log('Login Response:', loginResponse.status, loginData);

    if (!loginData.success || !loginData.data?.token) {
      console.log('❌ Login failed - cannot proceed with dashboard test');
      return;
    }

    const token = loginData.data.token;
    console.log('✅ Login successful, token received\n');

    // Step 2: Test Dashboard API
    console.log('2. Testing Dashboard Statistics API...');
    const dashboardResponse = await fetch(`${BASE_URL}/invoice/dashboard/stats`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    const dashboardData = await dashboardResponse.json();
    console.log('Dashboard Response Status:', dashboardResponse.status);
    console.log('Dashboard Data:', JSON.stringify(dashboardData, null, 2));

    if (dashboardResponse.status === 200 && dashboardData.success) {
      console.log('✅ Dashboard API test successful!');
      console.log('\n📈 Dashboard Statistics:');
      console.log(`- Total Invoices: ${dashboardData.data.totalInvoices}`);
      console.log(`- Total Users: ${dashboardData.data.totalUsers}`);
      console.log(`- Total Revenue: $${dashboardData.data.totalRevenue}`);
      console.log(`- Success Rate: ${dashboardData.data.successRate}%`);
      console.log(`- Pending Invoices: ${dashboardData.data.pendingInvoices}`);
      console.log(`- Submitted Invoices: ${dashboardData.data.submittedInvoices}`);
      console.log(`- Invalid Invoices: ${dashboardData.data.invalidInvoices}`);
      console.log(`- Valid Invoices: ${dashboardData.data.validInvoices}`);
    } else {
      console.log('❌ Dashboard API test failed');
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testDashboardAPI();
