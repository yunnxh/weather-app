function updateWeatherUI(data) {
  const cityHeading = document.querySelector('.current-weather h2');
  const temperature = document.querySelector('.current-weather h6:nth-of-type(1)');
  const wind = document.querySelector('.current-weather h6:nth-of-type(2)');
  const humidity = document.querySelector('.current-weather h6:nth-of-type(3)');

  cityHeading.textContent = data.city;
  temperature.textContent = `Temperature: ${data.temperature}°C`;
  wind.textContent = `Wind: ${data.windSpeed} M/S`;
  humidity.textContent = `Humidity: ${data.humidity}%`;
}

function getWeather(city) {
  const apiKey = 'c20925545257cec1439f5bfcf3f30ea9';
  const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

  // Check if weather data is already cached
  const cachedWeather = localStorage.getItem(city);
  if (cachedWeather) {
      const weatherData = JSON.parse(cachedWeather);
      updateWeatherUI(weatherData);
      return;
  }

  fetch(apiUrl)
      .then(response => response.json())
      .then(data => {
          const weather = {
              temperature: data.main.temp,
              windSpeed: data.wind.speed,
              humidity: data.main.humidity
          };

          const cityHeading = `${data.name} (${data.sys.country})`;
          updateWeatherUI(weather);

          // Cache the weather data
          localStorage.setItem(city, JSON.stringify({
              city: cityHeading,
              temperature: weather.temperature,
              windSpeed: weather.windSpeed,
              humidity: weather.humidity
          }));

          const forecastApiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;
          return fetch(forecastApiUrl);
      })
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
}

function handleSearch() {
  const cityInput = document.querySelector('.city-input');
  const city = cityInput.value;
  if (navigator.onLine) {
      getWeather(city);
  } else {
      const errorMessage = document.createElement('p');
      errorMessage.textContent = "You are currently offline. Cached data is being displayed.";
      const container = document.querySelector('.container');
      container.insertBefore(errorMessage, container.firstChild);
      errorMessage.style.color = 'red';
      errorMessage.style.fontWeight = 'bold';
  }
}

document.addEventListener('DOMContentLoaded', function() {
  const assignedCity = 'Ozark';
  getWeather(assignedCity);
});

const searchButton = document.querySelector('.search-btn');
searchButton.addEventListener('click', handleSearch);
