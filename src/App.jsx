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

  const units = unit ? "metric" : "imperial";
  const { data, loading, error } = useFetch(city, units);

  const handleSubmit = (e) => {
    e.preventDefault();
    const inputCity = e.target.elements.city.value.trim();
    if (inputCity) setCity(inputCity);
  };

  const weather = data?.current_weather;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-900 p-6">
      <h1 className="text-4xl font-extrabold mb-6 bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent">
        Weather App
      </h1>

      {/* Form input kota */}
      <form onSubmit={handleSubmit} className="mb-4 flex gap-2">
        <input
          type="text"
          name="city"
          placeholder="Masukkan kota..."
          className="px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl shadow-md transition"
        >
          Cari
        </button>
      </form>

      {/* Tombol ganti Celsius/Fahrenheit */}
      <button
        onClick={toggleUnit}
        className="mb-6 bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-xl shadow-md transition"
      >
        Ganti ke {unit ? "°F" : "°C"}
      </button>

      {/* Loading & Error */}
      {loading && <p className="text-gray-600">Sedang mengambil data...</p>}
      {error && <p className="text-red-500">Error: {error.message}</p>}

      {/* Tampilan cuaca */}
      {weather && (
        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-6 shadow-2xl text-center w-96 text-white transform hover:scale-105 transition-transform duration-300">
          <h2 className="text-2xl font-semibold mb-2 capitalize">{city}</h2>
          <p className="text-6xl font-extrabold mb-2 drop-shadow-lg">
            {weather.temperature}°{unit ? "C" : "F"}
          </p>

          <div className="flex justify-center gap-6 mt-4">
            <div className="flex flex-col items-center">
              <span className="text-xl">💨</span>
              <span className="text-sm">{weather.windspeed} km/h</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-xl">🧭</span>
              <span className="text-sm">{weather.winddirection}°</span>
            </div>
          </div>

          <p className="text-xs mt-4 text-gray-200">📱 {width}px</p>
        </div>
      )}
    </div>
  );
}
