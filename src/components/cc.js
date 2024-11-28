async function fetchFlightData() {
    const url =
      "https://sky-scrapper.p.rapidapi.com/api/v2/flights/searchFlights?originSkyId=LOND&destinationSkyId=NYCA&originEntityId=27544008&destinationEntityId=27537542&date=2024-11-30&cabinClass=economy&adults=1&sortBy=best&currency=USD&market=en-US&countryCode=US";
  
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "X-RapidAPI-Key": API_KEY,
        "X-RapidAPI-Host": "sky-scrapper.p.rapidapi.com",
      },
    });
  
    const data = await response.json();
    console.log("flight data", data);
  
    if (!data.status || !data.data?.itineraries || data.data.itineraries.length === 0) {
      throw new Error("No flights found for the selected route and date.");
    }
  
    return data.data.itineraries.map((itinerary) => {
      const leg = itinerary.legs?.[0] || {}; // Get the first leg or fallback to an empty object
      const marketingCarrier = leg.carriers?.marketing?.[0] || {}; // Access the first marketing carrier
      const originAirport = leg.origin || {};
      const destinationAirport = leg.destination || {};
  
      return {
        airline: marketingCarrier.name || "Unknown Airline",
        airlineLogo: marketingCarrier.logoUrl || 'https://via.placeholder.com/48?text=Airline',
        price: itinerary.price?.raw || 0,
        departure: originAirport.displayCode || "LHR",
        departureName: originAirport.name || "LHR",
        destination: destinationAirport.displayCode || "JFK",
        destinationName: destinationAirport.name || "JFK",
        departureTime: leg.departure || "Unknown",
        arrivalTime: leg.arrival || "Unknown",
        departureCity: originAirport.city || "London",
        destinationCity: destinationAirport.city || "New York",
        stopCount: leg.stopCount || 0,
        durationInMinutes: leg.durationInMinutes || 0,
      };
    });
  }