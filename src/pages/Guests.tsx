import React, { useState } from 'react';
import { 
  Users, 
  Plus, 
  Search, 
  Edit,
  Star,
  Mail,
  Phone,
  MapPin,
  Calendar,
  CreditCard
} from 'lucide-react';
import { guests, reservations, rooms } from '../data/sampleData';
import { Guest } from '../types';

const Guests: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterVip, setFilterVip] = useState<string>('all');
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null);

  const filteredGuests = guests.filter(guest => {
    const matchesSearch = 
      guest.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guest.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guest.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guest.phone.includes(searchTerm) ||
      guest.nationality.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesVip = filterVip === 'all' || 
                      (filterVip === 'vip' && guest.vipStatus) ||
                      (filterVip === 'regular' && !guest.vipStatus);
    
    return matchesSearch && matchesVip;
  });

  const getGuestReservations = (guestId: string) => {
    return reservations.filter(r => r.guestId === guestId);
  };

  const GuestCard: React.FC<{ guest: Guest }> = ({ guest }) => {
    const guestReservations = getGuestReservations(guest.id);
    const lastStay = guestReservations
      .filter(r => r.status === 'checked-out')
      .sort((a, b) => b.checkOut.getTime() - a.checkOut.getTime())[0];

    return (
      <div className="card hover:shadow-md transition-shadow animate-fade-in cursor-pointer" 
           onClick={() => setSelectedGuest(guest)}>
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            {guest.avatar ? (
              <img 
                src={guest.avatar} 
                alt={`${guest.firstName} ${guest.lastName}`}
                className="w-16 h-16 rounded-full object-cover"
              />
            ) : (
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                <Users className="h-8 w-8 text-primary-600" />
              </div>
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 truncate">
                {guest.firstName} {guest.lastName}
              </h3>
              {guest.vipStatus && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                  <Star className="h-3 w-3 mr-1" />
                  VIP
                </span>
              )}
            </div>
            
            <div className="mt-1 space-y-1">
              <div className="flex items-center text-sm text-gray-600">
                <Mail className="h-4 w-4 mr-2 flex-shrink-0" />
                <span className="truncate">{guest.email}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Phone className="h-4 w-4 mr-2 flex-shrink-0" />
                <span>{guest.phone}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                <span className="truncate">{guest.nationality}</span>
              </div>
            </div>
            
            <div className="mt-3 grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-lg font-bold text-primary-600">{guest.totalStays}</p>
                <p className="text-xs text-gray-500">Stays</p>
              </div>
              <div>
                <p className="text-lg font-bold text-green-600">${guest.totalSpent.toLocaleString()}</p>
                <p className="text-xs text-gray-500">Spent</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">
                  {lastStay ? new Date(lastStay.checkOut).toLocaleDateString() : 'Never'}
                </p>
                <p className="text-xs text-gray-500">Last Stay</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const GuestDetailModal: React.FC<{ guest: Guest; onClose: () => void }> = ({ guest, onClose }) => {
    const guestReservations = getGuestReservations(guest.id);
    const upcomingReservations = guestReservations.filter(r => 
      r.status === 'confirmed' || r.status === 'checked-in'
    );
    const pastReservations = guestReservations.filter(r => 
      r.status === 'checked-out'
    ).sort((a, b) => b.checkOut.getTime() - a.checkOut.getTime());

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-bounce-in">
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">Guest Profile</h2>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>
          
          <div className="p-6 space-y-6">
            {/* Guest Info */}
            <div className="flex items-start space-x-6">
              <div className="flex-shrink-0">
                {guest.avatar ? (
                  <img 
                    src={guest.avatar} 
                    alt={`${guest.firstName} ${guest.lastName}`}
                    className="w-24 h-24 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center">
                    <Users className="h-12 w-12 text-primary-600" />
                  </div>
                )}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="text-2xl font-bold text-gray-900">
                    {guest.firstName} {guest.lastName}
                  </h3>
                  {guest.vipStatus && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                      <Star className="h-4 w-4 mr-1" />
                      VIP Guest
                    </span>
                  )}
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="space-y-2">
                    <div className="flex items-center text-gray-600">
                      <Mail className="h-4 w-4 mr-2" />
                      {guest.email}
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Phone className="h-4 w-4 mr-2" />
                      {guest.phone}
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Calendar className="h-4 w-4 mr-2" />
                      Born {guest.dateOfBirth.toLocaleDateString()}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center text-gray-600">
                      <MapPin className="h-4 w-4 mr-2" />
                      {guest.nationality}
                    </div>
                    <div className="flex items-center text-gray-600">
                      <CreditCard className="h-4 w-4 mr-2" />
                      ID: {guest.idNumber}
                    </div>
                    <div className="flex items-center text-gray-600">
                      <MapPin className="h-4 w-4 mr-2" />
                      {guest.address}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <div className="grid grid-cols-1 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-primary-600">{guest.totalStays}</p>
                    <p className="text-sm text-gray-500">Total Stays</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">${guest.totalSpent.toLocaleString()}</p>
                    <p className="text-sm text-gray-500">Total Spent</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Preferences */}
            {guest.preferences.length > 0 && (
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Preferences</h4>
                <div className="flex flex-wrap gap-2">
                  {guest.preferences.map((preference, index) => (
                    <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                      {preference}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Upcoming Reservations */}
            {upcomingReservations.length > 0 && (
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Upcoming Reservations</h4>
                <div className="space-y-3">
                  {upcomingReservations.map((reservation) => {
                    const room = rooms.find(r => r.id === reservation.roomId);
                    return (
                      <div key={reservation.id} className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">Room {room?.number}</p>
                          <p className="text-sm text-gray-600">
                            {reservation.checkIn.toLocaleDateString()} - {reservation.checkOut.toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">${reservation.totalAmount}</p>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            reservation.status === 'confirmed' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                          }`}>
                            {reservation.status}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Reservation History */}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-3">Reservation History</h4>
              {pastReservations.length > 0 ? (
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {pastReservations.map((reservation) => {
                    const room = rooms.find(r => r.id === reservation.roomId);
                    return (
                      <div key={reservation.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">Room {room?.number}</p>
                          <p className="text-sm text-gray-600">
                            {reservation.checkIn.toLocaleDateString()} - {reservation.checkOut.toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">${reservation.totalAmount}</p>
                          <p className="text-xs text-gray-500">Completed</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">No past reservations</p>
              )}
            </div>

            {/* Actions */}
            <div className="flex space-x-3 pt-4 border-t border-gray-200">
              <button className="btn btn-primary">
                <Plus className="h-4 w-4 mr-2" />
                New Reservation
              </button>
              <button className="btn btn-secondary">
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
              </button>
              <button className="btn btn-secondary">
                <Mail className="h-4 w-4 mr-2" />
                Send Email
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center animate-slide-up">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Guest Management</h1>
          <p className="text-gray-600 mt-2">Manage guest profiles, preferences, and history</p>
        </div>
        <button className="btn btn-primary">
          <Plus className="h-4 w-4 mr-2" />
          Add Guest
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card text-center animate-fade-in">
          <div className="text-2xl font-bold text-gray-900">{guests.length}</div>
          <div className="text-gray-600">Total Guests</div>
        </div>
        <div className="card text-center animate-fade-in">
          <div className="text-2xl font-bold text-yellow-600">{guests.filter(g => g.vipStatus).length}</div>
          <div className="text-gray-600">VIP Guests</div>
        </div>
        <div className="card text-center animate-fade-in">
          <div className="text-2xl font-bold text-green-600">
            ${guests.reduce((sum, g) => sum + g.totalSpent, 0).toLocaleString()}
          </div>
          <div className="text-gray-600">Total Revenue</div>
        </div>
        <div className="card text-center animate-fade-in">
          <div className="text-2xl font-bold text-blue-600">
            {(guests.reduce((sum, g) => sum + g.totalSpent, 0) / guests.length).toFixed(0)}
          </div>
          <div className="text-gray-600">Avg. Spend</div>
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
                placeholder="Search guests by name, email, phone, or nationality..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent w-full"
              />
            </div>
          </div>
          
          <div className="flex gap-4">
            <select
              value={filterVip}
              onChange={(e) => setFilterVip(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">All Guests</option>
              <option value="vip">VIP Guests</option>
              <option value="regular">Regular Guests</option>
            </select>
          </div>
        </div>
      </div>

      {/* Guests Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGuests.map((guest) => (
          <GuestCard key={guest.id} guest={guest} />
        ))}
      </div>

      {filteredGuests.length === 0 && (
        <div className="text-center py-12 animate-fade-in">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No guests found</h3>
          <p className="text-gray-600">Try adjusting your search or filter criteria</p>
        </div>
      )}

      {/* Guest Detail Modal */}
      {selectedGuest && (
        <GuestDetailModal 
          guest={selectedGuest} 
          onClose={() => setSelectedGuest(null)} 
        />
      )}
    </div>
  );
};

export default Guests;