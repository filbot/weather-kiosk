let timerId;
const API_URL = 'https://api.openweathermap.org/data/2.5/weather';
const LAT = 47.6506;
const LON = -122.3694;
const API_KEY = process.env.REACT_APP_API_KEY;

self.onmessage = function(e) {
  if (e.data === 'start') {
    fetchWeatherData();
    timerId = setInterval(fetchWeatherData, 60000);
  } else if (e.data === 'stop') {
    clearInterval(timerId);
  }
};

async function fetchWeatherData() {
  try {
    const response = await fetch(`${API_URL}?lat=${LAT}&lon=${LON}&appid=${API_KEY}&units=imperial`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    self.postMessage({ type: 'success', data });
  } catch (error) {
    let errorMessage = 'An unexpected error occurred';
    
    if (error.name === 'TypeError') {
      errorMessage = 'Network error: Please check your internet connection';
    } else if (error instanceof SyntaxError) {
      errorMessage = 'Data parsing error: Received invalid data from the server';
    } else if (error.message.includes('HTTP error')) {
      errorMessage = `Server error: ${error.message}`;
    }
    
    self.postMessage({ type: 'error', error: errorMessage });
  }
}
