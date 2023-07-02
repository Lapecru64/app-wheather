import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Weather = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [temperatureUnit, setTemperatureUnit] = useState('Celsius');
  const [searchCity, setSearchCity] = useState('');
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Obtener la ubicación actual del usuario
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        // Hacer la petición a la API de OpenWeatherMap
        fetchWeatherData(latitude, longitude);
      },
      (error) => {
        console.error('Error getting user location:', error);
      }
    );
  }, []);

  const fetchWeatherData = (latitude, longitude) => {
    axios
      .get(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=528ae25cf348d6f52249d92aff1ed712`)
      .then((response) => {
        setWeatherData(response.data);
      })
      .catch((error) => {
        console.error('Error fetching weather data:', error);
      });
  };

  const handleSearch = () => {
    if (searchCity) {
      axios
        .get(`https://api.openweathermap.org/data/2.5/weather?q=${searchCity}&appid=528ae25cf348d6f52249d92aff1ed712`)
        .then((response) => {
          setWeatherData(response.data);
        })
        .catch((error) => {
          console.error('Error fetching weather data:', error);
        });
    }
  };

  const handleTemperatureUnitToggle = () => {
    setTemperatureUnit((prevUnit) => (prevUnit === 'Celsius' ? 'Fahrenheit' : 'Celsius'));
    
  };

  const handleDarkModeToggle = () => {
    setDarkMode((prevMode) => !prevMode);
  };


  if (!weatherData) {
    return <div>Loading...</div>;
  }

  const { name: city, sys: { country }, main: { temp }, weather: [{ description, main, icon }] } = weatherData;
  const temperature = temperatureUnit === 'Celsius' ? Math.round(temp - 273.15) : Math.round((temp - 273.15) * 9 / 5 + 32);

  return (
    <div className={`weather-container ${darkMode ? 'dark-mode' : ''}`}>
    
      <h1 className="weather-title">Weather App</h1>
      <div className="weather-card">
        <p className="weather-info">Country: {country}</p>
        <p className="weather-info">City: {city}</p>
        <p className="weather-info">Description: {description}</p>
        <p className="weather-info">Main: {main}</p>
        <p className="weather-info">Temperature: {temperature}° {temperatureUnit}</p>
        <img className="weather-icon" src={`https://openweathermap.org/img/w/${icon}.png`} alt="Weather Icon" />
      </div>
      <button className="temperature-toggle-button" onClick={handleTemperatureUnitToggle}>
      Temperature Unit Change Button
      </button>
      <button className="dark-mode-toggle-button" onClick={handleDarkModeToggle}>
      Button Dark Mode
    </button>
      <div>
        <input className='search'
          type="text"
          placeholder="Search city"
          value={searchCity} 
          onChange={(e) => setSearchCity(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>
    </div>
  );
};

export default Weather;
