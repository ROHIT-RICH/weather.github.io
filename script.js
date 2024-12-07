document.getElementById('searchButton').addEventListener('click', getWeather);

async function getWeather() {
    const city = document.getElementById('cityInput').value;
    if (!city) {
        alert('Please enter a city name.');
        return;
    }

    try {
        const apiKey = '63637f7b284fba8029c597e4cb3aa625';
        const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`);
        if (!response.ok) throw new Error('Network response was not ok.');

        const data = await response.json();
        displayWeather(data);
        updateRecentSearches(city);
    } catch (error) {
        document.getElementById('weatherDisplay').innerText = `Error: ${error.message}`;
    }
}

function displayWeather(data) {
    const weatherDisplay = document.getElementById('weatherDisplay');
    weatherDisplay.innerHTML = `
        <h2 class="text-xl font-bold">${data.city.name}</h2>
        <p>Current Temperature: ${data.list[0].main.temp}°C</p>
        <p>Condition: ${data.list[0].weather[0].description}</p>
        <p>Wind: ${data.list[0].wind.speed} m/s</p>
        <p>Humidity: ${data.list[0].main.humidity}%</p>
        <h3 class="text-lg font-bold mt-4">5-Day Forecast:</h3>
        <div class="grid grid-cols-5 gap-4">
            ${data.list.slice(0, 5).map(day => `
                <div class="bg-gray-100 p-2 rounded shadow-md text-center">
                    <p>${new Date(day.dt_txt).toDateString()}</p>
                    <img src="http://openweathermap.org/img/wn/${day.weather[0].icon}.png" alt="${day.weather[0].description}">
                    <p>${day.main.temp}°C</p>
                    <p>${day.weather[0].description}</p>
                </div>
            `).join('')}
        </div>
    `;
}

function updateRecentSearches(city) {
    let searches = JSON.parse(localStorage.getItem('recentSearches')) || [];
    if (!searches.includes(city)) {
        searches.push(city);
        if (searches.length > 5) searches.shift();  // Keep only the last 5 searches
        localStorage.setItem('recentSearches', JSON.stringify(searches));
    }
    displayRecentSearches();
}

function displayRecentSearches() {
    const recentSearches = document.getElementById('recentSearches');
    const searches = JSON.parse(localStorage.getItem('recentSearches')) || [];
    if (searches.length) {
        recentSearches.innerHTML = `
            <select id="recentSelect" class="border p-2">
                <option value="" disabled selected>Recent Searches</option>
                ${searches.map(city => `<option value="${city}">${city}</option>`).join('')}
            </select>
        `;
        document.getElementById('recentSelect').addEventListener('change', function () {
            document.getElementById('cityInput').value = this.value;
            getWeather();
        });
    } else {
        recentSearches.innerHTML = '';
    }
}

// Initial display of recent searches on page load
document.addEventListener('DOMContentLoaded', displayRecentSearches);