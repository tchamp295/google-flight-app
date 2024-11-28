import React, { useState } from "react";
import {
  ChevronDown,
  Filter,
  SortDesc,
  Plane,
  Clock,
  DollarSign,
  ArrowRight,
  Info,
} from "lucide-react";

const formatTime = (timeString) => {
  if (!timeString || timeString === "Unknown") return "Unknown";

  try {
    const date = new Date(timeString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  } catch (error) {
    return timeString;
  }
};

const calculateFlightDuration = (departureTime, arrivalTime) => {
  try {
    const departure = new Date(departureTime);
    const arrival = new Date(arrivalTime);
    const durationMs = arrival - departure;

    const hours = Math.floor(durationMs / (1000 * 60 * 60));
    const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));

    return `${hours}h ${minutes}m`;
  } catch (error) {
    return "1h 30m";
  }
};

function FlightResults({ flights, loading }) {
  const [sortCriteria, setSortCriteria] = useState("price");
  const [showFilters, setShowFilters] = useState(false);
  const [isSortMenuOpen, setIsSortMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const sortedFlights = [...flights].sort((a, b) => {
    switch (sortCriteria) {
      case "price":
        return a.price - b.price;
      case "duration":
        return a.durationInMinutes - b.durationInMinutes;
      default:
        return 0;
    }
  });

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white border border-gray-200 rounded-lg animate-pulse p-4"
            >
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!flights.length) {
    return (
      <div className="text-center py-12 max-w-md mx-auto">
        <div className="bg-blue-50 rounded-full p-6 inline-block mb-4">
          <Plane size={48} className="text-blue-500 mx-auto" />
        </div>
        <p className="text-lg text-gray-600">
          No flights found. Try adjusting your search criteria.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto font-roboto">
      <div className="sm:hidden mb-4">
        <div className="flex justify-between items-center">
          <h2 className="text-base font-medium text-gray-800">
            ✈️ {flights.length} flights found for your journey!
          </h2>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-gray-600 flex items-center space-x-2"
          >
            <span>Filter & Sort</span>
            <ChevronDown
              size={16}
              className={`transform transition-transform ${
                isMobileMenuOpen ? "rotate-180" : ""
              }`}
            />
          </button>
        </div>

        {isMobileMenuOpen && (
          <div className="mt-4 space-y-4">
            <div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="w-full flex justify-between items-center bg-gray-100 px-4 py-2 rounded-md"
              >
                <div className="flex items-center space-x-2">
                  <Filter size={16} />
                  <span>Filters</span>
                </div>
                <ChevronDown size={16} />
              </button>
            </div>
            <div>
              <div className="w-full bg-gray-100 px-4 py-2 rounded-md">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center space-x-2">
                    <SortDesc size={16} />
                    <span>Sort by</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div
                    onClick={() => {
                      setSortCriteria("price");
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex items-center space-x-2 py-1 hover:bg-gray-200 rounded"
                  >
                    <DollarSign size={16} />
                    <span>Price</span>
                  </div>
                  <div
                    onClick={() => {
                      setSortCriteria("duration");
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex items-center space-x-2 py-1 hover:bg-gray-200 rounded"
                  >
                    <Clock size={16} />
                    <span>Duration</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="hidden sm:flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2">
          <h2 className="text-xl font-medium text-gray-800">
            ✈️ {flights.length} flights found for your journey!
          </h2>
        </div>

        <div className="flex space-x-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2 text-gray-700 hover:bg-gray-100 px-3 py-1.5 rounded-md transition"
          >
            <Filter size={16} />
            <span className="text-sm">Filters</span>
          </button>

          <div className="relative">
            <button
              onClick={() => setIsSortMenuOpen(!isSortMenuOpen)}
              className="flex items-center space-x-2 text-gray-700 hover:bg-gray-100 px-3 py-1.5 rounded-md transition"
            >
              <SortDesc size={16} />
              <span className="text-sm">Sort</span>
              <ChevronDown size={16} />
            </button>
            {isSortMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                <div
                  onClick={() => {
                    setSortCriteria("price");
                    setIsSortMenuOpen(false);
                  }}
                  className="px-4 py-2 hover:bg-gray-100 flex items-center space-x-2 cursor-pointer"
                >
                  <DollarSign size={16} />
                  <span>Price</span>
                </div>
                <div
                  onClick={() => {
                    setSortCriteria("duration");
                    setIsSortMenuOpen(false);
                  }}
                  className="px-4 py-2 hover:bg-gray-100 flex items-center space-x-2 cursor-pointer"
                >
                  <Clock size={16} />
                  <span>Duration</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {showFilters && (
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4">
          <p className="text-gray-600">Filter options coming soon...</p>
        </div>
      )}

      <div className="space-y-2">
        {sortedFlights.map((flight, index) => (
          <div
            key={index}
            className="bg-white border border-gray-100 font-roboto rounded-lg shadow-sm hover:shadow-md transition-all"
          >
            <div className="p-4">
              <div className="sm:hidden">
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center space-x-2">
                    <img
                      src={flight.airlineLogo}
                      alt={`${flight.airline} logo`}
                      className="w-8 h-8 object-contain"
                    />
                    <span className="text-sm font-medium">
                      {flight.airline}
                    </span>
                  </div>
                  <div className="flex flex-col items-center">

                  <span className="text-base font-semibold text-blue-600">
                    ${flight.price}
                  </span>                    <span>{flight.tripType}</span>
                  </div>


                </div>
                <div className="flex justify-between items-center mb-3">
                  <div>
                    <span className="text-base font-normal text-gray-800">
                      {formatTime(flight.departureTime)} -{" "}
                      {formatTime(flight.arrivalTime)}
                    </span>
                    <div className="flex items-center space-x-2 text-gray-500 text-xs mt-1">
                      <span>{flight.departure}</span>
                      <ArrowRight size={16} className="text-gray-400" />
                      <span>{flight.destination}</span>
                    </div>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="text-gray-600 text-sm">
                    <span>
                      {calculateFlightDuration(
                        flight.departureTime,
                        flight.arrivalTime
                      )}
                    </span>
                    {flight.stopCount > 0 && (
                      <span className="ml-2">
                        • {flight.stopCount} Stop
                        {flight.stopCount > 1 ? "s" : ""}
                      </span>
                    )}
                  </div>
                  <ChevronDown />
                </div>
              </div>

              <div className="hidden sm:flex items-center w-full">
                <div className="w-full flex justify-between items-center">
                  <div className="flex items-center space-x-4">
                    <img
                      src={flight.airlineLogo}
                      alt={`${flight.airline} logo`}
                      className="w-8 h-8 object-contain"
                    />
                    <div>
                      <span className="text-base font-normal text-gray-800">
                        {formatTime(flight.departureTime)} -{" "}
                        {formatTime(flight.arrivalTime)}
                      </span>
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-500 text-xs">
                          {flight.airline}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-center space-y-1 text-gray-600">
                    <span className="text-base font-normal text-gray-800">
                      {calculateFlightDuration(
                        flight.departureTime,
                        flight.arrivalTime
                      )}
                    </span>
                    <div className="flex items-center space-x-2 text-gray-500 text-xs">
                      <span>{flight.departure}</span>
                      <ArrowRight size={16} className="text-gray-400" />
                      <span>{flight.destination}</span>
                    </div>
                  </div>
                  <div>
                    {flight.stopCount > 0 && (
                      <>
                        <span className="text-gray-300">•</span>
                        <span className="text-base font-normal text-gray-800">
                          {flight.stopCount} Stop
                          {flight.stopCount > 1 ? "s" : ""}
                        </span>
                      </>
                    )}
                  </div>
                  <div className="flex  items-center gap-4">
                    <div className="flex flex-col">
                    <span className="text-base font-normal text-gray-800">
                      ${flight.price}
                    </span>
                    <span className="text-gray-500 text-xs">{flight.tripType}</span>
                    </div>
                    <ChevronDown />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FlightResults;
