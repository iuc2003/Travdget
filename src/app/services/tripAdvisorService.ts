/**
 * TripAdvisor API Integration for Activities
 * 
 * To use the real TripAdvisor API:
 * 1. Sign up at https://www.tripadvisor.com/developers
 * 2. Get your API key
 * 3. Replace 'YOUR_TRIPADVISOR_API_KEY' below
 * 4. Uncomment the real API calls
 */

const TRIPADVISOR_API_KEY = 'YOUR_TRIPADVISOR_API_KEY';
const TRIPADVISOR_API_BASE = 'https://api.tripadvisor.com/api/partner/2.0';

export interface Activity {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  duration: string;
  rating: number;
  reviewCount: number;
  imageUrl: string;
  bookingUrl: string;
  highlights: string[];
}

// Mock activity data generator
function generateMockActivities(destination: string, travelStyle: string): Activity[] {
  const destinationActivities: Record<string, Activity[]> = {
    "Bali, Indonesia": [
      {
        id: "act-1",
        name: "Tegallalang Rice Terrace Tour",
        description: "Explore the famous UNESCO rice terraces and traditional Balinese farming",
        category: "Nature & Culture",
        price: 25,
        duration: "4 hours",
        rating: 4.8,
        reviewCount: 3421,
        imageUrl: "https://images.unsplash.com/photo-1537996194471-e657df975ab4",
        bookingUrl: "https://www.tripadvisor.com",
        highlights: ["Rice terraces", "Photo opportunities", "Local guide", "Traditional lunch"],
      },
      {
        id: "act-2",
        name: "Uluwatu Temple Sunset & Kecak Dance",
        description: "Visit the cliff-top temple and watch traditional Kecak fire dance at sunset",
        category: "Cultural Experience",
        price: 35,
        duration: "5 hours",
        rating: 4.9,
        reviewCount: 5234,
        imageUrl: "https://images.unsplash.com/photo-1555400038-63f5ba517a47",
        bookingUrl: "https://www.tripadvisor.com",
        highlights: ["Temple visit", "Sunset views", "Traditional dance", "Hotel pickup"],
      },
      {
        id: "act-3",
        name: "Mount Batur Sunrise Trek",
        description: "Early morning hike to watch sunrise from an active volcano",
        category: "Adventure",
        price: 45,
        duration: "8 hours",
        rating: 4.7,
        reviewCount: 2876,
        imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4",
        bookingUrl: "https://www.tripadvisor.com",
        highlights: ["Sunrise trek", "Volcano views", "Breakfast on summit", "Guide included"],
      },
      {
        id: "act-4",
        name: "Ubud Monkey Forest & Art Market",
        description: "Walk through sacred monkey forest and shop at traditional art markets",
        category: "Nature & Shopping",
        price: 15,
        duration: "3 hours",
        rating: 4.5,
        reviewCount: 4521,
        imageUrl: "https://images.unsplash.com/photo-1544735716-392fe2489ffa",
        bookingUrl: "https://www.tripadvisor.com",
        highlights: ["Monkey forest", "Art markets", "Local crafts", "Temple visit"],
      },
      {
        id: "act-5",
        name: "Balinese Cooking Class",
        description: "Learn to cook authentic Balinese dishes with a local chef",
        category: "Food & Culture",
        price: 40,
        duration: "4 hours",
        rating: 4.9,
        reviewCount: 1876,
        imageUrl: "https://images.unsplash.com/photo-1556910110-a5a63dfd393c",
        bookingUrl: "https://www.tripadvisor.com",
        highlights: ["Cooking class", "Market tour", "Recipe booklet", "Full meal"],
      },
      {
        id: "act-6",
        name: "Seminyak Beach Surfing Lesson",
        description: "Learn to surf with professional instructors on Seminyak Beach",
        category: "Water Sports",
        price: 30,
        duration: "2 hours",
        rating: 4.6,
        reviewCount: 2134,
        imageUrl: "https://images.unsplash.com/photo-1502680390469-be75c86b636f",
        bookingUrl: "https://www.tripadvisor.com",
        highlights: ["Surf lesson", "Equipment included", "Small groups", "All levels"],
      },
    ],
    "Bangkok, Thailand": [
      {
        id: "act-7",
        name: "Grand Palace & Wat Phra Kaew Tour",
        description: "Explore Bangkok's most iconic temple and royal palace complex",
        category: "Cultural",
        price: 30,
        duration: "4 hours",
        rating: 4.8,
        reviewCount: 6234,
        imageUrl: "https://images.unsplash.com/photo-1563492065567-9544b9600011",
        bookingUrl: "https://www.tripadvisor.com",
        highlights: ["Grand Palace", "Emerald Buddha", "Expert guide", "Skip the line"],
      },
      {
        id: "act-8",
        name: "Floating Market & River Cruise",
        description: "Experience traditional floating markets and cruise the Chao Phraya River",
        category: "Culture & Food",
        price: 35,
        duration: "5 hours",
        rating: 4.7,
        reviewCount: 4521,
        imageUrl: "https://images.unsplash.com/photo-1528181304800-259b08848526",
        bookingUrl: "https://www.tripadvisor.com",
        highlights: ["Floating market", "River cruise", "Local food", "Hotel pickup"],
      },
      {
        id: "act-9",
        name: "Street Food Night Tour",
        description: "Taste authentic Thai street food with a local foodie guide",
        category: "Food Tour",
        price: 40,
        duration: "3 hours",
        rating: 4.9,
        reviewCount: 3876,
        imageUrl: "https://images.unsplash.com/photo-1504544750208-dc0358e63f7f",
        bookingUrl: "https://www.tripadvisor.com",
        highlights: ["10+ food tastings", "Local guide", "Night markets", "Drinks included"],
      },
      {
        id: "act-10",
        name: "Muay Thai Boxing Experience",
        description: "Learn the basics of Muay Thai from professional fighters",
        category: "Sports & Fitness",
        price: 25,
        duration: "2 hours",
        rating: 4.6,
        reviewCount: 1234,
        imageUrl: "https://images.unsplash.com/photo-1555597673-b21d5c935865",
        bookingUrl: "https://www.tripadvisor.com",
        highlights: ["Boxing training", "Professional coach", "All equipment", "Certificate"],
      },
      {
        id: "act-11",
        name: "Ayutthaya Ancient City Day Trip",
        description: "Visit the UNESCO World Heritage ancient capital of Thailand",
        category: "Historical",
        price: 50,
        duration: "8 hours",
        rating: 4.8,
        reviewCount: 5432,
        imageUrl: "https://images.unsplash.com/photo-1528181304800-259b08848526",
        bookingUrl: "https://www.tripadvisor.com",
        highlights: ["Ancient temples", "Lunch included", "Guide", "Transport"],
      },
      {
        id: "act-12",
        name: "Thai Massage & Spa Experience",
        description: "Relax with a traditional Thai massage at a top-rated spa",
        category: "Wellness",
        price: 35,
        duration: "2 hours",
        rating: 4.7,
        reviewCount: 2876,
        imageUrl: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874",
        bookingUrl: "https://www.tripadvisor.com",
        highlights: ["Thai massage", "Herbal compress", "Tea service", "City center location"],
      },
    ],
  };

  // Default activities if destination not in list
  const defaultActivities: Activity[] = [
    {
      id: "act-default-1",
      name: "City Walking Tour",
      description: "Explore the city's main attractions with a knowledgeable local guide",
      category: "Cultural",
      price: 20,
      duration: "3 hours",
      rating: 4.6,
      reviewCount: 1234,
      imageUrl: "https://images.unsplash.com/photo-1488646953014-85cb44e25828",
      bookingUrl: "https://www.tripadvisor.com",
      highlights: ["Main sights", "Local guide", "Small group", "Stories & history"],
    },
    {
      id: "act-default-2",
      name: "Food Tasting Tour",
      description: "Sample local cuisine and learn about food culture",
      category: "Food",
      price: 45,
      duration: "4 hours",
      rating: 4.8,
      reviewCount: 876,
      imageUrl: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0",
      bookingUrl: "https://www.tripadvisor.com",
      highlights: ["Multiple tastings", "Local markets", "Chef guide", "Recipes"],
    },
    {
      id: "act-default-3",
      name: "Museum & Gallery Tour",
      description: "Visit the city's top museums and art galleries",
      category: "Cultural",
      price: 30,
      duration: "4 hours",
      rating: 4.5,
      reviewCount: 654,
      imageUrl: "https://images.unsplash.com/photo-1554907984-15263bfd63bd",
      bookingUrl: "https://www.tripadvisor.com",
      highlights: ["Skip-the-line", "Art expert", "Multiple venues", "Tickets included"],
    },
    {
      id: "act-default-4",
      name: "Day Trip Adventure",
      description: "Full day excursion to nearby attractions and natural wonders",
      category: "Adventure",
      price: 55,
      duration: "8 hours",
      rating: 4.7,
      reviewCount: 2341,
      imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4",
      bookingUrl: "https://www.tripadvisor.com",
      highlights: ["Transportation", "Lunch included", "Guide", "Scenic spots"],
    },
    {
      id: "act-default-5",
      name: "Cooking Class Experience",
      description: "Learn to cook traditional local dishes",
      category: "Food & Culture",
      price: 40,
      duration: "3 hours",
      rating: 4.9,
      reviewCount: 1567,
      imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
      bookingUrl: "https://www.tripadvisor.com",
      highlights: ["Hands-on cooking", "Market visit", "Recipes", "Full meal"],
    },
    {
      id: "act-default-6",
      name: "Sunset Cruise",
      description: "Enjoy stunning sunset views from the water",
      category: "Leisure",
      price: 50,
      duration: "2 hours",
      rating: 4.6,
      reviewCount: 987,
      imageUrl: "https://images.unsplash.com/photo-1544551763-46a013bb70d5",
      bookingUrl: "https://www.tripadvisor.com",
      highlights: ["Sunset views", "Drinks included", "Live music", "Photo opportunities"],
    },
  ];

  return destinationActivities[destination] || defaultActivities;
}

/**
 * Get activity recommendations for a destination
 */
export async function getActivities(
  destination: string,
  travelStyle: string
): Promise<Activity[]> {
  // MOCK DATA - Replace with real API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(generateMockActivities(destination, travelStyle));
    }, 1000);
  });

  /* REAL API IMPLEMENTATION (uncomment when you have API key):
  
  try {
    const cityName = destination.split(',')[0];
    const response = await fetch(
      `${TRIPADVISOR_API_BASE}/location/search?key=${TRIPADVISOR_API_KEY}&searchQuery=${encodeURIComponent(cityName)}&category=attractions`,
      {
        headers: {
          'Accept': 'application/json',
        },
      }
    );
    
    if (!response.ok) {
      throw new Error('TripAdvisor API request failed');
    }
    
    const data = await response.json();
    
    // Transform TripAdvisor data to our Activity interface
    return data.data.slice(0, 6).map((item: any) => ({
      id: item.location_id,
      name: item.name,
      description: item.description || 'Explore this amazing attraction',
      category: item.category?.name || 'Activity',
      price: estimatePrice(item.price_level), // Convert price level to actual price
      duration: item.duration || '3 hours',
      rating: parseFloat(item.rating) || 4.5,
      reviewCount: parseInt(item.num_reviews) || 0,
      imageUrl: item.photo?.images?.large?.url || '',
      bookingUrl: item.web_url || 'https://www.tripadvisor.com',
      highlights: item.subcategory?.map((s: any) => s.name) || [],
    }));
  } catch (error) {
    console.error('Error fetching TripAdvisor activities:', error);
    return generateMockActivities(destination, travelStyle);
  }
  */
}

function estimatePrice(priceLevel: string): number {
  const prices: Record<string, number> = {
    '$': 20,
    '$$': 40,
    '$$$': 60,
    '$$$$': 80,
  };
  return prices[priceLevel] || 30;
}
