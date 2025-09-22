const CarbonationCalculator = require('../../index.js');

const calculator = new CarbonationCalculator();

exports.handler = async (event, context) => {
  // Enable CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { value, from } = JSON.parse(event.body);
    
    let result;
    if (from === 'celsius') {
      result = {
        celsius: value,
        fahrenheit: calculator.celsiusToFahrenheit(value)
      };
    } else {
      result = {
        celsius: calculator.fahrenheitToCelsius(value),
        fahrenheit: value
      };
    }
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(result)
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message })
    };
  }
};
