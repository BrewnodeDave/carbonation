const CarbonationCalculator = require('./index.js');

const calculator = new CarbonationCalculator();

console.log('Testing temperature dependency:');
const result1 = calculator.calculateRequiredPressure(2.6, 2);
const result2 = calculator.calculateRequiredPressure(2.6, 8);

console.log('2°C pressure:', result1.psi, 'PSI, natural solubility:', result1.naturalSolubility, 'additional CO2:', result1.additionalCO2);
console.log('8°C pressure:', result2.psi, 'PSI, natural solubility:', result2.naturalSolubility, 'additional CO2:', result2.additionalCO2);

console.log('');
console.log('Natural solubility values:');
console.log('At 2°C:', calculator.calculateSolubility(2));
console.log('At 8°C:', calculator.calculateSolubility(8));
