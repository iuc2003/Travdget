import * as React from "react";

import { useEffect, useState } from "react";
import { Link } from "react-router";
import { Plane, ArrowLeft, MapPin, DollarSign, Calendar, Users, Hotel, UtensilsCrossed, Camera, Info, Clock, TrendingDown } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Separator } from "../components/ui/separator";
import { getFlightOptions, formatFlightDate } from "../services/flightService";
import { getAmadeusFlights } from "../services/amadeusService";

interface TripPreferences {
  destination: string;
  budget: number;
  travelStyle: string;
  duration: number;
  month: string;
  mode?: string;
}

interface DayActivity {
  time: string;
  activity: string;
  cost: number;
  description: string;
}

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

interface Itinerary {
  id: number;
  name: string;
  totalCost: number;
  flightCost: number;
  accommodation: {
    type: string;
    name: string;
    pricePerNight: number;
  };
  days: {
    day: number;
    title: string;
    activities: DayActivity[];
  }[];
  breakdown: {
    flights: number;
    accommodation: number;
    food: number;
    activities: number;
    transport: number;
  };
}

// Mock data generator
function generateItineraries(prefs: TripPreferences, flightPrice: number): Itinerary[] {
  const budgetPerDay = prefs.budget / prefs.duration;
  
  const getAccommodation = (level: "budget" | "mid" | "comfort") => {
    const accommodations = {
      budget: [
        { type: "Hostel", name: "Budget Backpackers Hostel", pricePerNight: 15 },
        { type: "Hostel", name: "Cozy Traveler's Inn", pricePerNight: 20 },
      ],
      mid: [
        { type: "Hotel", name: "City Center Hotel", pricePerNight: 45 },
        { type: "Guesthouse", name: "Charming Local Guesthouse", pricePerNight: 40 },
      ],
      comfort: [
        { type: "Hotel", name: "Boutique Downtown Hotel", pricePerNight: 80 },
        { type: "Hotel", name: "Modern Comfort Inn", pricePerNight: 75 },
      ],
    };
    return accommodations[level][0];
  };

  const getActivities = (destination: string, day: number, style: string): DayActivity[] => {
    const allActivities: Record<number, DayActivity[]> = {
      1: [
        { time: "9:00 AM", activity: "Walking Tour", cost: 0, description: "Free walking tour of historic district" },
        { time: "12:30 PM", activity: "Local Lunch", cost: 12, description: "Street food market exploration" },
        { time: "3:00 PM", activity: "Museum Visit", cost: 8, description: "National museum entry" },
        { time: "7:00 PM", activity: "Dinner", cost: 15, description: "Traditional local restaurant" },
      ],
      2: [
        { time: "8:00 AM", activity: "Day Trip", cost: 35, description: "Guided tour to nearby attractions" },
        { time: "1:00 PM", activity: "Lunch", cost: 10, description: "Packed lunch provided" },
        { time: "6:00 PM", activity: "Sunset Viewpoint", cost: 0, description: "Free scenic viewpoint" },
        { time: "8:00 PM", activity: "Dinner", cost: 18, description: "Rooftop restaurant" },
      ],
      3: [
        { time: "10:00 AM", activity: "Cultural Experience", cost: 25, description: "Cooking class or craft workshop" },
        { time: "1:00 PM", activity: "Lunch", cost: 14, description: "Café in artisan quarter" },
        { time: "4:00 PM", activity: "Shopping", cost: 30, description: "Local markets and souvenirs" },
        { time: "7:30 PM", activity: "Dinner", cost: 16, description: "Hidden gem restaurant" },
      ],
    };

    const dayIndex = ((day - 1) % 3) + 1;
    return allActivities[dayIndex];
  };

  const accommodationLevel = budgetPerDay < 100 ? "budget" : budgetPerDay < 200 ? "mid" : "comfort";
  
  const itinerary1: Itinerary = {
    id: 1,
    name: "Classic Explorer",
    totalCost: 0,
    flightCost: flightPrice,
    accommodation: getAccommodation(accommodationLevel),
    days: [],
    breakdown: {
      flights: 0,
      accommodation: 0,
      food: 0,
      activities: 0,
      transport: 0,
    },
  };

  const itinerary2: Itinerary = {
    id: 2,
    name: "Adventure Seeker",
    totalCost: 0,
    flightCost: flightPrice,
    accommodation: getAccommodation(accommodationLevel),
    days: [],
    breakdown: {
      flights: 0,
      accommodation: 0,
      food: 0,
      activities: 0,
      transport: 0,
    },
  };

  // Generate days for itinerary 1
  for (let day = 1; day <= prefs.duration; day++) {
    itinerary1.days.push({
      day,
      title: day === 1 ? "Arrival & City Exploration" : 
             day === prefs.duration ? "Last Day & Departure" :
             `Day ${day} Adventures`,
      activities: getActivities(prefs.destination, day, prefs.travelStyle),
    });
  }

  // Calculate costs
  itinerary1.breakdown.flights = flightPrice;
  itinerary1.breakdown.accommodation = itinerary1.accommodation.pricePerNight * prefs.duration;
  itinerary1.breakdown.food = prefs.duration * 40; // Average food cost per day
  itinerary1.breakdown.activities = itinerary1.days.reduce((sum, day) => 
    sum + day.activities.reduce((daySum, activity) => daySum + activity.cost, 0), 0
  );
  itinerary1.breakdown.transport = 150; // Fixed transport cost
  itinerary1.totalCost = Object.values(itinerary1.breakdown).reduce((a, b) => a + b, 0);

  // Generate slightly different itinerary 2
  for (let day = 1; day <= prefs.duration; day++) {
    const activities = getActivities(prefs.destination, day, prefs.travelStyle).map(act => ({
      ...act,
      cost: Math.round(act.cost * 1.1), // Slightly different costs
    }));
    
    itinerary2.days.push({
      day,
      title: day === 1 ? "Welcome & Orientation" : 
             day === prefs.duration ? "Farewell & Memories" :
             `Discover Day ${day}`,
      activities,
    });
  }

  itinerary2.breakdown.flights = flightPrice;
  itinerary2.breakdown.accommodation = itinerary2.accommodation.pricePerNight * prefs.duration;
  itinerary2.breakdown.food = prefs.duration * 45;
  itinerary2.breakdown.activities = itinerary2.days.reduce((sum, day) => 
    sum + day.activities.reduce((daySum, activity) => daySum + activity.cost, 0), 0
  );
  itinerary2.breakdown.transport = 180;
  itinerary2.totalCost = Object.values(itinerary2.breakdown).reduce((a, b) => a + b, 0);

  return [itinerary1, itinerary2];
}

export function Results() {
  const [preferences, setPreferences] = useState<TripPreferences | null>(null);
  const [itineraries, setItineraries] = useState<Itinerary[]>([]);
  const [flightOptions, setFlightOptions] = useState<FlightOption[]>([]);

  useEffect(() => {
    const stored = sessionStorage.getItem("tripPreferences");
    if (stored) {
      const prefs = JSON.parse(stored) as TripPreferences;
      setPreferences(prefs);
      if (prefs.mode === "amadeus") {
        getAmadeusFlights(prefs.destination, prefs.month, prefs.duration).then(options => {
          setFlightOptions(options);
          if (options.length > 0) {
            setItineraries(generateItineraries(prefs, options[0].price));
          }
        });
      } else {
        getFlightOptions(prefs.destination, prefs.month, prefs.duration).then(options => {
          setFlightOptions(options);
          if (options.length > 0) {
            setItineraries(generateItineraries(prefs, options[0].price));
          }
        });
      }
    }
  }, []);

  if (!preferences) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>No Trip Preferences Found</CardTitle>
            <CardDescription>Please plan your trip first</CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/plan">
              <Button className="w-full">Plan a Trip</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Plane className="w-8 h-8 text-blue-600" />
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Travdget
            </span>
          </Link>
          <Link to="/plan">
            <Button variant="ghost">
              <ArrowLeft className="mr-2 w-4 h-4" />
              Modify Preferences
            </Button>
          </Link>
        </div>
      </header>

      {/* Results Section */}
      <div className="container mx-auto px-4 py-12">
        {/* Trip Summary */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Your Personalized Itineraries</h1>
          <div className="flex flex-wrap gap-4">
            <Badge variant="secondary" className="px-4 py-2">
              <MapPin className="w-4 h-4 mr-2" />
              {preferences.destination}
            </Badge>
            <Badge variant="secondary" className="px-4 py-2">
              <DollarSign className="w-4 h-4 mr-2" />
              ${preferences.budget} Budget
            </Badge>
            <Badge variant="secondary" className="px-4 py-2">
              <Calendar className="w-4 h-4 mr-2" />
              {preferences.duration} Days
            </Badge>
            <Badge variant="secondary" className="px-4 py-2">
              <Users className="w-4 h-4 mr-2" />
              {preferences.travelStyle}
            </Badge>
          </div>
        </div>

        {/* Flight Options */}
        {flightOptions.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Plane className="w-6 h-6 text-blue-600" />
                    Top 3 Cheapest Flights for {preferences.month}
                  </CardTitle>
                  <CardDescription>Round-trip flights based on your selected travel month</CardDescription>
                </div>
                <Badge className="bg-green-500">
                  <TrendingDown className="w-4 h-4 mr-1" />
                  Best Deals
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                {flightOptions.map((flight, index) => (
                  <Card key={flight.id} className={index === 0 ? "border-2 border-blue-600 relative" : ""}>
                    {index === 0 && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <Badge className="bg-blue-600">Cheapest</Badge>
                      </div>
                    )}
                    <CardContent className="pt-6">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-lg">{flight.airline}</span>
                          <span className="text-2xl font-bold text-blue-600">${flight.price}</span>
                        </div>
                        
                        <Separator />
                        
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-gray-500" />
                            <div>
                              <p className="font-medium">Outbound</p>
                              <p className="text-gray-600">{formatFlightDate(flight.outboundDate)}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-gray-500" />
                            <div>
                              <p className="font-medium">Return</p>
                              <p className="text-gray-600">{formatFlightDate(flight.returnDate)}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-gray-500" />
                            <span className="text-gray-600">{flight.duration}</span>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-gray-500" />
                            <span className="text-gray-600">
                              {flight.stops === 0 ? "Non-stop" : `${flight.stops} stop${flight.stops > 1 ? 's' : ''}`}
                            </span>
                          </div>
                        </div>
                        
                        <Separator />
                        
                        <a href={flight.bookingUrl} target="_blank" rel="noopener noreferrer" className="block">
                          <Button className="w-full" variant={index === 0 ? "default" : "outline"}>
                            Book on Skyscanner
                          </Button>
                        </a>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-700 flex items-start gap-2">
                  <Info className="w-4 h-4 mt-0.5 flex-shrink-0 text-blue-600" />
                  <span>
                    These flight prices are estimates based on Skyscanner API data. Prices may vary.
                    The itinerary costs below are calculated using the cheapest flight option (${flightOptions[0].price}).
                    <strong className="ml-1">Note: This demo uses mock flight data. Connect to the real Skyscanner API by adding your API key in /src/app/services/flightService.ts</strong>
                  </span>
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Itineraries */}
        <div className="grid lg:grid-cols-2 gap-8">
          {itineraries.map((itinerary) => (
            <Card key={itinerary.id} className="overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                <CardTitle className="text-2xl">{itinerary.name}</CardTitle>
                <CardDescription className="text-blue-50">
                  Total Cost: ${itinerary.totalCost}
                  {itinerary.totalCost <= preferences.budget && (
                    <Badge className="ml-2 bg-green-500">Within Budget</Badge>
                  )}
                  {itinerary.totalCost > preferences.budget && (
                    <Badge className="ml-2 bg-yellow-500">${itinerary.totalCost - preferences.budget} over</Badge>
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                {/* Accommodation */}
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Hotel className="w-5 h-5 text-blue-600" />
                    <h3 className="font-semibold text-lg">Accommodation</h3>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="font-medium">{itinerary.accommodation.name}</p>
                    <p className="text-sm text-gray-600">{itinerary.accommodation.type}</p>
                    <p className="text-sm text-gray-600">
                      ${itinerary.accommodation.pricePerNight}/night × {preferences.duration} nights = 
                      <span className="font-semibold ml-1">${itinerary.breakdown.accommodation}</span>
                    </p>
                  </div>
                </div>

                {/* Budget Breakdown */}
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="w-5 h-5 text-purple-600" />
                    <h3 className="font-semibold text-lg">Budget Breakdown</h3>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Flights</span>
                      <span className="font-semibold">${itinerary.breakdown.flights}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Accommodation</span>
                      <span className="font-semibold">${itinerary.breakdown.accommodation}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Food & Drinks</span>
                      <span className="font-semibold">${itinerary.breakdown.food}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Activities & Tours</span>
                      <span className="font-semibold">${itinerary.breakdown.activities}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Transport</span>
                      <span className="font-semibold">${itinerary.breakdown.transport}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between items-center">
                      <span className="font-semibold">Total</span>
                      <span className="font-bold text-lg text-blue-600">${itinerary.totalCost}</span>
                    </div>
                  </div>
                </div>

                {/* Daily Itinerary */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Camera className="w-5 h-5 text-green-600" />
                    <h3 className="font-semibold text-lg">Daily Itinerary</h3>
                  </div>
                  <Tabs defaultValue="day1" className="w-full">
                    <TabsList className="grid w-full" style={{ gridTemplateColumns: `repeat(${Math.min(itinerary.days.length, 5)}, 1fr)` }}>
                      {itinerary.days.slice(0, 5).map((day) => (
                        <TabsTrigger key={day.day} value={`day${day.day}`}>
                          Day {day.day}
                        </TabsTrigger>
                      ))}
                    </TabsList>
                    {itinerary.days.slice(0, 5).map((day) => (
                      <TabsContent key={day.day} value={`day${day.day}`} className="space-y-4">
                        <div>
                          <h4 className="font-semibold text-lg mb-3">{day.title}</h4>
                          <div className="space-y-3">
                            {day.activities.map((activity, idx) => (
                              <div key={idx} className="border-l-2 border-blue-600 pl-4 py-2">
                                <div className="flex justify-between items-start mb-1">
                                  <span className="text-sm font-semibold text-blue-600">{activity.time}</span>
                                  <span className="text-sm font-semibold">${activity.cost}</span>
                                </div>
                                <p className="font-medium">{activity.activity}</p>
                                <p className="text-sm text-gray-600">{activity.description}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </TabsContent>
                    ))}
                  </Tabs>
                  {itinerary.days.length > 5 && (
                    <p className="text-sm text-gray-500 mt-2 flex items-center gap-1">
                      <Info className="w-4 h-4" />
                      Showing first 5 days. Full itinerary continues for {preferences.duration} days.
                    </p>
                  )}
                </div>

                <Button className="w-full mt-6">Select This Itinerary</Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tips Section */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Money-Saving Tips for {preferences.destination}</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <UtensilsCrossed className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Eat at local markets and street food vendors for authentic experiences at lower prices</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <span>Use public transportation or walk to explore the city and save on taxis</span>
              </li>
              <li className="flex items-start gap-2">
                <Calendar className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                <span>Book accommodations and tours in advance for better rates</span>
              </li>
              <li className="flex items-start gap-2">
                <DollarSign className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                <span>Look for free walking tours and museum days to cut activity costs</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
