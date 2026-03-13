import * as React from "react";

import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { Plane, ArrowLeft, Sparkles, Sliders, Info, AlertCircle } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Label } from "../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Slider } from "../components/ui/slider";
import { Badge } from "../components/ui/badge";
import { Alert, AlertDescription } from "../components/ui/alert";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../components/ui/tooltip";
import { getVisaRequirement, passportOptions, getVisaRequirementColor, getVisaRequirementLabel, type VisaRequirement } from "../services/visaService";
import { estimateBudget, getBudgetCategory } from "../services/budgetEstimator";

const destinations = [
  "Bali, Indonesia",
  "Bangkok, Thailand",
  "Barcelona, Spain",
  "Budapest, Hungary",
  "Cancún, Mexico",
  "Cape Town, South Africa",
  "Cusco, Peru",
  "Hanoi, Vietnam",
  "Istanbul, Turkey",
  "Lisbon, Portugal",
  "Marrakech, Morocco",
  "Prague, Czech Republic",
  "Rio de Janeiro, Brazil",
  "Rome, Italy",
  "Santorini, Greece",
];

const departingCities = [
  "New York, NY (JFK)",
  "Los Angeles, CA (LAX)",
  "Chicago, IL (ORD)",
  "Houston, TX (IAH)",
  "Miami, FL (MIA)",
  "San Francisco, CA (SFO)",
  "Boston, MA (BOS)",
  "Seattle, WA (SEA)",
  "Atlanta, GA (ATL)",
  "Dallas, TX (DFW)",
  "London, UK (LHR)",
  "Toronto, Canada (YYZ)",
  "Sydney, Australia (SYD)",
  "Tokyo, Japan (NRT)",
  "Singapore (SIN)",
  "Dubai, UAE (DXB)",
];

const travelStyles = [
  "Backpacker",
  "Budget Comfort",
  "Mid-Range",
  "Flashpacker",
  "Adventure Seeker",
  "Culture Enthusiast",
  "Foodie Explorer",
  "Beach Lover",
];

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export function PlanTrip() {
  const navigate = useNavigate();
  const [planMode, setPlanMode] = useState<"select" | "surprise" | "build" | null>(null);
  const [formData, setFormData] = useState({
    destination: "",
    departingFrom: "",
    budget: 1500,
    travelStyle: "",
    duration: 7,
    month: "",
    passport: "",
  });
  const [visaInfo, setVisaInfo] = useState<VisaRequirement | null>(null);
  const [budgetEstimate, setBudgetEstimate] = useState<{ recommended: number; minimum: number; comfortable: number; breakdown: any } | null>(null);

  const handleSubmit = (e: React.FormEvent, mode: "surprise" | "build") => {
    e.preventDefault();
    
    // Store form data in sessionStorage
    sessionStorage.setItem("tripPreferences", JSON.stringify({ ...formData, mode }));
    
    // Navigate based on mode
    if (mode === "surprise") {
      navigate("/results");
    } else {
      navigate("/build");
    }
  };

  useEffect(() => {
    if (formData.destination && formData.passport) {
      const visaRequirement = getVisaRequirement(formData.destination, formData.passport);
      setVisaInfo(visaRequirement);
    } else {
      setVisaInfo(null);
    }
  }, [formData.destination, formData.passport]);

  useEffect(() => {
    if (formData.destination && formData.duration && formData.month) {
      const estimate = estimateBudget(formData.destination, formData.duration, formData.month);
      setBudgetEstimate(estimate);
      
      // Set budget to recommended if not already set
      if (formData.budget === 1500) {
        setFormData(prev => ({ ...prev, budget: estimate.recommended }));
      }
    }
  }, [formData.destination, formData.duration, formData.month]);

  if (!planMode) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        {/* Header */}
        <header className="border-b bg-white/80 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <Plane className="w-8 h-8 text-blue-600" />
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Travdget
              </span>
            </Link>
            <Link to="/">
              <Button variant="ghost">
                <ArrowLeft className="mr-2 w-4 h-4" />
                Back to Home
              </Button>
            </Link>
          </div>
        </header>

        {/* Mode Selection */}
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold mb-4">How would you like to plan?</h1>
              <p className="text-xl text-gray-600">Choose your planning style</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Surprise Me Card */}
              <Card className="cursor-pointer hover:shadow-xl transition-shadow border-2 hover:border-purple-600" onClick={() => navigate("/surprise")}>
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                      <Sparkles className="w-10 h-10 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold">Surprise Me!</h2>
                    <p className="text-gray-600">
                      Let us create the perfect itinerary for you based on your preferences. 
                      We'll select the best flights, hotels, and activities within your budget.
                    </p>
                    <ul className="text-sm text-left space-y-2 w-full">
                      <li className="flex items-start gap-2">
                        <span className="text-green-600">✓</span>
                        <span>Fully curated itineraries</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-600">✓</span>
                        <span>Best value recommendations</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-600">✓</span>
                        <span>Quick and easy planning</span>
                      </li>
                    </ul>
                    <Button className="w-full" size="lg">
                      Choose Surprise Me
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Build My Own Card */}
              <Card className="cursor-pointer hover:shadow-xl transition-shadow border-2 hover:border-blue-600" onClick={() => setPlanMode("build")}>
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-full flex items-center justify-center">
                      <Sliders className="w-10 h-10 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold">Build My Own</h2>
                    <p className="text-gray-600">
                      Take full control! Choose your own flights, hotels, and activities. 
                      Watch your budget in real-time as you build your perfect trip.
                    </p>
                    <ul className="text-sm text-left space-y-2 w-full">
                      <li className="flex items-start gap-2">
                        <span className="text-green-600">✓</span>
                        <span>Full customization</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-600">✓</span>
                        <span>Real-time budget tracking</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-600">✓</span>
                        <span>Compare all options</span>
                      </li>
                    </ul>
                    <Button className="w-full" size="lg" variant="outline">
                      Choose Build My Own
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const recommendedBudgetPercent = budgetEstimate 
    ? ((budgetEstimate.recommended - 500) / (10000 - 500)) * 100
    : 10;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Plane className="w-8 h-8 text-blue-600" />
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Travdget
            </span>
          </Link>
          <Link to="/">
            <Button variant="ghost">
              <ArrowLeft className="mr-2 w-4 h-4" />
              Back to Home
            </Button>
          </Link>
        </div>
      </header>

      {/* Form Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-3xl">Plan Your Dream Trip</CardTitle>
              <CardDescription>
                Tell us about your travel preferences and we'll create personalized itineraries for you
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={(e) => handleSubmit(e, planMode!)} className="space-y-6">
                {/* Row 1: Dream Destination */}
                <div className="space-y-2">
                  <Label htmlFor="destination" className="flex items-center gap-2">
                    Dream Destination <Plane className="w-4 h-4 text-blue-600" />
                  </Label>
                  <Select
                    value={formData.destination}
                    onValueChange={(value) => setFormData({ ...formData, destination: value })}
                  >
                    <SelectTrigger id="destination">
                      <SelectValue placeholder="Select a destination" />
                    </SelectTrigger>
                    <SelectContent>
                      {destinations.map((dest) => (
                        <SelectItem key={dest} value={dest}>
                          {dest}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Row 2: Preferred Travel Month | Travel Style */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="month" className="flex items-center gap-2">
                      Preferred Travel Month <Plane className="w-4 h-4 text-blue-600" />
                    </Label>
                    <Select
                      value={formData.month}
                      onValueChange={(value) => setFormData({ ...formData, month: value })}
                    >
                      <SelectTrigger id="month">
                        <SelectValue placeholder="Select travel month" />
                      </SelectTrigger>
                      <SelectContent>
                        {months.map((month) => (
                          <SelectItem key={month} value={month}>
                            {month}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="travelStyle" className="flex items-center gap-2">
                      Travel Style <Plane className="w-4 h-4 text-blue-600" />
                    </Label>
                    <Select
                      value={formData.travelStyle}
                      onValueChange={(value) => setFormData({ ...formData, travelStyle: value })}
                    >
                      <SelectTrigger id="travelStyle">
                        <SelectValue placeholder="Select your travel style" />
                      </SelectTrigger>
                      <SelectContent>
                        {travelStyles.map((style) => (
                          <SelectItem key={style} value={style}>
                            {style}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Row 3: Departing From | Visa/Passport */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="departingFrom" className="flex items-center gap-2">
                      Departing From <Plane className="w-4 h-4 text-blue-600" />
                    </Label>
                    <Select
                      value={formData.departingFrom}
                      onValueChange={(value) => setFormData({ ...formData, departingFrom: value })}
                    >
                      <SelectTrigger id="departingFrom">
                        <SelectValue placeholder="Select departure city" />
                      </SelectTrigger>
                      <SelectContent>
                        {departingCities.map((city) => (
                          <SelectItem key={city} value={city}>
                            {city}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="passport" className="flex items-center gap-2">
                      Passport/Visa (Optional)
                    </Label>
                    <Select
                      value={formData.passport}
                      onValueChange={(value) => setFormData({ ...formData, passport: value })}
                    >
                      <SelectTrigger id="passport">
                        <SelectValue placeholder="Select passport type" />
                      </SelectTrigger>
                      <SelectContent>
                        {passportOptions.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Visa Information Alert */}
                {visaInfo && (
                  <Alert className={`${visaInfo.requirement === "visa_free" ? "border-green-500 bg-green-50" : "border-yellow-500 bg-yellow-50"}`}>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Badge className={getVisaRequirementColor(visaInfo.requirement)}>
                            {getVisaRequirementLabel(visaInfo.requirement)}
                          </Badge>
                          {visaInfo.duration && (
                            <span className="text-sm text-gray-600">Up to {visaInfo.duration}</span>
                          )}
                        </div>
                        <p className="text-sm">{visaInfo.details}</p>
                        {visaInfo.applicationUrl && (
                          <a 
                            href={visaInfo.applicationUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:underline inline-flex items-center gap-1"
                          >
                            Apply for visa →
                          </a>
                        )}
                      </div>
                    </AlertDescription>
                  </Alert>
                )}

                {/* Row 4: Trip Duration */}
                <div className="space-y-2">
                  <Label htmlFor="duration">Trip Duration (days)</Label>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-purple-600">{formData.duration} days</span>
                    </div>
                    <Slider
                      id="duration"
                      min={3}
                      max={30}
                      step={1}
                      value={[formData.duration]}
                      onValueChange={(value) => setFormData({ ...formData, duration: value[0] })}
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>3 days</span>
                      <span>30 days</span>
                    </div>
                  </div>
                </div>

                {/* Row 5: Budget with Recommended Amount */}
                <div className="space-y-2">
                  <Label htmlFor="budget" className="flex items-center gap-2">
                    Budget (USD)
                    {budgetEstimate && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="w-4 h-4 text-gray-400 cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent className="max-w-xs">
                            <div className="space-y-2">
                              <p className="font-semibold">Budget Recommendations for {formData.destination}</p>
                              <div className="space-y-1 text-sm">
                                <p>• Minimum: <span className="font-semibold">${budgetEstimate.minimum}</span></p>
                                <p>• Recommended: <span className="font-semibold text-blue-600">${budgetEstimate.recommended}</span></p>
                                <p>• Comfortable: <span className="font-semibold">${budgetEstimate.comfortable}</span></p>
                              </div>
                              <div className="pt-2 border-t mt-2 space-y-1 text-xs">
                                <p>Breakdown (recommended):</p>
                                <p>Flights: ${budgetEstimate.breakdown.flights}</p>
                                <p>Accommodation: ${budgetEstimate.breakdown.accommodation}</p>
                                <p>Food: ${budgetEstimate.breakdown.food}</p>
                                <p>Activities: ${budgetEstimate.breakdown.activities}</p>
                              </div>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </Label>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-blue-600">${formData.budget}</span>
                      {budgetEstimate && (
                        <Badge variant="outline" className="text-xs">
                          {getBudgetCategory(formData.budget, budgetEstimate)}
                        </Badge>
                      )}
                    </div>
                    <div className="relative">
                      <Slider
                        id="budget"
                        min={500}
                        max={10000}
                        step={100}
                        value={[formData.budget]}
                        onValueChange={(value) => setFormData({ ...formData, budget: value[0] })}
                      />
                      {/* Recommended budget marker */}
                      {budgetEstimate && (
                        <div 
                          className="absolute top-0 w-0.5 h-6 bg-green-500 -mt-1"
                          style={{ left: `${recommendedBudgetPercent}%` }}
                        >
                          <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                            <Plane className="w-4 h-4 text-green-500" />
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>$500</span>
                      {budgetEstimate && (
                        <span className="text-green-600">
                          <Plane className="w-3 h-3 inline mr-1" />
                          Recommended: ${budgetEstimate.recommended}
                        </span>
                      )}
                      <span>$10,000</span>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <Button 
                  type="submit" 
                  size="lg" 
                  className="w-full"
                  disabled={!formData.destination || !formData.departingFrom || !formData.travelStyle || !formData.month}
                >
                  {planMode === "surprise" ? "Surprise Me with Itineraries" : "Start Building My Trip"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}