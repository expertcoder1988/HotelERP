import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { dashboardService, RevenueChartData, RoomOccupancy } from '../services/dashboardService';
import { format, subMonths } from 'date-fns';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export const Reports: React.FC = () => {
  const [revenueData, setRevenueData] = useState<RevenueChartData[]>([]);
  const [roomOccupancy, setRoomOccupancy] = useState<RoomOccupancy[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reportType, setReportType] = useState('revenue');
  const [dateRange, setDateRange] = useState({
    startDate: subMonths(new Date(), 6),
    endDate: new Date(),
  });

  useEffect(() => {
    fetchReportData();
  }, [reportType, dateRange]);

  const fetchReportData = async () => {
    try {
      setLoading(true);
      const [revenueData, roomOccupancyData] = await Promise.all([
        dashboardService.getRevenueChart(6),
        dashboardService.getRoomOccupancy(),
      ]);
      setRevenueData(revenueData);
      setRoomOccupancy(roomOccupancyData);
    } catch (err: any) {
      setError(err.message || 'Failed to load report data');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateReport = () => {
    fetchReportData();
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
        Reports & Analytics
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {/* Report Controls */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={3}>
              <FormControl fullWidth>
                <InputLabel>Report Type</InputLabel>
                <Select
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value)}
                  label="Report Type"
                >
                  <MenuItem value="revenue">Revenue Analysis</MenuItem>
                  <MenuItem value="occupancy">Room Occupancy</MenuItem>
                  <MenuItem value="bookings">Booking Trends</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={3}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Start Date"
                  value={dateRange.startDate}
                  onChange={(date) => setDateRange({ ...dateRange, startDate: date || new Date() })}
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} sm={3}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="End Date"
                  value={dateRange.endDate}
                  onChange={(date) => setDateRange({ ...dateRange, endDate: date || new Date() })}
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} sm={3}>
              <Button
                variant="contained"
                onClick={handleGenerateReport}
                fullWidth
                sx={{ height: '56px' }}
              >
                Generate Report
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Grid container spacing={3}>
        {/* Revenue Chart */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Revenue Trend
              </Typography>
              <ResponsiveContainer width="100%" height={400}>
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

        {/* Room Occupancy Pie Chart */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Room Occupancy by Type
              </Typography>
              <ResponsiveContainer width="100%" height={400}>
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

        {/* Booking Trends */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Booking Trends
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="period" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="bookings" fill="#00C49F" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Room Occupancy Bar Chart */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Room Occupancy Details
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={roomOccupancy}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="roomType" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="totalRooms" fill="#8884D8" name="Total Rooms" />
                  <Bar dataKey="occupiedRooms" fill="#FF8042" name="Occupied Rooms" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Summary Statistics */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Summary Statistics
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={3}>
                  <Box textAlign="center" p={2}>
                    <Typography variant="h4" color="primary">
                      {revenueData.reduce((sum, item) => sum + item.revenue, 0).toFixed(0)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Revenue ($)
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <Box textAlign="center" p={2}>
                    <Typography variant="h4" color="success.main">
                      {revenueData.reduce((sum, item) => sum + item.bookings, 0)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Bookings
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <Box textAlign="center" p={2}>
                    <Typography variant="h4" color="info.main">
                      {roomOccupancy.reduce((sum, item) => sum + item.totalRooms, 0)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Rooms
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <Box textAlign="center" p={2}>
                    <Typography variant="h4" color="warning.main">
                      {roomOccupancy.length > 0 
                        ? (roomOccupancy.reduce((sum, item) => sum + item.occupancyRate, 0) / roomOccupancy.length).toFixed(1)
                        : 0}%
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Avg Occupancy Rate
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};