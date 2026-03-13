/**
 * Skyscanner Flight API Integration
 * 
 * To use the real Skyscanner API:
 * 1. Sign up at https://developers.skyscanner.net/
 * 2. Get your API key from the dashboard
 * 3. Replace 'YOUR_SKYSCANNER_API_KEY' below with your actual key
 * 4. Uncomment the real API call and comment out the mock data
 */

const SKYSCANNER_API_KEY = 'YOUR_SKYSCANNER_API_KEY';
const SKYSCANNER_API_BASE = 'https://partners.api.skyscanner.net/apiservices';

interface FlightOption {
  id: string;
  outboundDate: string;
  returnDate: string;
  price: number;
  airline: string;
  duration: string;
  stops: number;
  departure: string;
  arrival: string;
  bookingUrl: string;
}

// Helper to get airport codes from destination
function getAirportCode(destination: string): string {
  const airportCodes: Record<string, string> = {
    "Bali, Indonesia": "DPS",
    "Bangkok, Thailand": "BKK",
    "Barcelona, Spain": "BCN",
    "Budapest, Hungary": "BUD",
    "Cancún, Mexico": "CUN",
    "Cape Town, South Africa": "CPT",
    "Cusco, Peru": "CUZ",
    "Hanoi, Vietnam": "HAN",
    "Istanbul, Turkey": "IST",
    "Lisbon, Portugal": "LIS",
    "Marrakech, Morocco": "RAK",
    "Prague, Czech Republic": "PRG",
    "Rio de Janeiro, Brazil": "GIG",
    "Rome, Italy": "FCO",
    "Santorini, Greece": "JTR",
  };
  return airportCodes[destination] || "XXX";
}

// Helper to get month number
function getMonthNumber(monthName: string): number {
  const months = ["January", "February", "March", "April", "May", "June",
                  "July", "August", "September", "October", "November", "December"];
  return months.indexOf(monthName) + 1;
}

// Generate mock flight data (replace with real API call)
function generateMockFlights(
  destination: string,
  month: string,
  duration: number
): FlightOption[] {
  const destinationCode = getAirportCode(destination);
  const monthNum = getMonthNumber(month);
  const year = 2026; // Current year from context
  
  // Generate three different date options within the selected month
  const dateOptions = [
    { start: 5, label: "Early" },
    { start: 12, label: "Mid" },
    { start: 20, label: "Late" },
  ];

  // Base prices vary by destination
  const basePrices: Record<string, number> = {
    "DPS": 850, "BKK": 720, "BCN": 450, "BUD": 380,
    "CUN": 420, "CPT": 920, "CUZ": 680, "HAN": 780,
    "IST": 520, "LIS": 410, "RAK": 480, "PRG": 360,
    "GIG": 890, "FCO": 490, "JTR": 540,
  };

  const basePrice = basePrices[destinationCode] || 500;

  const airlines = [
    "Turkish Airlines", "Emirates", "Qatar Airways", "Lufthansa",
    "Air France", "KLM", "British Airways", "United Airlines",
    "Delta Airlines", "Singapore Airlines"
  ];

  return dateOptions.map((option, index) => {
    const outboundDate = `${year}-${String(monthNum).padStart(2, '0')}-${String(option.start).padStart(2, '0')}`;
    const returnDate = `${year}-${String(monthNum).padStart(2, '0')}-${String(option.start + duration).padStart(2, '0')}`;
    
    // Add price variation
    const priceVariation = index * 45 + (Math.random() * 30);
    const price = Math.round(basePrice + priceVariation);
    
    const stops = index === 0 ? 0 : index === 1 ? 1 : 2;
    const durationHours = 8 + (stops * 3) + Math.floor(Math.random() * 4);

    return {
      id: `flight-${index + 1}`,
      outboundDate,
      returnDate,
      price,
      airline: airlines[Math.floor(Math.random() * airlines.length)],
      duration: `${durationHours}h ${Math.floor(Math.random() * 60)}m`,
      stops,
      departure: "JFK", // Assuming departure from New York JFK
      arrival: destinationCode,
      bookingUrl: `https://www.skyscanner.com/transport/flights/jfk/${destinationCode.toLowerCase()}`,
    };
  }).sort((a, b) => a.price - b.price); // Sort by price ascending
}

/**
 * Fetch flight options from Skyscanner API
 */
export async function getFlightOptions(
  destination: string,
  month: string,
  duration: number
): Promise<FlightOption[]> {
  // MOCK DATA - Replace with real API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(generateMockFlights(destination, month, duration));
    }, 1000); // Simulate API delay
  });

  /* REAL API IMPLEMENTATION (uncomment when you have API key):
  
  const destinationCode = getAirportCode(destination);
  const monthNum = getMonthNumber(month);
  const year = new Date().getFullYear();
  
  try {
    const response = await fetch(
      `${SKYSCANNER_API_BASE}/browseroutes/v1.0/US/USD/en-US/JFK/${destinationCode}/${year}-${monthNum}`,
      {
        headers: {
          'x-api-key': SKYSCANNER_API_KEY,
        },
      }
    );
    
    if (!response.ok) {
      throw new Error('Skyscanner API request failed');
    }
    
    const data = await response.json();
    
    // Transform Skyscanner API response to our FlightOption format
    return data.Quotes.slice(0, 3).map((quote: any) => ({
      id: quote.QuoteId.toString(),
      outboundDate: quote.OutboundLeg.DepartureDate,
      returnDate: quote.InboundLeg?.DepartureDate || '',
      price: quote.MinPrice,
      airline: data.Carriers.find((c: any) => c.CarrierId === quote.OutboundLeg.CarrierIds[0])?.Name || 'Unknown',
      duration: 'Check details',
      stops: quote.Direct ? 0 : 1,
      departure: 'JFK',
      arrival: destinationCode,
      bookingUrl: `https://www.skyscanner.com/transport/flights/jfk/${destinationCode.toLowerCase()}`,
    }));
  } catch (error) {
    console.error('Error fetching flights:', error);
    // Fallback to mock data on error
    return generateMockFlights(destination, month, duration);
  }
  */
}

/**
 * Format date for display
 */
export function formatFlightDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    weekday: 'short', 
    month: 'short', 
    day: 'numeric',
    year: 'numeric'
  });
}
