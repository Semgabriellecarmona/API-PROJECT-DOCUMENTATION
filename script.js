function getWeather() {
    // API key for OpenWeatherMap
    const apiKey = 'aa975f2d422bc116b9bbed7bdf659137';
    
    // Get city name from input field
    const city = document.getElementById('city').value;
    
    // Check if city is empty
    if (!city) {
        alert('Please enter a city'); // Alert user to enter a city
        return; // Stop function execution
    }

    // Construct API URLs for current weather and forecast
    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;
    
    // Fetch current weather data
    fetch(currentWeatherUrl)
        .then(response => response.json()) // Convert response to JSON
        .then(data => {
            displayWeather(data); // Display weather data
        })
        .catch(error => {
            console.error('Error fetching current weather data:', error); // Log error to console
            alert('Error fetching current weather data. Please try again.'); // Alert user
        });

    // Fetch hourly forecast data
    fetch(forecastUrl)
        .then(response => response.json()) // Convert response to JSON
        .then(data => {
            displayHourlyForecast(data.list); // Display hourly forecast data
        })
        .catch(error => {
            console.error('Error fetching hourly forecast data:', error); // Log error to console
            alert('Error fetching hourly forecast data. Please try again.'); // Alert user
        });
}

function displayWeather(data) {
    // Get references to HTML elements for displaying weather
    const weatherInfoDiv = document.getElementById('weather-info');
    const tempDivInfo = document.getElementById('temperature-info');
    const weatherIcon = document.getElementById('weather-icon');
    
    // Check if city was not found
    if (data.cod === '404') {
        weatherInfoDiv.innerHTML = `<p>${data.message}</p>`; // Display error message
    } else {
        // Extract weather details from API response
        const cityName = data.name;
        const temperature = Math.round(data.main.temp);
        const description = data.weather[0].description;
        const iconCode = data.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;

        // Update HTML elements with weather information
        tempDivInfo.innerHTML = `<p>${temperature}°C</p>`;
        weatherInfoDiv.innerHTML = `<p>${cityName}</p><p>${description}</p>`;
        weatherIcon.src = iconUrl;
        weatherIcon.alt = description;
        weatherIcon.style.display = 'block'; // Make the icon visible
    }
}

function displayHourlyForecast(hourlyData) {
    // Get reference to the hourly forecast div
    const hourlyForecastDiv = document.getElementById('hourly-forecast');
    hourlyForecastDiv.innerHTML = ''; // Clear previous results
    
    // Get next 24 hours of forecast data (8 intervals of 3 hours each)
    const next24Hours = hourlyData.slice(0, 8);

    // Loop through each forecast entry
    next24Hours.forEach(item => {
        // Convert timestamp to readable hour format
        const dateTime = new Date(item.dt * 1000);
        const hour = dateTime.getHours();
        
        // Extract temperature and weather icon details
        const temperature = Math.round(item.main.temp);
        const iconCode = item.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`;

        // Create HTML content for hourly forecast item
        const hourlyItemHtml = `
            <div class="hourly-item">
                <span>${hour}:00</span>
                <img src="${iconUrl}" alt="Hourly Weather Icon">
                <span>${temperature}°C</span>
            </div>
        `;
        
        // Append new hourly forecast item to the forecast div
        hourlyForecastDiv.innerHTML += hourlyItemHtml;
    });
}
