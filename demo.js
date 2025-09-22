const CarbonationCalculator = require('./index.js');

/**
 * Demo script showing the Beer Carbonation Calculator in action
 */

const calculator = new CarbonationCalculator();

console.log('🍺 Beer Carbonation Calculator Demo 🍺\n');

// Example 1: Calculate pressure for a typical lager
console.log('=== Example 1: Lager Carbonation ===');
console.log('Target: 2.6 volumes CO₂ at 4°C (39°F)');
const lagerResult = calculator.calculateRequiredPressure(2.6, 4);
console.log(`Required pressure: ${lagerResult.psi} PSI (${lagerResult.bar} bar)`);
console.log(`Natural CO₂ solubility: ${lagerResult.naturalSolubility} vol`);
console.log(`Additional CO₂ needed: ${lagerResult.additionalCO2} vol\n`);

// Example 2: Calculate pressure for wheat beer
console.log('=== Example 2: Wheat Beer Carbonation ===');
console.log('Target: 3.2 volumes CO₂ at 6°C (43°F)');
const wheatResult = calculator.calculateRequiredPressure(3.2, 6);
console.log(`Required pressure: ${wheatResult.psi} PSI (${wheatResult.bar} bar)`);
console.log(`Natural CO₂ solubility: ${wheatResult.naturalSolubility} vol`);
console.log(`Additional CO₂ needed: ${wheatResult.additionalCO2} vol\n`);

// Example 3: Find optimal temperature for limited pressure
console.log('=== Example 3: Optimal Temperature for Limited Pressure ===');
console.log('Target: 2.4 volumes CO₂ with 15 PSI available');
const tempResult = calculator.calculateOptimalTemperature(2.4, 15);
console.log(`Optimal temperature: ${tempResult.celsius}°C (${tempResult.fahrenheit}°F)`);
console.log(`Calculation accuracy: ±${tempResult.accuracy} bar\n`);

// Example 4: Show beer style recommendations
console.log('=== Beer Style Carbonation Recommendations ===');
const styles = calculator.getBeerStyleRecommendations();
const selectedStyles = ['Lager', 'IPA', 'Stout/Porter', 'Wheat Beer'];

selectedStyles.forEach(style => {
  const data = styles[style];
  console.log(`${style}: ${data.min}-${data.max} vol (typical: ${data.typical})`);
});

console.log('\n=== Temperature vs Pressure Comparison ===');
console.log('For 2.5 volumes CO₂:');
[2, 4, 6, 8, 10].forEach(temp => {
  const result = calculator.calculateRequiredPressure(2.5, temp);
  const tempF = calculator.celsiusToFahrenheit(temp);
  console.log(`${temp}°C (${tempF}°F): ${result.psi} PSI`);
});

console.log('\n🍻 Ready to carbonate! Run "npm start" for interactive mode.');
