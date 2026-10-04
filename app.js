const form = document.getElementById("weather-form");
const cityInput= document.getElementById("city-name");
const statusEl = document.getElementById("weather-status");

async function getCoordinates(city) {
const url = "https://geocoding-api.open-meteo.com/v1/search?name=" + encodeURIComponent(city) + "&count=1";



const response = await fetch(url);

if (!response.ok) {
  throw new Error("Failed to reach the server. Try again.");
}

const data = await response.json();

if (!data.results) {
  throw new Error('city "' + city + '"not found. Check the spelling and try again.');
}

return data.results[0];
}

const weatherCodes = {
  0: "Clear", 1: "Mostly clear", 2: "Partly cloudy", 3: "Cloudy",
  45: "Foggy", 48: "Foggy",
  51: "Light drizzle", 53: "Drizzle", 55: "Heavy drizzle",
  61: "Light rain", 63: "Rainy", 65: "Heavy rain",
  71: "Light snow", 73: "Snow", 75: "Heavy snow",
  80: "Rain showers", 81: "Rain showers", 82: "Heavy showers",
  95: "Thunderstorm", 96: "Thunderstorm", 99: "Thunderstorm",
};

async function getWeather(lat, lon) {
  const url =
    "https://api.open-meteo.com/v1/forecast?latitude=" + lat +
    "&longitude=" + lon +
    "&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code";

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Could not load the weather. Try again.");
  }
  const data = await response.json();
  return data.current;
}

function showWeather(place, current) {
  document.getElementById("w-city").textContent = place.name + ", " + place.country;
  document.getElementById("w-temp").textContent = Math.round(current.temperature_2m);
  document.getElementById("w-condition").textContent = weatherCodes[current.weather_code] || "Unknown";
  document.getElementById("w-humidity").textContent = current.relative_humidity_2m + "%";
  document.getElementById("w-wind").textContent = current.wind_speed_10m + " km/h";
  document.getElementById("weather-result").classList.remove("hidden");
}

form.addEventListener("submit", async function (event) {
  event.preventDefault();
  
  const city = cityInput.value.trim();

  if (city === "") {
    statusEl.textContent = "Please enter a city name.";
    return;
  }

  statusEl.textContent = "Searching for " + city + "...";
  
  statusEl.textContent = "Loading...";
  document.getElementById("weather-result").classList.add("hidden");
  
  try {
    const place = await getCoordinates(city);
    const current = await getWeather(place.latitude, place.longitude);
    showWeather(place, current);
    statusEl.textContent = "";
  } catch (error) {
  if (error instanceof TypeError) {
    statusEl.textContent = "Network error. Check your connection and try again.";
  } else {
    statusEl.textContent = error.message;
  }
}
});

const tabButtons = document.querySelectorAll(".tab-btn");
const sections = document.querySelectorAll("main section");

tabButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    sections.forEach(function (section) {
      section.classList.add("hidden");
    });
    document.getElementById(button.dataset.target).classList.remove("hidden");

    tabButtons.forEach(function (b) {
      b.classList.remove("bg-blue-600", "text-white");
      b.classList.add("text-slate-600");
    });
    button.classList.add("bg-blue-600", "text-white");
    button.classList.remove("text-slate-600");
  });
});