let apiKey = "b9ba0314a93083136d968577c718e31d";
let celsiusTemperature = null;

function displayTemperature(response) {
  let cityName = response.data.name;
  let temperature = response.data.main.temp;
  let weatherDescription = response.data.weather[0].description;
  let humidity = response.data.main.humidity;
  let wind = parseInt(Math.round(response.data.wind.speed * 3.6));
  let weatherIcon = response.data.weather[0].icon;

  let cityHeading = document.querySelector("#city");
  cityHeading.textContent = cityName;

  let temperatureElement = document.querySelector("#temperature");
  temperatureElement.innerHTML = Math.round(temperature);

  let weatherDescriptionElement = document.querySelector(".description");
  weatherDescriptionElement.textContent = capitalizeFirstLetter(
    weatherDescription
  );

  let humidityElement = document.querySelector("#humidity");
  humidityElement.textContent = `Humidity: ${humidity}%`;

  let windElement = document.querySelector("#wind");
  windElement.textContent = `Wind: ${wind} km/h`;

  let weatherIconElement = document.querySelector("#icon");
  weatherIconElement.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${weatherIcon}.png`
  );

  let celsiusLink = document.querySelector("#celsius-link");
  let fahrenheitLink = document.querySelector("#fahrenheit-link");

  let coordinates = response.data.coord;
  getForecast(coordinates);
}

function displayFahrenheitTemperature(event) {
  event.preventDefault();
  let temperatureElement = document.querySelector("#temperature");
  let fahrenheitTemperature = (celsiusTemperature * 9) / 5 + 32;
  temperatureElement.innerHTML = Math.round(fahrenheitTemperature);

  let celsiusLink = document.querySelector("#celsius-link");
  let fahrenheitLink = document.querySelector("#fahrenheit-link");

  celsiusLink.classList.remove("active");
}

function displayCelsiusTemperature(event) {
  event.preventDefault();
  let temperatureElement = document.querySelector("#temperature");
  temperatureElement.innerHTML = Math.round(celsiusTemperature);

  let celsiusLink = document.querySelector("#celsius-link");
  let fahrenheitLink = document.querySelector("#fahrenheit-link");

  celsiusLink.classList.add("active");
}

function updateTemperatureUnits() {
  let temperatureElement = document.querySelector("#temperature");
  let celsiusLink = document.querySelector("#celsius-link");
  let fahrenheitLink = document.querySelector("#fahrenheit-link");

  temperatureElement.innerHTML = Math.round(celsiusTemperature);
  celsiusLink.classList.add("active");
}

function searchCity(city) {
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
  axios.get(apiUrl).then(displayTemperature);
}

function getCurrentPosition() {
  navigator.geolocation.getCurrentPosition(function (position) {
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;
    let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`;
    axios.get(apiUrl).then(displayTemperature);
  });
}

function loadTemperatureFromLocation() {
  getCurrentPosition();
}

loadTemperatureFromLocation();

let form = document.querySelector(".search-form");
let currentButton = document.querySelector("#current-location-button");

let DateTimeElement = document.querySelector("#current-date-time");

function formatDateTime(date) {
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
  ];

  let currentDay = days[date.getDay()];

  let options = {
    hour: "numeric",
    minute: "numeric",
    hour12: false
  };

  let formattedTime = date.toLocaleTimeString(undefined, options);

  let formattedDateTime = `${currentDay}, ${formattedTime}`;

  return formattedDateTime;
}

function updateDateTime() {
  let currentDate = new Date();
  DateTimeElement.innerHTML = formatDateTime(currentDate);
}

setInterval(updateDateTime, 1000);

form.addEventListener("submit", function (event) {
  event.preventDefault();
  let cityInput = document.querySelector(".form-control");
  let cityName = cityInput.value.trim();

  if (cityName.length === 0) {
    alert("Please enter a city name.");
  } else {
    searchCity(cityName);
    cityInput.value = "";
  }
});

currentButton.addEventListener("click", function (event) {
  event.preventDefault();
  let cityInput = document.querySelector(".form-control");
  let cityName = cityInput.value.trim();

  if (cityName.length === 0) {
    getCurrentPosition();
  } else {
    searchCity(cityName);
    cityInput.value = "";
  }
});

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return days[day];
}

function displayForecast(response) {
  let forecast = response.data.daily;

  let forecastElement = document.querySelector("#forecast");

  let forecastHTML = `<div class="row">`;
  forecast.forEach(function (forecastDay, index) {
    if (index < 6) {
      forecastHTML += `
      <div class="col-2">
        <div class="weather-forecast-date">${formatDay(forecastDay.dt)}</div>
        <img
          src="http://openweathermap.org/img/wn/${
            forecastDay.weather[0].icon
          }@2x.png"
          alt=""
          width="42"
        />
        <div class="weather-forecast-temperatures">
          <span class="weather-forecast-temperature-max">${Math.round(
            forecastDay.temp.max
          )}°</span>
          <span class="weather-forecast-temperature-min">${Math.round(
            forecastDay.temp.min
          )}°</span>
        </div>
      </div>
    `;
    }
  });

  forecastHTML += `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

function getForecast(coordinates) {
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&exclude=current,minutely,hourly&units=metric&appid=${apiKey}`;
  axios.get(apiUrl).then(displayForecast);
}
