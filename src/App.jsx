import React, { useState } from "react";
import SearchForm from "./components/SearchForm";
import FlightResults from "./components/FlightResults";
import Header from "./components/Header";
import { fetchFlightData } from "./services/flightService";

function App() {
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFlightSearch = async (searchParams) => {
    setLoading(true);
    setError(null);

    try {
      const transformedFlights = await fetchFlightData(searchParams);
      console.log("Flights",transformedFlights)
      setFlights(transformedFlights);
    } catch (error) {
      setError(error.message || "Unable to fetch flights. Please try again.");
      setFlights([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans">
      <Header />

      <main className="max-w-6xl mx-auto px-2 md:px-4 pb-0">
        <SearchForm onSearch={handleFlightSearch} />

        {error && (
          <div
            className="mt-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
            role="alert"
          >
            {error}
          </div>
        )}

        <div className="mt-8">
          <FlightResults flights={flights} loading={loading} />
        </div>
      </main>
    </div>
  );
}

export default App;
