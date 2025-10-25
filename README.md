# 🏨 Hotel Management System

A comprehensive, professional hotel management system built with **React** frontend, **.NET Core 8 Web API** backend, and **SQL Server** database.

## ✨ Features

### 🎯 Core Functionality
- **Guest Management** - Complete guest registration, profiles, and history
- **Room Management** - Room types, availability, and status tracking
- **Booking System** - Reservations, check-in/out, modifications
- **Payment Processing** - Multiple payment methods and tracking
- **Staff Management** - User roles and permissions
- **Services Management** - Hotel services and amenities
- **Reports & Analytics** - Comprehensive reporting dashboard

### 🎨 Modern UI/UX
- **Responsive Design** - Works on desktop, tablet, and mobile
- **Material-UI Components** - Professional, modern interface
- **Interactive Dashboard** - Real-time statistics and charts
- **Data Grids** - Advanced table functionality with sorting, filtering
- **Form Validation** - Client and server-side validation
- **Dark/Light Theme** - Customizable theme support

### 🔐 Security & Authentication
- **JWT Authentication** - Secure token-based authentication
- **Role-based Authorization** - Admin, Manager, Receptionist, Staff roles
- **Password Hashing** - BCrypt password encryption
- **API Security** - CORS, HTTPS, and input validation

## 🏗️ Architecture

### Backend (.NET Core 8 Web API)
```
HotelManagement.API/          # Web API project
├── Controllers/              # API endpoints
├── Program.cs               # Application startup
└── appsettings.json        # Configuration

HotelManagement.Core/         # Domain layer
├── Entities/               # Domain models
├── DTOs/                   # Data transfer objects
├── Interfaces/             # Repository interfaces
└── Services/               # Business logic

HotelManagement.Infrastructure/ # Data layer
├── Data/                   # DbContext and configurations
├── Repositories/           # Repository implementations
└── Services/               # Infrastructure services
```

### Frontend (React + TypeScript)
```
hotel-frontend/
├── src/
│   ├── components/         # Reusable UI components
│   ├── pages/             # Main application pages
│   ├── services/          # API service layer
│   ├── contexts/          # React contexts
│   └── App.tsx           # Main application component
├── public/                # Static assets
└── package.json          # Dependencies
```

## 🚀 Quick Start

### Prerequisites
- **.NET 8 SDK** - [Download](https://dotnet.microsoft.com/download/dotnet/8.0)
- **Node.js 18+** - [Download](https://nodejs.org/)
- **SQL Server** - [Download](https://www.microsoft.com/en-us/sql-server/sql-server-downloads)
- **Visual Studio 2022** or **VS Code** - Recommended IDEs

### Backend Setup

1. **Clone and Navigate**
   ```bash
   cd HotelManagement.API
   ```

2. **Restore Dependencies**
   ```bash
   dotnet restore
   ```

3. **Update Connection String**
   Edit `appsettings.json`:
   ```json
   {
     "ConnectionStrings": {
       "DefaultConnection": "Server=(localdb)\\mssqllocaldb;Database=HotelManagementDb;Trusted_Connection=true;MultipleActiveResultSets=true"
     }
   }
   ```

4. **Run the Application**
   ```bash
   dotnet run
   ```
   - API will be available at: `https://localhost:7001`
   - Swagger UI at: `https://localhost:7001/swagger`

### Frontend Setup

1. **Navigate to Frontend**
   ```bash
   cd hotel-frontend
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Start Development Server**
   ```bash
   npm start
   ```
   - Frontend will be available at: `http://localhost:3000`

### Database Setup

The database will be automatically created and seeded with sample data when you first run the backend application.

**Default Admin Credentials:**
- **Email:** admin@hotel.com
- **Password:** Admin123!

## 📊 Database Schema

### Core Tables
- **Users** - Staff and admin accounts
- **Guests** - Hotel guests and customer information
- **RoomTypes** - Room categories and pricing
- **Rooms** - Individual room details and status
- **Bookings** - Reservations and check-in/out records
- **Payments** - Payment transactions and history
- **Services** - Hotel services and amenities
- **ServiceBookings** - Service reservations

### Key Relationships
- Guests → Bookings (One-to-Many)
- Rooms → Bookings (One-to-Many)
- RoomTypes → Rooms (One-to-Many)
- Bookings → Payments (One-to-Many)
- Users → Bookings (One-to-Many)

## 🎯 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/refresh-token` - Refresh JWT token

### Bookings
- `GET /api/bookings` - Get all bookings
- `GET /api/bookings/{id}` - Get booking by ID
- `POST /api/bookings` - Create new booking
- `PUT /api/bookings/{id}` - Update booking
- `DELETE /api/bookings/{id}` - Delete booking

### Guests
- `GET /api/guests` - Get all guests
- `GET /api/guests/{id}` - Get guest by ID
- `POST /api/guests` - Create new guest
- `PUT /api/guests/{id}` - Update guest
- `DELETE /api/guests/{id}` - Delete guest

### Rooms
- `GET /api/rooms` - Get all rooms
- `GET /api/rooms/available` - Get available rooms
- `POST /api/rooms` - Create new room
- `PUT /api/rooms/{id}` - Update room

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics
- `GET /api/dashboard/revenue-chart` - Get revenue data
- `GET /api/dashboard/room-occupancy` - Get occupancy data

## 🎨 Frontend Pages

### Dashboard
- Real-time statistics and KPIs
- Revenue charts and trends
- Room occupancy visualization
- Upcoming check-ins/check-outs

### Bookings Management
- Complete booking lifecycle
- Search and filter capabilities
- Status management
- Guest and room assignment

### Guest Management
- Guest profiles and history
- VIP status tracking
- Contact information management
- Booking history

### Room Management
- Room inventory and status
- Room type configuration
- Availability tracking
- Maintenance scheduling

### Reports & Analytics
- Revenue analysis
- Occupancy reports
- Booking trends
- Custom date ranges

## 🔧 Configuration

### Backend Configuration
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Your SQL Server connection string"
  },
  "Jwt": {
    "Key": "Your JWT secret key (32+ characters)",
    "Issuer": "HotelManagementAPI",
    "Audience": "HotelManagementClient"
  }
}
```

### Frontend Configuration
```env
REACT_APP_API_URL=https://localhost:7001/api
```

## 🚀 Deployment

### Backend Deployment
1. **Publish the API**
   ```bash
   dotnet publish -c Release -o ./publish
   ```

2. **Deploy to IIS/Azure/Linux**
   - Configure connection strings
   - Set up SSL certificates
   - Configure CORS for production domain

### Frontend Deployment
1. **Build for Production**
   ```bash
   npm run build
   ```

2. **Deploy to Static Hosting**
   - Upload `build` folder to hosting service
   - Configure API URL for production
   - Set up HTTPS

## 🧪 Testing

### Backend Testing
```bash
# Run unit tests
dotnet test

# Run with coverage
dotnet test --collect:"XPlat Code Coverage"
```

### Frontend Testing
```bash
# Run tests
npm test

# Run with coverage
npm test -- --coverage
```

## 📝 API Documentation

The API includes comprehensive Swagger documentation available at:
- **Development:** `https://localhost:7001/swagger`
- **Production:** `https://your-domain.com/swagger`

## 🔒 Security Features

- **JWT Authentication** with refresh tokens
- **Password Hashing** using BCrypt
- **CORS Configuration** for cross-origin requests
- **Input Validation** on all endpoints
- **SQL Injection Protection** via Entity Framework
- **HTTPS Enforcement** in production

## 🎯 User Roles

### Admin
- Full system access
- User management
- System configuration
- All reports and analytics

### Manager
- Booking management
- Guest management
- Room management
- Financial reports

### Receptionist
- Check-in/check-out
- Guest registration
- Basic booking management
- Room status updates

### Staff
- Limited access to assigned functions
- Basic guest services
- Room maintenance updates

## 🚀 Performance Features

- **Entity Framework** with optimized queries
- **Lazy Loading** for related data
- **Pagination** on all list endpoints
- **Caching** for frequently accessed data
- **Async/Await** throughout the application
- **React Virtualization** for large datasets

## 📱 Mobile Responsiveness

The frontend is fully responsive and works seamlessly on:
- **Desktop** (1200px+)
- **Tablet** (768px - 1199px)
- **Mobile** (320px - 767px)

## 🔧 Troubleshooting

### Common Issues

1. **Database Connection Issues**
   - Verify SQL Server is running
   - Check connection string format
   - Ensure database permissions

2. **CORS Issues**
   - Verify CORS configuration in Program.cs
   - Check frontend API URL configuration

3. **Authentication Issues**
   - Verify JWT configuration
   - Check token expiration settings
   - Ensure proper role assignments

### Logs
- Backend logs are written to `logs/` directory
- Frontend errors appear in browser console
- Database logs available in SQL Server logs

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the API documentation in Swagger

## 🎉 Acknowledgments

- **Material-UI** for the component library
- **Recharts** for data visualization
- **Entity Framework** for data access
- **React** and **.NET Core** communities

---

**Built with ❤️ for modern hotel management needs**