/**
 * Budget Estimation Service
 * Provides recommended budget based on destination, duration, and travel month
 */

interface BudgetEstimate {
    recommended: number;
    minimum: number;
    comfortable: number;
    breakdown: {
      flights: number;
      accommodation: number;
      food: number;
      activities: number;
      transport: number;
    };
  }
  
  // Base daily costs by destination (in USD)
  const dailyCosts: Record<string, { low: number; mid: number; high: number }> = {
    "Bali, Indonesia": { low: 35, mid: 70, high: 150 },
    "Bangkok, Thailand": { low: 40, mid: 75, high: 160 },
    "Barcelona, Spain": { low: 80, mid: 150, high: 300 },
    "Budapest, Hungary": { low: 50, mid: 100, high: 200 },
    "Cancún, Mexico": { low: 60, mid: 120, high: 250 },
    "Cape Town, South Africa": { low: 45, mid: 90, high: 180 },
    "Cusco, Peru": { low: 35, mid: 65, high: 130 },
    "Hanoi, Vietnam": { low: 30, mid: 60, high: 120 },
    "Istanbul, Turkey": { low: 40, mid: 80, high: 160 },
    "Lisbon, Portugal": { low: 60, mid: 110, high: 220 },
    "Marrakech, Morocco": { low: 40, mid: 75, high: 150 },
    "Prague, Czech Republic": { low: 55, mid: 100, high: 200 },
    "Rio de Janeiro, Brazil": { low: 50, mid: 95, high: 190 },
    "Rome, Italy": { low: 75, mid: 140, high: 280 },
    "Santorini, Greece": { low: 70, mid: 130, high: 260 },
  };
  
  // Base flight costs by destination
  const flightCosts: Record<string, { low: number; high: number }> = {
    "Bali, Indonesia": { low: 800, high: 1200 },
    "Bangkok, Thailand": { low: 700, high: 1100 },
    "Barcelona, Spain": { low: 400, high: 700 },
    "Budapest, Hungary": { low: 350, high: 650 },
    "Cancún, Mexico": { low: 400, high: 700 },
    "Cape Town, South Africa": { low: 900, high: 1400 },
    "Cusco, Peru": { low: 650, high: 1000 },
    "Hanoi, Vietnam": { low: 750, high: 1150 },
    "Istanbul, Turkey": { low: 500, high: 900 },
    "Lisbon, Portugal": { low: 400, high: 700 },
    "Marrakech, Morocco": { low: 450, high: 800 },
    "Prague, Czech Republic": { low: 350, high: 650 },
    "Rio de Janeiro, Brazil": { low: 850, high: 1300 },
    "Rome, Italy": { low: 450, high: 800 },
    "Santorini, Greece": { low: 500, high: 900 },
  };
  
  // Seasonal multipliers
  const seasonalMultipliers: Record<string, number> = {
    "January": 0.9,
    "February": 0.85,
    "March": 0.95,
    "April": 1.0,
    "May": 1.05,
    "June": 1.15,
    "July": 1.25,
    "August": 1.25,
    "September": 1.05,
    "October": 1.0,
    "November": 0.9,
    "December": 1.1,
  };
  
  /**
   * Calculate recommended budget based on destination, duration, and month
   */
  export function estimateBudget(
    destination: string,
    duration: number,
    month: string
  ): BudgetEstimate {
    // Get base costs
    const dailyCost = dailyCosts[destination] || { low: 50, mid: 100, high: 200 };
    const flightCost = flightCosts[destination] || { low: 500, high: 900 };
    
    // Get seasonal multiplier
    const seasonalMultiplier = seasonalMultipliers[month] || 1.0;
    
    // Calculate flight cost (average with seasonal adjustment)
    const avgFlightCost = ((flightCost.low + flightCost.high) / 2) * seasonalMultiplier;
    
    // Calculate daily costs with seasonal adjustment
    const dailyMidCost = dailyCost.mid * seasonalMultiplier;
    
    // Breakdown for recommended budget (mid-range)
    const accommodationPerDay = dailyMidCost * 0.40; // 40% of daily budget
    const foodPerDay = dailyMidCost * 0.35; // 35% of daily budget
    const activitiesPerDay = dailyMidCost * 0.20; // 20% of daily budget
    const transportPerDay = dailyMidCost * 0.05; // 5% of daily budget
    
    const breakdown = {
      flights: Math.round(avgFlightCost),
      accommodation: Math.round(accommodationPerDay * duration),
      food: Math.round(foodPerDay * duration),
      activities: Math.round(activitiesPerDay * duration),
      transport: Math.round(transportPerDay * duration),
    };
    
    // Calculate totals
    const recommended = Math.round(avgFlightCost + (dailyMidCost * duration));
    const minimum = Math.round((flightCost.low * seasonalMultiplier) + (dailyCost.low * seasonalMultiplier * duration));
    const comfortable = Math.round((flightCost.high * seasonalMultiplier) + (dailyCost.high * seasonalMultiplier * duration));
    
    return {
      recommended,
      minimum,
      comfortable,
      breakdown,
    };
  }
  
  /**
   * Get budget category label
   */
  export function getBudgetCategory(budget: number, estimate: BudgetEstimate): string {
    if (budget < estimate.minimum) {
      return "Ultra Budget";
    } else if (budget < estimate.recommended) {
      return "Budget Traveler";
    } else if (budget < estimate.comfortable) {
      return "Comfortable";
    } else {
      return "Luxury";
    }
  }
  