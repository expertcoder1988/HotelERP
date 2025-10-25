export interface Room {
  id: string;
  number: string;
  type: 'single' | 'double' | 'suite' | 'deluxe';
  status: 'available' | 'occupied' | 'maintenance' | 'reserved';
  price: number;
  floor: number;
  amenities: string[];
  lastCleaned?: Date;
  currentGuest?: string;
}

export interface Guest {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  dateOfBirth: Date;
  nationality: string;
  idNumber: string;
  totalStays: number;
  totalSpent: number;
  vipStatus: boolean;
  preferences: string[];
  avatar?: string;
}

export interface Reservation {
  id: string;
  guestId: string;
  roomId: string;
  checkIn: Date;
  checkOut: Date;
  status: 'confirmed' | 'checked-in' | 'checked-out' | 'cancelled' | 'no-show';
  totalAmount: number;
  paidAmount: number;
  paymentStatus: 'pending' | 'partial' | 'paid' | 'refunded';
  specialRequests?: string;
  createdAt: Date;
  adults: number;
  children: number;
}

export interface DashboardStats {
  totalRooms: number;
  occupiedRooms: number;
  availableRooms: number;
  maintenanceRooms: number;
  reservedRooms: number;
  todayCheckIns: number;
  todayCheckOuts: number;
  totalRevenue: number;
  monthlyRevenue: number;
  occupancyRate: number;
  averageRoomRate: number;
}

export interface RevenueData {
  month: string;
  revenue: number;
  bookings: number;
}

export interface OccupancyData {
  date: string;
  occupancy: number;
}