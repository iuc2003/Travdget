import * as React from "react";

import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { Plane, ArrowLeft, Sparkles, Hotel, MapPin, Calendar, DollarSign, Download, Clock, CheckCircle2 } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Separator } from "../components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";

interface ItineraryOption {
  destination: string;
  totalCost: number;
  highlights: string[];
  flight: {
    airline: string;
    departureTime: string;
    arrivalTime: string;
    duration: string;
    price: number;
    class: string;
  };
  hotel: {
    name: string;
    rating: number;
    location: string;
    pricePerNight: number;
    totalNights: number;
    totalPrice: number;
    amenities: string[];
  };
  activities: {
    day: number;
    title: string;
    description: string;
    duration: string;
    price: number;
  }[];
  dailyItinerary: {
    day: number;
    morning: string;
    afternoon: string;
    evening: string;
  }[];
}

export function SurpriseMeResults() {
  const navigate = useNavigate();
  const [preferences, setPreferences] = useState<any>(null);
  const [itineraries, setItineraries] = useState<ItineraryOption[]>([]);
  const [selectedItinerary, setSelectedItinerary] = useState(0);

  useEffect(() => {
    const stored = sessionStorage.getItem("surpriseMePreferences");
    if (!stored) {
      navigate("/surprise");
      return;
    }

    const prefs = JSON.parse(stored);
    setPreferences(prefs);

    // Generate three itinerary options based on selected destinations
    const generatedItineraries = generateItineraries(prefs);
    setItineraries(generatedItineraries);
  }, [navigate]);

  const generateItineraries = (prefs: any): ItineraryOption[] => {
    const { destinations, duration, budget, month, departingFrom } = prefs;
    
    // Select top 3 destinations from user's selections
    const selectedDests = destinations.slice(0, 3);
    
    // If less than 3 destinations selected, add some popular ones
    const allDestinations = [
      "Bali, Indonesia",
      "Bangkok, Thailand",
      "Barcelona, Spain",
      "Budapest, Hungary",
      "Cancún, Mexico",
      "Lisbon, Portugal",
      "Prague, Czech Republic",
    ];
    
    while (selectedDests.length < 3) {
      const randomDest = allDestinations.find(d => !selectedDests.includes(d));
      if (randomDest) selectedDests.push(randomDest);
    }

    // Generate three different itinerary styles
    return selectedDests.map((dest, index) => {
      const budgetMultiplier = index === 0 ? 0.7 : index === 1 ? 0.85 : 1.0; // Budget, Mid-range, Comfort
      const flightPrice = Math.round(budget * 0.35 * budgetMultiplier);
      const hotelPricePerNight = Math.round((budget * 0.40 * budgetMultiplier) / duration);
      const activitiesBudget = budget * 0.25 * budgetMultiplier;

      const airlines = ["United Airlines", "Delta", "American Airlines", "Lufthansa", "Emirates"];
      const hotelNames = [
        `${dest.split(',')[0]} Grand Hotel`,
        `The ${dest.split(',')[0]} Palace`,
        `Luxury Suites ${dest.split(',')[0]}`,
        `${dest.split(',')[0]} Boutique Hotel`,
      ];

      const activities = generateActivities(dest, duration, activitiesBudget);
      const dailyItinerary = generateDailyItinerary(duration, dest);

      return {
        destination: dest,
        totalCost: Math.round(flightPrice + (hotelPricePerNight * duration) + activities.reduce((sum, a) => sum + a.price, 0)),
        highlights: [
          `Explore ${dest.split(',')[0]}'s top attractions`,
          `${duration} days of curated experiences`,
          `${index === 0 ? 'Budget-friendly' : index === 1 ? 'Balanced comfort' : 'Premium comfort'} accommodation`,
          `Hand-picked local activities`,
        ],
        flight: {
          airline: airlines[index % airlines.length],
          departureTime: "10:30 AM",
          arrivalTime: "2:45 PM (next day)",
          duration: "14h 15m",
          price: flightPrice,
          class: index === 2 ? "Business" : "Economy",
        },
        hotel: {
          name: hotelNames[index],
          rating: index === 0 ? 3.5 : index === 1 ? 4 : 4.5,
          location: `Central ${dest.split(',')[0]}`,
          pricePerNight: hotelPricePerNight,
          totalNights: duration,
          totalPrice: hotelPricePerNight * duration,
          amenities: [
            "Free WiFi",
            index > 0 ? "Swimming Pool" : "Shared Kitchen",
            index > 1 ? "Spa & Wellness" : "Fitness Center",
            "24/7 Reception",
            index > 0 ? "Restaurant" : "Breakfast Included",
          ],
        },
        activities,
        dailyItinerary,
      };
    });
  };

  const generateActivities = (destination: string, duration: number, budget: number) => {
    const destName = destination.split(',')[0];
    const activityTemplates = [
      { title: `${destName} City Tour`, description: "Guided walking tour of historic landmarks", duration: "3 hours" },
      { title: "Local Food Experience", description: "Taste authentic local cuisine with a food expert", duration: "2.5 hours" },
      { title: "Cultural Museum Visit", description: "Explore the rich history and art", duration: "2 hours" },
      { title: "Adventure Activity", description: "Thrilling outdoor experience", duration: "4 hours" },
      { title: "Sunset Experience", description: "Watch sunset at the best viewpoint", duration: "2 hours" },
      { title: "Market Tour", description: "Browse local markets and shops", duration: "2 hours" },
    ];

    const numActivities = Math.min(duration, 6);
    const pricePerActivity = budget / numActivities;

    return activityTemplates.slice(0, numActivities).map((template, index) => ({
      day: index + 1,
      ...template,
      price: Math.round(pricePerActivity * (0.8 + Math.random() * 0.4)),
    }));
  };

  const generateDailyItinerary = (duration: number, destination: string) => {
    const destName = destination.split(',')[0];
    return Array.from({ length: duration }, (_, i) => ({
      day: i + 1,
      morning: i === 0 
        ? `Arrive in ${destName}, check into hotel, freshen up` 
        : `Breakfast at hotel, visit ${['historic district', 'famous landmarks', 'local markets', 'museums', 'temples'][i % 5]}`,
      afternoon: `Lunch at local restaurant, ${['city tour', 'cultural experience', 'adventure activity', 'shopping', 'relaxation'][i % 5]}`,
      evening: i === duration - 1 
        ? `Pack and prepare for departure, farewell dinner` 
        : `Dinner at ${['rooftop restaurant', 'traditional venue', 'beachfront café', 'local hotspot', 'street food market'][i % 5]}, evening stroll`,
    }));
  };

  const downloadPDF = (itinerary: ItineraryOption) => {
    // In a real app, this would generate a PDF
    alert(`PDF download for ${itinerary.destination} itinerary would start here. In production, this would generate a detailed PDF with all flight, hotel, and activity information.`);
  };

  if (!preferences || itineraries.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Plane className="w-12 h-12 text-purple-600 mx-auto mb-4 animate-bounce" />
          <p>Loading your personalized itineraries...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Plane className="w-8 h-8 text-purple-600" />
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Travdget
            </span>
          </Link>
          <Link to="/surprise">
            <Button variant="ghost">
              <ArrowLeft className="mr-2 w-4 h-4" />
              Back to Form
            </Button>
          </Link>
        </div>
      </header>

      {/* Results Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 mb-4">
              <Sparkles className="w-8 h-8 text-purple-600" />
              <h1 className="text-4xl font-bold">Your Personalized Itineraries</h1>
            </div>
            <p className="text-xl text-gray-600">
              We've created 3 amazing options for your {preferences.duration}-day adventure
            </p>
          </div>

          {/* Itinerary Tabs */}
          <Tabs value={selectedItinerary.toString()} onValueChange={(v) => setSelectedItinerary(parseInt(v))} className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 h-auto">
              {itineraries.map((itinerary, index) => (
                <TabsTrigger 
                  key={index} 
                  value={index.toString()} 
                  className="flex flex-col items-center gap-2 py-4 data-[state=active]:bg-purple-600 data-[state=active]:text-white"
                >
                  <div className="flex items-center gap-2">
                    <Badge variant={index === selectedItinerary ? "secondary" : "outline"}>
                      Option {index + 1}
                    </Badge>
                  </div>
                  <div className="font-bold text-lg">{itinerary.destination}</div>
                  <div className="text-sm">${itinerary.totalCost.toLocaleString()}</div>
                </TabsTrigger>
              ))}
            </TabsList>

            {itineraries.map((itinerary, index) => (
              <TabsContent key={index} value={index.toString()} className="space-y-6">
                {/* Overview Card */}
                <Card className="border-2 border-purple-200">
                  <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-3xl mb-2">{itinerary.destination}</CardTitle>
                        <CardDescription className="text-base">
                          {preferences.duration} days • {preferences.month} • From {preferences.departingFrom}
                        </CardDescription>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-600">Total Cost</div>
                        <div className="text-3xl font-bold text-purple-600">${itinerary.totalCost.toLocaleString()}</div>
                        <Button 
                          onClick={() => downloadPDF(itinerary)} 
                          size="sm" 
                          className="mt-2 bg-purple-600 hover:bg-purple-700"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Download PDF
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                      {itinerary.highlights.map((highlight, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                          <span className="text-sm">{highlight}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Flight Details */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Plane className="w-6 h-6 text-purple-600" />
                      Flight Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-semibold text-lg">{itinerary.flight.airline}</div>
                          <div className="text-sm text-gray-600">{itinerary.flight.class} Class</div>
                        </div>
                        <Badge className="bg-green-600">${itinerary.flight.price.toLocaleString()}</Badge>
                      </div>
                      <Separator />
                      <div className="grid md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <div className="text-gray-600">Departure</div>
                          <div className="font-semibold">{itinerary.flight.departureTime}</div>
                          <div className="text-xs text-gray-500">{preferences.departingFrom}</div>
                        </div>
                        <div className="text-center">
                          <div className="text-gray-600">Duration</div>
                          <div className="font-semibold flex items-center justify-center gap-1">
                            <Clock className="w-4 h-4" />
                            {itinerary.flight.duration}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-gray-600">Arrival</div>
                          <div className="font-semibold">{itinerary.flight.arrivalTime}</div>
                          <div className="text-xs text-gray-500">{itinerary.destination}</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Hotel Details */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Hotel className="w-6 h-6 text-purple-600" />
                      Accommodation
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-semibold text-lg">{itinerary.hotel.name}</div>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="flex">
                              {Array.from({ length: Math.floor(itinerary.hotel.rating) }).map((_, i) => (
                                <span key={i} className="text-yellow-500">★</span>
                              ))}
                              {itinerary.hotel.rating % 1 !== 0 && <span className="text-yellow-500">½</span>}
                            </div>
                            <span className="text-sm text-gray-600">• {itinerary.hotel.location}</span>
                          </div>
                        </div>
                        <Badge className="bg-green-600">${itinerary.hotel.totalPrice.toLocaleString()}</Badge>
                      </div>
                      <Separator />
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <div className="text-sm text-gray-600 mb-2">Price Breakdown</div>
                          <div className="space-y-1 text-sm">
                            <div className="flex justify-between">
                              <span>${itinerary.hotel.pricePerNight}/night</span>
                              <span>× {itinerary.hotel.totalNights} nights</span>
                            </div>
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-600 mb-2">Amenities</div>
                          <div className="flex flex-wrap gap-2">
                            {itinerary.hotel.amenities.map((amenity, i) => (
                              <Badge key={i} variant="outline" className="text-xs">
                                {amenity}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Activities */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="w-6 h-6 text-purple-600" />
                      Included Activities
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {itinerary.activities.map((activity, i) => (
                        <div key={i} className="border-l-4 border-purple-600 pl-4 py-2">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <Badge variant="outline">Day {activity.day}</Badge>
                                <span className="font-semibold">{activity.title}</span>
                              </div>
                              <p className="text-sm text-gray-600">{activity.description}</p>
                              <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                                <Clock className="w-3 h-3" />
                                {activity.duration}
                              </div>
                            </div>
                            <Badge className="bg-green-600 ml-4">${activity.price}</Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Day-by-Day Itinerary */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="w-6 h-6 text-purple-600" />
                      Day-by-Day Itinerary
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {itinerary.dailyItinerary.map((day, i) => (
                        <div key={i} className="relative">
                          <div className="flex items-start gap-4">
                            <div className="flex-shrink-0">
                              <div className="w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold">
                                {day.day}
                              </div>
                            </div>
                            <div className="flex-1 space-y-3">
                              <div>
                                <div className="text-sm font-semibold text-purple-600">Morning</div>
                                <p className="text-sm text-gray-700">{day.morning}</p>
                              </div>
                              <div>
                                <div className="text-sm font-semibold text-purple-600">Afternoon</div>
                                <p className="text-sm text-gray-700">{day.afternoon}</p>
                              </div>
                              <div>
                                <div className="text-sm font-semibold text-purple-600">Evening</div>
                                <p className="text-sm text-gray-700">{day.evening}</p>
                              </div>
                            </div>
                          </div>
                          {i < itinerary.dailyItinerary.length - 1 && (
                            <div className="absolute left-6 top-16 bottom-0 w-0.5 bg-gray-200" />
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Cost Breakdown */}
                <Card className="border-2 border-purple-200">
                  <CardHeader className="bg-purple-50">
                    <CardTitle className="flex items-center gap-2">
                      <DollarSign className="w-6 h-6 text-purple-600" />
                      Cost Breakdown
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span>Round-trip Flight ({itinerary.flight.class})</span>
                        <span className="font-semibold">${itinerary.flight.price.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Accommodation ({itinerary.hotel.totalNights} nights)</span>
                        <span className="font-semibold">${itinerary.hotel.totalPrice.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Activities & Experiences ({itinerary.activities.length} included)</span>
                        <span className="font-semibold">${itinerary.activities.reduce((sum, a) => sum + a.price, 0).toLocaleString()}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between text-lg font-bold text-purple-600">
                        <span>Total</span>
                        <span>${itinerary.totalCost.toLocaleString()}</span>
                      </div>
                      <div className="text-xs text-gray-500 text-center pt-2">
                        * Prices are estimates and may vary. Food and personal expenses not included.
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>

          {/* Action Buttons */}
          <div className="mt-8 flex gap-4 justify-center">
            <Link to="/surprise">
              <Button variant="outline" size="lg">
                Create New Itineraries
              </Button>
            </Link>
            <Button size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
              Book This Trip
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
