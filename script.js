async function getWeather(city) {
  try {
    // OpenWeather API Direct Call
    const apiKey = "b1b15e88fa797225412429c1c50c122a1";
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&appid=${apiKey}`;
    
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Fetch error details:", error);
    return null;
  }
}

async function showWeather(city) {
  if (!city) {
    alert("Please select a valid city.");
    return;
  }

  const data = await getWeather(city);

  if (!data || !data.main) {
    alert(`Could not fetch weather data for "${city}". Open Console (F12) to see error.`);
    return;
  }

  // Update Weather Card Elements
  const iconCode = data.weather?.[0]?.icon;
  document.getElementById("weather-icon").src = iconCode
    ? `https://openweathermap.org/img/wn/${iconCode}@2x.png`
    : "";

  document.getElementById("main-temperature").textContent = Math.round(data.main.temp);
  document.getElementById("feels-like").textContent = Math.round(data.main.feels_like);
  document.getElementById("humidity").textContent = data.main.humidity;
  document.getElementById("wind").textContent = data.wind?.speed ?? "N/A";
  document.getElementById("wind-gust").textContent = data.wind?.gust ?? "0";
  document.getElementById("weather-main").textContent = data.weather?.[0]?.main ?? "N/A";
  document.getElementById("location").textContent = data.name;
}

document.getElementById("get-weather-btn").addEventListener("click", function () {
  const city = document.getElementById("city").value;
  showWeather(city);
});