import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  IconButton,
  Alert,
  CircularProgress,
  Grid,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Visibility,
  CheckIn,
  CheckOut,
} from '@mui/icons-material';
import { DataGrid, GridColDef, GridActionsCellItem } from '@mui/x-data-grid';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { bookingService, Booking, CreateBookingRequest, UpdateBookingRequest } from '../services/bookingService';
import { guestService, Guest } from '../services/guestService';
import { roomService, Room } from '../services/roomService';
import { format } from 'date-fns';

const statusColors: { [key: string]: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' } = {
  Pending: 'warning',
  Confirmed: 'info',
  CheckedIn: 'success',
  CheckedOut: 'default',
  Cancelled: 'error',
  NoShow: 'error',
};

export const Bookings: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [guests, setGuests] = useState<Guest[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);
  const [formData, setFormData] = useState<CreateBookingRequest>({
    guestId: 0,
    roomId: 0,
    checkInDate: '',
    checkOutDate: '',
    numberOfGuests: 1,
    specialRequests: '',
    notes: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [bookingsData, guestsData, roomsData] = await Promise.all([
        bookingService.getBookings(),
        guestService.getGuests(),
        roomService.getAvailableRooms(),
      ]);
      setBookings(bookingsData);
      setGuests(guestsData);
      setRooms(roomsData);
    } catch (err: any) {
      setError(err.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBooking = () => {
    setEditingBooking(null);
    setFormData({
      guestId: 0,
      roomId: 0,
      checkInDate: '',
      checkOutDate: '',
      numberOfGuests: 1,
      specialRequests: '',
      notes: '',
    });
    setOpenDialog(true);
  };

  const handleEditBooking = (booking: Booking) => {
    setEditingBooking(booking);
    setFormData({
      guestId: booking.guest.id,
      roomId: booking.room.id,
      checkInDate: booking.checkInDate,
      checkOutDate: booking.checkOutDate,
      numberOfGuests: booking.numberOfGuests,
      specialRequests: booking.specialRequests || '',
      notes: booking.notes || '',
    });
    setOpenDialog(true);
  };

  const handleSaveBooking = async () => {
    try {
      if (editingBooking) {
        const updateData: UpdateBookingRequest = {
          checkInDate: formData.checkInDate,
          checkOutDate: formData.checkOutDate,
          numberOfGuests: formData.numberOfGuests,
          specialRequests: formData.specialRequests,
          notes: formData.notes,
        };
        await bookingService.updateBooking(editingBooking.id, updateData);
      } else {
        await bookingService.createBooking(formData);
      }
      setOpenDialog(false);
      fetchData();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save booking');
    }
  };

  const handleDeleteBooking = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this booking?')) {
      try {
        await bookingService.deleteBooking(id);
        fetchData();
      } catch (err: any) {
        setError(err.message || 'Failed to delete booking');
      }
    }
  };

  const handleStatusChange = async (id: number, newStatus: string) => {
    try {
      await bookingService.updateBooking(id, { status: newStatus });
      fetchData();
    } catch (err: any) {
      setError(err.message || 'Failed to update booking status');
    }
  };

  const columns: GridColDef[] = [
    { field: 'bookingNumber', headerName: 'Booking #', width: 150 },
    { field: 'guestName', headerName: 'Guest', width: 200 },
    { field: 'roomNumber', headerName: 'Room', width: 100 },
    {
      field: 'checkInDate',
      headerName: 'Check-in',
      width: 120,
      valueFormatter: (params) => format(new Date(params.value), 'MMM dd, yyyy'),
    },
    {
      field: 'checkOutDate',
      headerName: 'Check-out',
      width: 120,
      valueFormatter: (params) => format(new Date(params.value), 'MMM dd, yyyy'),
    },
    { field: 'numberOfGuests', headerName: 'Guests', width: 80 },
    {
      field: 'totalAmount',
      headerName: 'Total',
      width: 100,
      valueFormatter: (params) => `$${params.value.toFixed(2)}`,
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={statusColors[params.value] || 'default'}
          size="small"
        />
      ),
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 150,
      getActions: (params) => [
        <GridActionsCellItem
          icon={<Visibility />}
          label="View"
          onClick={() => handleEditBooking(params.row)}
        />,
        <GridActionsCellItem
          icon={<Edit />}
          label="Edit"
          onClick={() => handleEditBooking(params.row)}
        />,
        <GridActionsCellItem
          icon={<Delete />}
          label="Delete"
          onClick={() => handleDeleteBooking(params.row.id)}
        />,
      ],
    },
  ];

  const rows = bookings.map((booking) => ({
    id: booking.id,
    bookingNumber: booking.bookingNumber,
    guestName: `${booking.guest.firstName} ${booking.guest.lastName}`,
    roomNumber: booking.room.roomNumber,
    checkInDate: booking.checkInDate,
    checkOutDate: booking.checkOutDate,
    numberOfGuests: booking.numberOfGuests,
    totalAmount: booking.totalAmount,
    status: booking.status,
  }));

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
          Bookings
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleCreateBooking}
        >
          New Booking
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <Card>
        <CardContent>
          <DataGrid
            rows={rows}
            columns={columns}
            pageSizeOptions={[10, 25, 50]}
            initialState={{
              pagination: { paginationModel: { pageSize: 10 } },
            }}
            disableRowSelectionOnClick
            autoHeight
          />
        </CardContent>
      </Card>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingBooking ? 'Edit Booking' : 'Create New Booking'}
        </DialogTitle>
        <DialogContent>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel>Guest</InputLabel>
                  <Select
                    value={formData.guestId}
                    onChange={(e) => setFormData({ ...formData, guestId: Number(e.target.value) })}
                    label="Guest"
                  >
                    {guests.map((guest) => (
                      <MenuItem key={guest.id} value={guest.id}>
                        {guest.firstName} {guest.lastName}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel>Room</InputLabel>
                  <Select
                    value={formData.roomId}
                    onChange={(e) => setFormData({ ...formData, roomId: Number(e.target.value) })}
                    label="Room"
                  >
                    {rooms.map((room) => (
                      <MenuItem key={room.id} value={room.id}>
                        {room.roomNumber} - {room.roomType.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <DatePicker
                  label="Check-in Date"
                  value={formData.checkInDate ? new Date(formData.checkInDate) : null}
                  onChange={(date) => setFormData({ ...formData, checkInDate: date?.toISOString() || '' })}
                  slotProps={{ textField: { fullWidth: true, required: true } }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <DatePicker
                  label="Check-out Date"
                  value={formData.checkOutDate ? new Date(formData.checkOutDate) : null}
                  onChange={(date) => setFormData({ ...formData, checkOutDate: date?.toISOString() || '' })}
                  slotProps={{ textField: { fullWidth: true, required: true } }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Number of Guests"
                  type="number"
                  value={formData.numberOfGuests}
                  onChange={(e) => setFormData({ ...formData, numberOfGuests: Number(e.target.value) })}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={editingBooking?.status || 'Pending'}
                    onChange={(e) => editingBooking && handleStatusChange(editingBooking.id, e.target.value)}
                    label="Status"
                  >
                    <MenuItem value="Pending">Pending</MenuItem>
                    <MenuItem value="Confirmed">Confirmed</MenuItem>
                    <MenuItem value="CheckedIn">Checked In</MenuItem>
                    <MenuItem value="CheckedOut">Checked Out</MenuItem>
                    <MenuItem value="Cancelled">Cancelled</MenuItem>
                    <MenuItem value="NoShow">No Show</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Special Requests"
                  multiline
                  rows={3}
                  value={formData.specialRequests}
                  onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Notes"
                  multiline
                  rows={2}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
              </Grid>
            </Grid>
          </LocalizationProvider>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleSaveBooking} variant="contained">
            {editingBooking ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};