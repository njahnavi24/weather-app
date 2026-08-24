async function getWeather(city) {
  try {
    const formattedCity = encodeURIComponent(city.trim());
    const response = await fetch(
      `https://weather-proxy.freecodecamp.rocks/api/city/${formattedCity}`
    );

    if (!response.ok) throw new Error("Network response failed");

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Fetch error:", error);
    return null;
  }
}

async function showWeather(city) {
  if (!city) {
    alert("Please select a valid city from the dropdown.");
    return;
  }

  const data = await getWeather(city);

  if (!data) {
    alert("Something went wrong, please try again later.");
    return;
  }

  document.getElementById("weather-icon").src =
    data.weather?.[0]?.icon || "";

  document.getElementById("main-temperature").textContent =
    data.main?.temp ?? "N/A";

  document.getElementById("feels-like").textContent =
    data.main?.feels_like ?? "N/A";

  document.getElementById("humidity").textContent =
    data.main?.humidity ?? "N/A";

  document.getElementById("wind").textContent =
    data.wind?.speed ?? "N/A";

  document.getElementById("wind-gust").textContent =
    data.wind?.gust ?? "N/A";

  document.getElementById("weather-main").textContent =
    data.weather?.[0]?.main ?? "N/A";

  document.getElementById("location").textContent =
    data.name ?? "N/A";
}

document
  .getElementById("get-weather-btn")
  .addEventListener("click", function () {
    const city = document.getElementById("city").value;
    showWeather(city);
  });