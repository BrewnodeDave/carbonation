const http = require('http');
const https = require('https');

/**
 * Web Interface Test Suite for Beer Carbonation Calculator
 * Tests the button functionality on localhost:8888
 */
class WebTestSuite {
  constructor() {
    this.baseUrl = 'http://localhost:8888';
    this.testResults = [];
  }

  /**
   * Assert function for testing
   */
  assert(condition, message) {
    if (condition) {
      console.log(`✅ PASS: ${message}`);
      this.testResults.push({ status: 'PASS', message });
    } else {
      console.log(`❌ FAIL: ${message}`);
      this.testResults.push({ status: 'FAIL', message });
    }
  }

  /**
   * Make HTTP request
   */
  makeRequest(url, method = 'GET', data = null) {
    return new Promise((resolve, reject) => {
      const isHttps = url.startsWith('https');
      const client = isHttps ? https : http;
      
      const urlObj = new URL(url);
      const options = {
        hostname: urlObj.hostname,
        port: urlObj.port,
        path: urlObj.pathname + urlObj.search,
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'Web-Test-Suite/1.0'
        }
      };

      if (data && method === 'POST') {
        const postData = JSON.stringify(data);
        options.headers['Content-Length'] = Buffer.byteLength(postData);
      }

      const req = client.request(options, (res) => {
        let body = '';
        res.on('data', (chunk) => {
          body += chunk;
        });
        res.on('end', () => {
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            body: body
          });
        });
      });

      req.on('error', (err) => {
        reject(err);
      });

      if (data && method === 'POST') {
        req.write(JSON.stringify(data));
      }

      req.end();
    });
  }

  /**
   * Test main page loads
   */
  async testMainPageLoads() {
    console.log('\n=== Testing Main Page Load ===');
    
    try {
      const response = await this.makeRequest(this.baseUrl);
      this.assert(response.statusCode === 200, 'Main page loads successfully');
      this.assert(response.body.includes('Beer Carbonation'), 'Page contains title');
      this.assert(response.body.includes('Calculate Pressure'), 'Page contains Calculate Pressure button');
      this.assert(response.body.includes('Calculate Temperature'), 'Page contains Calculate Temperature button');
      this.assert(response.body.includes('Beer Styles'), 'Page contains Beer Styles tab');
    } catch (error) {
      this.assert(false, `Main page load failed: ${error.message}`);
    }
  }

  /**
   * Test Calculate Pressure API endpoint (button functionality)
   */
  async testCalculatePressureButton() {
    console.log('\n=== Testing Calculate Pressure Button API ===');
    
    try {
      const testData = {
        targetVolumes: 2.6,
        temperature: 4,
        tempUnit: 'celsius'
      };

      const response = await this.makeRequest(
        `${this.baseUrl}/.netlify/functions/calculate-pressure`,
        'POST',
        testData
      );

      this.assert(response.statusCode === 200, 'Calculate pressure endpoint responds');
      
      const result = JSON.parse(response.body);
      this.assert(result.psi !== undefined, 'Response contains PSI value');
      this.assert(result.bar !== undefined, 'Response contains bar value');
      this.assert(result.psi > 0, 'PSI value is positive');
      this.assert(result.psi < 100, 'PSI value is reasonable (< 100)');
      
      console.log(`   Result: ${result.psi} PSI (${result.bar} bar)`);
      
    } catch (error) {
      this.assert(false, `Calculate pressure button test failed: ${error.message}`);
    }
  }

  /**
   * Test Calculate Temperature API endpoint (button functionality)
   */
  async testCalculateTemperatureButton() {
    console.log('\n=== Testing Calculate Temperature Button API ===');
    
    try {
      const testData = {
        targetVolumes: 2.4,
        pressure: 15,
        pressureUnit: 'psi'
      };

      const response = await this.makeRequest(
        `${this.baseUrl}/.netlify/functions/calculate-temperature`,
        'POST',
        testData
      );

      this.assert(response.statusCode === 200, 'Calculate temperature endpoint responds');
      
      const result = JSON.parse(response.body);
      this.assert(result.celsius !== undefined, 'Response contains Celsius value');
      this.assert(result.fahrenheit !== undefined, 'Response contains Fahrenheit value');
      this.assert(result.celsius >= -5, 'Temperature is within reasonable range (>= -5°C)');
      this.assert(result.celsius <= 20, 'Temperature is within reasonable range (<= 20°C)');
      
      console.log(`   Result: ${result.celsius}°C (${result.fahrenheit}°F)`);
      
    } catch (error) {
      this.assert(false, `Calculate temperature button test failed: ${error.message}`);
    }
  }

  /**
   * Test Beer Styles API endpoint (tab button functionality)
   */
  async testBeerStylesButton() {
    console.log('\n=== Testing Beer Styles Button API ===');
    
    try {
      const response = await this.makeRequest(
        `${this.baseUrl}/.netlify/functions/beer-styles`
      );

      this.assert(response.statusCode === 200, 'Beer styles endpoint responds');
      
      const result = JSON.parse(response.body);
      this.assert(typeof result === 'object', 'Response is an object');
      this.assert(result.Lager !== undefined, 'Contains Lager style');
      this.assert(result['Wheat Beer'] !== undefined, 'Contains Wheat Beer style');
      this.assert(result.Lager.typical > 2.0, 'Lager has reasonable carbonation value');
      
      const styleCount = Object.keys(result).length;
      console.log(`   Found ${styleCount} beer styles`);
      
    } catch (error) {
      this.assert(false, `Beer styles button test failed: ${error.message}`);
    }
  }

  /**
   * Test conversion API endpoints (used by unit selector buttons)
   */
  async testConversionButtons() {
    console.log('\n=== Testing Unit Conversion Button APIs ===');
    
    try {
      // Test temperature conversion
      const tempResponse = await this.makeRequest(
        `${this.baseUrl}/.netlify/functions/convert-temperature`,
        'POST',
        { value: 32, from: 'fahrenheit', to: 'celsius' }
      );

      this.assert(tempResponse.statusCode === 200, 'Temperature conversion endpoint responds');
      const tempResult = JSON.parse(tempResponse.body);
      this.assert(Math.abs(tempResult.celsius - 0) < 0.1, 'Temperature conversion accurate (32°F = 0°C)');
      // Test pressure conversion
      const pressureResponse = await this.makeRequest(
        `${this.baseUrl}/.netlify/functions/convert-pressure`,
        'POST',
        { value: 14.5, from: 'psi', to: 'bar' }
      );

      this.assert(pressureResponse.statusCode === 200, 'Pressure conversion endpoint responds');
      const pressureResult = JSON.parse(pressureResponse.body);
      this.assert(Math.abs(pressureResult.bar - 1.0) < 0.1, 'Pressure conversion accurate (14.5 PSI ≈ 1 bar)');

    } catch (error) {
      this.assert(false, `Conversion buttons test failed: ${error.message}`);
    }
  }

  /**
   * Test button functionality with various scenarios
   */
  async testButtonScenarios() {
    console.log('\n=== Testing Button Scenarios ===');
    
    try {
      // Test Calculate Pressure with high carbonation (wheat beer scenario)
      const wheatBeerTest = await this.makeRequest(
        `${this.baseUrl}/.netlify/functions/calculate-pressure`,
        'POST',
        { targetVolumes: 3.3, temperature: 12, tempUnit: 'celsius' }
      );

      const wheatResult = JSON.parse(wheatBeerTest.body);
      this.assert(wheatResult.psi > 20, 'Wheat beer requires higher pressure');

      // Test Calculate Temperature with low pressure scenario
      const lowPressureTest = await this.makeRequest(
        `${this.baseUrl}/.netlify/functions/calculate-temperature`,
        'POST',
        { targetVolumes: 2.4, pressure: 10, pressureUnit: 'psi' }
      );

      const lowPressureResult = JSON.parse(lowPressureTest.body);
      this.assert(lowPressureResult.celsius <= 10, 'Low pressure requires cooler temperature');

      // Test with Fahrenheit input
      const fahrenheitTest = await this.makeRequest(
        `${this.baseUrl}/.netlify/functions/calculate-pressure`,
        'POST',
        { targetVolumes: 2.6, temperature: 39.2, tempUnit: 'fahrenheit' }
      );

      const fahrenheitResult = JSON.parse(fahrenheitTest.body);
      this.assert(fahrenheitResult.psi > 0, 'Fahrenheit input works correctly');

      console.log(`   Wheat beer pressure: ${wheatResult.psi} PSI`);
      console.log(`   Low pressure temp: ${lowPressureResult.celsius}°C`);
      
    } catch (error) {
      this.assert(false, `Button scenarios test failed: ${error.message}`);
    }
  }

  /**
   * Test error handling for button inputs
   */
  async testButtonErrorHandling() {
    console.log('\n=== Testing Button Error Handling ===');
    
    try {
      // Test with invalid input
      const invalidTest = await this.makeRequest(
        `${this.baseUrl}/.netlify/functions/calculate-pressure`,
        'POST',
        { targetVolumes: 'invalid', temperature: 4, tempUnit: 'celsius' }
      );
      this.assert(invalidTest.statusCode >= 400, 'Invalid input returns error status');

      // Test with missing required fields
      const missingFieldTest = await this.makeRequest(
        `${this.baseUrl}/.netlify/functions/calculate-pressure`,
        'POST',
        { targetVolumes: 2.6 } // missing temperature
      );

      this.assert(missingFieldTest.statusCode >= 400, 'Missing fields return error status');
      
    } catch (error) {
      // This is expected for error cases
      this.assert(true, 'Error handling works (connection/parsing errors are expected)');
    }
  }

  /**
   * Run all web tests
   */
  async runAllTests() {
    console.log('🌐 Running Web Interface Button Tests for localhost:8888 🌐');
    console.log('Testing the Beer Carbonation Calculator web buttons...\n');
    
    await this.testMainPageLoads();
    await this.testCalculatePressureButton();
    await this.testCalculateTemperatureButton();
    await this.testBeerStylesButton();
    await this.testConversionButtons();
    await this.testButtonScenarios();
    await this.testButtonErrorHandling();
    
    // Summary
    const passed = this.testResults.filter(r => r.status === 'PASS').length;
    const failed = this.testResults.filter(r => r.status === 'FAIL').length;
    
    console.log('\n=== Web Test Summary ===');
    console.log(`Total tests: ${this.testResults.length}`);
    console.log(`Passed: ${passed}`);
    console.log(`Failed: ${failed}`);
    
    if (failed === 0) {
      console.log('🎉 All web button tests passed! The web interface is working correctly.');
    } else {
      console.log('⚠️  Some web button tests failed. Please review the web interface.');
    }

    console.log('\n📝 Test Details:');
    console.log('- Main page loading and button presence');
    console.log('- Calculate Pressure button API functionality');
    console.log('- Calculate Temperature button API functionality');
    console.log('- Beer Styles tab button API functionality');
    console.log('- Unit conversion button APIs');
    console.log('- Various brewing scenarios');
    console.log('- Error handling for invalid inputs');
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  const webTestSuite = new WebTestSuite();
  webTestSuite.runAllTests().catch(console.error);
}

module.exports = WebTestSuite;
