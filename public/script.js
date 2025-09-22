// Global variables
let beerStyles = {};

// Tab switching
function showTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Remove active class from all buttons
    document.querySelectorAll('.tab-button').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show selected tab
    document.getElementById(tabName + '-tab').classList.add('active');
    
    // Add active class to clicked button
    event.target.classList.add('active');
}

// Calculate pressure
async function calculatePressure() {
    const targetVolumes = parseFloat(document.getElementById('target-volumes-pressure').value);
    const tempValue = parseFloat(document.getElementById('temperature').value);
    const tempUnit = document.getElementById('temp-unit').value;
    
    // Convert temperature to Celsius if needed
    let temperature = tempValue;
    if (tempUnit === 'fahrenheit') {
        temperature = (tempValue - 32) * 5/9;
    }
    
    try {
        const response = await fetch('/.netlify/functions/calculate-pressure', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                targetVolumes,
                temperature
            })
        });
        
        const result = await response.json();
        
        if (response.ok) {
            document.getElementById('result-pressure').textContent = 
                `${result.psi} PSI (${result.bar} bar)`;
            document.getElementById('result-natural').textContent = 
                `${result.naturalSolubility} volumes`;
            document.getElementById('result-additional').textContent = 
                `${result.additionalCO2} volumes`;
            
            document.getElementById('pressure-results').style.display = 'block';
        } else {
            alert('Error: ' + result.error);
        }
    } catch (error) {
        alert('Calculation error: ' + error.message);
    }
}

// Calculate temperature
async function calculateTemperature() {
    const targetVolumes = parseFloat(document.getElementById('target-volumes-temp').value);
    const pressureValue = parseFloat(document.getElementById('pressure').value);
    const pressureUnit = document.getElementById('pressure-unit').value;
    
    // Convert pressure to PSI if needed
    let pressure = pressureValue;
    if (pressureUnit === 'bar') {
        pressure = pressureValue * 14.5038;
    }
    
    try {
        const response = await fetch('/.netlify/functions/calculate-temperature', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                targetVolumes,
                pressure
            })
        });
        
        const result = await response.json();
        
        if (response.ok) {
            document.getElementById('result-temperature').textContent = 
                `${result.celsius}°C (${result.fahrenheit}°F)`;
            document.getElementById('result-accuracy').textContent = 
                `±${result.accuracy} bar`;
            
            document.getElementById('temperature-results').style.display = 'block';
        } else {
            alert('Error: ' + result.error);
        }
    } catch (error) {
        alert('Calculation error: ' + error.message);
    }
}

// Load beer styles
async function loadBeerStyles() {
    try {
        const response = await fetch('/.netlify/functions/beer-styles');
        beerStyles = await response.json();
        
        const grid = document.getElementById('beer-styles-grid');
        grid.innerHTML = '';
        
        for (const [styleName, data] of Object.entries(beerStyles)) {
            const styleCard = document.createElement('div');
            styleCard.className = 'style-card';
            styleCard.innerHTML = `
                <div class="style-name">${styleName}</div>
                <div class="style-range">Range: ${data.min} - ${data.max} vol</div>
                <div class="style-typical">Typical: ${data.typical} vol</div>
            `;
            grid.appendChild(styleCard);
        }
    } catch (error) {
        console.error('Error loading beer styles:', error);
    }
}

// Add some visual feedback for calculations
function addLoadingState(element) {
    element.classList.add('loading');
    element.disabled = true;
}

function removeLoadingState(element) {
    element.classList.remove('loading');
    element.disabled = false;
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Load initial data
    loadBeerStyles();
    
    // Set up enter key handlers for calculators
    document.getElementById('target-volumes-pressure').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') calculatePressure();
    });
    
    document.getElementById('temperature').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') calculatePressure();
    });
    
    document.getElementById('target-volumes-temp').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') calculateTemperature();
    });
    
    document.getElementById('pressure').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') calculateTemperature();
    });
});

// Add some visual feedback for calculations
function addLoadingState(element) {
    element.classList.add('loading');
    element.disabled = true;
}

function removeLoadingState(element) {
    element.classList.remove('loading');
    element.disabled = false;
}
