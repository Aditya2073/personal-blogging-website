import fetch from 'node-fetch';

const checkServer = async () => {
  try {
    const response = await fetch('http://localhost:3001/api/newsletters');
    const contentType = response.headers.get('content-type');
    console.log('Server Response Content-Type:', contentType);
    
    if (response.ok) {
      const data = await response.json();
      console.log('Server is running and returning JSON:', data);
    } else {
      console.error('Server returned error:', response.status, response.statusText);
      const text = await response.text();
      console.error('Response body:', text);
    }
  } catch (error) {
    console.error('Error connecting to server:', error.message);
  }
};

checkServer();
