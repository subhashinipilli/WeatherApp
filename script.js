
async function getWeather() {

    // Get city name from input
    let city = document.getElementById("cityInput").value.trim();

    let errorMessage = document.getElementById("errorMessage");

    if (city === "") {
        errorMessage.textContent = "Please enter a city name!";
        return;
    }

    errorMessage.textContent = "Loading weather...";

    try {

        // Step 1: Search for city coordinates
        let geoURL =
            "https://geocoding-api.open-meteo.com/v1/search?name="
            + encodeURIComponent(city)
            + "&count=1&language=en&format=json";

        let geoResponse = await fetch(geoURL);
        let geoData = await geoResponse.json();

        if (!geoData.results || geoData.results.length === 0) {
            errorMessage.textContent = "City not found!";
            return;
        }

        let location = geoData.results[0];

        let latitude = location.latitude;
        let longitude = location.longitude;

        // Step 2: Get weather information
        let weatherURL =
            "https://api.open-meteo.com/v1/forecast?latitude="
            + latitude
            + "&longitude="
            + longitude
            + "&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m"
			+ "&daily=weather_code,temperature_2m_max,temperature_2m_min"
		    + "&forecast_days=5"
            + "&timezone=auto";

        let weatherResponse = await fetch(weatherURL);
		let weatherData = await weatherResponse.json();
		displayForecast(weatherData.daily);
       

        // Step 3: Get current weather details
        let current = weatherData.current;

        // Step 4: Display weather information
        document.getElementById("cityName").textContent =
            location.name + ", " + location.country;

        document.getElementById("temperature").textContent =
            current.temperature_2m + " °C";

        document.getElementById("description").textContent =
            getWeatherDescription(current.weather_code);
			document.getElementById("weatherIcon").textContent =
			    getWeatherIcon(current.weather_code);
        document.getElementById("humidity").textContent =
            current.relative_humidity_2m;

        document.getElementById("windSpeed").textContent =
            current.wind_speed_10m;

        errorMessage.textContent = "";

    } catch (error) {

        errorMessage.textContent =
            "Unable to fetch weather. Please check your internet connection.";

        console.log(error);
    }
}


// Convert weather codes into descriptions
function getWeatherDescription(code) {

    if (code === 0) return "Clear Sky";
    if (code === 1) return "Mainly Clear";
    if (code === 2) return "Partly Cloudy";
    if (code === 3) return "Overcast";
    if (code === 45 || code === 48) return "Foggy";

    if (code >= 51 && code <= 57) return "Drizzle";

    if (code >= 61 && code <= 67) return "Rain";

    if (code >= 71 && code <= 77) return "Snow";

    if (code >= 80 && code <= 82) return "Rain Showers";

    if (code >= 85 && code <= 86) return "Snow Showers";

    if (code >= 95 && code <= 99) return "Thunderstorm";

    return "Weather condition unavailable";
}

function getWeatherIcon(code) {

    if (code === 0) return "☀️";
    if (code === 1) return "🌤️";
    if (code === 2) return "⛅";
    if (code === 3) return "☁️";

    if (code === 45 || code === 48) return "🌫️";

    if (code >= 51 && code <= 57) return "🌦️";

    if (code >= 61 && code <= 67) return "🌧️";

    if (code >= 71 && code <= 77) return "❄️";

    if (code >= 80 && code <= 82) return "🌧️";

    if (code >= 95 && code <= 99) return "⛈️";

    return "🌡️";
}

function displayForecast(daily) {

    let forecastContainer =
        document.getElementById("forecastContainer");

    forecastContainer.innerHTML = "";

    for (let i = 0; i < daily.time.length; i++) {

        let day = document.createElement("div");

        day.className = "forecast-day";

        let date = document.createElement("p");
        date.textContent = daily.time[i];

        let icon = document.createElement("h2");
        icon.textContent = getWeatherIcon(daily.weather_code[i]);

        let temperature = document.createElement("p");

        temperature.textContent =
            "Max: " + daily.temperature_2m_max[i] + "°C | " +
            "Min: " + daily.temperature_2m_min[i] + "°C";

        day.appendChild(date);
        day.appendChild(icon);
        day.appendChild(temperature);

        forecastContainer.appendChild(day);
    }
}
document.getElementById("cityInput").addEventListener("keydown", function(event) {

    if (event.key === "Enter") {
        getWeather();
    }

});
