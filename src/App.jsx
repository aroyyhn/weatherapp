import React from "react";
import useFetch from "./hooks/useFetch";
import useLocalStorage from "./hooks/useLocalStorage";
import useToggle from "./hooks/useToggle";
import useWindowSize from "./hooks/useWindowSize";
import "./index.css";

export default function App() {
  const [city, setCity] = useLocalStorage("lastCity", "Jakarta");
  const [unit, toggleUnit] = useToggle(true); // true = Celsius, false = Fahrenheit
  const { width } = useWindowSize();

  const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
  const units = unit ? "metric" : "imperial";

  const { data: weather, loading, error } = useFetch(city, units, "id");

  const handleSubmit = (e) => {
    e.preventDefault();
    const inputCity = e.target.elements.city.value.trim();
    if (inputCity) setCity(inputCity);
  };
  console.log("API Key:", import.meta.env.VITE_WEATHER_API_KEY);


  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-900 p-6">
      <h1 className="text-3xl font-bold mb-6 text-blue-600">Weather App</h1>

      {/* Form input kota */}
      <form onSubmit={handleSubmit} className="mb-4 flex gap-2">
        <input
          type="text"
          name="city"
          placeholder="Masukkan kota..."
          className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
        >
          Cari
        </button>
      </form>

      {/* Tombol ganti Celsius/Fahrenheit */}
      <button
        onClick={toggleUnit}
        className="mb-6 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg"
      >
        Ganti ke {unit ? "°F" : "°C"}
      </button>

      {/* Loading & Error */}
      {loading && <p className="text-gray-600">Sedang mengambil data...</p>}
      {error && <p className="text-red-500">Error: {error.message}</p>}

      {/* Tampilan cuaca */}
      {weather && (
        <div className="bg-white rounded-2xl p-6 shadow-md text-center w-80">
          <h2 className="text-2xl font-semibold mb-2">{weather.name}</h2>
          <img
            src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
            alt="Ikon Cuaca"
            className="mx-auto mb-2"
          />
          <p className="text-4xl font-bold text-blue-600">
            {weather.main.temp}°{unit ? "C" : "F"}
          </p>
          <p className="capitalize text-gray-600">{weather.weather[0].description}</p>
          <p className="text-sm mt-3 text-gray-400">📱 {width}px</p>
        </div>
      )}
    </div>
  );
}
