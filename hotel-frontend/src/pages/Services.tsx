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
} from '@mui/icons-material';
import { DataGrid, GridColDef, GridActionsCellItem } from '@mui/x-data-grid';

interface Service {
  id: number;
  name: string;
  description?: string;
  price: number;
  category: string;
  isActive: boolean;
  notes?: string;
  createdAt: string;
  updatedAt?: string;
}

const categoryColors: { [key: string]: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' } = {
  Food: 'error',
  Beverage: 'warning',
  Spa: 'info',
  Laundry: 'secondary',
  Transportation: 'primary',
  Entertainment: 'success',
  Other: 'default',
};

export const Services: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    category: 'Other',
    notes: '',
  });

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      // Mock data for now
      const mockServices: Service[] = [
        {
          id: 1,
          name: 'Room Service',
          description: 'In-room dining service',
          price: 25.00,
          category: 'Food',
          isActive: true,
          createdAt: new Date().toISOString(),
        },
        {
          id: 2,
          name: 'Spa Treatment',
          description: 'Relaxing spa and wellness treatment',
          price: 80.00,
          category: 'Spa',
          isActive: true,
          createdAt: new Date().toISOString(),
        },
        {
          id: 3,
          name: 'Laundry Service',
          description: 'Professional laundry and dry cleaning',
          price: 15.00,
          category: 'Laundry',
          isActive: true,
          createdAt: new Date().toISOString(),
        },
        {
          id: 4,
          name: 'Airport Transfer',
          description: 'Complimentary airport pickup and drop-off',
          price: 50.00,
          category: 'Transportation',
          isActive: true,
          createdAt: new Date().toISOString(),
        },
      ];
      setServices(mockServices);
    } catch (err: any) {
      setError(err.message || 'Failed to load services');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateService = () => {
    setEditingService(null);
    setFormData({
      name: '',
      description: '',
      price: 0,
      category: 'Other',
      notes: '',
    });
    setOpenDialog(true);
  };

  const handleEditService = (service: Service) => {
    setEditingService(service);
    setFormData({
      name: service.name,
      description: service.description || '',
      price: service.price,
      category: service.category,
      notes: service.notes || '',
    });
    setOpenDialog(true);
  };

  const handleSaveService = async () => {
    try {
      // Mock save - in real app, call API
      if (editingService) {
        setServices(services.map(s => s.id === editingService.id ? { ...s, ...formData } : s));
      } else {
        const newService: Service = {
          id: Math.max(...services.map(s => s.id)) + 1,
          ...formData,
          isActive: true,
          createdAt: new Date().toISOString(),
        };
        setServices([...services, newService]);
      }
      setOpenDialog(false);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save service');
    }
  };

  const handleDeleteService = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      try {
        setServices(services.filter(s => s.id !== id));
      } catch (err: any) {
        setError(err.message || 'Failed to delete service');
      }
    }
  };

  const columns: GridColDef[] = [
    { field: 'name', headerName: 'Name', width: 200 },
    { field: 'description', headerName: 'Description', width: 300 },
    { field: 'price', headerName: 'Price', width: 100, valueFormatter: (params) => `$${params.value}` },
    {
      field: 'category',
      headerName: 'Category',
      width: 120,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={categoryColors[params.value] || 'default'}
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
      width: 120,
      getActions: (params) => [
        <GridActionsCellItem
          icon={<Edit />}
          label="Edit"
          onClick={() => handleEditService(params.row)}
        />,
        <GridActionsCellItem
          icon={<Delete />}
          label="Delete"
          onClick={() => handleDeleteService(params.row.id)}
        />,
      ],
    },
  ];

  const rows = services.map((service) => ({
    id: service.id,
    name: service.name,
    description: service.description || '',
    price: service.price,
    category: service.category,
    isActive: service.isActive,
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
          Services
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleCreateService}
        >
          New Service
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
          {editingService ? 'Edit Service' : 'Create New Service'}
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
                label="Price"
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  label="Category"
                >
                  <MenuItem value="Food">Food</MenuItem>
                  <MenuItem value="Beverage">Beverage</MenuItem>
                  <MenuItem value="Spa">Spa</MenuItem>
                  <MenuItem value="Laundry">Laundry</MenuItem>
                  <MenuItem value="Transportation">Transportation</MenuItem>
                  <MenuItem value="Entertainment">Entertainment</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </Select>
              </FormControl>
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
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleSaveService} variant="contained">
            {editingService ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};