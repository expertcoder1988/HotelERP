# 📁 Hotel Management System - Project Structure

## 🏗️ Complete Project Overview

```
HotelManagement/
├── 📁 HotelManagement.API/                 # .NET Core 8 Web API
│   ├── 📁 Controllers/                     # API Controllers
│   │   ├── AuthController.cs              # Authentication endpoints
│   │   ├── BookingsController.cs          # Booking management
│   │   ├── GuestsController.cs            # Guest management
│   │   ├── RoomsController.cs             # Room management
│   │   ├── RoomTypesController.cs         # Room type management
│   │   └── DashboardController.cs         # Dashboard analytics
│   ├── 📁 Data/                           # Database context
│   │   └── HotelDbContext.cs              # Entity Framework context
│   ├── Program.cs                         # Application startup
│   ├── appsettings.json                   # Configuration
│   └── HotelManagement.API.csproj         # Project file
│
├── 📁 HotelManagement.Core/               # Domain Layer
│   ├── 📁 Entities/                       # Domain models
│   │   ├── BaseEntity.cs                  # Base entity class
│   │   ├── User.cs                        # User entity
│   │   ├── Guest.cs                       # Guest entity
│   │   ├── Room.cs                        # Room entity
│   │   ├── RoomType.cs                    # Room type entity
│   │   ├── Booking.cs                     # Booking entity
│   │   ├── Payment.cs                     # Payment entity
│   │   ├── Service.cs                     # Service entity
│   │   └── ServiceBooking.cs              # Service booking entity
│   ├── 📁 DTOs/                          # Data Transfer Objects
│   │   ├── AuthDto.cs                     # Authentication DTOs
│   │   ├── BookingDto.cs                  # Booking DTOs
│   │   ├── GuestDto.cs                    # Guest DTOs
│   │   ├── RoomDto.cs                     # Room DTOs
│   │   ├── RoomTypeDto.cs                 # Room type DTOs
│   │   ├── PaymentDto.cs                  # Payment DTOs
│   │   ├── ServiceDto.cs                  # Service DTOs
│   │   └── DashboardDto.cs                # Dashboard DTOs
│   ├── 📁 Interfaces/                     # Repository interfaces
│   │   ├── IGenericRepository.cs          # Generic repository
│   │   ├── IUnitOfWork.cs                 # Unit of work pattern
│   │   ├── IBookingRepository.cs          # Booking repository
│   │   └── IAuthService.cs                # Auth service interface
│   └── HotelManagement.Core.csproj        # Core project file
│
├── 📁 HotelManagement.Infrastructure/     # Infrastructure Layer
│   ├── 📁 Data/                          # Data access
│   │   └── HotelDbContext.cs             # EF DbContext
│   ├── 📁 Repositories/                  # Repository implementations
│   │   ├── GenericRepository.cs          # Generic repository
│   │   ├── UnitOfWork.cs                 # Unit of work implementation
│   │   └── BookingRepository.cs          # Booking repository
│   ├── 📁 Services/                      # Infrastructure services
│   │   └── AuthService.cs                # Authentication service
│   └── HotelManagement.Infrastructure.csproj
│
├── 📁 hotel-frontend/                     # React Frontend
│   ├── 📁 public/                        # Static assets
│   │   └── index.html                    # Main HTML file
│   ├── 📁 src/                           # Source code
│   │   ├── 📁 components/                # React components
│   │   │   ├── Layout.tsx                # Main layout component
│   │   │   └── ProtectedRoute.tsx        # Route protection
│   │   ├── 📁 contexts/                  # React contexts
│   │   │   └── AuthContext.tsx           # Authentication context
│   │   ├── 📁 pages/                     # Application pages
│   │   │   ├── Login.tsx                 # Login page
│   │   │   ├── Dashboard.tsx             # Dashboard page
│   │   │   ├── Bookings.tsx              # Bookings management
│   │   │   ├── Guests.tsx                # Guest management
│   │   │   ├── Rooms.tsx                 # Room management
│   │   │   ├── RoomTypes.tsx             # Room type management
│   │   │   ├── Payments.tsx              # Payment management
│   │   │   ├── Services.tsx              # Service management
│   │   │   └── Reports.tsx               # Reports & analytics
│   │   ├── 📁 services/                  # API services
│   │   │   ├── api.ts                    # Axios configuration
│   │   │   ├── authService.ts            # Authentication service
│   │   │   ├── bookingService.ts         # Booking service
│   │   │   ├── guestService.ts           # Guest service
│   │   │   ├── roomService.ts            # Room service
│   │   │   └── dashboardService.ts       # Dashboard service
│   │   ├── App.tsx                       # Main app component
│   │   └── index.tsx                     # App entry point
│   ├── package.json                      # Dependencies
│   ├── tsconfig.json                     # TypeScript config
│   └── .env                              # Environment variables
│
├── 📄 HotelManagement.sln                # Solution file
├── 📄 README.md                          # Main documentation
├── 📄 PROJECT_STRUCTURE.md               # This file
├── 📄 setup.ps1                          # Windows setup script
├── 📄 setup.sh                           # Linux/Mac setup script
└── 📄 .gitignore                         # Git ignore file
```

## 🎯 Key Features by Layer

### 🏢 Backend (.NET Core 8)
- **Clean Architecture** with separation of concerns
- **Entity Framework Core** for data access
- **JWT Authentication** with role-based authorization
- **Swagger Documentation** for API testing
- **Repository Pattern** for data access abstraction
- **Unit of Work** pattern for transaction management
- **AutoMapper** for object mapping
- **FluentValidation** for input validation
- **Serilog** for structured logging

### 🎨 Frontend (React + TypeScript)
- **Material-UI** for modern, responsive design
- **React Router** for navigation
- **Axios** for API communication
- **Recharts** for data visualization
- **Context API** for state management
- **TypeScript** for type safety
- **Responsive Design** for all screen sizes
- **Dark/Light Theme** support

### 🗄️ Database (SQL Server)
- **Normalized Schema** with proper relationships
- **Soft Delete** pattern for data integrity
- **Audit Fields** (CreatedAt, UpdatedAt)
- **Indexes** for performance optimization
- **Foreign Key Constraints** for data consistency
- **Enum Types** for status management

## 🔧 Technology Stack

### Backend Technologies
- **.NET Core 8** - Web API framework
- **Entity Framework Core 8** - ORM
- **SQL Server** - Database
- **JWT Bearer** - Authentication
- **AutoMapper** - Object mapping
- **FluentValidation** - Input validation
- **Serilog** - Logging
- **Swagger/OpenAPI** - API documentation

### Frontend Technologies
- **React 18** - UI library
- **TypeScript** - Type safety
- **Material-UI 5** - Component library
- **React Router 6** - Navigation
- **Axios** - HTTP client
- **Recharts** - Data visualization
- **Date-fns** - Date manipulation

### Development Tools
- **Visual Studio 2022** - IDE
- **VS Code** - Code editor
- **Git** - Version control
- **npm** - Package manager
- **dotnet CLI** - .NET tools

## 🚀 Getting Started

### Prerequisites
1. **.NET 8 SDK** installed
2. **Node.js 18+** installed
3. **SQL Server** running
4. **Git** for version control

### Quick Setup
```bash
# Clone the repository
git clone <repository-url>
cd HotelManagement

# Run setup script
# Windows
.\setup.ps1

# Linux/Mac
./setup.sh

# Start the application
# Terminal 1 - Backend
cd HotelManagement.API
dotnet run

# Terminal 2 - Frontend
cd hotel-frontend
npm start
```

### Access Points
- **Frontend:** http://localhost:3000
- **Backend API:** https://localhost:7001
- **Swagger UI:** https://localhost:7001/swagger

### Default Login
- **Email:** admin@hotel.com
- **Password:** Admin123!

## 📊 Database Schema

### Core Entities
- **Users** - System users and staff
- **Guests** - Hotel guests and customers
- **RoomTypes** - Room categories and pricing
- **Rooms** - Individual room details
- **Bookings** - Reservations and check-ins
- **Payments** - Payment transactions
- **Services** - Hotel services and amenities
- **ServiceBookings** - Service reservations

### Relationships
- Users → Bookings (One-to-Many)
- Guests → Bookings (One-to-Many)
- RoomTypes → Rooms (One-to-Many)
- Rooms → Bookings (One-to-Many)
- Bookings → Payments (One-to-Many)
- Services → ServiceBookings (One-to-Many)

## 🎨 UI/UX Features

### Design System
- **Material Design 3** principles
- **Consistent Color Palette** with primary/secondary colors
- **Typography Scale** with proper hierarchy
- **Spacing System** using 8px grid
- **Component Library** with reusable elements

### Responsive Breakpoints
- **Mobile:** 320px - 767px
- **Tablet:** 768px - 1199px
- **Desktop:** 1200px+

### Interactive Elements
- **Data Grids** with sorting, filtering, pagination
- **Charts and Graphs** for data visualization
- **Form Validation** with real-time feedback
- **Loading States** and error handling
- **Modal Dialogs** for data entry
- **Toast Notifications** for user feedback

## 🔐 Security Features

### Authentication & Authorization
- **JWT Tokens** with refresh mechanism
- **Role-based Access Control** (Admin, Manager, Receptionist, Staff)
- **Password Hashing** using BCrypt
- **Token Expiration** and renewal
- **CORS Configuration** for cross-origin requests

### Data Protection
- **Input Validation** on all endpoints
- **SQL Injection Protection** via Entity Framework
- **XSS Protection** through React's built-in escaping
- **HTTPS Enforcement** in production
- **Sensitive Data Encryption** for passwords

## 📈 Performance Optimizations

### Backend Optimizations
- **Async/Await** throughout the application
- **Entity Framework** query optimization
- **Lazy Loading** for related data
- **Pagination** on all list endpoints
- **Caching** for frequently accessed data
- **Connection Pooling** for database connections

### Frontend Optimizations
- **Code Splitting** with React.lazy
- **Memoization** for expensive calculations
- **Virtual Scrolling** for large datasets
- **Image Optimization** and lazy loading
- **Bundle Splitting** for faster loading
- **Service Worker** for offline support

## 🧪 Testing Strategy

### Backend Testing
- **Unit Tests** for business logic
- **Integration Tests** for API endpoints
- **Repository Tests** for data access
- **Service Tests** for business services

### Frontend Testing
- **Component Tests** with React Testing Library
- **Integration Tests** for user workflows
- **API Mocking** for isolated testing
- **E2E Tests** with Cypress (optional)

## 🚀 Deployment

### Backend Deployment
- **Docker Containerization** for consistency
- **IIS/Azure App Service** for hosting
- **Database Migration** scripts
- **Environment Configuration** management

### Frontend Deployment
- **Static Hosting** (Netlify, Vercel, Azure Static Web Apps)
- **CDN Integration** for global performance
- **Environment Variables** for configuration
- **Build Optimization** for production

## 📝 Documentation

### API Documentation
- **Swagger/OpenAPI** specification
- **Interactive API Explorer**
- **Request/Response Examples**
- **Authentication Requirements**

### User Documentation
- **User Manual** for hotel staff
- **Admin Guide** for system management
- **API Reference** for developers
- **Troubleshooting Guide** for common issues

---

**This project represents a complete, production-ready hotel management system with modern architecture, comprehensive features, and professional UI/UX design.**