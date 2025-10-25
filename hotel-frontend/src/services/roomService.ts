import { api } from './api';

export interface Room {
  id: number;
  roomNumber: string;
  floor: number;
  status: string;
  notes?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
  roomType: {
    id: number;
    name: string;
    description?: string;
    basePrice: number;
    maxOccupancy: number;
    size: number;
    amenities?: string;
    isActive: boolean;
  };
}

export interface RoomType {
  id: number;
  name: string;
  description?: string;
  basePrice: number;
  maxOccupancy: number;
  size: number;
  amenities?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
  rooms: any[];
}

export interface CreateRoomRequest {
  roomNumber: string;
  floor: number;
  roomTypeId: number;
  notes?: string;
}

export interface UpdateRoomRequest {
  floor?: number;
  roomTypeId?: number;
  status?: string;
  notes?: string;
  isActive?: boolean;
}

export interface CreateRoomTypeRequest {
  name: string;
  description?: string;
  basePrice: number;
  maxOccupancy: number;
  size: number;
  amenities?: string;
}

export interface UpdateRoomTypeRequest {
  name?: string;
  description?: string;
  basePrice?: number;
  maxOccupancy?: number;
  size?: number;
  amenities?: string;
  isActive?: boolean;
}

export const roomService = {
  async getRooms(params?: {
    floor?: number;
    status?: string;
    roomTypeId?: number;
    isActive?: boolean;
    page?: number;
    pageSize?: number;
  }): Promise<Room[]> {
    const response = await api.get<Room[]>('/rooms', { params });
    return response.data;
  },

  async getRoom(id: number): Promise<Room> {
    const response = await api.get<Room>(`/rooms/${id}`);
    return response.data;
  },

  async createRoom(room: CreateRoomRequest): Promise<Room> {
    const response = await api.post<Room>('/rooms', room);
    return response.data;
  },

  async updateRoom(id: number, room: UpdateRoomRequest): Promise<Room> {
    const response = await api.put<Room>(`/rooms/${id}`, room);
    return response.data;
  },

  async deleteRoom(id: number): Promise<void> {
    await api.delete(`/rooms/${id}`);
  },

  async getAvailableRooms(params?: {
    checkIn?: string;
    checkOut?: string;
    roomTypeId?: number;
  }): Promise<Room[]> {
    const response = await api.get<Room[]>('/rooms/available', { params });
    return response.data;
  },

  async getRoomTypes(params?: {
    isActive?: boolean;
    page?: number;
    pageSize?: number;
  }): Promise<RoomType[]> {
    const response = await api.get<RoomType[]>('/roomtypes', { params });
    return response.data;
  },

  async getRoomType(id: number): Promise<RoomType> {
    const response = await api.get<RoomType>(`/roomtypes/${id}`);
    return response.data;
  },

  async createRoomType(roomType: CreateRoomTypeRequest): Promise<RoomType> {
    const response = await api.post<RoomType>('/roomtypes', roomType);
    return response.data;
  },

  async updateRoomType(id: number, roomType: UpdateRoomTypeRequest): Promise<RoomType> {
    const response = await api.put<RoomType>(`/roomtypes/${id}`, roomType);
    return response.data;
  },

  async deleteRoomType(id: number): Promise<void> {
    await api.delete(`/roomtypes/${id}`);
  },
};