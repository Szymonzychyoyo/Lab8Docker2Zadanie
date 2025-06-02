const express = require('express');
const axios = require('axios');
const moment = require('moment');

const app = express();
const port = process.env.PORT || 3000;

// Dane autora
const author = "Szymon Zych";

// Logi startowe
console.log(`Start aplikacji: ${moment().format('YYYY-MM-DD HH:mm:ss')}`);
console.log(`Autor: ${author}`);
console.log(`Aplikacja nasłuchuje na porcie: ${port}`);


app.use(express.urlencoded({ extended: true }));

// Lista krajów i miast
const locations = {
    "Polska": ["Warszawa", "Kraków", "Gdańsk"],
    "Niemcy": ["Berlin", "Monachium", "Hamburg"],
    "Francja": ["Paryż", "Lyon", "Marsylia"]
};


const WEATHER_API_KEY = "23f85facd3becc137a8e86f047010667"; 

// Strona główna
app.get('/', (req, res) => {
    let form = `
        <h1>Wybierz kraj i miasto</h1>
        <form method="POST" action="/">
            <select name="country" id="countrySelect" onchange="updateCities()">
                <option disabled selected>Wybierz kraj</option>
                ${Object.keys(locations).map(c => `<option value="${c}">${c}</option>`).join('')}
            </select>
            <br><br>
            <select name="city" id="citySelect">
                <option disabled selected>Wybierz miasto</option>
            </select>
            <br><br>
            <button type="submit">Pokaż pogodę</button>
        </form>

        <script>
            const locations = ${JSON.stringify(locations)};
            function updateCities() {
                const country = document.getElementById('countrySelect').value;
                const cities = locations[country] || [];
                const citySelect = document.getElementById('citySelect');
                citySelect.innerHTML = cities.map(c => \`<option value="\${c}">\${c}</option>\`).join('');
            }
        </script>
    `;
    res.send(form);
});

// Obsługa formularza
app.post('/', async (req, res) => {
    const city = req.body.city;
    if (!city) {
        return res.send("Nie wybrano miasta!");
    }

    try {
        const weatherUrl = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${WEATHER_API_KEY}&lang=pl`;
        const weatherResponse = await axios.get(weatherUrl);
        const weatherData = weatherResponse.data;

        res.send(`
            <h1>Pogoda w ${city}</h1>
            <p>Temperatura: ${weatherData.main.temp}°C</p>
            <p>Opis: ${weatherData.weather[0].description}</p>
            <br><br>
            <a href="/">Wróć</a>
        `);
    } catch (error) {
        console.error(error);
        res.send("Błąd podczas pobierania pogody.");
    }
});

app.listen(port, () => {
    console.log(`Serwer działa na porcie ${port}`);
});
