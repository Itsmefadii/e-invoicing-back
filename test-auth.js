/**
 * Test script to demonstrate JWT authentication
 * Run this after starting your server to test the authentication system
 */

const BASE_URL = 'http://localhost:3001/api/v1';

// Test data
const testCredentials = {
  email: 'admin@example.com',
  password: 'password123'
};

async function testAuthentication() {
  console.log('🔐 Testing JWT Authentication System\n');

  try {
    // Test 1: Login to get token
    console.log('1. Testing login (should work without token)...');
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
      console.log('❌ Login failed - cannot proceed with other tests');
      return;
    }

    const token = loginData.data.token;
    console.log('✅ Login successful, token received\n');

    // Test 2: Access protected route without token (should fail)
    console.log('2. Testing protected route without token (should fail)...');
    const noTokenResponse = await fetch(`${BASE_URL}/system-configs/business-natures`);
    const noTokenData = await noTokenResponse.json();
    console.log('No Token Response:', noTokenResponse.status, noTokenData);
    console.log('✅ Correctly blocked without token\n');

    // Test 3: Access protected route with token (should work)
    console.log('3. Testing protected route with token (should work)...');
    const withTokenResponse = await fetch(`${BASE_URL}/system-configs/business-natures`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    const withTokenData = await withTokenResponse.json();
    console.log('With Token Response:', withTokenResponse.status, withTokenData);
    console.log('✅ Successfully accessed with token\n');

    // Test 4: Access protected route with invalid token (should fail)
    console.log('4. Testing protected route with invalid token (should fail)...');
    const invalidTokenResponse = await fetch(`${BASE_URL}/system-configs/business-natures`, {
      headers: {
        'Authorization': 'Bearer invalid-token-123'
      }
    });
    const invalidTokenData = await invalidTokenResponse.json();
    console.log('Invalid Token Response:', invalidTokenResponse.status, invalidTokenData);
    console.log('✅ Correctly blocked with invalid token\n');

    console.log('🎉 All authentication tests completed!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testAuthentication();
