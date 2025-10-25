import { api } from './api';

export interface DashboardStats {
  totalRooms: number;
  availableRooms: number;
  occupiedRooms: number;
  totalBookings: number;
  pendingBookings: number;
  checkedInGuests: number;
  todayRevenue: number;
  monthlyRevenue: number;
  totalRevenue: number;
}

export interface RecentBooking {
  id: number;
  bookingNumber: string;
  guestName: string;
  roomNumber: string;
  checkInDate: string;
  checkOutDate: string;
  totalAmount: number;
  status: string;
}

export interface RevenueChartData {
  period: string;
  revenue: number;
  bookings: number;
}

export interface RoomOccupancy {
  roomType: string;
  totalRooms: number;
  occupiedRooms: number;
  occupancyRate: number;
}

export const dashboardService = {
  async getStats(): Promise<DashboardStats> {
    const response = await api.get<DashboardStats>('/dashboard/stats');
    return response.data;
  },

  async getRecentBookings(count: number = 10): Promise<RecentBooking[]> {
    const response = await api.get<RecentBooking[]>('/dashboard/recent-bookings', {
      params: { count }
    });
    return response.data;
  },

  async getRevenueChart(months: number = 12): Promise<RevenueChartData[]> {
    const response = await api.get<RevenueChartData[]>('/dashboard/revenue-chart', {
      params: { months }
    });
    return response.data;
  },

  async getRoomOccupancy(): Promise<RoomOccupancy[]> {
    const response = await api.get<RoomOccupancy[]>('/dashboard/room-occupancy');
    return response.data;
  },

  async getUpcomingCheckIns(date?: string): Promise<RecentBooking[]> {
    const response = await api.get<RecentBooking[]>('/dashboard/upcoming-checkins', {
      params: date ? { date } : {}
    });
    return response.data;
  },

  async getUpcomingCheckOuts(date?: string): Promise<RecentBooking[]> {
    const response = await api.get<RecentBooking[]>('/dashboard/upcoming-checkouts', {
      params: date ? { date } : {}
    });
    return response.data;
  },
};