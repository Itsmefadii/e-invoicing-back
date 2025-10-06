// HS Code API Test with Axios
import axios from 'axios';

const BASE_URL = 'http://127.0.0.1:3001/api/v1/system-configs';
const BEARER_TOKEN = '5b0891e4-8216-3f78-be52-9e70b054393a';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Authorization': `Bearer ${BEARER_TOKEN}`,
    'Content-Type': 'application/json'
  }
});

async function testHsCodeAPI() {
  console.log('🚀 Testing HS Code API with Bearer Token...\n');

  try {
    // Test 1: Populate HS Codes from FBR API
    console.log('1️⃣ Testing FBR API Population...');
    const populateResponse = await api.post('/hs-codes/populate-from-fbr');
    console.log('✅ FBR Population Response:', JSON.stringify(populateResponse.data, null, 2));
    console.log('');

    // Test 2: Get All HS Codes
    console.log('2️⃣ Testing Get All HS Codes...');
    const getAllResponse = await api.get('/hs-codes');
    console.log('✅ All HS Codes Response:');
    console.log(`   Total HS Codes: ${getAllResponse.data.data?.length || 0}`);
    if (getAllResponse.data.data && getAllResponse.data.data.length > 0) {
      console.log('   First 3 HS Codes:');
      getAllResponse.data.data.slice(0, 3).forEach((hsCode, index) => {
        console.log(`   ${index + 1}. ${hsCode.hsCode} - ${hsCode.description?.substring(0, 50)}...`);
      });
    }
    console.log('');

    // Test 3: Get HS Code by ID (if any exist)
    if (getAllResponse.data.data && getAllResponse.data.data.length > 0) {
      const firstHsCodeId = getAllResponse.data.data[0].id;
      console.log(`3️⃣ Testing Get HS Code by ID (${firstHsCodeId})...`);
      const getByIdResponse = await api.get(`/hs-codes/${firstHsCodeId}`);
      console.log('✅ HS Code by ID Response:', JSON.stringify(getByIdResponse.data, null, 2));
      console.log('');
    }

    // Test 4: Create a new HS Code
    console.log('4️⃣ Testing Create New HS Code...');
    const newHsCode = {
      hsCode: '9999.9999',
      description: 'TEST HS CODE - FOR TESTING PURPOSES ONLY'
    };
    
    const createResponse = await api.post('/hs-codes', newHsCode);
    console.log('✅ Create HS Code Response:', JSON.stringify(createResponse.data, null, 2));
    console.log('');

    // Test 5: Update the created HS Code
    if (createResponse.data.data && createResponse.data.data.id) {
      const updateId = createResponse.data.data.id;
      console.log(`5️⃣ Testing Update HS Code (${updateId})...`);
      const updateData = {
        hsCode: '9999.9999',
        description: 'UPDATED TEST HS CODE - FOR TESTING PURPOSES ONLY'
      };
      
      const updateResponse = await api.put(`/hs-codes/${updateId}`, updateData);
      console.log('✅ Update HS Code Response:', JSON.stringify(updateResponse.data, null, 2));
      console.log('');

      // Test 6: Delete the created HS Code
      console.log(`6️⃣ Testing Delete HS Code (${updateId})...`);
      const deleteResponse = await api.delete(`/hs-codes/${updateId}`);
      console.log('✅ Delete HS Code Response:', JSON.stringify(deleteResponse.data, null, 2));
      console.log('');
    }

    console.log('🎉 All tests completed successfully!');

  } catch (error) {
    console.error('❌ Error testing HS Code API:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
    }
    console.error('Stack trace:', error.stack);
  }
}

// Run the tests
testHsCodeAPI();
