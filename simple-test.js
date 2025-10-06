// Simple connection test
import axios from 'axios';

const BASE_URL = 'http://127.0.0.1:3001/api/v1';
const TOKEN = '5b0891e4-8216-3f78-be52-9e70b054393a';

console.log('Testing connection to backend server...');

// Test basic connection
axios.get(`${BASE_URL}/system-configs/hs-codes`, {
  headers: {
    'Authorization': `Bearer ${TOKEN}`,
    'Content-Type': 'application/json'
  }
})
.then(response => {
  console.log('✅ Connection successful!');
  console.log('Response status:', response.status);
  console.log('Response data:', JSON.stringify(response.data, null, 2));
})
.catch(error => {
  console.log('❌ Connection failed:');
  if (error.response) {
    console.log('Status:', error.response.status);
    console.log('Data:', error.response.data);
  } else if (error.request) {
    console.log('No response received. Server might not be running.');
    console.log('Error:', error.message);
  } else {
    console.log('Error:', error.message);
  }
});
