// Using built-in fetch (Node.js 18+)

const BASE_URL = 'http://localhost:3001/api/v1/system-configs';
const BEARER_TOKEN = '5b0891e4-8216-3f78-be52-9e70b054393a';

const headers = {
  'Authorization': `Bearer ${BEARER_TOKEN}`,
  'Content-Type': 'application/json'
};

async function testHsCodeAPI() {
  console.log('🚀 Testing HS Code API with Bearer Token...\n');

  try {
    // Test 1: Populate HS Codes from FBR API
    console.log('1️⃣ Testing FBR API Population...');
    const populateResponse = await fetch(`${BASE_URL}/hs-codes/populate-from-fbr`, {
      method: 'POST',
      headers: headers
    });
    
    const populateData = await populateResponse.json();
    console.log('✅ FBR Population Response:', JSON.stringify(populateData, null, 2));
    console.log('');

    // Test 2: Get All HS Codes
    console.log('2️⃣ Testing Get All HS Codes...');
    const getAllResponse = await fetch(`${BASE_URL}/hs-codes`, {
      method: 'GET',
      headers: headers
    });
    
    const allHsCodes = await getAllResponse.json();
    console.log('✅ All HS Codes Response:');
    console.log(`   Total HS Codes: ${allHsCodes.data?.length || 0}`);
    if (allHsCodes.data && allHsCodes.data.length > 0) {
      console.log('   First 3 HS Codes:');
      allHsCodes.data.slice(0, 3).forEach((hsCode, index) => {
        console.log(`   ${index + 1}. ${hsCode.hsCode} - ${hsCode.description?.substring(0, 50)}...`);
      });
    }
    console.log('');

    // Test 3: Get HS Code by ID (if any exist)
    if (allHsCodes.data && allHsCodes.data.length > 0) {
      const firstHsCodeId = allHsCodes.data[0].id;
      console.log(`3️⃣ Testing Get HS Code by ID (${firstHsCodeId})...`);
      const getByIdResponse = await fetch(`${BASE_URL}/hs-codes/${firstHsCodeId}`, {
        method: 'GET',
        headers: headers
      });
      
      const hsCodeById = await getByIdResponse.json();
      console.log('✅ HS Code by ID Response:', JSON.stringify(hsCodeById, null, 2));
      console.log('');
    }

    // Test 4: Create a new HS Code
    console.log('4️⃣ Testing Create New HS Code...');
    const newHsCode = {
      hsCode: '9999.9999',
      description: 'TEST HS CODE - FOR TESTING PURPOSES ONLY'
    };
    
    const createResponse = await fetch(`${BASE_URL}/hs-codes`, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(newHsCode)
    });
    
    const createdHsCode = await createResponse.json();
    console.log('✅ Create HS Code Response:', JSON.stringify(createdHsCode, null, 2));
    console.log('');

    // Test 5: Update the created HS Code
    if (createdHsCode.data && createdHsCode.data.id) {
      const updateId = createdHsCode.data.id;
      console.log(`5️⃣ Testing Update HS Code (${updateId})...`);
      const updateData = {
        hsCode: '9999.9999',
        description: 'UPDATED TEST HS CODE - FOR TESTING PURPOSES ONLY'
      };
      
      const updateResponse = await fetch(`${BASE_URL}/hs-codes/${updateId}`, {
        method: 'PUT',
        headers: headers,
        body: JSON.stringify(updateData)
      });
      
      const updatedHsCode = await updateResponse.json();
      console.log('✅ Update HS Code Response:', JSON.stringify(updatedHsCode, null, 2));
      console.log('');

      // Test 6: Delete the created HS Code
      console.log(`6️⃣ Testing Delete HS Code (${updateId})...`);
      const deleteResponse = await fetch(`${BASE_URL}/hs-codes/${updateId}`, {
        method: 'DELETE',
        headers: headers
      });
      
      const deleteResult = await deleteResponse.json();
      console.log('✅ Delete HS Code Response:', JSON.stringify(deleteResult, null, 2));
      console.log('');
    }

    console.log('🎉 All tests completed successfully!');

  } catch (error) {
    console.error('❌ Error testing HS Code API:', error.message);
    console.error('Stack trace:', error.stack);
  }
}

// Run the tests
testHsCodeAPI();
