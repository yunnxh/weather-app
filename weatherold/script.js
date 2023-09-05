// Function to fetch weather data from the server
function fetchWeatherFromServer(city) {
  const apiKey = 'c20925545257cec1439f5bfcf3f30ea9';
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      const weather = {
        temperature: data.main.temp,
        windSpeed: data.wind.speed,
        humidity: data.main.humidity,
        city: data.name,
        country: data.sys.country,
      };

      // Cache the weather data on the server (via PHP)
      cacheWeatherOnServer(city, weather);

      // Update the UI
      updateWeatherUI(weather);
    })
    .catch((error) => {
      console.log('Error:', error);
    });
}

// Function to cache weather data on the server
function cacheWeatherOnServer(city, weatherData) {
  fetch('cache_weather.php', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ city: city, weatherData: weatherData }), // Include city and weatherData in the payload
  })
    .then((response) => response.json())
    .then((data) => {
      console.log('Weather data cached on server:', data);
    })
    .catch((error) => {
      console.log('Error caching weather data:', error);
    });
}


// Function to get weather data (with caching)
function getWeather(city) {
  // Check if weather data is already cached on the server
  fetch('get_cached_weather.php?city=' + encodeURIComponent(city))
    .then((response) => response.json())
    .then((data) => {
      if (data && data.weatherData) {
        // Data is available on the server, use it
        updateWeatherUI(data.weatherData);
      } else {
        // Data is not cached on the server, fetch it from OpenWeatherMap
        fetchWeatherFromServer(city);
      }
    })
    .catch((error) => {
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
  const cityHeading = document.querySelector('.current-weather h2');
  const temperature = document.querySelector('.current-weather h6:nth-of-type(1)');
  const wind = document.querySelector('.current-weather h6:nth-of-type(2)');
  const humidity = document.querySelector('.current-weather h6:nth-of-type(3)');

  cityHeading.textContent = `${weatherData.city} (${weatherData.country})`;
  temperature.textContent = `Temperature: ${weatherData.temperature}°C`;
  wind.textContent = `Wind: ${weatherData.windSpeed} M/S`;
  humidity.textContent = `Humidity: ${weatherData.humidity}%`;
}

// Function to handle the search button click event
function handleSearch() {
  const cityInput = document.querySelector('.city-input');
  const city = cityInput.value;
  getWeather(city);
}

// Initialize the app
document.addEventListener('DOMContentLoaded', function () {
  const assignedCity = 'Ozark'; // Replace with your assigned city
  getWeather(assignedCity);

  const searchButton = document.querySelector('.search-btn');
  searchButton.addEventListener('click', handleSearch);
});
