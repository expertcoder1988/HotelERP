import { api } from './api';

export interface Booking {
  id: number;
  bookingNumber: string;
  checkInDate: string;
  checkOutDate: string;
  numberOfGuests: number;
  totalAmount: number;
  paidAmount: number;
  status: string;
  specialRequests?: string;
  notes?: string;
  createdAt: string;
  updatedAt?: string;
  guest: {
    id: number;
    firstName: string;
    lastName: string;
    email?: string;
    phoneNumber?: string;
  };
  room: {
    id: number;
    roomNumber: string;
    floor: number;
    status: string;
    roomType: {
      id: number;
      name: string;
      basePrice: number;
    };
  };
  user?: {
    id: number;
    firstName: string;
    lastName: string;
  };
  payments: any[];
}

export interface CreateBookingRequest {
  guestId: number;
  roomId: number;
  checkInDate: string;
  checkOutDate: string;
  numberOfGuests: number;
  specialRequests?: string;
  notes?: string;
}

export interface UpdateBookingRequest {
  checkInDate?: string;
  checkOutDate?: string;
  numberOfGuests?: number;
  status?: string;
  specialRequests?: string;
  notes?: string;
}

export const bookingService = {
  async getBookings(params?: {
    status?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    pageSize?: number;
  }): Promise<Booking[]> {
    const response = await api.get<Booking[]>('/bookings', { params });
    return response.data;
  },

  async getBooking(id: number): Promise<Booking> {
    const response = await api.get<Booking>(`/bookings/${id}`);
    return response.data;
  },

  async createBooking(booking: CreateBookingRequest): Promise<Booking> {
    const response = await api.post<Booking>('/bookings', booking);
    return response.data;
  },

  async updateBooking(id: number, booking: UpdateBookingRequest): Promise<Booking> {
    const response = await api.put<Booking>(`/bookings/${id}`, booking);
    return response.data;
  },

  async deleteBooking(id: number): Promise<void> {
    await api.delete(`/bookings/${id}`);
  },

  async getUpcomingCheckIns(date?: string): Promise<Booking[]> {
    const response = await api.get<Booking[]>('/bookings/upcoming-checkins', {
      params: date ? { date } : {}
    });
    return response.data;
  },

  async getUpcomingCheckOuts(date?: string): Promise<Booking[]> {
    const response = await api.get<Booking[]>('/bookings/upcoming-checkouts', {
      params: date ? { date } : {}
    });
    return response.data;
  },
};