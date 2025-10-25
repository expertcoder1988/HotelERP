import React, { useState } from 'react';
import { 
  Bed, 
  Plus, 
  Search, 
  Edit, 
  Eye,
  Wrench,
  Wifi,
  Tv,
  Snowflake,
  Coffee,
  Car,
  Waves
} from 'lucide-react';
import { rooms } from '../data/sampleData';
import { Room } from '../types';

const Rooms: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filteredRooms = rooms.filter(room => {
    const matchesSearch = room.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         room.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (room.currentGuest && room.currentGuest.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = filterStatus === 'all' || room.status === filterStatus;
    const matchesType = filterType === 'all' || room.type === filterType;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusColor = (status: Room['status']) => {
    switch (status) {
      case 'available': return 'status-available';
      case 'occupied': return 'status-occupied';
      case 'maintenance': return 'status-maintenance';
      case 'reserved': return 'status-reserved';
      default: return 'status-available';
    }
  };

  const getAmenityIcon = (amenity: string) => {
    switch (amenity.toLowerCase()) {
      case 'wifi': return <Wifi className="h-4 w-4" />;
      case 'tv': return <Tv className="h-4 w-4" />;
      case 'ac': return <Snowflake className="h-4 w-4" />;
      case 'mini bar': return <Coffee className="h-4 w-4" />;
      case 'balcony': return <Eye className="h-4 w-4" />;
      case 'parking': return <Car className="h-4 w-4" />;
      case 'jacuzzi': return <Waves className="h-4 w-4" />;
      default: return <Coffee className="h-4 w-4" />;
    }
  };

  const RoomCard: React.FC<{ room: Room }> = ({ room }) => (
    <div className="card hover:shadow-md transition-shadow animate-fade-in">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Room {room.number}</h3>
          <p className="text-gray-600 capitalize">{room.type} Room</p>
        </div>
        <span className={`${getStatusColor(room.status)} capitalize`}>
          {room.status}
        </span>
      </div>
      
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Price per night</span>
          <span className="text-xl font-bold text-primary-600">${room.price}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Floor</span>
          <span className="font-medium">{room.floor}</span>
        </div>
        
        {room.currentGuest && (
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Current Guest</span>
            <span className="font-medium">{room.currentGuest}</span>
          </div>
        )}
        
        <div>
          <span className="text-gray-600 text-sm">Amenities</span>
          <div className="flex flex-wrap gap-2 mt-1">
            {room.amenities.slice(0, 4).map((amenity, index) => (
              <div key={index} className="flex items-center space-x-1 bg-gray-100 px-2 py-1 rounded text-xs">
                {getAmenityIcon(amenity)}
                <span>{amenity}</span>
              </div>
            ))}
            {room.amenities.length > 4 && (
              <span className="text-xs text-gray-500">+{room.amenities.length - 4} more</span>
            )}
          </div>
        </div>
        
        <div className="flex space-x-2 pt-3 border-t border-gray-200">
          <button className="btn btn-primary flex-1 text-sm py-2">
            <Eye className="h-4 w-4 mr-1" />
            View
          </button>
          <button className="btn btn-secondary text-sm py-2">
            <Edit className="h-4 w-4" />
          </button>
          <button className="btn btn-warning text-sm py-2">
            <Wrench className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );

  const RoomListItem: React.FC<{ room: Room }> = ({ room }) => (
    <div className="card animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
              <Bed className="h-6 w-6 text-primary-600" />
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Room {room.number}</h3>
            <p className="text-gray-600 capitalize">{room.type} Room • Floor {room.floor}</p>
            {room.currentGuest && (
              <p className="text-sm text-gray-500">Guest: {room.currentGuest}</p>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-6">
          <div className="text-right">
            <p className="text-lg font-bold text-primary-600">${room.price}</p>
            <p className="text-sm text-gray-500">per night</p>
          </div>
          
          <span className={`${getStatusColor(room.status)} capitalize`}>
            {room.status}
          </span>
          
          <div className="flex space-x-2">
            <button className="btn btn-primary text-sm py-2">
              <Eye className="h-4 w-4 mr-1" />
              View
            </button>
            <button className="btn btn-secondary text-sm py-2">
              <Edit className="h-4 w-4" />
            </button>
            <button className="btn btn-warning text-sm py-2">
              <Wrench className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center animate-slide-up">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Rooms Management</h1>
          <p className="text-gray-600 mt-2">Manage your hotel rooms, availability, and maintenance</p>
        </div>
        <button className="btn btn-primary">
          <Plus className="h-4 w-4 mr-2" />
          Add Room
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card text-center animate-fade-in">
          <div className="text-2xl font-bold text-gray-900">{rooms.length}</div>
          <div className="text-gray-600">Total Rooms</div>
        </div>
        <div className="card text-center animate-fade-in">
          <div className="text-2xl font-bold text-green-600">{rooms.filter(r => r.status === 'available').length}</div>
          <div className="text-gray-600">Available</div>
        </div>
        <div className="card text-center animate-fade-in">
          <div className="text-2xl font-bold text-red-600">{rooms.filter(r => r.status === 'occupied').length}</div>
          <div className="text-gray-600">Occupied</div>
        </div>
        <div className="card text-center animate-fade-in">
          <div className="text-2xl font-bold text-yellow-600">{rooms.filter(r => r.status === 'maintenance').length}</div>
          <div className="text-gray-600">Maintenance</div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="card animate-slide-up">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search rooms by number, type, or guest..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent w-full"
              />
            </div>
          </div>
          
          <div className="flex gap-4">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="available">Available</option>
              <option value="occupied">Occupied</option>
              <option value="reserved">Reserved</option>
              <option value="maintenance">Maintenance</option>
            </select>
            
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="single">Single</option>
              <option value="double">Double</option>
              <option value="suite">Suite</option>
              <option value="deluxe">Deluxe</option>
            </select>
            
            <div className="flex border border-gray-300 rounded-lg">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-2 text-sm ${viewMode === 'grid' ? 'bg-primary-600 text-white' : 'text-gray-600 hover:bg-gray-50'} rounded-l-lg`}
              >
                Grid
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-2 text-sm ${viewMode === 'list' ? 'bg-primary-600 text-white' : 'text-gray-600 hover:bg-gray-50'} rounded-r-lg`}
              >
                List
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Rooms Display */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRooms.map((room) => (
            <RoomCard key={room.id} room={room} />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredRooms.map((room) => (
            <RoomListItem key={room.id} room={room} />
          ))}
        </div>
      )}

      {filteredRooms.length === 0 && (
        <div className="text-center py-12 animate-fade-in">
          <Bed className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No rooms found</h3>
          <p className="text-gray-600">Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  );
};

export default Rooms;