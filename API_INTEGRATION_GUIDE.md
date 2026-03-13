# Travdget API Integration Guide

## Overview
Travdget integrates with multiple travel APIs to provide comprehensive trip planning with two modes:
1. **Surprise Me** - Auto-generated itineraries
2. **Build My Own** - Custom trip builder with real-time budget tracking

## API Integrations

### 1. Flight APIs

#### Skyscanner API
- **File**: `/src/app/services/flightService.ts`
- **Purpose**: Fetch 3 cheapest flight options
- **Setup**:
  1. Sign up at https://developers.skyscanner.net/
  2. Get your API key
  3. Replace `YOUR_SKYSCANNER_API_KEY` in the file
  4. Uncomment the real API implementation

#### Amadeus Flights API
- **File**: `/src/app/services/amadeusService.ts`
- **Purpose**: Fetch additional 3 flight options (total 6 options)
- **Setup**:
  1. Sign up at https://developers.amadeus.com/
  2. Get your API key and secret
  3. Replace credentials in the file
  4. Uncomment the real API implementation

### 2. Hotel API

#### Amadeus Hotel Search API
- **File**: `/src/app/services/amadeusService.ts`
- **Purpose**: Fetch 3 hotel options based on budget
- **Setup**: Same as Amadeus Flights (shared credentials)

### 3. Cost Estimation API

#### Numbeo API
- **File**: `/src/app/services/numbeoService.ts`
- **Purpose**: Get cost of living data for destinations
- **Features**:
  - Meal prices (budget & mid-range)
  - Public transport costs
  - Daily budget estimates
- **Setup**:
  1. Sign up at https://www.numbeo.com/api/
  2. Get your API key
  3. Replace `YOUR_NUMBEO_API_KEY`
  4. Uncomment the real API implementation

### 4. Activities API

#### TripAdvisor API
- **File**: `/src/app/services/tripAdvisorService.ts`
- **Purpose**: Fetch activity recommendations
- **Setup**:
  1. Sign up at https://www.tripadvisor.com/developers
  2. Get your API key
  3. Replace `YOUR_TRIPADVISOR_API_KEY`
  4. Uncomment the real API implementation

## Features

### Surprise Me Mode
- Auto-selects cheapest flight
- Recommends hotels within budget
- Generates complete daily itineraries
- Shows 2 curated itinerary options

### Build My Own Mode
- **Step 1: Flights** - Choose from 6 options (3 Skyscanner + 3 Amadeus)
- **Step 2: Hotels** - Choose from 3 Amadeus hotels
- **Step 3: Activities** - Select multiple activities from TripAdvisor
- **Step 4: Review** - See complete cost breakdown
- **Real-time Budget Tracking**: 
  - Shows remaining budget as you add items
  - Visual progress bar
  - Warns when over budget

## Budget Tracking Implementation

The Build My Own mode tracks your budget in real-time:
- Starting budget is set by user
- Each selection deducts from remaining budget
- Visual indicators show budget status
- Green = under budget, Red = over budget

## Mock Data

All APIs currently use mock data for demonstration. To use real data:
1. Get API credentials from each provider
2. Replace placeholder API keys
3. Uncomment real API implementation blocks
4. Comment out mock data generators

## File Structure

```
/src/app/
├── services/
│   ├── flightService.ts      # Skyscanner API
│   ├── amadeusService.ts     # Amadeus Flights & Hotels
│   ├── numbeoService.ts      # Cost estimation
│   └── tripAdvisorService.ts # Activities
├── pages/
│   ├── Home.tsx              # Landing page
│   ├── PlanTrip.tsx          # Mode selection & preferences
│   ├── BuildTrip.tsx         # Custom builder with budget tracking
│   └── Results.tsx           # Auto-generated itineraries
└── routes.ts                 # App routing
```

## Next Steps

1. Sign up for all API accounts
2. Get API credentials
3. Update service files with your keys
4. Test with real data
5. Deploy your application

## Notes

- All prices are in USD
- Mock data provides realistic price ranges
- Budget tracking is client-side (no persistence)
- For production, consider adding Supabase for user data persistence
