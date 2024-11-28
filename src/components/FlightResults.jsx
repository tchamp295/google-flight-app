import React, { useState } from "react";
import {
  ChevronDown,
  Tag,
  ArrowRight,
  Plane,
  Search,
  MoreHorizontal,
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
const FlightResults = ({ flights, loading }) => {
  const [sortCriteria, setSortCriteria] = useState("best");
  const [visibleFlights, setVisibleFlights] = useState(20);

  const sortOptions = [
    { value: "best", label: "Best" },
    { value: "price_low", label: "Price (Low)" },
    { value: "price_high", label: "Price (High)" },
    { value: "fastest", label: "Fastest" },
    { value: "duration", label: "Duration" },
    { value: "departure_time", label: "Departure Time" },
    { value: "arrival_time", label: "Arrival Time" },
  ];

  const sortedFlights = [...flights].sort((a, b) => {
    switch (sortCriteria) {
      case "best":
        return a.price - b.price;
      case "price_low":
        return a.price - b.price;
      case "price_high":
        return b.price - a.price;
      case "fastest":
        return a.durationInMinutes - b.durationInMinutes;
      case "duration":
        return a.durationInMinutes - b.durationInMinutes;
      case "departure_time":
        return new Date(a.departureTime) - new Date(b.departureTime);
      case "arrival_time":
        return new Date(a.arrivalTime) - new Date(b.arrivalTime);
      default:
        return 0;
    }
  });

  if (loading) {
    return (
      <div className="w-full py-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-gray-100 rounded-lg animate-pulse py-4 mb-2"
          >
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!flights.length) {
    return (
      <div className="flex flex-col items-center justify-center w-full bg-gray-50 rounded-lg p-8 space-y-6 border border-gray-200 shadow-sm">
        <div className="bg-blue-50 rounded-full p-5">
          <Plane
            size={60}
            className="text-blue-500 opacity-80"
            strokeWidth={1.5}
          />
        </div>

        <div className="text-center">
          <h3 className="text-2xl font-semibold text-gray-800 mb-3">
            No flights found
          </h3>
          <p className="text-gray-600 max-w-md mx-auto">
            We couldn't find any flights matching your search criteria. Try
            adjusting your dates, destinations, or filters.
          </p>
        </div>

        <button className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition-colors">
          <Search size={20} />
          <span>Modify Search</span>
        </button>

        <div className="text-xs text-gray-500 mt-4">
          Tip: Check nearby airports or flexible dates for more options
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto py-4">
      <div className="bg-white  pb-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pt-4 space-y-3 sm:space-y-0">
          <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
            <span className="text-sm font-medium text-gray-600">
              Best Matches
            </span>
            <div className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full text-xs">
              {flights.length} flights
            </div>
          </div>
          <div className="text-sm text-gray-700 flex items-center">
            <Tag size={16} className="mr-2 text-blue-500 hidden md:block" />
            Cheapest from{" "}
            <span className="font-semibold text-blue-600 ml-1">
              ${sortedFlights[0].price}
            </span>
          </div>
        </div>

        <div className="flex justify-end items-center    mt-3">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-3  w-full sm:w-48">
            <span className="text-sm text-gray-600 whitespace-nowrap">
              Sort by:
            </span>
            <div className="relative  w-full">
              <select
                value={sortCriteria}
                onChange={(e) => setSortCriteria(e.target.value)}
                className="appearance-none w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <ChevronDown size={16} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-2  ">
        {sortedFlights.slice(0, visibleFlights).map((flight, index) => (
          <div
            key={index}
            className="border rounded-lg hover:shadow-md transition-shadow cursor-pointer"
          >
            <div className="p-4 grid grid-cols-1 sm:grid-cols-4 gap-2 sm:gap-4 items-center">
              <div className="flex items-center space-x-3">
                <img
                  src={flight.airlineLogo}
                  alt={`${flight.airline} logo`}
                  className="w-8 h-8 object-contain"
                />
                <span className="text-sm text-gray-700">{flight.airline}</span>
              </div>

              <div className="flex flex-col">
                <span className="font-medium">
                  {formatTime(flight.departureTime)} -{" "}
                  {formatTime(flight.arrivalTime)}
                </span>
                <div className="text-xs text-gray-500 flex items-center space-x-1">
                  <span>{flight.departure}</span>
                  <ArrowRight size={12} />
                  <span>{flight.destination}</span>
                </div>
              </div>

              <div className="text-sm text-gray-600">
                <span>
                  {calculateFlightDuration(
                    flight.departureTime,
                    flight.arrivalTime
                  )}
                </span>
                {flight.stopCount > 0 && (
                  <span className="ml-2">
                    • {flight.stopCount} Stop{flight.stopCount > 1 ? "s" : ""}
                  </span>
                )}
              </div>

              <div className="flex flex-col items-start sm:items-end">
                <span className="text-lg font-semibold text-blue-600">
                  ${flight.price}
                </span>
                <span className="text-xs text-gray-500">{flight.tripType}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {visibleFlights < sortedFlights.length && (
        <div className="flex justify-center mt-4">
          <button
            onClick={() => setVisibleFlights(visibleFlights + 10)}
            className="flex items-center space-x-2 px-5 py-2.5 bg-blue-600 text-white rounded-full shadow-md hover:bg-blue-700 transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg group"
          >
            <MoreHorizontal
              size={20}
              className="group-hover:animate-pulse text-white"
            />
            <span className="font-medium">View more flights</span>
            <ArrowRight
              size={18}
              className="ml-1 transition-transform group-hover:translate-x-1"
            />
          </button>
        </div>
      )}
    </div>
  );
};

export default FlightResults;
