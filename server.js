const express = require('express');
const path = require('path');
const CarbonationCalculator = require('./index.js');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.static('public'));
app.use(express.json());

// Create calculator instance
const calculator = new CarbonationCalculator();

// Serve the main page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API endpoints
app.post('/api/calculate-pressure', (req, res) => {
  try {
    const { targetVolumes, temperature } = req.body;
    
    if (!targetVolumes || !temperature) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    const result = calculator.calculateRequiredPressure(targetVolumes, temperature);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/calculate-temperature', (req, res) => {
  try {
    const { targetVolumes, pressure } = req.body;
    
    if (!targetVolumes || !pressure) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    const result = calculator.calculateOptimalTemperature(targetVolumes, pressure);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/beer-styles', (req, res) => {
  try {
    const styles = calculator.getBeerStyleRecommendations();
    res.json(styles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/convert-temperature', (req, res) => {
  try {
    const { value, from } = req.body;
    
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
    
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/convert-pressure', (req, res) => {
  try {
    const { value, from } = req.body;
    
    let result;
    if (from === 'psi') {
      result = {
        psi: value,
        bar: calculator.psiToBar(value)
      };
    } else {
      result = {
        psi: calculator.barToPsi(value),
        bar: value
      };
    }
    
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start server
app.listen(port, () => {
  console.log(`🍺 Beer Carbonation Calculator Web App running at http://localhost:${port}`);
  console.log(`📊 Interactive calculator with real-time calculations`);
  console.log(`🎯 Supports pressure and temperature optimization`);
});
