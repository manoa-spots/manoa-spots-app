// spotData.ts (in your prisma folder)
import type { SpotCreate, SpotHours } from '../../src/types/spot';

const defaultHours: SpotHours = {
  monday: '7:30 AM - 9:00 PM',
  tuesday: '7:30 AM - 9:00 PM',
  wednesday: '7:30 AM - 9:00 PM',
  thursday: '7:30 AM - 9:00 PM',
  friday: '7:30 AM - 5:00 PM',
  saturday: '9:00 AM - 5:00 PM',
  sunday: '12:00 PM - 9:00 PM',
};

const spots: SpotCreate[] = [
  {
    name: 'Hamilton Library',
    description: 'Quiet study space with multiple floors',
    imageUrl: 'https://www.hawaii.edu/news/wp-content/uploads/2020/10/manoa-hamilton-library-signs.jpg',
    rating: 4.5,
    numReviews: 125,
    address: '2550 McCarthy Mall, Honolulu, HI 96822',
    zipCode: '96822',
    hours: JSON.stringify(defaultHours),
    amenities: ['Quiet Study', 'Group Rooms', 'WiFi', 'Printing'],
    hasOutlets: true,
    hasParking: 'Campus parking pass required',
    hasFoodDrinks: false,
    maxGroupSize: 6,
    minGroupSize: 1,
    type: 'LIBRARY',
  },
  {
    name: 'Starbucks at Campus Center',
    description: 'Coffee shop with plenty of outdoor seating',
    imageUrl: 'https://www.hawaii.edu/news/wp-content/uploads/2024/01/manoa-starbucks-gateway-front.jpeg',
    rating: 4.2,
    numReviews: 4,
    address: '2005 S King St, Honolulu, HI 96826',
    zipCode: '96826',
    hours: JSON.stringify(defaultHours),
    amenities: ['Coffee', 'Tea', 'Pastries', 'WiFi'],
    hasOutlets: true,
    hasParking: 'Paid parking available',
    hasFoodDrinks: true,
    maxGroupSize: 4,
    minGroupSize: 1,
    type: 'CAFE',
  },
  {
    name: 'East-West Center Japanese Garden',
    description: 'Outdoor garden good for reading',
    imageUrl: 'https://freight.cargo.site/w/7000/q/75/i/c3a883cb127f2967828c03500e0d834f'
    + 'cb6d39cf8421185530dd43b2c459b3b3/Jefferson-Hall-2.jpg',
    rating: 4.8,
    numReviews: 10,
    address: '1601 East-West Rd, Honolulu, HI 96848',
    zipCode: '96848',
    hours: JSON.stringify(defaultHours),
    amenities: ['Outdoor', 'Quiet', 'WiFi'],
    hasOutlets: false,
    hasParking: 'Street parking only',
    hasFoodDrinks: false,
    maxGroupSize: 10,
    minGroupSize: 1,
    type: 'OUTDOOR',
  },
  {
    name: 'Paradise Palms Café',
    description: 'Food and drinks with indoor and outdoor seating',
    imageUrl: 'https://assets.change.org/photos/8/zu/kj/XZzUKjKaXjZJyBO-800x450-noPad.jpg?1492727329',
    rating: 4.0,
    numReviews: 20,
    address: '2500 Campus Rd, Honolulu, HI 96822',
    zipCode: '96822',
    hours: JSON.stringify(defaultHours),
    amenities: ['Food', 'Drinks', 'Indoor Seating', 'Outdoor Seating'],
    hasOutlets: true,
    hasParking: 'Campus parking pass required',
    hasFoodDrinks: true,
    maxGroupSize: 6,
    minGroupSize: 1,
    type: 'CAFE',
  },
  {
    name: 'Bilger Hall Courtyard',
    description: 'Shaded outdoor courtyard with tables',
    imageUrl: 'https://s3-media0.fl.yelpcdn.com/bphoto/mRgwQLiZ8YiVMecvz4VM1w/o.jpg',
    rating: 4.7,
    numReviews: 5,
    address: '2538 McCarthy Mall, Honolulu, HI 96822',
    zipCode: '96822',
    hours: JSON.stringify(defaultHours),
    amenities: ['Outdoor', 'Seating', 'WiFi'],
    hasOutlets: false,
    hasParking: 'Campus parking pass required',
    hasFoodDrinks: false,
    maxGroupSize: 15,
    minGroupSize: 1,
    type: 'OUTDOOR',
  },
  {
    name: 'Plantoem Café',
    description: 'Cozy café with indoor and outdoor seating',
    imageUrl: 'https://s3-media0.fl.yelpcdn.com/bphoto/xQElvvJlsfHdlg00uD8NiA/o.jpg',
    rating: 4.3,
    numReviews: 15,
    address: '3457 Waialae Ave Second Floor, Unit 203',
    zipCode: '96816',
    hours: JSON.stringify(defaultHours),
    amenities: ['Coffee', 'Tea', 'Pastries', 'WiFi'],
    hasOutlets: true,
    hasParking: 'Street parking only',
    hasFoodDrinks: true,
    maxGroupSize: 4,
    minGroupSize: 1,
    type: 'CAFE',
  },

];

export default spots;
