// Map city names to coordinates
const cityCoordinates = {
  "new york": { lat: 40.7128, lon: -74.0060, name: "New York" },
  "los angeles": { lat: 34.0522, lon: -118.2437, name: "Los Angeles" },
  "chicago": { lat: 41.8781, lon: -87.6298, name: "Chicago" },
  "paris": { lat: 48.8566, lon: 2.3522, name: "Paris" },
  "tokyo": { lat: 35.6762, lon: 139.6503, name: "Tokyo" },
  "london": { lat: 51.5074, lon: -0.1278, name: "London" }
};

async function getWeather(cityKey) {
  try {
    const city = cityCoordinates[cityKey.toLowerCase()];
    if (!city) return null;

    const url = `https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lon}&current_weather=true&hourly=relativehumidity_2m,windgusts_10m`;
    
    const response = await fetch(url);
    if (!response.ok) throw new Error("Network response was not ok");

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

  document.getElementById("main-temperature").textContent = Math.round(data.temp);
  document.getElementById("feels-like").textContent = Math.round(data.temp);
  document.getElementById("humidity").textContent = data.humidity;
  document.getElementById("wind").textContent = data.wind;
  document.getElementById("wind-gust").textContent = data.windGust;
  document.getElementById("weather-main").textContent = "Clear / Fair";
  document.getElementById("location").textContent = data.name;
  
  // Set default sun weather icon
  document.getElementById("weather-icon").src = "https://openweathermap.org/img/wn/01d@2x.png";
}

document.getElementById("get-weather-btn").addEventListener("click", function () {
  const city = document.getElementById("city").value;
  showWeather(city);
});