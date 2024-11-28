import React, { useState, useEffect } from "react";
import { Search, Plus, Trash2 } from "lucide-react";

function SearchForm({ onSearch }) {
  const [tripType, setTripType] = useState("round");
  const [airports, setAirports] = useState([]);
  const [loadingAirports, setLoadingAirports] = useState(false);

  const [multiCityLegs, setMultiCityLegs] = useState([
    { departure: "", destination: "", date: "" },
    { departure: "", destination: "", date: "" },
  ]);

  const [formData, setFormData] = useState({
    passengers: 1,
    travelClass: "economy",
  });

  useEffect(() => {
    const fetchAirports = async () => {
      setLoadingAirports(true);
      try {
        const response = await fetch(
          "https://sky-scrapper.p.rapidapi.com/api/v1/flights/searchAirport?query=new york,london&locale=en-US",
          
          {
            method: "GET",
            headers: {
              "x-rapidapi-key":
                "b74dce785cmshcf5e5d1f1cc874dp1406b3jsn46438c37c10b",
              "x-rapidapi-host": "sky-scrapper.p.rapidapi.com",
            },
          }
        );
        const data = await response.json();
        console.log("airports",data)
        setAirports(data.data || []);
      } catch (error) {
        console.error("Error fetching airports:", error);
      } finally {
        setLoadingAirports(false);
      }
    };

    fetchAirports();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "tripType") {
      setTripType(value);
      if (value !== "multi-city") {
        setMultiCityLegs([
          { departure: "", destination: "", date: "" },
          { departure: "", destination: "", date: "" },
        ]);
      }
    } else if (name === "passengers" || name === "travelClass") {
      setFormData({ ...formData, [name]: value });
    }
  };


  const handleMultiCityLegChange = (index, e) => {
    const { name, value } = e.target;
    const updatedLegs = [...multiCityLegs];
    updatedLegs[index] = { ...updatedLegs[index], [name]: value };
    setMultiCityLegs(updatedLegs);
  };

  const addMultiCityLeg = () => {
    if (multiCityLegs.length < 5) {
      setMultiCityLegs([
        ...multiCityLegs,
        { departure: "", destination: "", date: "" },
      ]);
    }
  };
  const removeMultiCityLeg = (index) => {
    if (multiCityLegs.length > 1) {
      const updatedLegs = multiCityLegs.filter((_, i) => i !== index);
      setMultiCityLegs(updatedLegs);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let searchData;
    switch (tripType) {
      case "round":
        searchData = {
          ...formData,
          departure: e.target.departure.value,
          destination: e.target.destination.value,
          date: e.target.date.value,
          returnDate: e.target.returnDate.value,
        };
        break;
      case "one-way":
        searchData = {
          ...formData,
          departure: e.target.departure.value,
          destination: e.target.destination.value,
          date: e.target.date.value,
        };
        break;
      case "multi-city":
        searchData = {
          ...formData,
          multiCityLegs: multiCityLegs,
        };
        break;
    }

    console.log("Form Data Submitted:", searchData);
    onSearch(searchData);
  };

  return (
    <div className="font-roboto w-full">
      <div
        className="w-full h-40 sm:h-60 bg-cover bg-center"
        style={{
          backgroundImage: "url('./flights_nc_4.svg')",
        }}
      ></div>
      <h1 className="text-center text-3xl sm:text-5xl font-medium font-noto mb-6">
        Flights
      </h1>
      <div className="bg-white rounded-xl shadow-xl p-4 sm:p-8 max-w-6xl mx-auto relative ">
        <div className="flex flex-col sm:flex-row flex-wrap items-center gap-4 mb-6">
          <div className="flex flex-col sm:flex-row items-center space-x-0 sm:space-x-2 w-full sm:w-auto">
            <label className="text-sm text-gray-500 w-full sm:w-auto mb-2 sm:mb-0 text-left sm:text-left">
              Trip Type
            </label>
            <select
              name="tripType"
              value={tripType}
              onChange={handleChange}
              className="p-2 border-b border-gray-300 focus:outline-none focus:border-blue-500 text-sm w-full sm:w-auto"
            >
              <option value="round">Round Trip</option>
              <option value="one-way">One Way</option>
              <option value="multi-city">Multi-City</option>
            </select>
          </div>

          <div className="flex flex-col sm:flex-row items-center space-x-0 sm:space-x-2 w-full sm:w-auto">
            <label className="text-sm text-gray-500 w-full sm:w-auto">
              Passengers
            </label>
            <select
              name="passengers"
              value={formData.passengers}
              onChange={handleChange}
              className="p-2 border-b border-gray-300 focus:outline-none focus:border-blue-500 text-sm w-full sm:w-auto"
            >
              {[1, 2, 3, 4, 5].map((num) => (
                <option key={num} value={num}>
                  {num} Passenger{num > 1 ? "s" : ""}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col sm:flex-row items-center space-x-0 sm:space-x-2 w-full sm:w-auto">
            <label className="text-sm text-gray-500 w-full sm:w-auto mb-2 sm:mb-0 text-left sm:text-left">
              Class
            </label>
            <select
              name="travelClass"
              value={formData.travelClass}
              onChange={handleChange}
              className="p-2 border-b border-gray-300 focus:outline-none focus:border-blue-500 text-sm w-full sm:w-auto"
            >
              {["economy", "business", "first", "premium_economy"].map(
                (travelClass) => (
                  <option key={travelClass} value={travelClass}>
                    {travelClass}
                  </option>
                )
              )}
            </select>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="pb-10">
          {(tripType === "round" || tripType === "one-way") && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex flex-col">
                <label className="text-xs font-semibold text-gray-600 mb-2">
                  From
                </label>
                <select
                  name="departure"
                  required
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                >
                  <option value="">Where from?</option>
                  {airports.map((airport) => (
                    <option key={airport.skyId} value={airport.skyId}>
                      {airport.presentation.title} -{" "}
                      {airport.presentation.subtitle}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col">
                <label className="text-xs font-semibold text-gray-600 mb-2">
                  To
                </label>
                <select
                  name="destination"
                  required
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                >
                  <option value="">Where to?</option>
                  {airports.map((airport) => (
                    <option key={airport.skyId} value={airport.skyId}>
                      {airport.presentation.title} -{" "}
                      {airport.presentation.subtitle}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col">
                <label className="text-xs font-semibold text-gray-600 mb-2">
                  Departure
                </label>
                <input
                  type="date"
                  name="date"
                  required
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>

              {tripType === "round" && (
                <div className="flex flex-col">
                  <label className="text-xs font-semibold text-gray-600 mb-2">
                    Return
                  </label>
                  <input
                    type="date"
                    name="returnDate"
                    required
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
              )}
            </div>
          )}

          {tripType === "multi-city" && (
            <div className="space-y-4">
              {multiCityLegs.map((leg, index) => (
                <div
                  key={index}
                  className="grid grid-cols-1 sm:grid-cols-3 gap-4 relative"
                >
                  <div className="flex flex-col">
                    <label className="text-xs font-semibold text-gray-600 mb-2">
                      From
                    </label>
                    <select
                      name="departure"
                      value={leg.departure}
                      onChange={(e) => handleMultiCityLegChange(index, e)}
                      required
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    >
                      <option value="">Where from?</option>
                      {airports.map((airport) => (
                        <option key={airport.skyId} value={airport.skyId}>
                          {airport.presentation.title} -{" "}
                          {airport.presentation.subtitle}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-col">
                    <label className="text-xs font-semibold text-gray-600 mb-2">
                      To
                    </label>
                    <select
                      name="destination"
                      value={leg.destination}
                      onChange={(e) => handleMultiCityLegChange(index, e)}
                      required
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    >
                      <option value="">Where to?</option>
                      {airports.map((airport) => (
                        <option key={airport.skyId} value={airport.skyId}>
                          {airport.presentation.title} -{" "}
                          {airport.presentation.subtitle}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-col relative">
                    <label className="text-xs font-semibold text-gray-600 mb-2">
                      Departure Date
                    </label>
                    <input
                      type="date"
                      name="date"
                      value={leg.date}
                      onChange={(e) => handleMultiCityLegChange(index, e)}
                      required
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />

                    {multiCityLegs.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeMultiCityLeg(index)}
                        className="absolute top-0 right-0 text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}

              {multiCityLegs.length < 5 && (
                <div className="flex justify-center mt-4">
                  <button
                    type="button"
                    onClick={addMultiCityLeg}
                    className="flex items-center text-blue-600 hover:text-blue-800 text-sm"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Another Leg
                  </button>
                </div>
              )}
            </div>
          )}

          <div className="col-span-1 sm:col-span-2 md:col-span-4 flex justify-center absolute -bottom-5 left-0 right-0">
            <button
              type="submit"
              className="w-auto bg-blue-600 text-white py-3 px-6 rounded-full hover:bg-blue-700 transition-all duration-300 font-semibold text-sm flex items-center justify-center space-x-2"
            >
              <Search className="h-5 w-5" />
              <span>Explore</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SearchForm;
