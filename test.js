const CarbonationCalculator = require('./index.js');

/**
 * Test suite for the Beer Carbonation Calculator
 */
class TestSuite {
  constructor() {
    this.calculator = new CarbonationCalculator();
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
   * Test temperature conversions
   */
  testTemperatureConversions() {
    console.log('\n=== Testing Temperature Conversions ===');
    
    // Test Celsius to Fahrenheit
    const fahrenheit = this.calculator.celsiusToFahrenheit(0);
    this.assert(fahrenheit === 32, 'Celsius to Fahrenheit: 0°C = 32°F');
    
    const fahrenheit2 = this.calculator.celsiusToFahrenheit(100);
    this.assert(fahrenheit2 === 212, 'Celsius to Fahrenheit: 100°C = 212°F');
    
    // Test Fahrenheit to Celsius
    const celsius = this.calculator.fahrenheitToCelsius(32);
    this.assert(celsius === 0, 'Fahrenheit to Celsius: 32°F = 0°C');
    
    const celsius2 = this.calculator.fahrenheitToCelsius(212);
    this.assert(celsius2 === 100, 'Fahrenheit to Celsius: 212°F = 100°C');
  }

  /**
   * Test pressure conversions
   */
  testPressureConversions() {
    console.log('\n=== Testing Pressure Conversions ===');
    
    // Test PSI to bar (approximately)
    const bar = this.calculator.psiToBar(14.5);
    this.assert(Math.abs(bar - 1.0) < 0.01, 'PSI to bar: ~14.5 PSI = ~1 bar');
    
    // Test bar to PSI
    const psi = this.calculator.barToPsi(1.0);
    this.assert(Math.abs(psi - 14.5) < 0.1, 'Bar to PSI: 1 bar = ~14.5 PSI');
  }

  /**
   * Test CO₂ solubility calculations
   */
  testSolubilityCalculations() {
    console.log('\n=== Testing CO₂ Solubility Calculations ===');
    
    // Test solubility at typical serving temperatures
    const solubility4C = this.calculator.calculateSolubility(4);
    this.assert(solubility4C > 1.5 && solubility4C < 2.0, 
                `CO₂ solubility at 4°C: ${solubility4C} vol (should be ~1.6-1.7)`);
    
    const solubility0C = this.calculator.calculateSolubility(0);
    const solubility10C = this.calculator.calculateSolubility(10);
    this.assert(solubility0C > solubility10C, 
                'CO₂ solubility decreases with temperature');
  }

  /**
   * Test pressure calculations
   */
  testPressureCalculations() {
    console.log('\n=== Testing Pressure Calculations ===');
    
    // Test typical lager carbonation
    const result = this.calculator.calculateRequiredPressure(2.6, 4);
    this.assert(result.psi > 0 && result.psi < 50, 
                `Pressure for 2.6 vol at 4°C: ${result.psi} PSI (reasonable range)`);
    
    // Test that higher temperature requires higher pressure
    const result1 = this.calculator.calculateRequiredPressure(2.6, 2);
    const result2 = this.calculator.calculateRequiredPressure(2.6, 8);
    this.assert(result2.psi > result1.psi, 
                'Higher temperature requires higher pressure for same carbonation');
  }

  /**
   * Test temperature calculations
   */
  testTemperatureCalculations() {
    console.log('\n=== Testing Temperature Calculations ===');
    
    // Test optimal temperature calculation
    const result = this.calculator.calculateOptimalTemperature(2.6, 12);
    this.assert(result.celsius >= 0 && result.celsius <= 15, 
                `Optimal temperature: ${result.celsius}°C (within serving range)`);
    
    this.assert(result.accuracy < 1.0, 
                `Temperature calculation accuracy: ±${result.accuracy} bar (should be precise)`);
  }

  /**
   * Test beer style recommendations
   */
  testBeerStyleRecommendations() {
    console.log('\n=== Testing Beer Style Recommendations ===');
    
    const styles = this.calculator.getBeerStyleRecommendations();
    
    this.assert(Object.keys(styles).length > 5, 
                'Beer styles: Multiple styles available');
    
    this.assert(styles['Lager'] && styles['Lager'].typical > 2.0, 
                'Lager carbonation: Reasonable typical value');
    
    this.assert(styles['Wheat Beer'] && styles['Wheat Beer'].typical > styles['Stout/Porter'].typical, 
                'Wheat beer has higher carbonation than stout');
  }

  /**
   * Integration test with realistic scenarios
   */
  testRealisticScenarios() {
    console.log('\n=== Testing Realistic Brewing Scenarios ===');
    
    // Scenario 1: Typical lager at serving temperature
    const lager = this.calculator.calculateRequiredPressure(2.6, 4);
    this.assert(lager.psi > 10 && lager.psi < 40, 
                `Lager pressure: ${lager.psi} PSI (realistic range 15-35 PSI)`);
    
    // Scenario 2: Wheat beer at cellar temperature
    const wheat = this.calculator.calculateRequiredPressure(3.2, 12);
    this.assert(wheat.psi > lager.psi, 
                'Wheat beer requires higher pressure than lager');
    
    // Scenario 3: Temperature calculation for limited pressure system
    const tempResult = this.calculator.calculateOptimalTemperature(2.4, 10);
    this.assert(tempResult.celsius < 10, 
                'Lower pressure systems require cooler temperatures');
  }

  /**
   * Run all tests
   */
  runAllTests() {
    console.log('🧪 Running Beer Carbonation Calculator Tests 🧪');
    
    this.testTemperatureConversions();
    this.testPressureConversions();
    this.testSolubilityCalculations();
    this.testPressureCalculations();
    this.testTemperatureCalculations();
    this.testBeerStyleRecommendations();
    this.testRealisticScenarios();
    
    // Summary
    const passed = this.testResults.filter(r => r.status === 'PASS').length;
    const failed = this.testResults.filter(r => r.status === 'FAIL').length;
    
    console.log('\n=== Test Summary ===');
    console.log(`Total tests: ${this.testResults.length}`);
    console.log(`Passed: ${passed}`);
    console.log(`Failed: ${failed}`);
    
    if (failed === 0) {
      console.log('🎉 All tests passed! The calculator is working correctly.');
    } else {
      console.log('⚠️  Some tests failed. Please review the implementation.');
    }
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  const testSuite = new TestSuite();
  testSuite.runAllTests();
}

module.exports = TestSuite;
