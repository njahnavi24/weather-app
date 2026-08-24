// Map city names to coordinates
const cityCoordinates = {
  "new york": { lat: 40.7128, lon: -74.0060, name: "New York" },
  "los angeles": { lat: 34.0522, lon: -118.2437, name: "Los Angeles" },
  "chicago": { lat: 41.8781, lon: -87.6298, name: "Chicago" },
  "paris": { lat: 48.8566, lon: 2.3522, name: "Paris" },
  "tokyo": { lat: 35.6762, lon: 139.6503, name: "Tokyo" },
  "london": { lat: 51.5074, lon: -0.1278, name: "London" }
};

// Embedded SVG icons for guaranteed loading
const weatherIcons = {
  clear: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><circle cx="32" cy="32" r="14" fill="%23ffb703"/><path d="M32 6v6M32 52v6M6 32h6M52 32h6M13.6 13.6l4.2 4.2M46.2 46.2l4.2 4.2M13.6 50.4l4.2-4.2M46.2 17.8l4.2-4.2" stroke="%23ffb703" stroke-width="4" stroke-linecap="round"/></svg>`,
  partlyCloudy: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><circle cx="24" cy="24" r="10" fill="%23ffb703"/><path d="M46 50H22a12 12 0 01-2.4-23.7A16 16 0 0150 28.5 10 10 0146 50z" fill="%2390e0ef"/></svg>`,
  cloudy: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><path d="M46 46H18a14 14 0 01-2.8-27.7A18 18 0 0150 22a12 12 0 01-4 24z" fill="%238d99ae"/></svg>`,
  rain: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><path d="M46 38H18a14 14 0 01-2.8-27.7A18 18 0 0150 14a12 12 0 01-4 24z" fill="%2348cae4"/><path d="M22 46l-4 10M32 46l-4 10M42 46l-4 10" stroke="%230077b6" stroke-width="4" stroke-linecap="round"/></svg>`,
  thunderstorm: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><path d="M46 34H18a14 14 0 01-2.8-27.7A18 18 0 0150 10a12 12 0 01-4 24z" fill="%234a5568"/><path d="M30 36l-6 12h8l-4 12 14-16h-8l6-8z" fill="%23ffb703"/></svg>`,
  snow: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><path d="M46 38H18a14 14 0 01-2.8-27.7A18 18 0 0150 14a12 12 0 01-4 24z" fill="%23caf0f8"/><circle cx="20" cy="50" r="3" fill="%230077b6"/><circle cx="32" cy="52" r="3" fill="%230077b6"/><circle cx="44" cy="50" r="3" fill="%230077b6"/></svg>`
};

// Map WMO Weather Code from Open-Meteo to specific icon & status text
function getWeatherDetails(code) {
  if (code === 0) {
    return { text: "Clear Sky", icon: weatherIcons.clear };
  } else if (code >= 1 && code <= 3) {
    return { text: "Partly Cloudy", icon: weatherIcons.partlyCloudy };
  } else if (code >= 45 && code <= 48) {
    return { text: "Cloudy / Foggy", icon: weatherIcons.cloudy };
  } else if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) {
    return { text: "Rain", icon: weatherIcons.rain };
  } else if (code >= 71 && code <= 77) {
    return { text: "Snow", icon: weatherIcons.snow };
  } else if (code >= 95 && code <= 99) {
    return { text: "Thunderstorm", icon: weatherIcons.thunderstorm };
  } else {
    return { text: "Cloudy", icon: weatherIcons.cloudy };
  }
}

async function getWeather(cityKey) {
  try {
    const city = cityCoordinates[cityKey.toLowerCase()];
    if (!city) return null;

    const url = `https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lon}&current_weather=true&hourly=relativehumidity_2m,windgusts_10m`;
    
    const response = await fetch(url);
    if (!response.ok) throw new Error("Network response failed");

    const data = await response.json();
    return {
      name: city.name,
      temp: data.current_weather.temperature,
      wind: data.current_weather.windspeed,
      windGust: data.hourly?.windgusts_10m?.[0] ?? "N/A",
      humidity: data.hourly?.relativehumidity_2m?.[0] ?? "N/A",
      weatherCode: data.current_weather.weathercode
    };
  } catch (error) {
    console.error("Fetch error details:", error);
    return null;
  }
}

async function showWeather(city) {
  if (!city) {
    alert("Please select a city.");
    return;
  }

  const data = await getWeather(city);

  if (!data) {
    alert("Could not fetch weather data. Please try again.");
    return;
  }

  const weatherDetails = getWeatherDetails(data.weatherCode);

  document.getElementById("main-temperature").textContent = Math.round(data.temp);
  document.getElementById("feels-like").textContent = Math.round(data.temp);
  document.getElementById("humidity").textContent = data.humidity;
  document.getElementById("wind").textContent = data.wind;
  document.getElementById("wind-gust").textContent = data.windGust;
  document.getElementById("weather-main").textContent = weatherDetails.text;
  document.getElementById("location").textContent = data.name;
  
  // Directly set SVG string source
  document.getElementById("weather-icon").src = weatherDetails.icon;
}

document.getElementById("get-weather-btn").addEventListener("click", function () {
  const city = document.getElementById("city").value;
  showWeather(city);
});