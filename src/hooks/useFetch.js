import { useEffect, useState } from "react";

export default function useFetch(city, units = "metric") {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!city) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        // 1️⃣ Geocoding city → lat/lon
        const geoRes = await fetch(
          `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1`
        );
        if (!geoRes.ok) throw new Error("Failed to fetch geocoding");
        const geoJson = await geoRes.json();

        if (!geoJson.results || geoJson.results.length === 0) {
          throw new Error(`City "${city}" not found`);
        }

        const { latitude, longitude } = geoJson.results[0];

        // 2️⃣ Unit mapping
        const temperature_unit =
          units === "imperial" ? "fahrenheit" : "celsius";

        // 3️⃣ Fetch weather
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&hourly=temperature_2m,precipitation&temperature_unit=${temperature_unit}&timezone=auto`;

        console.log("Request URL:", url);
        const res = await fetch(url);
        if (!res.ok) throw new Error(`Error: ${res.status}`);
        const json = await res.json();

        setData(json);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [city, units]);

  return { data, loading, error };
}
