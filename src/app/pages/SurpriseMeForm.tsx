import * as React from "react";

import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Plane, ArrowLeft, Sparkles, X } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Label } from "../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Slider } from "../components/ui/slider";
import { Badge } from "../components/ui/badge";

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

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export function SurpriseMeForm() {
  const navigate = useNavigate();
  const [selectedDestinations, setSelectedDestinations] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    departingFrom: "",
    budget: 2000,
    duration: 7,
    month: "",
  });

  const handleDestinationToggle = (destination: string) => {
    if (selectedDestinations.includes(destination)) {
      setSelectedDestinations(selectedDestinations.filter(d => d !== destination));
    } else {
      setSelectedDestinations([...selectedDestinations, destination]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Store form data in sessionStorage
    sessionStorage.setItem("surpriseMePreferences", JSON.stringify({
      destinations: selectedDestinations,
      ...formData,
    }));
    
    // Navigate to surprise me results
    navigate("/surprise-results");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Plane className="w-8 h-8 text-purple-600" />
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Travdget
            </span>
          </Link>
          <Link to="/plan">
            <Button variant="ghost">
              <ArrowLeft className="mr-2 w-4 h-4" />
              Back
            </Button>
          </Link>
        </div>
      </header>

      {/* Form Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <Card className="border-2 border-purple-200">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-3xl">Surprise Me!</CardTitle>
                  <CardDescription className="text-base">
                    We'll create three amazing itineraries based on your preferences
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Dream Destinations - Multiple Selection */}
                <div className="space-y-3">
                  <Label className="flex items-center gap-2 text-base">
                    Dream Destinations <Plane className="w-4 h-4 text-purple-600" />
                    <span className="text-sm text-gray-500">(Select multiple)</span>
                  </Label>
                  <div className="p-4 border rounded-lg bg-gray-50 min-h-[100px]">
                    {selectedDestinations.length === 0 ? (
                      <p className="text-gray-400 text-sm">Click destinations below to select...</p>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {selectedDestinations.map((dest) => (
                          <Badge 
                            key={dest} 
                            className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 cursor-pointer"
                            onClick={() => handleDestinationToggle(dest)}
                          >
                            {dest}
                            <X className="w-3 h-3 ml-2" />
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {destinations.map((dest) => (
                      <Button
                        key={dest}
                        type="button"
                        variant={selectedDestinations.includes(dest) ? "default" : "outline"}
                        size="sm"
                        className={selectedDestinations.includes(dest) ? "bg-purple-600 hover:bg-purple-700" : ""}
                        onClick={() => handleDestinationToggle(dest)}
                      >
                        {dest}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Travel Month */}
                <div className="space-y-2">
                  <Label htmlFor="month" className="flex items-center gap-2 text-base">
                    Preferred Travel Month <Plane className="w-4 h-4 text-purple-600" />
                  </Label>
                  <Select
                    value={formData.month}
                    onValueChange={(value) => setFormData({ ...formData, month: value })}
                  >
                    <SelectTrigger id="month" className="h-12">
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

                {/* Number of Days */}
                <div className="space-y-2">
                  <Label htmlFor="duration" className="flex items-center gap-2 text-base">
                    Number of Days <Plane className="w-4 h-4 text-purple-600" />
                  </Label>
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

                {/* Departure Airport */}
                <div className="space-y-2">
                  <Label htmlFor="departingFrom" className="flex items-center gap-2 text-base">
                    Departure Airport <Plane className="w-4 h-4 text-purple-600" />
                  </Label>
                  <Select
                    value={formData.departingFrom}
                    onValueChange={(value) => setFormData({ ...formData, departingFrom: value })}
                  >
                    <SelectTrigger id="departingFrom" className="h-12">
                      <SelectValue placeholder="Select departure airport" />
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

                {/* Budget */}
                <div className="space-y-2">
                  <Label htmlFor="budget" className="flex items-center gap-2 text-base">
                    Budget (USD) <Plane className="w-4 h-4 text-purple-600" />
                  </Label>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-purple-600">${formData.budget}</span>
                    </div>
                    <Slider
                      id="budget"
                      min={500}
                      max={10000}
                      step={100}
                      value={[formData.budget]}
                      onValueChange={(value) => setFormData({ ...formData, budget: value[0] })}
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>$500</span>
                      <span>$10,000</span>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <Button 
                  type="submit" 
                  size="lg" 
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-lg py-6"
                  disabled={selectedDestinations.length === 0 || !formData.departingFrom || !formData.month}
                >
                  <Sparkles className="mr-2 w-5 h-5" />
                  Create My Itineraries
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
