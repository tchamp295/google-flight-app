const API_KEY = import.meta.env.VITE_RAPIDAPI_KEY;

const BASE_URL = "https://sky-scrapper.p.rapidapi.com/api/v2/flights";

async function fetchFlightData(searchParams) {
  console.log("Search Params:", searchParams);

  const url = `${BASE_URL}/searchFlightsComplete?originSkyId=${
    searchParams.departureSkyId
  }&destinationSkyId=${searchParams.destinationSkyId}&originEntityId=${
    searchParams.departureEntityId
  }&destinationEntityId=${searchParams.destinationEntityId}&date=${
    searchParams.date
  }&adults=${
    searchParams.passengers
  }&cabinClass=${searchParams.travelClass.toLowerCase()}&currency=USD&market=en-US&countryCode=US`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "X-RapidAPI-Key": API_KEY,
        "X-RapidAPI-Host": "sky-scrapper.p.rapidapi.com",
      },
    });

    const data = await response.json();
    console.log("Flight Data:", data);

    if (!data.status || !data.data?.itineraries?.length) {
      throw new Error("No flights found for the selected route and date.");
    }

    return data.data.itineraries.map((itinerary) => {
      const legs = itinerary.legs || [];
      const leg = legs[0] || {};
      const marketingCarrier = leg.carriers?.marketing?.[0] || {};
      const originAirport = leg.origin || {};
      const destinationAirport = leg.destination || {};

      const tripType =
        legs.length === 1
          ? "One-Way"
          : legs.length === 2 &&
            legs[0]?.origin?.id === legs[1]?.destination?.id
          ? "Round-Trip"
          : "Multi-City";

      return {
        tripType,
        airline: marketingCarrier.name || null,
        airlineLogo: marketingCarrier.logoUrl || null,
        price: itinerary.price?.raw || null,
        departure: originAirport.displayCode || null,
        departureName: originAirport.name || null,
        destination: destinationAirport.displayCode || null,
        destinationName: destinationAirport.name || null,
        departureTime: leg.departure || null,
        arrivalTime: leg.arrival || null,
        departureCity: originAirport.city || null,
        destinationCity: destinationAirport.city || null,
        stopCount: leg.stopCount || null,
        durationInMinutes: leg.durationInMinutes || null,
      };
    });
  } catch (error) {
    console.error("Error fetching flight data:", error.message);
    throw error;
  }
}

export { fetchFlightData };
