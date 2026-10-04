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

form.addEventListener("submit", async function (event) {
  event.preventDefault();
  
  const city = cityInput.value.trim();

  if (city === "") {
    statusEl.textContent = "Please enter a city name.";
    return;
  }

  statusEl.textContent = "Searching for " + city + "...";
  
  try {
    const place = await getCoordinates(city);
    console.log(place);
    statusEl.textContent = "";
  } catch (error) {
    statusEl.textContent = error.message;
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