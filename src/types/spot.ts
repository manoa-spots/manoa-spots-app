export interface SpotHours {
  monday: string;
  tuesday: string;
  wednesday: string;
  thursday: string;
  friday: string;
  saturday: string;
  sunday: string;
}

export interface SpotCreate {
  name: string;
  description?: string;
  imageUrl: string;
  rating: number;
  numReviews: number;
  address: string;
  zipCode: string;
  hours: string; // JSON string of SpotHours
  amenities: string[];
  hasOutlets: boolean;
  hasParking: string;
  hasFoodDrinks: boolean;
  maxGroupSize: number;
  minGroupSize: number;
  type: string;
}
