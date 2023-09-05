// Function to fetch weather data from the server
function fetchWeatherFromServer(city) {
  const apiKey = 'c20925545257cec1439f5bfcf3f30ea9';
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      const weather = {
        temperature: data.main.temp,
        windSpeed: data.wind.speed,
        humidity: data.main.humidity
      };

      // Cache the weather data in localStorage
      localStorage.setItem(city, JSON.stringify(weather));

      // Update the UI
      updateWeatherUI(weather);
    })
    .catch(error => {
      console.log('Error:', error);
    });
}

// Function to get weather data (with caching)
function getWeather(city) {
  // Check if weather data is already cached
  const cachedWeather = localStorage.getItem(city);
  if (cachedWeather) {
    // Data is available in localStorage, use it
    const weatherData = JSON.parse(cachedWeather);
    updateWeatherUI(weatherData);
  } else {
    // Data is not cached, fetch it from the server
    fetchWeatherFromServer(city);
  }
}

// Function to update the UI with weather data
function updateWeatherUI(weatherData) {
  // Implement this function to update your UI elements
  const cityHeading = document.querySelector('.current-weather h2');
  const temperature = document.querySelector('.current-weather h6:nth-of-type(1)');
  const wind = document.querySelector('.current-weather h6:nth-of-type(2)');
  const humidity = document.querySelector('.current-weather h6:nth-of-type(3)');

  cityHeading.textContent = `${weatherData.name} (${weatherData.sys.country})`; // Change data to weatherData
  temperature.textContent = `Temperature: ${weatherData.temperature}°C`;
  wind.textContent = `Wind: ${weatherData.windSpeed} M/S`;
  humidity.textContent = `Humidity: ${weatherData.humidity}%`;
}


// Example usage when the search button is clicked
searchButton.addEventListener('click', handleSearch);

      .then(response => response.json())
      .then(forecastData => {
        const forecastItems = forecastData.list;
        const uniqueDates = [];
  
        const filteredForecast = forecastItems.filter(item => {
          const date = item.dt_txt.split(' ')[0];
          if (!uniqueDates.includes(date)) {
            uniqueDates.push(date);
            return true;
          }
          return false;
        });
  
        const weatherCards = document.querySelector('.weather-cards');
        weatherCards.innerHTML = '';
  
        filteredForecast.slice(0, 5).forEach(item => {
          const forecastCard = document.createElement('li');
          forecastCard.classList.add('card');
          forecastCard.innerHTML = `
            <h3>${item.dt_txt.split(' ')[0]}</h3>
            <h6>Temp: ${item.main.temp}°C</h6>
            <h6>Wind: ${item.wind.speed} M/S</h6>
            <h6>Humidity: ${item.main.humidity}%</h6>
          `;
          weatherCards.appendChild(forecastCard);
        });
      })
      .catch(error => {
        console.log('Error:', error);
      });
  
  
  function handleSearch() {
    const cityInput = document.querySelector('.city-input');
    const city = cityInput.value;
    getWeather(city);
  }
  
  document.addEventListener('DOMContentLoaded', function() {
    const assignedCity = 'Ozark';
    getWeather(assignedCity);
  });
  
  const searchButton = document.querySelector('.search-btn');
  searchButton.addEventListener('click', handleSearch);
  // Example usage when the search button is clicked
searchButton.addEventListener('click', handleSearch);