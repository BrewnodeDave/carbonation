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
    const { targetVolumes, temperature } = JSON.parse(event.body);

    // Validate parameters
    if (
      typeof targetVolumes !== 'number' ||
      typeof temperature !== 'number' ||
      isNaN(targetVolumes) ||
      isNaN(temperature) ||
      targetVolumes < 1.0 || targetVolumes > 5.0 ||
      temperature < 0 || temperature > 40
    ) {
      return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: 'Invalid parameters: targetVolumes must be 1.0-5.0, temperature must be 0-40 (°C)' })
      };
    }
    
    if (!targetVolumes || temperature === undefined) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing required parameters' })
      };
    }

    const result = calculator.calculateRequiredPressure(targetVolumes, temperature);
    
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
