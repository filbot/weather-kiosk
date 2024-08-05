import "./App.css";
import { useState, useEffect } from "react";
import axios from "axios";

const openweathermapApiKey = process.env.REACT_APP_API_KEY;
const coordinates = {
    lon: -122.3694,
    lat: 47.6506,
};

async function fetchWeatherData() {
    try {
        const response = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${openweathermapApiKey}&units=imperial`
        );
        return response.data;
    } catch (error) {
        console.error("Error fetching weather data:", error);
        return null;
    }
}

function generateDate() {
    const date = new Date();
    const weekdays = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
    ];
    const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];

    const dayOfWeek = weekdays[date.getDay()];
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();

    let daySuffix;
    if (day % 10 === 1 && day !== 11) {
        daySuffix = "st";
    } else if (day % 10 === 2 && day !== 12) {
        daySuffix = "nd";
    } else if (day % 10 === 3 && day !== 13) {
        daySuffix = "rd";
    } else {
        daySuffix = "th";
    }

    return `${dayOfWeek}, ${day}${daySuffix} ${month} ${year}`;
}

function App() {
    const [weatherData, setWeatherData] = useState(null);
    const [currentDate, setCurrentDate] = useState(generateDate());
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const data = await fetchWeatherData();
            if (data) {
                setWeatherData(data);
            } else {
                setError("Unable to fetch weather data.");
            }
        };

        fetchData();
        setCurrentDate(generateDate());

        const intervalId = setInterval(() => {
            fetchData();
            setCurrentDate(generateDate());
        }, 60000); // Fetch data and update date every 60 seconds

        return () => clearInterval(intervalId); // Clear interval on component unmount
    }, []); // Empty dependency array ensures this runs only once

    if (error) {
        return <div className="App">{error}</div>;
    }

    if (!weatherData) {
        return <div className="App">Loading...</div>;
    }

    const roundedWeatherData = {
        ...weatherData,
        main: {
            ...weatherData.main,
            temp: Math.round(weatherData.main.temp),
            humidity: Math.round(weatherData.main.humidity),
        },
        wind: {
            ...weatherData.wind,
            speed: Math.round(weatherData.wind.speed),
        },
        visibility: Math.round((weatherData.visibility / 1000) * 0.621371),
    };

    return (
        <div className="App">
            {/* <div className="city-name">{roundedWeatherData.name}</div> */}
            <div className="date">{currentDate}</div>
            <div className="weather-block">
                <div className="weather">
                    {roundedWeatherData.weather[0].description}
                </div>
                <div className="temperature">
                    {roundedWeatherData.main.temp}°
                </div>
            </div>
            <div className="detail-block">
                <div className="wind-data data-block">
                    <div className="wind icon">
                        <i className="wi wi-windy"></i>
                    </div>
                    <div className="wind info">
                        {roundedWeatherData.wind.speed} mph
                    </div>
                    <div className="wind type">Wind</div>
                </div>
                <div className="humidity-data data-block">
                    <div className="humidity icon">
                        <i className="wi wi-humidity"></i>
                    </div>
                    <div className="humidity info">
                        {roundedWeatherData.main.humidity}%
                    </div>
                    <div className="humidity type">Humidity</div>
                </div>
                <div className="visibility-data data-block">
                    <div className="visibility icon">
                        <i className="wi wi-day-fog"></i>
                    </div>
                    <div className="visibility info">
                        {roundedWeatherData.visibility} mi
                    </div>
                    <div className="visibility type">Visibility</div>
                </div>
            </div>
        </div>
    );
}

export default App;
