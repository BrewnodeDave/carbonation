# Beer Carbonation Calculator 🍺

A Node.js application that calculates the optimal temperature and pressure settings needed to carbonate beer to a specific CO₂ volume level.

## Features

- **Pressure Calculation**: Calculate required pressure for a given temperature and target CO₂ volume
- **Temperature Calculation**: Find optimal temperature for available pressure and target CO₂ volume  
- **Beer Style Recommendations**: Built-in carbonation guidelines for different beer styles
- **Unit Conversions**: Support for Celsius/Fahrenheit and PSI/bar
- **Interactive CLI**: User-friendly command-line interface
- **Scientific Accuracy**: Based on Henry's Law and empirical formulas for beer carbonation

## Installation

1. Clone or download this repository
2. Navigate to the project directory
3. Install dependencies:

```bash
npm install
```

## Usage

### Web Application (Recommended)

Run the modern web interface:

```bash
npm run web
```

Then open your browser to `http://localhost:3000`

The web app features:
- **Interactive Calculator**: Real-time pressure and temperature calculations
- **Tabbed Interface**: Easy switching between calculation modes
- **Beer Style Guide**: Built-in carbonation recommendations for popular beer styles
- **Temperature vs Pressure Chart**: Visual reference with customizable CO₂ volumes
- **Unit Converters**: Quick conversion between °C/°F and PSI/bar
- **Mobile Responsive**: Works perfectly on all devices
- **Real-time Results**: Instant calculations as you type

### Interactive Mode (CLI)

Run the application in interactive command-line mode:

```bash
npm start
```

The application will present you with options to:
1. Calculate pressure for given temperature and CO₂ volume
2. Calculate temperature for given pressure and CO₂ volume
3. View beer style carbonation recommendations
4. Exit

### Example Calculations

**Calculate Pressure:**
- Target: 2.6 volumes CO₂ (typical lager)
- Temperature: 4°C (39°F)
- Result: ~12 PSI at serving temperature

**Calculate Temperature:**
- Target: 2.4 volumes CO₂
- Available pressure: 10 PSI
- Result: ~2°C (36°F) optimal temperature

## Beer Style Guidelines

The application includes carbonation recommendations for popular beer styles:

| Style | Range (vol CO₂) | Typical |
|-------|----------------|---------|
| Lager | 2.4 - 2.8 | 2.6 |
| Ale | 2.0 - 2.6 | 2.3 |
| IPA | 2.2 - 2.6 | 2.4 |
| Stout/Porter | 1.6 - 2.2 | 1.9 |
| Wheat Beer | 2.8 - 3.8 | 3.3 |
| Belgian | 2.4 - 3.0 | 2.7 |
| Sour Beer | 2.6 - 3.4 | 3.0 |
| Pilsner | 2.4 - 2.8 | 2.6 |

## API Usage

You can also use the calculator programmatically:

```javascript
const CarbonationCalculator = require('./index.js');

const calculator = new CarbonationCalculator();

// Calculate required pressure
const pressureResult = calculator.calculateRequiredPressure(2.6, 4);
console.log(`Required pressure: ${pressureResult.psi} PSI`);

// Calculate optimal temperature
const tempResult = calculator.calculateOptimalTemperature(2.4, 10);
console.log(`Optimal temperature: ${tempResult.celsius}°C`);

// Get beer style recommendations
const styles = calculator.getBeerStyleRecommendations();
console.log(styles['Lager']); // { min: 2.4, max: 2.8, typical: 2.6 }
```

## Testing

Run the test suite to verify calculations:

```bash
npm test
```

The tests verify:
- Temperature and pressure conversions
- CO₂ solubility calculations
- Pressure requirements for different scenarios
- Temperature optimization algorithms
- Beer style recommendation data

## Scientific Background

The calculator uses:

- **Henry's Law**: For gas solubility in liquids
- **Temperature Dependency**: CO₂ solubility decreases with temperature
- **Beer-Specific Adjustments**: Accounts for alcohol content and dissolved solids
- **Empirical Formulas**: Based on brewing industry standards and research

### Formula

The basic relationship for CO₂ solubility in beer:

```
Required Pressure = (Target Volume - Natural Solubility) × Temperature Factor
```

Where:
- Natural solubility varies with temperature
- Temperature factor accounts for reduced solubility at higher temperatures
- Pressure is calculated to achieve the difference between target and natural levels

## Development

### Project Structure

```
carbonation/
├── package.json          # Project configuration and dependencies
├── index.js             # Main calculator logic and CLI interface
├── server.js            # Express web server
├── test.js              # Test suite
├── demo.js              # Demonstration script
├── public/              # Web application files
│   ├── index.html       # Main web page
│   ├── styles.css       # Styling and responsive design
│   └── script.js        # Frontend JavaScript
└── README.md            # This file
```

### Contributing

1. Fork the repository
2. Create a feature branch
3. Add tests for new functionality
4. Ensure all tests pass
5. Submit a pull request

## Requirements

- Node.js 14.0.0 or higher
- npm (comes with Node.js)

## License

MIT License - see package.json for details

## Disclaimer

This calculator provides estimates based on scientific formulas and brewing industry standards. Always verify results with your specific equipment and conditions. Actual carbonation may vary due to factors like:

- Beer composition (alcohol content, residual sugars)
- Equipment variations
- Temperature fluctuations
- Time factors (equilibrium rates)

For critical applications, consider professional brewing software or consult with brewing experts.

---

**Happy Brewing! 🍻**
