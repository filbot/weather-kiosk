import { useState, useEffect } from "react";
import './App.css';

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

    return `${dayOfWeek}, ${month} ${day}, ${year}`;
}

function App() {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);

    const fetchDataWithRetry = async (url, delay = 1000) => {
        while (true) {
            try {
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const result = await response.json();
                return result;
            } catch (err) {
                setError(err.message);
                await new Promise(res => setTimeout(res, delay));
            }
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await fetchDataWithRetry('https://api.example.com/data');
                setData(result);
                setError(null); // Clear error if successful
            } catch (err) {
                setError(err.message);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="App">
            <header className="App-header">
                <p>{generateDate()}</p>
                {error ? (
                    <p>Error: {error}</p>
                ) : (
                    <p>Data: {JSON.stringify(data)}</p>
                )}
            </header>
        </div>
    );
}

export default App;
