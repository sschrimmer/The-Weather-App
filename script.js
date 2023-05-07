const apiKey = "aea25d4e576e6011595a94a49b437836";
const searchHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];

const cityInput = document.getElementById("city-input");
const searchBtn = document.getElementById("search-btn");
const searchHistoryDiv = document.getElementById("search-history");
const currentWeatherDiv = document.getElementById("current-weather");
const forecastDiv = document.getElementById("forecast");

// Handle search form submission
function handleSearch(e) {
	e.preventDefault();

	const city = cityInput.value.trim();

//Get city coordinates from OpenWeatherMap API
return fetch('https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}')
.then(response => {
	if (!response.ok) {
		throw new Error("City not found");

	}
	return response.json();
})

.then(data => {
	if (!data.name) {
		throw new Error("city name not found in response");

	}

// Save search to search history
searchHistory.unshift(data.name);
localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
renderSearchHistory();

// Get weather data for city using coordinates
const lat = data.coord.lat;
const lon = data.coord.lon;
return fetch('https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}');
})
.then(response => response.json())
.then(data => {
	//Render current weather and 5-day forecast
	const currentWeather = data.list[0];
	const forecast = data.list.slice(1, 6);

	currentWeatherDiv.innerHTML = `
	<h2>${city}</h2>
	<p>Date: ${new Date(currentWeather.dt * 1000).toLocaleDateString()}</p>
	<p>Humidity: ${currentWeather.main.humidty}%</p>
	<p>Wind Speed: ${currentWeather.wind.speed} m/s<p>
	<img src= "https://openweathermap.org/img/w/${currentWeather.weather[0].icon}.png" alt="${currentWeather.weather[0].description}">

	`;

	let forecastHtml = "<h2>5-Day Forecast:</h2>";
	forecast.forEach(forecastItem => {
		forecastHtml += `
		<div>
		<p>Date: ${new Date(forecastItem.dt * 1000).toLocaleDateString()}</p>
		<p>Temperature: ${kelvinToCelsius(forecastItem.main.temp)} &deg;F</p>
		<p>Humidity: $(forecastItem.main.humidty}%apiKey=" %</p>
		<p>Wind Speed: ${forecastItem.wind.speed} m/s</p>
		<img src="https://openweathermap.org/img/w/${forecastItem.weather[0].icon}.png" alt="$(forecastItem.weather[0].description}">
</div>
`;
	});
	forecastDiv.innerHTML = forecastHtml;
})
.catch(error => {
	console.error(error);
	alert(error.message);
});

//Clear input field
cityInput.value = "";

}

//Convert temperature from Kelvin to farenheight
function kelvinToCelsius(Kelvin) {
	return ((kelvin - 273.15)* 9/5 +32).toFixed(1);
}

//Render search history
function renderSearchHistory() {
	let searchHistoryHtml = "<h2>Search History:</h2>";
	searchHistory.forEach(city => {
		searchHistoryHtml += '<div class="search-history-item">${city}</div>';

	});
	
searchHistoryDiv.innerHTML = searchHistoryHtml;

//Add click event listeners to search history items
const searchHistoryItems = document.querySelectorAll(".search-history-item");
searchHistoryItems.forEach(item => {
	item.addEventListener("click", () => {
		item.addEventListener("click", () => {
			cityInput.value = item.innerText;
			searchBtn.click();
		});
	});
})}

//Initialize search history on page load
renderSearchHistory();

// Add submit event listener to search form
document.getElementById("search-form").addEventListener("submit", handleSearch);


