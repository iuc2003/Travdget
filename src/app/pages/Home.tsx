import * as React from "react";

import { Link } from "react-router";
import { Plane, Sparkles } from "lucide-react";
import { Button } from "../components/ui/button";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Import illustration assets
import howTravdgetWorksImg from "../../assets/images/howTravdgetWorks.png";

// Carousel destinations
const carouselDestinations = [
  {
    image: "https://images.unsplash.com/photo-1650509010177-84f88bc0e5a1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cm9waWNhbCUyMGJlYWNoJTIwcGFyYWRpc2UlMjB0dXJxdW9pc2V8ZW58MXx8fHwxNzczMzQ4OTI3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    name: "Tropical Beaches",
  },
  {
    image: "https://images.unsplash.com/photo-1722553158864-234aea324575?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3VudGFpbiUyMGxhbmRzY2FwZSUyMHNjZW5pYyUyMGFscHN8ZW58MXx8fHwxNzczMzQ4OTI4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    name: "Mountain Escapes",
  },
  {
    image: "https://images.unsplash.com/photo-1725806760874-96040618865c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxldXJvcGVhbiUyMGNpdHklMjBhcmNoaXRlY3R1cmV8ZW58MXx8fHwxNzczMzM3ODExfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    name: "European Cities",
  },
  {
    image: "https://images.unsplash.com/photo-1769223147961-e31437e6ff22?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhc2lhbiUyMHRlbXBsZSUyMGN1bHR1cmV8ZW58MXx8fHwxNzczMzI1OTczfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    name: "Cultural Wonders",
  },
  {
    image: "https://images.unsplash.com/photo-1684275749334-bc7bd3281f94?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZXNlcnQlMjBsYW5kc2NhcGUlMjBhZHZlbnR1cmV8ZW58MXx8fHwxNzczMzQ4OTI5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    name: "Desert Adventures",
  },
  {
    image: "https://images.unsplash.com/photo-1633716898262-0e1469d55bb3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3YXRlcmZhbGwlMjBuYXR1cmUlMjBqdW5nbGV8ZW58MXx8fHwxNzczMjk0NzY1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    name: "Jungle Retreats",
  },
];

export function Home() {
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 800,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    cssEase: "ease-in-out",
    pauseOnHover: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header - Matching the design image */}
      <header className="bg-gradient-to-r from-purple-50 via-purple-100/50 to-blue-50 fixed top-0 w-full z-10 border-b border-purple-200/30">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Plane className="w-8 h-8 text-purple-600" />
            <span className="text-2xl font-bold text-purple-700">
              Travdget
            </span>
          </Link>
          <Link to="/plan">
            <Button className="bg-[#1e1b3e] hover:bg-[#2d2952] text-white px-6 py-2 rounded-lg">
              View Itineraries
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section - Matching the design image */}
      <section className="pt-32 pb-16 px-4 bg-gradient-to-br from-purple-50 via-purple-100/40 to-blue-50 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-20 right-10 opacity-20">
          <Plane className="w-32 h-32 text-gray-400 transform rotate-12" />
        </div>
        <div className="absolute bottom-0 right-0 opacity-10">
          <svg width="400" height="300" viewBox="0 0 400 300" className="text-gray-300">
            <pattern id="grid-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" />
            </pattern>
            <rect width="400" height="300" fill="url(#grid-pattern)" />
          </svg>
        </div>

        <div className="container mx-auto text-center relative z-10">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="bg-gradient-to-r from-purple-600 via-purple-700 to-purple-800 bg-clip-text text-transparent">
              Dream Destinations,
              <br />
              Budget Friendly
            </span>
          </h1>
          <p className="text-xl text-gray-700 mb-8 max-w-3xl mx-auto">
            Plan your perfect trip with personalized itineraries designed to fit your budget, style, and timeline!
          </p>
          <Link to="/plan">
            <Button size="lg" className="bg-[#1e1b3e] hover:bg-[#2d2952] text-white text-lg px-10 py-6 rounded-full">
              Start Planning <Sparkles className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Destination Carousel */}
      <section className="py-12 px-4 bg-white">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">Explore Destinations</h2>
          <div className="carousel-container">
            <Slider {...sliderSettings}>
              {carouselDestinations.map((destination, index) => (
                <div key={index} className="px-2">
                  <div className="relative rounded-lg overflow-hidden group cursor-pointer h-80">
                    <img
                      src={destination.image}
                      alt={destination.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end">
                      <div className="p-6 w-full">
                        <p className="text-white text-2xl font-bold">{destination.name}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </Slider>
          </div>
        </div>
      </section>

      {/* How Travdget Works Section - Using the exact design from image */}
      <section className="py-20 px-4 bg-gradient-to-br from-blue-50/50 via-gray-50 to-purple-50/30 relative overflow-hidden">
        {/* Background grid pattern */}
        <div className="absolute inset-0 opacity-20">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="diagonal-grid" width="60" height="60" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                <line x1="0" y1="0" x2="0" y2="60" stroke="#cbd5e1" strokeWidth="1" />
                <line x1="0" y1="0" x2="60" y2="0" stroke="#cbd5e1" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#diagonal-grid)" />
          </svg>
        </div>

        {/* Airplane decoration */}
        <div className="absolute top-10 right-20 opacity-30">
          <Plane className="w-24 h-24 text-gray-400 transform rotate-45" />
        </div>

        <div className="container mx-auto relative z-10">
          {/* Display the exact image from Figma */}
          <div className="max-w-6xl mx-auto">
            <img 
              src={howTravdgetWorksImg} 
              alt="How Travdget Works" 
              className="w-full h-auto"
            />
          </div>

          {/* Call to Action */}
          <div className="text-center mt-16">
            <Link to="/plan">
              <Button size="lg" className="bg-[#1e1b3e] hover:bg-[#2d2952] text-white text-lg px-10 py-6 rounded-full shadow-lg hover:shadow-xl transition-shadow">
                Start Your Journey <Sparkles className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Plane className="w-6 h-6" />
            <span className="text-xl font-bold">Travdget</span>
          </div>
          <p className="text-gray-400">Turn dream destinations into budget-friendly itineraries</p>
        </div>
      </footer>

      <style>{`
        .carousel-container .slick-dots {
          bottom: -40px;
        }
        
        .carousel-container .slick-dots li button:before {
          font-size: 12px;
          color: #9333ea;
        }
        
        .carousel-container .slick-dots li.slick-active button:before {
          color: #9333ea;
        }

        .carousel-container .slick-prev,
        .carousel-container .slick-next {
          z-index: 1;
        }

        .carousel-container .slick-prev:before,
        .carousel-container .slick-next:before {
          color: #9333ea;
          font-size: 30px;
        }

        .carousel-container .slick-prev {
          left: -40px;
        }

        .carousel-container .slick-next {
          right: -40px;
        }

        @media (max-width: 768px) {
          .carousel-container .slick-prev {
            left: -20px;
          }
          
          .carousel-container .slick-next {
            right: -20px;
          }
        }
      `}</style>
    </div>
  );
}
