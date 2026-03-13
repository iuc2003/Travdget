/**
 * Visa/Authorization Information Service
 * 
 * This service provides visa requirements based on passport and destination
 * For production, consider integrating with official government APIs
 */

export interface VisaRequirement {
    destination: string;
    passport: string;
    requirement: "visa_free" | "visa_on_arrival" | "evisa" | "visa_required" | "restricted";
    duration?: string;
    details: string;
    applicationUrl?: string;
  }
  
  // Common passport/nationality options
  export const passportOptions = [
    "United States",
    "United Kingdom",
    "Canada",
    "Australia",
    "Germany",
    "France",
    "Spain",
    "Italy",
    "Japan",
    "South Korea",
    "Singapore",
    "India",
    "China",
    "Brazil",
    "Mexico",
    "South Africa",
    "Nigeria",
    "Argentina",
    "Chile",
    "New Zealand",
    "Ireland",
    "Netherlands",
    "Sweden",
    "Norway",
    "Denmark",
    "Finland",
    "Belgium",
    "Switzerland",
    "Austria",
    "Poland",
  ];
  
  // Mock visa requirements database
  const visaRequirements: Record<string, Record<string, VisaRequirement>> = {
    "Bali, Indonesia": {
      "United States": {
        destination: "Bali, Indonesia",
        passport: "United States",
        requirement: "visa_on_arrival",
        duration: "30 days",
        details: "US passport holders can obtain a Visa on Arrival for 30 days (extendable once for another 30 days). Cost: $35 USD.",
        applicationUrl: "https://molina.imigrasi.go.id/",
      },
      "United Kingdom": {
        destination: "Bali, Indonesia",
        passport: "United Kingdom",
        requirement: "visa_on_arrival",
        duration: "30 days",
        details: "UK passport holders can obtain a Visa on Arrival for 30 days. Cost: $35 USD.",
        applicationUrl: "https://molina.imigrasi.go.id/",
      },
      "India": {
        destination: "Bali, Indonesia",
        passport: "India",
        requirement: "visa_on_arrival",
        duration: "30 days",
        details: "Indian passport holders can obtain a Visa on Arrival for 30 days. Cost: $35 USD.",
        applicationUrl: "https://molina.imigrasi.go.id/",
      },
    },
    "Bangkok, Thailand": {
      "United States": {
        destination: "Bangkok, Thailand",
        passport: "United States",
        requirement: "visa_free",
        duration: "30 days",
        details: "US passport holders can enter Thailand visa-free for up to 30 days for tourism purposes.",
      },
      "United Kingdom": {
        destination: "Bangkok, Thailand",
        passport: "United Kingdom",
        requirement: "visa_free",
        duration: "30 days",
        details: "UK passport holders can enter Thailand visa-free for up to 30 days for tourism purposes.",
      },
      "India": {
        destination: "Bangkok, Thailand",
        passport: "India",
        requirement: "evisa",
        duration: "60 days",
        details: "Indian passport holders can apply for a Thailand eVisa online. Single entry valid for 60 days.",
        applicationUrl: "https://www.thaievisa.go.th/",
      },
    },
    "Barcelona, Spain": {
      "United States": {
        destination: "Barcelona, Spain",
        passport: "United States",
        requirement: "visa_free",
        duration: "90 days",
        details: "US passport holders can travel to Spain (Schengen Area) visa-free for up to 90 days within a 180-day period.",
      },
      "United Kingdom": {
        destination: "Barcelona, Spain",
        passport: "United Kingdom",
        requirement: "visa_free",
        duration: "90 days",
        details: "UK passport holders can travel to Spain (Schengen Area) visa-free for up to 90 days within a 180-day period.",
      },
      "India": {
        destination: "Barcelona, Spain",
        passport: "India",
        requirement: "visa_required",
        duration: "90 days",
        details: "Indian passport holders require a Schengen visa to visit Spain. Apply at the Spanish embassy or consulate.",
        applicationUrl: "https://www.schengenvisainfo.com/",
      },
    },
    "Budapest, Hungary": {
      "United States": {
        destination: "Budapest, Hungary",
        passport: "United States",
        requirement: "visa_free",
        duration: "90 days",
        details: "US passport holders can travel to Hungary (Schengen Area) visa-free for up to 90 days within a 180-day period.",
      },
      "United Kingdom": {
        destination: "Budapest, Hungary",
        passport: "United Kingdom",
        requirement: "visa_free",
        duration: "90 days",
        details: "UK passport holders can travel to Hungary (Schengen Area) visa-free for up to 90 days within a 180-day period.",
      },
    },
    "Cancún, Mexico": {
      "United States": {
        destination: "Cancún, Mexico",
        passport: "United States",
        requirement: "visa_free",
        duration: "180 days",
        details: "US passport holders can enter Mexico visa-free for up to 180 days for tourism.",
      },
      "United Kingdom": {
        destination: "Cancún, Mexico",
        passport: "United Kingdom",
        requirement: "visa_free",
        duration: "180 days",
        details: "UK passport holders can enter Mexico visa-free for up to 180 days for tourism.",
      },
    },
  };
  
  /**
   * Get visa requirement information
   */
  export function getVisaRequirement(destination: string, passport: string): VisaRequirement | null {
    const destRequirements = visaRequirements[destination];
    if (!destRequirements) {
      return {
        destination,
        passport,
        requirement: "visa_required",
        details: "Visa requirements not available. Please check with the destination's embassy or consulate.",
      };
    }
  
    const requirement = destRequirements[passport];
    if (!requirement) {
      return {
        destination,
        passport,
        requirement: "visa_required",
        details: "Visa requirements not available for this passport. Please check with the destination's embassy or consulate.",
      };
    }
  
    return requirement;
  }
  
  /**
   * Get visa requirement badge color
   */
  export function getVisaRequirementColor(requirement: VisaRequirement["requirement"]): string {
    switch (requirement) {
      case "visa_free":
        return "bg-green-500";
      case "visa_on_arrival":
        return "bg-blue-500";
      case "evisa":
        return "bg-yellow-500";
      case "visa_required":
        return "bg-orange-500";
      case "restricted":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  }
  
  /**
   * Get visa requirement label
   */
  export function getVisaRequirementLabel(requirement: VisaRequirement["requirement"]): string {
    switch (requirement) {
      case "visa_free":
        return "Visa Free";
      case "visa_on_arrival":
        return "Visa on Arrival";
      case "evisa":
        return "eVisa Required";
      case "visa_required":
        return "Visa Required";
      case "restricted":
        return "Restricted";
      default:
        return "Unknown";
    }
  }
  