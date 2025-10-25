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
} from '@mui/icons-material';
import { DataGrid, GridColDef, GridActionsCellItem } from '@mui/x-data-grid';
import { roomService, RoomType, CreateRoomTypeRequest, UpdateRoomTypeRequest } from '../services/roomService';

export const RoomTypes: React.FC = () => {
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [editingRoomType, setEditingRoomType] = useState<RoomType | null>(null);
  const [formData, setFormData] = useState<CreateRoomTypeRequest>({
    name: '',
    description: '',
    basePrice: 0,
    maxOccupancy: 1,
    size: 0,
    amenities: '',
  });

  useEffect(() => {
    fetchRoomTypes();
  }, []);

  const fetchRoomTypes = async () => {
    try {
      setLoading(true);
      const data = await roomService.getRoomTypes();
      setRoomTypes(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load room types');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRoomType = () => {
    setEditingRoomType(null);
    setFormData({
      name: '',
      description: '',
      basePrice: 0,
      maxOccupancy: 1,
      size: 0,
      amenities: '',
    });
    setOpenDialog(true);
  };

  const handleEditRoomType = (roomType: RoomType) => {
    setEditingRoomType(roomType);
    setFormData({
      name: roomType.name,
      description: roomType.description || '',
      basePrice: roomType.basePrice,
      maxOccupancy: roomType.maxOccupancy,
      size: roomType.size,
      amenities: roomType.amenities || '',
    });
    setOpenDialog(true);
  };

  const handleSaveRoomType = async () => {
    try {
      if (editingRoomType) {
        await roomService.updateRoomType(editingRoomType.id, formData);
      } else {
        await roomService.createRoomType(formData);
      }
      setOpenDialog(false);
      fetchRoomTypes();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save room type');
    }
  };

  const handleDeleteRoomType = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this room type?')) {
      try {
        await roomService.deleteRoomType(id);
        fetchRoomTypes();
      } catch (err: any) {
        setError(err.message || 'Failed to delete room type');
      }
    }
  };

  const columns: GridColDef[] = [
    { field: 'name', headerName: 'Name', width: 200 },
    { field: 'description', headerName: 'Description', width: 300 },
    { field: 'basePrice', headerName: 'Base Price', width: 120, valueFormatter: (params) => `$${params.value}` },
    { field: 'maxOccupancy', headerName: 'Max Occupancy', width: 120 },
    { field: 'size', headerName: 'Size (sqm)', width: 120 },
    {
      field: 'isActive',
      headerName: 'Active',
      width: 100,
      renderCell: (params) => (
        <Chip
          label={params.value ? 'Yes' : 'No'}
          color={params.value ? 'success' : 'default'}
          size="small"
        />
      ),
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
          onClick={() => handleEditRoomType(params.row)}
        />,
        <GridActionsCellItem
          icon={<Delete />}
          label="Delete"
          onClick={() => handleDeleteRoomType(params.row.id)}
        />,
      ],
    },
  ];

  const rows = roomTypes.map((roomType) => ({
    id: roomType.id,
    name: roomType.name,
    description: roomType.description || '',
    basePrice: roomType.basePrice,
    maxOccupancy: roomType.maxOccupancy,
    size: roomType.size,
    isActive: roomType.isActive,
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
          Room Types
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleCreateRoomType}
        >
          New Room Type
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
          {editingRoomType ? 'Edit Room Type' : 'Create New Room Type'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Base Price"
                type="number"
                value={formData.basePrice}
                onChange={(e) => setFormData({ ...formData, basePrice: Number(e.target.value) })}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Max Occupancy"
                type="number"
                value={formData.maxOccupancy}
                onChange={(e) => setFormData({ ...formData, maxOccupancy: Number(e.target.value) })}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Size (sqm)"
                type="number"
                value={formData.size}
                onChange={(e) => setFormData({ ...formData, size: Number(e.target.value) })}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Amenities"
                multiline
                rows={2}
                value={formData.amenities}
                onChange={(e) => setFormData({ ...formData, amenities: e.target.value })}
                placeholder="WiFi, TV, Air Conditioning, etc."
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleSaveRoomType} variant="contained">
            {editingRoomType ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};