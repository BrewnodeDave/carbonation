const readlineSync = require('readline-sync');

/**
 * Beer Carbonation Calculator
 * 
 * This application calculates the temperature and pressure needed to achieve
 * a specific CO₂ volume in beer using Henry's Law and empirical formulas.
 */

class CarbonationCalculator {
  constructor() {
    // CO₂ solubility constants for beer (adjusted for alcohol content)
    this.henryConstant = 29.4; // atm·L/mol at 0°C
    this.temperatureCoefficient = 0.0414; // per °C
  }

  /**
   * Convert Celsius to Fahrenheit
   */
  celsiusToFahrenheit(celsius) {
    return (celsius * 9/5) + 32;
  }

  /**
   * Convert Fahrenheit to Celsius
   */
  fahrenheitToCelsius(fahrenheit) {
    return (fahrenheit - 32) * 5/9;
  }

  /**
   * Convert PSI to bar
   */
  psiToBar(psi) {
    return psi * 0.0689476;
  }

  /**
   * Convert bar to PSI
   */
  barToPsi(bar) {
    return bar * 14.5038;
  }

  /**
   * Calculate CO₂ solubility at a given temperature (in volumes)
   * Based on empirical formulas for beer carbonation
   */
  calculateSolubility(temperatureCelsius) {
    // Empirical formula for CO₂ solubility in beer (adjusted for realistic values)
    // This accounts for alcohol content and other dissolved solids reducing solubility
    const temp = temperatureCelsius;
    return 1.8 - (0.035 * temp) + (0.0002 * temp * temp);
  }

  /**
   * Calculate required pressure for target CO₂ volume
   * @param {number} targetVolumes - Target CO₂ volumes (typically 2.2-2.8 for beer)
   * @param {number} temperatureCelsius - Temperature in Celsius
   * @returns {object} Pressure in both PSI and bar
   */
  calculateRequiredPressure(targetVolumes, temperatureCelsius) {
    // Natural solubility at the given temperature
    const naturalSolubility = this.calculateSolubility(temperatureCelsius);
    
    // Additional CO₂ needed beyond natural solubility
    const additionalCO2 = Math.max(0, targetVolumes - naturalSolubility);
    
    // Improved pressure calculation using empirical formula for beer
    // Based on industry standards and brewing science
    // Higher temperature requires higher pressure due to reduced CO₂ solubility
    const tempFactor = 1.0 + (temperatureCelsius * 0.08); // Increases with temperature
    const basePressure = 0.8; // Base pressure factor for beer
    const pressureBar = (additionalCO2 * tempFactor) + basePressure;
    
    // Ensure minimum pressure for any carbonation
    const finalPressureBar = Math.max(pressureBar, 0.5);
    const pressurePsi = this.barToPsi(finalPressureBar);
    
    return {
      psi: Math.round(pressurePsi * 10) / 10,
      bar: Math.round(finalPressureBar * 100) / 100,
      naturalSolubility: Math.round(naturalSolubility * 100) / 100,
      additionalCO2: Math.round(additionalCO2 * 100) / 100
    };
  }

  /**
   * Calculate optimal temperature for a given pressure and CO₂ volume
   * @param {number} targetVolumes - Target CO₂ volumes
   * @param {number} pressurePsi - Available pressure in PSI
   * @returns {object} Temperature in both Celsius and Fahrenheit
   */
  calculateOptimalTemperature(targetVolumes, pressurePsi) {
    const pressureBar = this.psiToBar(pressurePsi);
    
    // Iterative approach to find optimal temperature
    let bestTemp = null;
    let minDifference = Infinity;
    
    // Search temperature range from -5°C to 20°C (extended range for all scenarios)
    // This covers freezing temperatures to warmer serving conditions
    for (let temp = -5; temp <= 20; temp += 0.1) {
      const result = this.calculateRequiredPressure(targetVolumes, temp);
      const difference = Math.abs(result.bar - pressureBar);
      
      if (difference < minDifference) {
        minDifference = difference;
        bestTemp = temp;
      }
    }
    
    return {
      celsius: Math.round(bestTemp * 10) / 10,
      fahrenheit: Math.round(this.celsiusToFahrenheit(bestTemp) * 10) / 10,
      accuracy: Math.round(minDifference * 100) / 100
    };
  }

  /**
   * Get beer style carbonation recommendations
   */
  getBeerStyleRecommendations() {
    return {
      'Lager': { min: 2.4, max: 2.8, typical: 2.6 },
      'Ale': { min: 2.0, max: 2.6, typical: 2.3 },
      'IPA': { min: 2.2, max: 2.6, typical: 2.4 },
      'Stout/Porter': { min: 1.6, max: 2.2, typical: 1.9 },
      'Wheat Beer': { min: 2.8, max: 3.8, typical: 3.3 },
      'Belgian': { min: 2.4, max: 3.0, typical: 2.7 },
      'Sour Beer': { min: 2.6, max: 3.4, typical: 3.0 },
      'Pilsner': { min: 2.4, max: 2.8, typical: 2.6 }
    };
  }

  /**
   * Display beer style recommendations
   */
  displayBeerStyles() {
    const styles = this.getBeerStyleRecommendations();
    console.log('\n=== Beer Style Carbonation Recommendations ===');
    console.log('Style'.padEnd(15) + 'Range (vol CO₂)'.padEnd(20) + 'Typical');
    console.log('-'.repeat(50));
    
    for (const [style, data] of Object.entries(styles)) {
      const range = `${data.min} - ${data.max}`;
      console.log(style.padEnd(15) + range.padEnd(20) + data.typical);
    }
    console.log('');
  }

  /**
   * Run interactive calculator
   */
  runInteractive() {
    console.log('🍺 Beer Carbonation Calculator 🍺\n');
    console.log('Calculate the optimal temperature and pressure for carbonating your beer.\n');

    while (true) {
      console.log('Choose calculation mode:');
      console.log('1. Calculate pressure for given temperature and CO₂ volume');
      console.log('2. Calculate temperature for given pressure and CO₂ volume');
      console.log('3. View beer style carbonation recommendations');
      console.log('4. Exit\n');

      const choice = readlineSync.question('Enter your choice (1-4): ');

      switch (choice) {
        case '1':
          this.calculatePressureMode();
          break;
        case '2':
          this.calculateTemperatureMode();
          break;
        case '3':
          this.displayBeerStyles();
          break;
        case '4':
          console.log('Thanks for using the Beer Carbonation Calculator! 🍻');
          return;
        default:
          console.log('Invalid choice. Please try again.\n');
      }
    }
  }

  /**
   * Calculate pressure mode
   */
  calculatePressureMode() {
    console.log('\n=== Calculate Required Pressure ===');
    
    const targetVolumes = parseFloat(readlineSync.question('Enter target CO₂ volume (e.g., 2.4): '));
    const tempUnit = readlineSync.question('Temperature unit - (C)elsius or (F)ahrenheit? ').toLowerCase();
    
    let temperatureCelsius;
    if (tempUnit === 'f') {
      const tempF = parseFloat(readlineSync.question('Enter temperature (°F): '));
      temperatureCelsius = this.fahrenheitToCelsius(tempF);
    } else {
      temperatureCelsius = parseFloat(readlineSync.question('Enter temperature (°C): '));
    }

    const result = this.calculateRequiredPressure(targetVolumes, temperatureCelsius);
    
    console.log('\n=== Results ===');
    console.log(`Target CO₂ volume: ${targetVolumes} vol`);
    console.log(`Temperature: ${temperatureCelsius}°C (${this.celsiusToFahrenheit(temperatureCelsius)}°F)`);
    console.log(`Natural CO₂ solubility: ${result.naturalSolubility} vol`);
    console.log(`Additional CO₂ needed: ${result.additionalCO2} vol`);
    console.log(`Required pressure: ${result.psi} PSI (${result.bar} bar)`);
    console.log('');
  }

  /**
   * Calculate temperature mode
   */
  calculateTemperatureMode() {
    console.log('\n=== Calculate Optimal Temperature ===');
    
    const targetVolumes = parseFloat(readlineSync.question('Enter target CO₂ volume (e.g., 2.4): '));
    const pressureUnit = readlineSync.question('Pressure unit - (P)SI or (B)ar? ').toLowerCase();
    
    let pressurePsi;
    if (pressureUnit === 'b') {
      const pressureBar = parseFloat(readlineSync.question('Enter available pressure (bar): '));
      pressurePsi = this.barToPsi(pressureBar);
    } else {
      pressurePsi = parseFloat(readlineSync.question('Enter available pressure (PSI): '));
    }

    const result = this.calculateOptimalTemperature(targetVolumes, pressurePsi);
    
    console.log('\n=== Results ===');
    console.log(`Target CO₂ volume: ${targetVolumes} vol`);
    console.log(`Available pressure: ${pressurePsi} PSI (${this.psiToBar(pressurePsi)} bar)`);
    console.log(`Optimal temperature: ${result.celsius}°C (${result.fahrenheit}°F)`);
    console.log(`Calculation accuracy: ±${result.accuracy} bar`);
    console.log('');
  }
}

// Run the application
if (require.main === module) {
  const calculator = new CarbonationCalculator();
  calculator.runInteractive();
}

module.exports = CarbonationCalculator;
