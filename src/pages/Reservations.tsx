import React, { useState } from 'react';
import { 
  Calendar, 
  Plus, 
  Search, 
  Eye,
  Edit,
  CheckCircle,
  Clock,
  Users,
  Bed,
  Phone,
  Mail
} from 'lucide-react';
import { reservations, guests, rooms } from '../data/sampleData';
import { Reservation } from '../types';
import { format, addDays, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay } from 'date-fns';

const Reservations: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [selectedDate, setSelectedDate] = useState(new Date());

  const filteredReservations = reservations.filter(reservation => {
    const guest = guests.find(g => g.id === reservation.guestId);
    const room = rooms.find(r => r.id === reservation.roomId);
    
    const matchesSearch = 
      guest?.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guest?.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guest?.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room?.number.includes(searchTerm) ||
      reservation.id.includes(searchTerm);
    
    const matchesStatus = filterStatus === 'all' || reservation.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: Reservation['status']) => {
    switch (status) {
      case 'confirmed': return 'status-reserved';
      case 'checked-in': return 'status-occupied';
      case 'checked-out': return 'status-available';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      case 'no-show': return 'bg-red-100 text-red-800';
      default: return 'status-reserved';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'status-available';
      case 'partial': return 'status-maintenance';
      case 'pending': return 'status-occupied';
      case 'refunded': return 'bg-gray-100 text-gray-800';
      default: return 'status-reserved';
    }
  };

  // Calendar view helpers
  const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(selectedDate, { weekStartsOn: 1 });
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

  const getReservationsForDate = (date: Date) => {
    return reservations.filter(reservation => 
      (reservation.checkIn <= date && reservation.checkOut > date) ||
      isSameDay(reservation.checkIn, date) ||
      isSameDay(reservation.checkOut, date)
    );
  };

  const ReservationCard: React.FC<{ reservation: Reservation }> = ({ reservation }) => {
    const guest = guests.find(g => g.id === reservation.guestId);
    const room = rooms.find(r => r.id === reservation.roomId);
    const nights = Math.ceil((reservation.checkOut.getTime() - reservation.checkIn.getTime()) / (1000 * 60 * 60 * 24));

    return (
      <div className="card hover:shadow-md transition-shadow animate-fade-in">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
              <Users className="h-5 w-5 text-primary-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {guest?.firstName} {guest?.lastName}
              </h3>
              <p className="text-sm text-gray-600">Reservation #{reservation.id}</p>
            </div>
          </div>
          <span className={`${getStatusColor(reservation.status)} capitalize`}>
            {reservation.status.replace('-', ' ')}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="space-y-2">
            <div className="flex items-center text-sm text-gray-600">
              <Bed className="h-4 w-4 mr-2" />
              Room {room?.number} ({room?.type})
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <Calendar className="h-4 w-4 mr-2" />
              {format(reservation.checkIn, 'MMM dd')} - {format(reservation.checkOut, 'MMM dd')}
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <Clock className="h-4 w-4 mr-2" />
              {nights} night{nights > 1 ? 's' : ''}
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center text-sm text-gray-600">
              <Users className="h-4 w-4 mr-2" />
              {reservation.adults} adult{reservation.adults > 1 ? 's' : ''}{reservation.children > 0 && `, ${reservation.children} child${reservation.children > 1 ? 'ren' : ''}`}
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <Mail className="h-4 w-4 mr-2" />
              {guest?.email}
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <Phone className="h-4 w-4 mr-2" />
              {guest?.phone}
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center pt-4 border-t border-gray-200">
          <div>
            <p className="text-lg font-bold text-gray-900">${reservation.totalAmount}</p>
            <div className="flex items-center space-x-2">
              <span className={`text-xs px-2 py-1 rounded-full ${getPaymentStatusColor(reservation.paymentStatus)}`}>
                {reservation.paymentStatus}
              </span>
              {reservation.paymentStatus === 'partial' && (
                <span className="text-xs text-gray-500">
                  ${reservation.paidAmount} paid
                </span>
              )}
            </div>
          </div>
          
          <div className="flex space-x-2">
            <button className="btn btn-secondary text-sm py-2">
              <Eye className="h-4 w-4 mr-1" />
              View
            </button>
            <button className="btn btn-primary text-sm py-2">
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </button>
            {reservation.status === 'confirmed' && (
              <button className="btn btn-success text-sm py-2">
                <CheckCircle className="h-4 w-4 mr-1" />
                Check-in
              </button>
            )}
            {reservation.status === 'checked-in' && (
              <button className="btn btn-warning text-sm py-2">
                <CheckCircle className="h-4 w-4 mr-1" />
                Check-out
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  const CalendarView: React.FC = () => (
    <div className="card animate-slide-up">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          Week of {format(weekStart, 'MMM dd, yyyy')}
        </h3>
        <div className="flex space-x-2">
          <button 
            onClick={() => setSelectedDate(addDays(selectedDate, -7))}
            className="btn btn-secondary text-sm"
          >
            Previous Week
          </button>
          <button 
            onClick={() => setSelectedDate(addDays(selectedDate, 7))}
            className="btn btn-secondary text-sm"
          >
            Next Week
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-7 gap-2">
        {weekDays.map((day) => {
          const dayReservations = getReservationsForDate(day);
          const isToday = isSameDay(day, new Date());
          
          return (
            <div key={day.toISOString()} className={`border rounded-lg p-3 min-h-[120px] ${isToday ? 'bg-primary-50 border-primary-200' : 'bg-white border-gray-200'}`}>
              <div className={`text-sm font-medium mb-2 ${isToday ? 'text-primary-700' : 'text-gray-900'}`}>
                {format(day, 'EEE dd')}
              </div>
              
              <div className="space-y-1">
                {dayReservations.slice(0, 3).map((reservation) => {
                  const guest = guests.find(g => g.id === reservation.guestId);
                  const room = rooms.find(r => r.id === reservation.roomId);
                  const isCheckIn = isSameDay(reservation.checkIn, day);
                  const isCheckOut = isSameDay(reservation.checkOut, day);
                  
                  return (
                    <div 
                      key={reservation.id} 
                      className={`text-xs p-1 rounded text-white truncate ${
                        isCheckIn ? 'bg-green-500' : isCheckOut ? 'bg-red-500' : 'bg-blue-500'
                      }`}
                      title={`${guest?.firstName} ${guest?.lastName} - Room ${room?.number}`}
                    >
                      {isCheckIn && '→ '}{isCheckOut && '← '}
                      {guest?.firstName} - {room?.number}
                    </div>
                  );
                })}
                {dayReservations.length > 3 && (
                  <div className="text-xs text-gray-500">
                    +{dayReservations.length - 3} more
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="flex items-center space-x-6 mt-4 text-sm">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-500 rounded"></div>
          <span>Check-in</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-red-500 rounded"></div>
          <span>Check-out</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-blue-500 rounded"></div>
          <span>Staying</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center animate-slide-up">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reservations</h1>
          <p className="text-gray-600 mt-2">Manage bookings, check-ins, and check-outs</p>
        </div>
        <button className="btn btn-primary">
          <Plus className="h-4 w-4 mr-2" />
          New Reservation
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card text-center animate-fade-in">
          <div className="text-2xl font-bold text-gray-900">{reservations.length}</div>
          <div className="text-gray-600">Total Reservations</div>
        </div>
        <div className="card text-center animate-fade-in">
          <div className="text-2xl font-bold text-blue-600">{reservations.filter(r => r.status === 'confirmed').length}</div>
          <div className="text-gray-600">Confirmed</div>
        </div>
        <div className="card text-center animate-fade-in">
          <div className="text-2xl font-bold text-green-600">{reservations.filter(r => r.status === 'checked-in').length}</div>
          <div className="text-gray-600">Checked In</div>
        </div>
        <div className="card text-center animate-fade-in">
          <div className="text-2xl font-bold text-purple-600">
            ${reservations.reduce((sum, r) => sum + r.totalAmount, 0).toLocaleString()}
          </div>
          <div className="text-gray-600">Total Revenue</div>
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
                placeholder="Search by guest name, email, room, or reservation ID..."
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
              <option value="confirmed">Confirmed</option>
              <option value="checked-in">Checked In</option>
              <option value="checked-out">Checked Out</option>
              <option value="cancelled">Cancelled</option>
              <option value="no-show">No Show</option>
            </select>
            
            <div className="flex border border-gray-300 rounded-lg">
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-2 text-sm ${viewMode === 'list' ? 'bg-primary-600 text-white' : 'text-gray-600 hover:bg-gray-50'} rounded-l-lg`}
              >
                List
              </button>
              <button
                onClick={() => setViewMode('calendar')}
                className={`px-3 py-2 text-sm ${viewMode === 'calendar' ? 'bg-primary-600 text-white' : 'text-gray-600 hover:bg-gray-50'} rounded-r-lg`}
              >
                Calendar
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      {viewMode === 'calendar' ? (
        <CalendarView />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredReservations.map((reservation) => (
            <ReservationCard key={reservation.id} reservation={reservation} />
          ))}
        </div>
      )}

      {filteredReservations.length === 0 && viewMode === 'list' && (
        <div className="text-center py-12 animate-fade-in">
          <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No reservations found</h3>
          <p className="text-gray-600">Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  );
};

export default Reservations;