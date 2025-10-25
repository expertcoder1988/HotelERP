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
import { roomService, Room, RoomType, CreateRoomRequest, UpdateRoomRequest } from '../services/roomService';

const statusColors: { [key: string]: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' } = {
  Available: 'success',
  Occupied: 'error',
  OutOfOrder: 'error',
  Cleaning: 'warning',
  Maintenance: 'info',
};

export const Rooms: React.FC = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [formData, setFormData] = useState<CreateRoomRequest>({
    roomNumber: '',
    floor: 1,
    roomTypeId: 0,
    notes: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [roomsData, roomTypesData] = await Promise.all([
        roomService.getRooms(),
        roomService.getRoomTypes(),
      ]);
      setRooms(roomsData);
      setRoomTypes(roomTypesData);
    } catch (err: any) {
      setError(err.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRoom = () => {
    setEditingRoom(null);
    setFormData({
      roomNumber: '',
      floor: 1,
      roomTypeId: 0,
      notes: '',
    });
    setOpenDialog(true);
  };

  const handleEditRoom = (room: Room) => {
    setEditingRoom(room);
    setFormData({
      roomNumber: room.roomNumber,
      floor: room.floor,
      roomTypeId: room.roomTypeId,
      notes: room.notes || '',
    });
    setOpenDialog(true);
  };

  const handleSaveRoom = async () => {
    try {
      if (editingRoom) {
        const updateData: UpdateRoomRequest = {
          floor: formData.floor,
          roomTypeId: formData.roomTypeId,
          notes: formData.notes,
        };
        await roomService.updateRoom(editingRoom.id, updateData);
      } else {
        await roomService.createRoom(formData);
      }
      setOpenDialog(false);
      fetchData();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save room');
    }
  };

  const handleDeleteRoom = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this room?')) {
      try {
        await roomService.deleteRoom(id);
        fetchData();
      } catch (err: any) {
        setError(err.message || 'Failed to delete room');
      }
    }
  };

  const handleStatusChange = async (id: number, newStatus: string) => {
    try {
      await roomService.updateRoom(id, { status: newStatus });
      fetchData();
    } catch (err: any) {
      setError(err.message || 'Failed to update room status');
    }
  };

  const columns: GridColDef[] = [
    { field: 'roomNumber', headerName: 'Room Number', width: 150 },
    { field: 'floor', headerName: 'Floor', width: 100 },
    { field: 'roomTypeName', headerName: 'Room Type', width: 200 },
    { field: 'basePrice', headerName: 'Price', width: 100, valueFormatter: (params) => `$${params.value}` },
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
      width: 150,
      getActions: (params) => [
        <GridActionsCellItem
          icon={<Edit />}
          label="Edit"
          onClick={() => handleEditRoom(params.row)}
        />,
        <GridActionsCellItem
          icon={<Delete />}
          label="Delete"
          onClick={() => handleDeleteRoom(params.row.id)}
        />,
      ],
    },
  ];

  const rows = rooms.map((room) => ({
    id: room.id,
    roomNumber: room.roomNumber,
    floor: room.floor,
    roomTypeName: room.roomType.name,
    basePrice: room.roomType.basePrice,
    status: room.status,
    isActive: room.isActive,
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
          Rooms
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleCreateRoom}
        >
          New Room
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

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingRoom ? 'Edit Room' : 'Create New Room'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Room Number"
                value={formData.roomNumber}
                onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
                required
                disabled={!!editingRoom}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Floor"
                type="number"
                value={formData.floor}
                onChange={(e) => setFormData({ ...formData, floor: Number(e.target.value) })}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth required>
                <InputLabel>Room Type</InputLabel>
                <Select
                  value={formData.roomTypeId}
                  onChange={(e) => setFormData({ ...formData, roomTypeId: Number(e.target.value) })}
                  label="Room Type"
                >
                  {roomTypes.map((roomType) => (
                    <MenuItem key={roomType.id} value={roomType.id}>
                      {roomType.name} - ${roomType.basePrice}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            {editingRoom && (
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={editingRoom.status}
                    onChange={(e) => handleStatusChange(editingRoom.id, e.target.value)}
                    label="Status"
                  >
                    <MenuItem value="Available">Available</MenuItem>
                    <MenuItem value="Occupied">Occupied</MenuItem>
                    <MenuItem value="OutOfOrder">Out of Order</MenuItem>
                    <MenuItem value="Cleaning">Cleaning</MenuItem>
                    <MenuItem value="Maintenance">Maintenance</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            )}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Notes"
                multiline
                rows={3}
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleSaveRoom} variant="contained">
            {editingRoom ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};