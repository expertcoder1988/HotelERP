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
  Chip,
  IconButton,
  Alert,
  CircularProgress,
  Grid,
  FormControlLabel,
  Switch,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Search,
} from '@mui/icons-material';
import { DataGrid, GridColDef, GridActionsCellItem } from '@mui/x-data-grid';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { guestService, Guest, CreateGuestRequest, UpdateGuestRequest } from '../services/guestService';
import { format } from 'date-fns';

export const Guests: React.FC = () => {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [editingGuest, setEditingGuest] = useState<Guest | null>(null);
  const [formData, setFormData] = useState<CreateGuestRequest>({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    address: '',
    nationality: '',
    passportNumber: '',
    dateOfBirth: '',
    gender: '',
    isVip: false,
    specialRequests: '',
  });

  useEffect(() => {
    fetchGuests();
  }, []);

  const fetchGuests = async () => {
    try {
      setLoading(true);
      const data = await guestService.getGuests({ search: searchTerm });
      setGuests(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load guests');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGuest = () => {
    setEditingGuest(null);
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      address: '',
      nationality: '',
      passportNumber: '',
      dateOfBirth: '',
      gender: '',
      isVip: false,
      specialRequests: '',
    });
    setOpenDialog(true);
  };

  const handleEditGuest = (guest: Guest) => {
    setEditingGuest(guest);
    setFormData({
      firstName: guest.firstName,
      lastName: guest.lastName,
      email: guest.email || '',
      phoneNumber: guest.phoneNumber || '',
      address: guest.address || '',
      nationality: guest.nationality || '',
      passportNumber: guest.passportNumber || '',
      dateOfBirth: guest.dateOfBirth || '',
      gender: guest.gender || '',
      isVip: guest.isVip,
      specialRequests: guest.specialRequests || '',
    });
    setOpenDialog(true);
  };

  const handleSaveGuest = async () => {
    try {
      if (editingGuest) {
        await guestService.updateGuest(editingGuest.id, formData);
      } else {
        await guestService.createGuest(formData);
      }
      setOpenDialog(false);
      fetchGuests();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save guest');
    }
  };

  const handleDeleteGuest = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this guest?')) {
      try {
        await guestService.deleteGuest(id);
        fetchGuests();
      } catch (err: any) {
        setError(err.message || 'Failed to delete guest');
      }
    }
  };

  const columns: GridColDef[] = [
    { field: 'firstName', headerName: 'First Name', width: 150 },
    { field: 'lastName', headerName: 'Last Name', width: 150 },
    { field: 'email', headerName: 'Email', width: 200 },
    { field: 'phoneNumber', headerName: 'Phone', width: 150 },
    { field: 'nationality', headerName: 'Nationality', width: 120 },
    {
      field: 'isVip',
      headerName: 'VIP',
      width: 80,
      renderCell: (params) => (
        <Chip
          label={params.value ? 'VIP' : 'Regular'}
          color={params.value ? 'primary' : 'default'}
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
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 120,
      getActions: (params) => [
        <GridActionsCellItem
          icon={<Edit />}
          label="Edit"
          onClick={() => handleEditGuest(params.row)}
        />,
        <GridActionsCellItem
          icon={<Delete />}
          label="Delete"
          onClick={() => handleDeleteGuest(params.row.id)}
        />,
      ],
    },
  ];

  const rows = guests.map((guest) => ({
    id: guest.id,
    firstName: guest.firstName,
    lastName: guest.lastName,
    email: guest.email || '',
    phoneNumber: guest.phoneNumber || '',
    nationality: guest.nationality || '',
    isVip: guest.isVip,
    createdAt: guest.createdAt,
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
          Guests
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleCreateGuest}
        >
          New Guest
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <Card sx={{ mb: 2 }}>
        <CardContent>
          <TextField
            fullWidth
            placeholder="Search guests..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />,
            }}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                fetchGuests();
              }
            }}
          />
        </CardContent>
      </Card>

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
          {editingGuest ? 'Edit Guest' : 'Create New Guest'}
        </DialogTitle>
        <DialogContent>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="First Name"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Last Name"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Nationality"
                  value={formData.nationality}
                  onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Passport Number"
                  value={formData.passportNumber}
                  onChange={(e) => setFormData({ ...formData, passportNumber: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <DatePicker
                  label="Date of Birth"
                  value={formData.dateOfBirth ? new Date(formData.dateOfBirth) : null}
                  onChange={(date) => setFormData({ ...formData, dateOfBirth: date?.toISOString() || '' })}
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Gender"
                  select
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                >
                  <MenuItem value="Male">Male</MenuItem>
                  <MenuItem value="Female">Female</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.isVip}
                      onChange={(e) => setFormData({ ...formData, isVip: e.target.checked })}
                    />
                  }
                  label="VIP Guest"
                />
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
            </Grid>
          </LocalizationProvider>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleSaveGuest} variant="contained">
            {editingGuest ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};