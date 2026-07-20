const cityInput = document.getElementById("city");
const searchBtn = document.getElementById("search");

const cityName = document.getElementById("cityName");
const temp = document.getElementById("temp");
const condition = document.getElementById("condition");
const humidity = document.getElementById("humidity");
const wind = document.getElementById("wind");
const icon = document.getElementById("icon");
const loading = document.getElementById("loading");
const forecastContainer = document.getElementById("forecastContainer");

searchBtn.addEventListener("click", getWeather);

cityInput.addEventListener("keypress", function(event){

    if(event.key === "Enter"){

        getWeather();

    }

});
async function getWeather() {

    const city = cityInput.value.trim();

    if (city === "") {
        alert("Please enter a city name.");
        return;
    }

    try {
        loading.textContent = "Loading weather...";

        const geoResponse = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1`
        );

        const geoData = await geoResponse.json();

        if (!geoData.results) {
            alert("City not found!");
            return;
        }

        const latitude = geoData.results[0].latitude;
        const longitude = geoData.results[0].longitude;
        const place = geoData.results[0].name;

        const weatherResponse = await fetch(
`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`
);

        const weatherData = await weatherResponse.json();

        cityName.textContent = place;
        temp.textContent = weatherData.current.temperature_2m + "°C";
        humidity.textContent = weatherData.current.relative_humidity_2m;
        wind.textContent = weatherData.current.wind_speed_10m;
        loading.textContent = "";
        const code = weatherData.current.weather_code;

        console.log("Weather Code:", code);
        document.body.classList.remove("sunny", "cloudy", "rainy");

if (code === 0) {

    condition.textContent = "☀️ Clear Sky";
    icon.src = "https://openweathermap.org/img/wn/01d.png";
    document.body.classList.add("sunny");

}
else if (code >= 1 && code <= 3) {

    condition.textContent = "☁️ Cloudy";
    icon.src = "https://openweathermap.org/img/wn/03d.png";
    document.body.classList.add("cloudy");

}
else if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) {

    condition.textContent = "🌧️ Rain";
    icon.src = "https://openweathermap.org/img/wn/10d.png";
    document.body.classList.add("rainy");

}
else if (code >= 95 && code <= 99) {

    condition.textContent = "⛈️ Thunderstorm";
    icon.src = "https://openweathermap.org/img/wn/11d.png";
    document.body.classList.add("rainy");

}
else {

    condition.textContent = "🌍 Weather Updated";
    icon.src = "https://openweathermap.org/img/wn/50d.png";

}
forecastContainer.innerHTML = "";

const days = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

for(let i=0;i<5;i++){

    const date = new Date(weatherData.daily.time[i]);

    const day = days[date.getDay()];

    let forecastIcon = "01d";

    const forecastCode = weatherData.daily.weather_code[i];

    if(forecastCode>=1 && forecastCode<=3){

        forecastIcon="03d";

    }
    else if((forecastCode>=51 && forecastCode<=67) || (forecastCode>=80 && forecastCode<=82)){

        forecastIcon="10d";

    }
    else if(forecastCode>=95){

        forecastIcon="11d";

    }

    forecastContainer.innerHTML += `
        <div class="forecast-card">
            <p><strong>${day}</strong></p>
            <img src="https://openweathermap.org/img/wn/${forecastIcon}.png">
            <p>${Math.round(weatherData.daily.temperature_2m_max[i])}° / ${Math.round(weatherData.daily.temperature_2m_min[i])}°</p>
        </div>
    `;

}

    } catch (error) {

        alert("Something went wrong!");
        loading.textContent = "";

        console.log(error);

    }

}