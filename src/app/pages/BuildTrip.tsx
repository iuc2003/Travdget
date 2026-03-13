import * as React from "react";

import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { Plane, ArrowLeft, DollarSign, Check, X } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Progress } from "../components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Separator } from "../components/ui/separator";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";
import { Label } from "../components/ui/label";
import { Checkbox } from "../components/ui/checkbox";
import { getFlightOptions, formatFlightDate } from "../services/flightService";
import { getAmadeusFlights, getAmadeusHotels, type AmadeusFlightOption, type AmadeusHotel } from "../services/amadeusService";
import { getCostEstimates, type CostEstimate } from "../services/numbeoService";
import { getActivities, type Activity } from "../services/tripAdvisorService";

interface TripPreferences {
  destination: string;
  budget: number;
  travelStyle: string;
  duration: number;
  month: string;
  mode: string;
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
  source: "skyscanner" | "amadeus";
}

export function BuildTrip() {
  const navigate = useNavigate();
  const [preferences, setPreferences] = useState<TripPreferences | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [remainingBudget, setRemainingBudget] = useState(0);
  const [selectedItems, setSelectedItems] = useState({
    flight: null as FlightOption | null,
    hotel: null as AmadeusHotel | null,
    activities: [] as Activity[],
  });

  const [flightOptions, setFlightOptions] = useState<FlightOption[]>([]);
  const [hotelOptions, setHotelOptions] = useState<AmadeusHotel[]>([]);
  const [activityOptions, setActivityOptions] = useState<Activity[]>([]);
  const [costEstimates, setCostEstimates] = useState<CostEstimate | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = sessionStorage.getItem("tripPreferences");
    if (stored) {
      const prefs = JSON.parse(stored) as TripPreferences;
      setPreferences(prefs);
      setRemainingBudget(prefs.budget);
      loadOptions(prefs);
    } else {
      navigate("/plan");
    }
  }, [navigate]);

  const loadOptions = async (prefs: TripPreferences) => {
    setLoading(true);
    try {
      const [skyFlights, amadeusFlights, hotels, activities, costs] = await Promise.all([
        getFlightOptions(prefs.destination, prefs.month, prefs.duration),
        getAmadeusFlights(prefs.destination, prefs.month, prefs.duration),
        getAmadeusHotels(prefs.destination, prefs.duration, prefs.budget),
        getActivities(prefs.destination, prefs.travelStyle),
        getCostEstimates(prefs.destination),
      ]);

      const skyFlightsWithSource = skyFlights.map(f => ({ ...f, source: "skyscanner" as const }));
      const amadeusFlightsWithSource = amadeusFlights.map(f => ({ ...f, source: "amadeus" as const }));
      
      setFlightOptions([...skyFlightsWithSource, ...amadeusFlightsWithSource]);
      setHotelOptions(hotels);
      setActivityOptions(activities);
      setCostEstimates(costs);
    } catch (error) {
      console.error("Error loading options:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateTotal = () => {
    let total = 0;
    if (selectedItems.flight) total += selectedItems.flight.price;
    if (selectedItems.hotel) total += selectedItems.hotel.totalPrice;
    selectedItems.activities.forEach(act => total += act.price);
    return total;
  };

  const handleFlightSelect = (flight: FlightOption) => {
    const previousPrice = selectedItems.flight?.price || 0;
    setSelectedItems({ ...selectedItems, flight });
    setRemainingBudget(preferences!.budget - (calculateTotal() - previousPrice + flight.price));
  };

  const handleHotelSelect = (hotel: AmadeusHotel) => {
    const previousPrice = selectedItems.hotel?.totalPrice || 0;
    setSelectedItems({ ...selectedItems, hotel });
    setRemainingBudget(preferences!.budget - (calculateTotal() - previousPrice + hotel.totalPrice));
  };

  const handleActivityToggle = (activity: Activity, checked: boolean) => {
    let newActivities;
    if (checked) {
      newActivities = [...selectedItems.activities, activity];
    } else {
      newActivities = selectedItems.activities.filter(a => a.id !== activity.id);
    }
    
    setSelectedItems({ ...selectedItems, activities: newActivities });
    
    let total = 0;
    if (selectedItems.flight) total += selectedItems.flight.price;
    if (selectedItems.hotel) total += selectedItems.hotel.totalPrice;
    newActivities.forEach(act => total += act.price);
    setRemainingBudget(preferences!.budget - total);
  };

  const handleFinalize = () => {
    sessionStorage.setItem("customItinerary", JSON.stringify(selectedItems));
    navigate("/results");
  };

  if (!preferences || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
        <div className="text-center">
          <Plane className="w-16 h-16 text-blue-600 animate-bounce mx-auto mb-4" />
          <p className="text-xl">Loading options...</p>
        </div>
      </div>
    );
  }

  const steps = ["Flights", "Hotels", "Activities", "Review"];
  const totalSpent = calculateTotal();
  const budgetPercentage = (totalSpent / preferences.budget) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <Link to="/" className="flex items-center gap-2">
              <Plane className="w-8 h-8 text-blue-600" />
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Travdget
              </span>
            </Link>
            <Link to="/plan">
              <Button variant="ghost">
                <ArrowLeft className="mr-2 w-4 h-4" />
                Start Over
              </Button>
            </Link>
          </div>

          {/* Budget Tracker */}
          <Card>
            <CardContent className="pt-4 pb-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-600">Budget Remaining</p>
                    <p className={`text-3xl font-bold ${remainingBudget < 0 ? 'text-red-600' : 'text-green-600'}`}>
                      ${remainingBudget.toFixed(0)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Total Budget</p>
                    <p className="text-2xl font-bold text-gray-800">${preferences.budget}</p>
                  </div>
                </div>
                <Progress value={Math.min(budgetPercentage, 100)} className="h-3" />
                <div className="flex justify-between text-xs text-gray-600">
                  <span>Spent: ${totalSpent.toFixed(0)}</span>
                  <span>{budgetPercentage.toFixed(0)}% of budget</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <Tabs value={steps[currentStep]} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            {steps.map((step, index) => (
              <TabsTrigger
                key={step}
                value={step}
                onClick={() => setCurrentStep(index)}
                disabled={index > currentStep}
              >
                {step}
                {index < currentStep && <Check className="ml-2 w-4 h-4" />}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Flights Tab */}
          <TabsContent value="Flights" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Choose Your Flight</h2>
              <p className="text-gray-600 mb-6">Compare 6 flight options from Skyscanner and Amadeus</p>
              
              <div className="grid gap-4">
                <RadioGroup value={selectedItems.flight?.id || ""} onValueChange={(id) => {
                  const flight = flightOptions.find(f => f.id === id);
                  if (flight) handleFlightSelect(flight);
                }}>
                  {flightOptions.map((flight) => (
                    <Card key={flight.id} className={`cursor-pointer transition-all ${selectedItems.flight?.id === flight.id ? 'border-2 border-blue-600 shadow-lg' : 'hover:shadow-md'}`}>
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 flex-1">
                            <RadioGroupItem value={flight.id} id={flight.id} />
                            <Label htmlFor={flight.id} className="flex-1 cursor-pointer">
                              <div className="grid md:grid-cols-4 gap-4 items-center">
                                <div>
                                  <Badge className="mb-2" variant={flight.source === "skyscanner" ? "default" : "secondary"}>
                                    {flight.source === "skyscanner" ? "Skyscanner" : "Amadeus"}
                                  </Badge>
                                  <p className="font-semibold">{flight.airline}</p>
                                  <p className="text-sm text-gray-600">{flight.duration}</p>
                                </div>
                                <div>
                                  <p className="text-sm font-medium">Outbound</p>
                                  <p className="text-sm text-gray-600">{formatFlightDate(flight.outboundDate)}</p>
                                </div>
                                <div>
                                  <p className="text-sm font-medium">Return</p>
                                  <p className="text-sm text-gray-600">{formatFlightDate(flight.returnDate)}</p>
                                </div>
                                <div className="text-right">
                                  <p className="text-sm text-gray-600">{flight.stops === 0 ? "Non-stop" : `${flight.stops} stop${flight.stops > 1 ? 's' : ''}`}</p>
                                  <p className="text-2xl font-bold text-blue-600">${flight.price}</p>
                                </div>
                              </div>
                            </Label>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </RadioGroup>
              </div>

              <Button
                className="mt-6 w-full md:w-auto"
                size="lg"
                onClick={() => setCurrentStep(1)}
                disabled={!selectedItems.flight}
              >
                Continue to Hotels
              </Button>
            </div>
          </TabsContent>

          {/* Hotels Tab */}
          <TabsContent value="Hotels" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Choose Your Hotel</h2>
              <p className="text-gray-600 mb-6">Select accommodation from Amadeus Hotel Search</p>
              
              <div className="grid gap-4">
                <RadioGroup value={selectedItems.hotel?.id || ""} onValueChange={(id) => {
                  const hotel = hotelOptions.find(h => h.id === id);
                  if (hotel) handleHotelSelect(hotel);
                }}>
                  {hotelOptions.map((hotel) => (
                    <Card key={hotel.id} className={`cursor-pointer transition-all ${selectedItems.hotel?.id === hotel.id ? 'border-2 border-blue-600 shadow-lg' : 'hover:shadow-md'}`}>
                      <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                          <RadioGroupItem value={hotel.id} id={hotel.id} />
                          <Label htmlFor={hotel.id} className="flex-1 cursor-pointer">
                            <div className="grid md:grid-cols-3 gap-4 items-center">
                              <div>
                                <p className="font-semibold text-lg">{hotel.name}</p>
                                <p className="text-sm text-gray-600">{hotel.address}</p>
                                <div className="flex items-center gap-1 mt-1">
                                  {[...Array(hotel.rating)].map((_, i) => (
                                    <span key={i} className="text-yellow-500">★</span>
                                  ))}
                                </div>
                              </div>
                              <div>
                                <p className="text-sm text-gray-600">Amenities</p>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {hotel.amenities.slice(0, 3).map((amenity, i) => (
                                    <Badge key={i} variant="outline" className="text-xs">{amenity}</Badge>
                                  ))}
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-sm text-gray-600">${hotel.pricePerNight}/night × {preferences.duration} nights</p>
                                <p className="text-2xl font-bold text-blue-600">${hotel.totalPrice}</p>
                              </div>
                            </div>
                          </Label>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </RadioGroup>
              </div>

              <div className="flex gap-4 mt-6">
                <Button variant="outline" onClick={() => setCurrentStep(0)}>
                  Back to Flights
                </Button>
                <Button
                  onClick={() => setCurrentStep(2)}
                  disabled={!selectedItems.hotel}
                >
                  Continue to Activities
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* Activities Tab */}
          <TabsContent value="Activities" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Choose Your Activities</h2>
              <p className="text-gray-600 mb-6">Select activities from TripAdvisor (you can choose multiple)</p>
              
              <div className="grid md:grid-cols-2 gap-4">
                {activityOptions.map((activity) => {
                  const isSelected = selectedItems.activities.some(a => a.id === activity.id);
                  return (
                    <Card key={activity.id} className={`cursor-pointer transition-all ${isSelected ? 'border-2 border-blue-600 shadow-lg' : 'hover:shadow-md'}`}>
                      <CardContent className="pt-6">
                        <div className="flex items-start gap-4">
                          <Checkbox
                            id={activity.id}
                            checked={isSelected}
                            onCheckedChange={(checked) => handleActivityToggle(activity, checked as boolean)}
                          />
                          <Label htmlFor={activity.id} className="flex-1 cursor-pointer">
                            <div className="space-y-2">
                              <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                  <p className="font-semibold">{activity.name}</p>
                                  <Badge variant="outline" className="mt-1">{activity.category}</Badge>
                                </div>
                                <p className="text-xl font-bold text-blue-600">${activity.price}</p>
                              </div>
                              <p className="text-sm text-gray-600">{activity.description}</p>
                              <div className="flex items-center gap-4 text-sm">
                                <span className="flex items-center gap-1">
                                  <span className="text-yellow-500">★</span>
                                  {activity.rating} ({activity.reviewCount})
                                </span>
                                <span className="text-gray-600">{activity.duration}</span>
                              </div>
                              <div className="flex flex-wrap gap-1">
                                {activity.highlights.slice(0, 3).map((highlight, i) => (
                                  <Badge key={i} variant="secondary" className="text-xs">{highlight}</Badge>
                                ))}
                              </div>
                            </div>
                          </Label>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              <div className="flex gap-4 mt-6">
                <Button variant="outline" onClick={() => setCurrentStep(1)}>
                  Back to Hotels
                </Button>
                <Button onClick={() => setCurrentStep(3)}>
                  Continue to Review
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* Review Tab */}
          <TabsContent value="Review" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Review Your Trip</h2>
              <p className="text-gray-600 mb-6">Final review of your custom itinerary</p>

              <div className="grid lg:grid-cols-2 gap-6">
                {/* Summary Card */}
                <Card>
                  <CardHeader>
                    <CardTitle>Trip Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Flight */}
                    {selectedItems.flight && (
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold flex items-center gap-2">
                            <Plane className="w-4 h-4" />
                            Flight
                          </h3>
                          <Button variant="ghost" size="sm" onClick={() => setCurrentStep(0)}>Edit</Button>
                        </div>
                        <div className="bg-gray-50 rounded p-3 space-y-1">
                          <p className="text-sm font-medium">{selectedItems.flight.airline}</p>
                          <p className="text-sm text-gray-600">{formatFlightDate(selectedItems.flight.outboundDate)} - {formatFlightDate(selectedItems.flight.returnDate)}</p>
                          <p className="text-sm font-semibold">${selectedItems.flight.price}</p>
                        </div>
                      </div>
                    )}

                    <Separator />

                    {/* Hotel */}
                    {selectedItems.hotel && (
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold">Hotel</h3>
                          <Button variant="ghost" size="sm" onClick={() => setCurrentStep(1)}>Edit</Button>
                        </div>
                        <div className="bg-gray-50 rounded p-3 space-y-1">
                          <p className="text-sm font-medium">{selectedItems.hotel.name}</p>
                          <p className="text-sm text-gray-600">{preferences.duration} nights</p>
                          <p className="text-sm font-semibold">${selectedItems.hotel.totalPrice}</p>
                        </div>
                      </div>
                    )}

                    <Separator />

                    {/* Activities */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold">Activities ({selectedItems.activities.length})</h3>
                        <Button variant="ghost" size="sm" onClick={() => setCurrentStep(2)}>Edit</Button>
                      </div>
                      <div className="space-y-2">
                        {selectedItems.activities.map(activity => (
                          <div key={activity.id} className="bg-gray-50 rounded p-3">
                            <div className="flex justify-between items-start">
                              <p className="text-sm font-medium flex-1">{activity.name}</p>
                              <p className="text-sm font-semibold">${activity.price}</p>
                            </div>
                          </div>
                        ))}
                        {selectedItems.activities.length === 0 && (
                          <p className="text-sm text-gray-500 italic">No activities selected</p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Cost Breakdown */}
                <Card>
                  <CardHeader>
                    <CardTitle>Cost Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Flight</span>
                        <span className="font-semibold">${selectedItems.flight?.price || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Hotel</span>
                        <span className="font-semibold">${selectedItems.hotel?.totalPrice || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Activities</span>
                        <span className="font-semibold">
                          ${selectedItems.activities.reduce((sum, a) => sum + a.price, 0)}
                        </span>
                      </div>
                      <Separator />
                      <div className="flex justify-between text-lg">
                        <span className="font-bold">Total</span>
                        <span className="font-bold text-blue-600">${totalSpent}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className={remainingBudget >= 0 ? "text-green-600" : "text-red-600"}>
                          {remainingBudget >= 0 ? "Under Budget" : "Over Budget"}
                        </span>
                        <span className={`font-semibold ${remainingBudget >= 0 ? "text-green-600" : "text-red-600"}`}>
                          ${Math.abs(remainingBudget)}
                        </span>
                      </div>
                    </div>

                    {costEstimates && (
                      <>
                        <Separator />
                        <div>
                          <h4 className="font-semibold mb-2">Estimated Daily Costs in {preferences.destination}</h4>
                          <div className="space-y-1 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Budget meal</span>
                              <span>${costEstimates.mealInexpensive}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Mid-range meal</span>
                              <span>${costEstimates.mealMidRange}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Public transport</span>
                              <span>${costEstimates.publicTransportTicket}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Cappuccino</span>
                              <span>${costEstimates.cappuccino}</span>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              </div>

              <div className="flex gap-4 mt-6">
                <Button variant="outline" onClick={() => setCurrentStep(2)}>
                  Back to Activities
                </Button>
                <Button
                  size="lg"
                  onClick={handleFinalize}
                  disabled={!selectedItems.flight || !selectedItems.hotel}
                  className="flex-1"
                >
                  Finalize My Trip
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
