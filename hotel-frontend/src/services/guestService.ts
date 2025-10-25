import { api } from './api';

export interface Guest {
  id: number;
  firstName: string;
  lastName: string;
  email?: string;
  phoneNumber?: string;
  address?: string;
  nationality?: string;
  passportNumber?: string;
  dateOfBirth?: string;
  gender?: string;
  isVip: boolean;
  specialRequests?: string;
  createdAt: string;
  updatedAt?: string;
  bookings: any[];
}

export interface CreateGuestRequest {
  firstName: string;
  lastName: string;
  email?: string;
  phoneNumber?: string;
  address?: string;
  nationality?: string;
  passportNumber?: string;
  dateOfBirth?: string;
  gender?: string;
  isVip?: boolean;
  specialRequests?: string;
}

export interface UpdateGuestRequest {
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  address?: string;
  nationality?: string;
  passportNumber?: string;
  dateOfBirth?: string;
  gender?: string;
  isVip?: boolean;
  specialRequests?: string;
}

export const guestService = {
  async getGuests(params?: {
    search?: string;
    isVip?: boolean;
    page?: number;
    pageSize?: number;
  }): Promise<Guest[]> {
    const response = await api.get<Guest[]>('/guests', { params });
    return response.data;
  },

  async getGuest(id: number): Promise<Guest> {
    const response = await api.get<Guest>(`/guests/${id}`);
    return response.data;
  },

  async createGuest(guest: CreateGuestRequest): Promise<Guest> {
    const response = await api.post<Guest>('/guests', guest);
    return response.data;
  },

  async updateGuest(id: number, guest: UpdateGuestRequest): Promise<Guest> {
    const response = await api.put<Guest>(`/guests/${id}`, guest);
    return response.data;
  },

  async deleteGuest(id: number): Promise<void> {
    await api.delete(`/guests/${id}`);
  },
};