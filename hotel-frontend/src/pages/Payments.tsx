import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Alert,
  CircularProgress,
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { bookingService, Booking } from '../services/bookingService';
import { format } from 'date-fns';

const statusColors: { [key: string]: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' } = {
  Pending: 'warning',
  Completed: 'success',
  Failed: 'error',
  Refunded: 'info',
  Cancelled: 'error',
};

const methodColors: { [key: string]: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' } = {
  Cash: 'success',
  CreditCard: 'primary',
  DebitCard: 'info',
  BankTransfer: 'secondary',
  Check: 'warning',
  Other: 'default',
};

export const Payments: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const data = await bookingService.getBookings();
      setBookings(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load payments');
    } finally {
      setLoading(false);
    }
  };

  const columns: GridColDef[] = [
    { field: 'bookingNumber', headerName: 'Booking #', width: 150 },
    { field: 'guestName', headerName: 'Guest', width: 200 },
    { field: 'roomNumber', headerName: 'Room', width: 100 },
    {
      field: 'totalAmount',
      headerName: 'Total Amount',
      width: 120,
      valueFormatter: (params) => `$${params.value.toFixed(2)}`,
    },
    {
      field: 'paidAmount',
      headerName: 'Paid Amount',
      width: 120,
      valueFormatter: (params) => `$${params.value.toFixed(2)}`,
    },
    {
      field: 'balance',
      headerName: 'Balance',
      width: 120,
      valueFormatter: (params) => `$${(params.row.totalAmount - params.row.paidAmount).toFixed(2)}`,
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
      field: 'createdAt',
      headerName: 'Created',
      width: 120,
      valueFormatter: (params) => format(new Date(params.value), 'MMM dd, yyyy'),
    },
  ];

  const rows = bookings.map((booking) => ({
    id: booking.id,
    bookingNumber: booking.bookingNumber,
    guestName: `${booking.guest.firstName} ${booking.guest.lastName}`,
    roomNumber: booking.room.roomNumber,
    totalAmount: booking.totalAmount,
    paidAmount: booking.paidAmount,
    status: booking.status,
    createdAt: booking.createdAt,
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
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
        Payments
      </Typography>

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
    </Box>
  );
};