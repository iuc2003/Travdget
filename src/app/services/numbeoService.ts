/**
 * Numbeo API Integration for Cost of Living Data
 * 
 * To use the real Numbeo API:
 * 1. Sign up at https://www.numbeo.com/api/
 * 2. Get your API key
 * 3. Replace 'YOUR_NUMBEO_API_KEY' below
 * 4. Uncomment the real API calls
 */

const NUMBEO_API_KEY = 'YOUR_NUMBEO_API_KEY';
const NUMBEO_API_BASE = 'https://www.numbeo.com/api';

export interface CostEstimate {
  mealInexpensive: number;
  mealMidRange: number;
  domesticBeer: number;
  cappuccino: number;
  waterBottle: number;
  publicTransportTicket: number;
  taxiPerKm: number;
  hotelBudget: number;
  hotelMidRange: number;
  attraction: number;
  dailyBudgetLow: number;
  dailyBudgetMid: number;
  dailyBudgetHigh: number;
}

// Mock cost data by destination
function generateMockCostData(destination: string): CostEstimate {
  const costData: Record<string, CostEstimate> = {
    "Bali, Indonesia": {
      mealInexpensive: 3.5,
      mealMidRange: 15,
      domesticBeer: 2,
      cappuccino: 2.5,
      waterBottle: 0.4,
      publicTransportTicket: 0.5,
      taxiPerKm: 0.6,
      hotelBudget: 20,
      hotelMidRange: 50,
      attraction: 8,
      dailyBudgetLow: 35,
      dailyBudgetMid: 70,
      dailyBudgetHigh: 150,
    },
    "Bangkok, Thailand": {
      mealInexpensive: 3,
      mealMidRange: 12,
      domesticBeer: 2.5,
      cappuccino: 2,
      waterBottle: 0.5,
      publicTransportTicket: 0.8,
      taxiPerKm: 0.7,
      hotelBudget: 25,
      hotelMidRange: 60,
      attraction: 10,
      dailyBudgetLow: 40,
      dailyBudgetMid: 75,
      dailyBudgetHigh: 160,
    },
    "Barcelona, Spain": {
      mealInexpensive: 12,
      mealMidRange: 35,
      domesticBeer: 4,
      cappuccino: 2.5,
      waterBottle: 1.2,
      publicTransportTicket: 2.4,
      taxiPerKm: 1.2,
      hotelBudget: 60,
      hotelMidRange: 120,
      attraction: 15,
      dailyBudgetLow: 80,
      dailyBudgetMid: 150,
      dailyBudgetHigh: 300,
    },
    "Budapest, Hungary": {
      mealInexpensive: 7,
      mealMidRange: 20,
      domesticBeer: 2,
      cappuccino: 2,
      waterBottle: 0.8,
      publicTransportTicket: 1.2,
      taxiPerKm: 0.9,
      hotelBudget: 40,
      hotelMidRange: 80,
      attraction: 10,
      dailyBudgetLow: 50,
      dailyBudgetMid: 100,
      dailyBudgetHigh: 200,
    },
    "Cancún, Mexico": {
      mealInexpensive: 8,
      mealMidRange: 25,
      domesticBeer: 3,
      cappuccino: 3,
      waterBottle: 1,
      publicTransportTicket: 0.5,
      taxiPerKm: 0.8,
      hotelBudget: 50,
      hotelMidRange: 100,
      attraction: 20,
      dailyBudgetLow: 60,
      dailyBudgetMid: 120,
      dailyBudgetHigh: 250,
    },
  };

  // Default values if destination not found
  return costData[destination] || {
    mealInexpensive: 10,
    mealMidRange: 25,
    domesticBeer: 3,
    cappuccino: 3,
    waterBottle: 1,
    publicTransportTicket: 2,
    taxiPerKm: 1,
    hotelBudget: 50,
    hotelMidRange: 100,
    attraction: 15,
    dailyBudgetLow: 60,
    dailyBudgetMid: 120,
    dailyBudgetHigh: 250,
  };
}

/**
 * Get cost of living estimates for a destination
 */
export async function getCostEstimates(destination: string): Promise<CostEstimate> {
  // MOCK DATA - Replace with real API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(generateMockCostData(destination));
    }, 800);
  });

  /* REAL API IMPLEMENTATION (uncomment when you have API key):
  
  try {
    const cityName = destination.split(',')[0];
    const response = await fetch(
      `${NUMBEO_API_BASE}/city_prices?api_key=${NUMBEO_API_KEY}&query=${encodeURIComponent(cityName)}`,
      {
        headers: {
          'Accept': 'application/json',
        },
      }
    );
    
    if (!response.ok) {
      throw new Error('Numbeo API request failed');
    }
    
    const data = await response.json();
    
    // Map Numbeo data to our CostEstimate interface
    const prices = data.prices || [];
    
    return {
      mealInexpensive: findPrice(prices, 'Meal, Inexpensive Restaurant') || 10,
      mealMidRange: findPrice(prices, 'Meal for 2 People, Mid-range Restaurant') / 2 || 25,
      domesticBeer: findPrice(prices, 'Domestic Beer') || 3,
      cappuccino: findPrice(prices, 'Cappuccino') || 3,
      waterBottle: findPrice(prices, 'Water') || 1,
      publicTransportTicket: findPrice(prices, 'One-way Ticket') || 2,
      taxiPerKm: findPrice(prices, 'Taxi 1km') || 1,
      hotelBudget: 50, // Estimate
      hotelMidRange: 100, // Estimate
      attraction: 15, // Estimate
      dailyBudgetLow: 60,
      dailyBudgetMid: 120,
      dailyBudgetHigh: 250,
    };
  } catch (error) {
    console.error('Error fetching Numbeo data:', error);
    return generateMockCostData(destination);
  }
  */
}

function findPrice(prices: any[], itemName: string): number {
  const item = prices.find((p: any) => p.item_name.includes(itemName));
  return item ? parseFloat(item.average_price) : 0;
}
