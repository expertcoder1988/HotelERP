import { Room, Guest, Reservation, DashboardStats, RevenueData, OccupancyData } from '../types';

export const rooms: Room[] = [
  {
    id: '1',
    number: '101',
    type: 'single',
    status: 'occupied',
    price: 120,
    floor: 1,
    amenities: ['WiFi', 'TV', 'AC', 'Mini Bar'],
    lastCleaned: new Date('2024-10-24T10:00:00'),
    currentGuest: 'John Smith'
  },
  {
    id: '2',
    number: '102',
    type: 'double',
    status: 'available',
    price: 180,
    floor: 1,
    amenities: ['WiFi', 'TV', 'AC', 'Mini Bar', 'Balcony']
  },
  {
    id: '3',
    number: '103',
    type: 'suite',
    status: 'reserved',
    price: 350,
    floor: 1,
    amenities: ['WiFi', 'TV', 'AC', 'Mini Bar', 'Balcony', 'Jacuzzi', 'Kitchen']
  },
  {
    id: '4',
    number: '201',
    type: 'deluxe',
    status: 'occupied',
    price: 280,
    floor: 2,
    amenities: ['WiFi', 'TV', 'AC', 'Mini Bar', 'Balcony', 'Sea View'],
    currentGuest: 'Sarah Johnson'
  },
  {
    id: '5',
    number: '202',
    type: 'double',
    status: 'maintenance',
    price: 180,
    floor: 2,
    amenities: ['WiFi', 'TV', 'AC', 'Mini Bar']
  },
  {
    id: '6',
    number: '203',
    type: 'single',
    status: 'available',
    price: 120,
    floor: 2,
    amenities: ['WiFi', 'TV', 'AC']
  },
  {
    id: '7',
    number: '301',
    type: 'suite',
    status: 'occupied',
    price: 350,
    floor: 3,
    amenities: ['WiFi', 'TV', 'AC', 'Mini Bar', 'Balcony', 'Jacuzzi', 'Kitchen'],
    currentGuest: 'Michael Brown'
  },
  {
    id: '8',
    number: '302',
    type: 'deluxe',
    status: 'available',
    price: 280,
    floor: 3,
    amenities: ['WiFi', 'TV', 'AC', 'Mini Bar', 'Balcony', 'Sea View']
  }
];

export const guests: Guest[] = [
  {
    id: '1',
    firstName: 'John',
    lastName: 'Smith',
    email: 'john.smith@email.com',
    phone: '+1-555-0123',
    address: '123 Main St, New York, NY 10001',
    dateOfBirth: new Date('1985-03-15'),
    nationality: 'American',
    idNumber: 'P123456789',
    totalStays: 12,
    totalSpent: 4500,
    vipStatus: true,
    preferences: ['Non-smoking', 'High floor', 'Late checkout'],
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
  },
  {
    id: '2',
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sarah.j@email.com',
    phone: '+1-555-0456',
    address: '456 Oak Ave, Los Angeles, CA 90210',
    dateOfBirth: new Date('1990-07-22'),
    nationality: 'American',
    idNumber: 'P987654321',
    totalStays: 8,
    totalSpent: 2800,
    vipStatus: false,
    preferences: ['Pool view', 'Extra towels'],
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'
  },
  {
    id: '3',
    firstName: 'Michael',
    lastName: 'Brown',
    email: 'michael.brown@email.com',
    phone: '+44-20-7946-0958',
    address: '789 Queen St, London, UK SW1A 1AA',
    dateOfBirth: new Date('1978-11-08'),
    nationality: 'British',
    idNumber: 'UK456789123',
    totalStays: 15,
    totalSpent: 6200,
    vipStatus: true,
    preferences: ['Business center access', 'Early breakfast'],
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
  }
];

export const reservations: Reservation[] = [
  {
    id: '1',
    guestId: '1',
    roomId: '1',
    checkIn: new Date('2024-10-24'),
    checkOut: new Date('2024-10-27'),
    status: 'checked-in',
    totalAmount: 360,
    paidAmount: 360,
    paymentStatus: 'paid',
    createdAt: new Date('2024-10-20'),
    adults: 1,
    children: 0
  },
  {
    id: '2',
    guestId: '2',
    roomId: '4',
    checkIn: new Date('2024-10-25'),
    checkOut: new Date('2024-10-28'),
    status: 'checked-in',
    totalAmount: 840,
    paidAmount: 420,
    paymentStatus: 'partial',
    createdAt: new Date('2024-10-22'),
    adults: 2,
    children: 0
  },
  {
    id: '3',
    guestId: '3',
    roomId: '7',
    checkIn: new Date('2024-10-23'),
    checkOut: new Date('2024-10-30'),
    status: 'checked-in',
    totalAmount: 2450,
    paidAmount: 2450,
    paymentStatus: 'paid',
    specialRequests: 'Late checkout, extra pillows',
    createdAt: new Date('2024-10-15'),
    adults: 2,
    children: 1
  }
];

export const dashboardStats: DashboardStats = {
  totalRooms: 8,
  occupiedRooms: 3,
  availableRooms: 3,
  maintenanceRooms: 1,
  reservedRooms: 1,
  todayCheckIns: 2,
  todayCheckOuts: 1,
  totalRevenue: 125000,
  monthlyRevenue: 28500,
  occupancyRate: 75,
  averageRoomRate: 220
};

export const revenueData: RevenueData[] = [
  { month: 'Jan', revenue: 22000, bookings: 85 },
  { month: 'Feb', revenue: 25000, bookings: 92 },
  { month: 'Mar', revenue: 28000, bookings: 105 },
  { month: 'Apr', revenue: 32000, bookings: 118 },
  { month: 'May', revenue: 35000, bookings: 125 },
  { month: 'Jun', revenue: 38000, bookings: 142 },
  { month: 'Jul', revenue: 42000, bookings: 158 },
  { month: 'Aug', revenue: 45000, bookings: 165 },
  { month: 'Sep', revenue: 39000, bookings: 148 },
  { month: 'Oct', revenue: 28500, bookings: 108 }
];

export const occupancyData: OccupancyData[] = [
  { date: '2024-10-16', occupancy: 65 },
  { date: '2024-10-17', occupancy: 70 },
  { date: '2024-10-18', occupancy: 75 },
  { date: '2024-10-19', occupancy: 80 },
  { date: '2024-10-20', occupancy: 85 },
  { date: '2024-10-21', occupancy: 90 },
  { date: '2024-10-22', occupancy: 88 },
  { date: '2024-10-23', occupancy: 82 },
  { date: '2024-10-24', occupancy: 75 },
  { date: '2024-10-25', occupancy: 78 }
];