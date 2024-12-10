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

  // ----------- Spot 1 ------------- //

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

  // ----------- Spot 2 ------------- //

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

  // ----------- Spot 3 ------------- //

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

  // ----------- Spot 4 ------------- //

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

  // ----------- Spot 5 ------------- //

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

  // ----------- Spot 6 ------------- //

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

  // ----------- Spot 7 ------------- //

  {
    name: 'Sakamaki Hall Courtyard',
    description: 'Nice area on campus to study between classes',
    imageUrl: 'https://pbs.twimg.com/media/Bv_wsWaCMAEhVwi?format=jpg&name=large',
    rating: 4,
    numReviews: 5,
    address: '3457 Waialae Ave Second Floor, Unit 203',
    zipCode: '96816',
    hours: JSON.stringify(defaultHours),
    amenities: ['Tables', 'WiFi'],
    hasOutlets: false,
    hasParking: 'Campus parking pass required',
    hasFoodDrinks: false,
    maxGroupSize: 5,
    minGroupSize: 1,
    type: 'OUTDOOR',
  },

  // ----------- Spot 8 ------------- //

  {
    name: 'Campus Center Courtyard',
    description: 'Can be busy during the day',
    imageUrl: 'www.hawaiibusiness.com/content/uploads/2022/01/i/i/uh-manoa-hero-1024x683.jpg',
    rating: 3.5,
    numReviews: 6,
    address: '3457 Waialae Ave Second Floor, Unit 203',
    zipCode: '96816',
    hours: JSON.stringify(defaultHours),
    amenities: ['Tables', 'Shade', 'WiFi'],
    hasOutlets: false,
    hasParking: 'Campus parking pass required',
    hasFoodDrinks: false,
    maxGroupSize: 5,
    minGroupSize: 1,
    type: 'OUTDOOR',
  },

  // ----------- Spot 9 ------------- //

  {
    name: 'Life Science Lobby',
    description: 'Great place to study with friends',
    imageUrl: 'https://g70.design/wp-content/uploads/2022/01/217004_01_N11_cropped_950x525.jpg',
    rating: 4.5,
    numReviews: 10,
    address: '3457 Waialae Ave Second Floor, Unit 203',
    zipCode: '96816',
    hours: JSON.stringify(defaultHours),
    amenities: ['Tables', 'Shade', 'WiFi'],
    hasOutlets: false,
    hasParking: 'Campus parking pass required',
    hasFoodDrinks: false,
    maxGroupSize: 10,
    minGroupSize: 1,
    type: 'INDOOR',
  },

  // ----------- Spot 10 ------------- //

  {
    name: 'Life Science Study Room',
    description: 'Great space for students to utilize for group projects',
    imageUrl: 'https://g70.design/wp-content/uploads/2022/01/217004_01_N9_cropped_950x525.jpg'
    + 'www.hawaiibusiness.com/content/uploads/2022/01/i/i/uh-manoa-hero-1024x683.jpg',
    rating: 5,
    numReviews: 5,
    address: '3457 Waialae Ave Second Floor, Unit 203',
    zipCode: '96816',
    hours: JSON.stringify(defaultHours),
    amenities: ['Tables', 'Whiteboards', 'WiFi'],
    hasOutlets: true,
    hasParking: 'Campus parking pass required',
    hasFoodDrinks: false,
    maxGroupSize: 5,
    minGroupSize: 1,
    type: 'INDOOR',
  },

  // ----------- Spot 11 ------------- //

  {
    name: 'Boba House',
    description: 'Good boba and very quiet place',
    imageUrl: 'https://s3-media0.fl.yelpcdn.com/bphoto/VzRFtKyUfJbSAhtPITEUIg/o.jpg',
    rating: 4,
    numReviews: 10,
    address: '1610 S King St',
    zipCode: '96826',
    hours: JSON.stringify(defaultHours),
    amenities: ['Tables', 'WiFi'],
    hasOutlets: true,
    hasParking: 'Parking lot available',
    hasFoodDrinks: true,
    maxGroupSize: 5,
    minGroupSize: 1,
    type: 'CAFE',
  },

  // ----------- Spot 12 ------------- //

  {
    name: 'Spero Spera',
    description: 'Nice cafe with good food',
    imageUrl: 'https://s3-media0.fl.yelpcdn.com/bphoto/Y2kgzyfZAfw3g5W1KBSQ9w/o.jpg',
    rating: 4.5,
    numReviews: 5,
    address: '1334 Young St Ste 102',
    zipCode: '96814',
    hours: JSON.stringify(defaultHours),
    amenities: ['Tables', 'Shade', 'WiFi'],
    hasOutlets: true,
    hasParking: 'Parking lot available',
    hasFoodDrinks: true,
    maxGroupSize: 5,
    minGroupSize: 1,
    type: 'CAFE',
  },

  // ----------- Spot 13 ------------- //

  {
    name: 'Cafe Villamor',
    description: 'Small quiet cafe with good food and coffee',
    imageUrl: 'https://s3-media0.fl.yelpcdn.com/bphoto/MuFY4uzXx9SIw8_ByL75wg/o.jpg',
    rating: 4.5,
    numReviews: 13,
    address: '825 Ilaniwai St Honolulu',
    zipCode: '96813',
    hours: JSON.stringify(defaultHours),
    amenities: ['Tables', 'WiFi'],
    hasOutlets: true,
    hasParking: 'Street parking only',
    hasFoodDrinks: true,
    maxGroupSize: 5,
    minGroupSize: 1,
    type: 'CAFE',
  },

  // ----------- Spot 14 ------------- //

  {
    name: 'Farmer Building Courtyard',
    description: 'Can be busy during the day',
    imageUrl: 'https://manoa.hawaii.edu/copf/wp-content/uploads/sites/74/2024/03/HIG-Open-Area-Map-2-1024x435.png',
    rating: 3.5,
    numReviews: 5,
    address: '3457 Waialae Ave Second Floor, Unit 203',
    zipCode: '96816',
    hours: JSON.stringify(defaultHours),
    amenities: ['Tables', 'Shade', 'WiFi'],
    hasOutlets: false,
    hasParking: 'Campus parking pass required',
    hasFoodDrinks: false,
    maxGroupSize: 5,
    minGroupSize: 1,
    type: 'OUTDOOR',
  },

  // ----------- Spot 15 ------------- //

  {
    name: 'CWaioli Kitchen and Bake Shop',
    description: 'Good coffee and food!',
    imageUrl: 'https://s3-media0.fl.yelpcdn.com/bphoto/jUFrnqUz8ET4leAA4rqGqg/o.jpg',
    rating: 3.5,
    numReviews: 5,
    address: '2950 Manoa Rd',
    zipCode: '96822',
    hours: JSON.stringify(defaultHours),
    amenities: ['Tables', 'WiFi'],
    hasOutlets: false,
    hasParking: 'Parking lot available',
    hasFoodDrinks: true,
    maxGroupSize: 5,
    minGroupSize: 1,
    type: 'CAFE',
  },

  // ----------- Spot 16 ------------- //

  {
    name: 'The Curb Kaimuki',
    description: 'Can be busy during the day',
    imageUrl: 'https://s3-media0.fl.yelpcdn.com/bphoto/TtCZwp54NULzxRSm2gW-uw/o.jpg',
    rating: 4,
    numReviews: 16,
    address: '3408 Waialae Ave Ste 103',
    zipCode: '96816',
    hours: JSON.stringify(defaultHours),
    amenities: ['Coffee', 'WiFi'],
    hasOutlets: true,
    hasParking: 'Parking lot available',
    hasFoodDrinks: true,
    maxGroupSize: 5,
    minGroupSize: 1,
    type: 'CAFE',
  },

  // ----------- Spot 17 ------------- //

  {
    name: 'Fins Bagles',
    description: 'Great bagels and there is outdoor seating available',
    imageUrl: 'https://s3-media0.fl.yelpcdn.com/bphoto/0GptkVE_DoMdF8HCis8lBQ/o.jpg',
    rating: 4,
    numReviews: 5,
    address: '3110 Winam Ave',
    zipCode: '96816',
    hours: JSON.stringify(defaultHours),
    amenities: ['Tables', 'Food'],
    hasOutlets: false,
    hasParking: 'Parking lot available',
    hasFoodDrinks: true,
    maxGroupSize: 3,
    minGroupSize: 1,
    type: 'OUTDOOR',
  },

  // ----------- Spot 18 ------------- //

  {
    name: 'Pai Cafe',
    description: 'Usually not too busy with some small tables',
    imageUrl: 'https://s3-media0.fl.yelpcdn.com/bphoto/3vQXml9roszhtQ7TtaDoEQ/o.jpg',
    rating: 4.8,
    numReviews: 5,
    address: '755 Kapahulu Ave',
    zipCode: '96816',
    hours: JSON.stringify(defaultHours),
    amenities: ['Tables', 'Coffee', 'WiFi'],
    hasOutlets: false,
    hasParking: 'Parking lot available',
    hasFoodDrinks: true,
    maxGroupSize: 5,
    minGroupSize: 1,
    type: 'CAFE',
  },

  // ----------- Spot 19 ------------- //

  {
    name: 'Bluetree Cafe',
    description: 'Great coffee and food to fuel your study session',
    imageUrl: 'https://s3-media0.fl.yelpcdn.com/bphoto/eczEHA58bWF-Jpd8BMmuRA/o.jpg',
    rating: 3.5,
    numReviews: 5,
    address: '1009 Kapiolani Blvd',
    zipCode: '96814',
    hours: JSON.stringify(defaultHours),
    amenities: ['Tables', 'WiFi'],
    hasOutlets: true,
    hasParking: 'Parking lot available',
    hasFoodDrinks: true,
    maxGroupSize: 5,
    minGroupSize: 1,
    type: 'CAFE',
  },

  // ----------- Spot 20 ------------- //

  {
    name: 'Try Coffee',
    description: 'Lots of indoor and outdoor seating',
    imageUrl: 'https://s3-media0.fl.yelpcdn.com/bphoto/SF1joBe84oTLZQVK8856Kg/o.jpg',
    rating: 5,
    numReviews: 10,
    address: '1200 Ala Moana Blvd Fl 2',
    zipCode: '96814',
    hours: JSON.stringify(defaultHours),
    amenities: ['Coffee', 'WiFi'],
    hasOutlets: true,
    hasParking: 'Parking lot available',
    hasFoodDrinks: true,
    maxGroupSize: 8,
    minGroupSize: 1,
    type: 'CAFE',
  },

  // ----------- Spot 21 ------------- //

  {
    name: 'ARS Cafe',
    description: 'Some seating inside and outside',
    imageUrl: 'https://s3-media0.fl.yelpcdn.com/bphoto/H5pknpdWurdTlRAz59TerA/o.jpg',
    rating: 4.6,
    numReviews: 8,
    address: '3116 Monsarrat Ave',
    zipCode: '96815',
    hours: JSON.stringify(defaultHours),
    amenities: ['Coffee', 'WiFi'],
    hasOutlets: false,
    hasParking: 'Parking lot available',
    hasFoodDrinks: true,
    maxGroupSize: 5,
    minGroupSize: 1,
    type: 'CAFE',
  },

  // ----------- Spot 22 ------------- //

  {
    name: 'Po’ai By Pono Potions',
    description: 'Great coffee and study vibes with large tables',
    imageUrl: 'https://s3-media0.fl.yelpcdn.com/bphoto/U5jG8dcgd6r-FiUwrY8I1g/o.jpg',
    rating: 5,
    numReviews: 25,
    address: '1119 Smith St',
    zipCode: '96817',
    hours: JSON.stringify(defaultHours),
    amenities: ['Large tables', 'Outdoor seating', 'WiFi'],
    hasOutlets: false,
    hasParking: 'Parking lot available',
    hasFoodDrinks: true,
    maxGroupSize: 10,
    minGroupSize: 1,
    type: 'CAFE',
  },

  // ----------- Spot 23 ------------- //

  {
    name: 'Cooke Street Market',
    description: 'Large tables great for group study',
    imageUrl: 'https://s3-media0.fl.yelpcdn.com/bphoto/NUUEdNW94tjEUIqIzJ_GFQ/o.jpg',
    rating: 4.4,
    numReviews: 5,
    address: '725 Kapiolani Blvd Ste',
    zipCode: '96813',
    hours: JSON.stringify(defaultHours),
    amenities: ['Large tables', 'WiFi'],
    hasOutlets: true,
    hasParking: 'Parking lot available',
    hasFoodDrinks: true,
    maxGroupSize: 5,
    minGroupSize: 1,
    type: 'CAFE',
  },

  // ----------- Spot 24 ------------- //

  {
    name: 'Alii Coffee Company',
    description: 'Very good drinks and food',
    imageUrl: 'https://s3-media0.fl.yelpcdn.com/bphoto/-A3Sk1OmmDssntTVoQSaSg/o.jpg',
    rating: 4.2,
    numReviews: 5,
    address: '35 S Beretania St Honolulu',
    zipCode: '96813',
    hours: JSON.stringify(defaultHours),
    amenities: ['WiFi'],
    hasOutlets: false,
    hasParking: 'Street parking only',
    hasFoodDrinks: true,
    maxGroupSize: 4,
    minGroupSize: 1,
    type: 'CAFE',
  },

  // ----------- Spot 25 ------------- //

  {
    name: 'Drip Studio',
    description: 'Can be busy during the day',
    imageUrl: 'https://s3-media0.fl.yelpcdn.com/bphoto/CZAf8NYaW4FJmTXXa8hg4g/o.jpg',
    rating: 5,
    numReviews: 20,
    address: '1146 Fort Street Mall',
    zipCode: '96813',
    hours: JSON.stringify(defaultHours),
    amenities: ['Tables', 'WiFi'],
    hasOutlets: false,
    hasParking: 'Street parking only',
    hasFoodDrinks: true,
    maxGroupSize: 2,
    minGroupSize: 1,
    type: 'CAFE',
  },
];

export default spots;
