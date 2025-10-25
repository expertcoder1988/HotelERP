import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Paper,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Hotel,
  People,
  Bed,
  AttachMoney,
  TrendingUp,
  CheckIn,
  CheckOut,
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { dashboardService, DashboardStats, RecentBooking, RevenueChartData, RoomOccupancy } from '../services/dashboardService';
import { format } from 'date-fns';

const StatCard: React.FC<{
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  subtitle?: string;
}> = ({ title, value, icon, color, subtitle }) => (
  <Card>
    <CardContent>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Box>
          <Typography color="textSecondary" gutterBottom variant="h6">
            {title}
          </Typography>
          <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
            {value}
          </Typography>
          {subtitle && (
            <Typography color="textSecondary" variant="body2">
              {subtitle}
            </Typography>
          )}
        </Box>
        <Box
          sx={{
            backgroundColor: color,
            borderRadius: '50%',
            p: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {icon}
        </Box>
      </Box>
    </CardContent>
  </Card>
);

export const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentBookings, setRecentBookings] = useState<RecentBooking[]>([]);
  const [revenueData, setRevenueData] = useState<RevenueChartData[]>([]);
  const [roomOccupancy, setRoomOccupancy] = useState<RoomOccupancy[]>([]);
  const [upcomingCheckIns, setUpcomingCheckIns] = useState<RecentBooking[]>([]);
  const [upcomingCheckOuts, setUpcomingCheckOuts] = useState<RecentBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [
          statsData,
          recentBookingsData,
          revenueData,
          roomOccupancyData,
          upcomingCheckInsData,
          upcomingCheckOutsData,
        ] = await Promise.all([
          dashboardService.getStats(),
          dashboardService.getRecentBookings(5),
          dashboardService.getRevenueChart(6),
          dashboardService.getRoomOccupancy(),
          dashboardService.getUpcomingCheckIns(),
          dashboardService.getUpcomingCheckOuts(),
        ]);

        setStats(statsData);
        setRecentBookings(recentBookingsData);
        setRevenueData(revenueData);
        setRoomOccupancy(roomOccupancyData);
        setUpcomingCheckIns(upcomingCheckInsData);
        setUpcomingCheckOuts(upcomingCheckOutsData);
      } catch (err: any) {
        setError(err.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    );
  }

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
        Dashboard
      </Typography>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Rooms"
            value={stats?.totalRooms || 0}
            icon={<Hotel sx={{ color: 'white' }} />}
            color="#1976d2"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Available Rooms"
            value={stats?.availableRooms || 0}
            icon={<Bed sx={{ color: 'white' }} />}
            color="#2e7d32"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Occupied Rooms"
            value={stats?.occupiedRooms || 0}
            icon={<People sx={{ color: 'white' }} />}
            color="#d32f2f"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Bookings"
            value={stats?.totalBookings || 0}
            icon={<TrendingUp sx={{ color: 'white' }} />}
            color="#ed6c02"
          />
        </Grid>
      </Grid>

      {/* Revenue Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={4}>
          <StatCard
            title="Today's Revenue"
            value={`$${stats?.todayRevenue?.toFixed(2) || '0.00'}`}
            icon={<AttachMoney sx={{ color: 'white' }} />}
            color="#9c27b0"
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <StatCard
            title="Monthly Revenue"
            value={`$${stats?.monthlyRevenue?.toFixed(2) || '0.00'}`}
            icon={<TrendingUp sx={{ color: 'white' }} />}
            color="#f57c00"
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <StatCard
            title="Total Revenue"
            value={`$${stats?.totalRevenue?.toFixed(2) || '0.00'}`}
            icon={<AttachMoney sx={{ color: 'white' }} />}
            color="#388e3c"
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Revenue Chart */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Revenue Trend
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="period" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`$${value}`, 'Revenue']} />
                  <Line type="monotone" dataKey="revenue" stroke="#1976d2" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Room Occupancy */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Room Occupancy
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={roomOccupancy}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ roomType, occupancyRate }) => `${roomType}: ${occupancyRate}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="occupancyRate"
                  >
                    {roomOccupancy.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Bookings */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Bookings
              </Typography>
              <Box>
                {recentBookings.map((booking) => (
                  <Paper key={booking.id} sx={{ p: 2, mb: 1 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Box>
                        <Typography variant="subtitle2" fontWeight="bold">
                          {booking.bookingNumber}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {booking.guestName} - {booking.roomNumber}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {format(new Date(booking.checkInDate), 'MMM dd')} - {format(new Date(booking.checkOutDate), 'MMM dd')}
                        </Typography>
                      </Box>
                      <Box textAlign="right">
                        <Typography variant="h6" color="primary">
                          ${booking.totalAmount}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {booking.status}
                        </Typography>
                      </Box>
                    </Box>
                  </Paper>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Upcoming Check-ins/Check-outs */}
        <Grid item xs={12} md={6}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    <CheckIn sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Today's Check-ins
                  </Typography>
                  <Box>
                    {upcomingCheckIns.map((booking) => (
                      <Paper key={booking.id} sx={{ p: 2, mb: 1 }}>
                        <Typography variant="subtitle2" fontWeight="bold">
                          {booking.guestName}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Room {booking.roomNumber} - {format(new Date(booking.checkInDate), 'HH:mm')}
                        </Typography>
                      </Paper>
                    ))}
                    {upcomingCheckIns.length === 0 && (
                      <Typography variant="body2" color="text.secondary">
                        No check-ins today
                      </Typography>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    <CheckOut sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Today's Check-outs
                  </Typography>
                  <Box>
                    {upcomingCheckOuts.map((booking) => (
                      <Paper key={booking.id} sx={{ p: 2, mb: 1 }}>
                        <Typography variant="subtitle2" fontWeight="bold">
                          {booking.guestName}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Room {booking.roomNumber} - {format(new Date(booking.checkOutDate), 'HH:mm')}
                        </Typography>
                      </Paper>
                    ))}
                    {upcomingCheckOuts.length === 0 && (
                      <Typography variant="body2" color="text.secondary">
                        No check-outs today
                      </Typography>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};