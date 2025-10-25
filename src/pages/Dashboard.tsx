import React from 'react';
import { 
  Bed, 
  Users, 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  Clock,
  CheckCircle,
  AlertTriangle,
  Home
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { dashboardStats, revenueData, occupancyData, rooms, reservations, guests } from '../data/sampleData';

const Dashboard: React.FC = () => {
  const roomStatusData = [
    { name: 'Available', value: dashboardStats.availableRooms, color: '#10B981' },
    { name: 'Occupied', value: dashboardStats.occupiedRooms, color: '#EF4444' },
    { name: 'Reserved', value: dashboardStats.reservedRooms, color: '#3B82F6' },
    { name: 'Maintenance', value: dashboardStats.maintenanceRooms, color: '#F59E0B' },
  ];

  const recentReservations = reservations.slice(0, 5);

  const StatCard: React.FC<{
    title: string;
    value: string | number;
    icon: React.ComponentType<any>;
    trend?: number;
    color: string;
  }> = ({ title, value, icon: Icon, trend, color }) => (
    <div className="card animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {trend !== undefined && (
            <div className={`flex items-center mt-2 text-sm ${trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {trend >= 0 ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
              {Math.abs(trend)}% from last month
            </div>
          )}
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="animate-slide-up">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome back! Here's what's happening at your hotel today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Revenue"
          value={`$${dashboardStats.totalRevenue.toLocaleString()}`}
          icon={DollarSign}
          trend={12}
          color="bg-green-500"
        />
        <StatCard
          title="Occupancy Rate"
          value={`${dashboardStats.occupancyRate}%`}
          icon={Home}
          trend={5}
          color="bg-blue-500"
        />
        <StatCard
          title="Today's Check-ins"
          value={dashboardStats.todayCheckIns}
          icon={Calendar}
          color="bg-purple-500"
        />
        <StatCard
          title="Available Rooms"
          value={dashboardStats.availableRooms}
          icon={Bed}
          color="bg-indigo-500"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="card animate-slide-up">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Revenue</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => [`$${value}`, 'Revenue']} />
              <Bar dataKey="revenue" fill="#3B82F6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Occupancy Trend */}
        <div className="card animate-slide-up">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Occupancy Trend (Last 10 Days)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={occupancyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} />
              <YAxis />
              <Tooltip formatter={(value) => [`${value}%`, 'Occupancy']} />
              <Line type="monotone" dataKey="occupancy" stroke="#10B981" strokeWidth={3} dot={{ fill: '#10B981' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Room Status and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Room Status Pie Chart */}
        <div className="card animate-slide-up">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Room Status</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={roomStatusData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {roomStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {roomStatusData.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.color }}></div>
                  <span className="text-sm text-gray-600">{item.name}</span>
                </div>
                <span className="text-sm font-medium">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Reservations */}
        <div className="card animate-slide-up">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Reservations</h3>
          <div className="space-y-3">
            {recentReservations.map((reservation) => {
              const guest = guests.find(g => g.id === reservation.guestId);
              const room = rooms.find(r => r.id === reservation.roomId);
              
              return (
                <div key={reservation.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{guest?.firstName} {guest?.lastName}</p>
                    <p className="text-sm text-gray-500">Room {room?.number}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">${reservation.totalAmount}</p>
                    <span className={`status-badge ${
                      reservation.status === 'confirmed' ? 'status-reserved' :
                      reservation.status === 'checked-in' ? 'status-occupied' :
                      'status-available'
                    }`}>
                      {reservation.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card animate-slide-up">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button className="w-full btn btn-primary py-3">
              <Calendar className="h-4 w-4 mr-2" />
              New Reservation
            </button>
            <button className="w-full btn btn-secondary py-3">
              <Users className="h-4 w-4 mr-2" />
              Add Guest
            </button>
            <button className="w-full btn btn-secondary py-3">
              <CheckCircle className="h-4 w-4 mr-2" />
              Check-in Guest
            </button>
            <button className="w-full btn btn-warning py-3">
              <AlertTriangle className="h-4 w-4 mr-2" />
              Room Maintenance
            </button>
          </div>
        </div>
      </div>

      {/* Today's Schedule */}
      <div className="card animate-slide-up">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Today's Schedule</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-3 flex items-center">
              <Clock className="h-4 w-4 mr-2 text-green-600" />
              Check-ins ({dashboardStats.todayCheckIns})
            </h4>
            <div className="space-y-2">
              {reservations.filter(r => r.status === 'confirmed').slice(0, 3).map((reservation) => {
                const guest = guests.find(g => g.id === reservation.guestId);
                const room = rooms.find(r => r.id === reservation.roomId);
                
                return (
                  <div key={reservation.id} className="flex items-center justify-between p-2 bg-green-50 rounded">
                    <div>
                      <p className="font-medium text-gray-900">{guest?.firstName} {guest?.lastName}</p>
                      <p className="text-sm text-gray-500">Room {room?.number}</p>
                    </div>
                    <span className="text-sm text-green-600 font-medium">3:00 PM</span>
                  </div>
                );
              })}
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-900 mb-3 flex items-center">
              <Clock className="h-4 w-4 mr-2 text-red-600" />
              Check-outs ({dashboardStats.todayCheckOuts})
            </h4>
            <div className="space-y-2">
              {reservations.filter(r => r.status === 'checked-in').slice(0, 2).map((reservation) => {
                const guest = guests.find(g => g.id === reservation.guestId);
                const room = rooms.find(r => r.id === reservation.roomId);
                
                return (
                  <div key={reservation.id} className="flex items-center justify-between p-2 bg-red-50 rounded">
                    <div>
                      <p className="font-medium text-gray-900">{guest?.firstName} {guest?.lastName}</p>
                      <p className="text-sm text-gray-500">Room {room?.number}</p>
                    </div>
                    <span className="text-sm text-red-600 font-medium">11:00 AM</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;