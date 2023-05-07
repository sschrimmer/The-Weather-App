function getWeather(event) {
	event.preventDefault(); // Prevent form submission from reloading the page

	const city = document.getElementById("city").value;
	const apiKey = "18cf87fb1bde6a36934057b63920bc18";
	const url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;

	fetch(url)
		.then(response => response.json())
		.then(data => {
			if (data.cod == 200) {
				const weather = data.weather[0].description;
				const temperature = Math.round(data.main.temp - 273.15);
				const humidity = data.main.humidity;
				const windSpeed = data.wind.speed;

				const weatherData = `<p>Weather: ${weather}</p>
									 <p>Temperature: ${temperature}°C</p>
									 <p>Humidity: ${humidity}%</p>
									 <p>Wind Speed: ${windSpeed} m/s</p>`;
				document.getElementById("weather-data").innerHTML = weatherData;
			} else {
				document.getElementById("weather-data").innerHTML = `<p>City not found</p>`;
			}
		})
		.catch(error => console.log(error));
}