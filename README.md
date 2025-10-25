# Luxury Hotel Management System

A modern, responsive hotel management system front-end built with HTML, CSS, and vanilla JavaScript. This system provides a comprehensive interface for managing hotel operations including rooms, bookings, guests, and staff.

## Features

### 📊 Dashboard
- Real-time statistics overview
- Total rooms, available rooms, active bookings, and revenue tracking
- Recent bookings list
- Room status visualization (Available, Occupied, Maintenance)

### 🛏️ Room Management
- View all rooms with detailed information
- Filter rooms by type (Standard, Deluxe, Suite, Presidential)
- Filter rooms by status (Available, Occupied, Maintenance)
- Add new rooms
- Edit existing rooms
- Visual room cards with pricing and floor information

### 📅 Booking Management
- Complete booking list with guest information
- Create new bookings
- View check-in and check-out dates
- Track booking status (Confirmed, Checked-In, Pending, Cancelled)
- Delete bookings
- Automatic room status updates

### 👥 Guest Management
- Guest database with contact information
- Track total stays per guest
- Guest status monitoring
- Add, edit, and delete guest records

### 👨‍💼 Staff Management
- Staff member profiles
- Role assignments (Manager, Receptionist, Housekeeping, Maintenance)
- Shift scheduling (Morning, Evening, Night)
- Contact information management

### 📈 Reports & Analytics
- Occupancy rate tracking
- Average daily rate calculation
- Customer satisfaction ratings
- Total guest count
- Revenue visualization

## Technologies Used

- **HTML5** - Structure and semantic markup
- **CSS3** - Modern styling with gradients, animations, and responsive design
- **JavaScript (ES6+)** - Interactive functionality and data management
- **Font Awesome** - Icons and visual elements

## Getting Started

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, Edge)
- No server or dependencies required!

### Installation

1. Clone this repository or download the files
2. Open `index.html` in your web browser:
   - Simply double-click the `index.html` file, or
   - Right-click and choose "Open with" your preferred browser

### Usage

The application will load with sample data pre-populated. You can:

1. **Navigate** - Use the sidebar menu to switch between different pages
2. **Add Rooms** - Click "Add New Room" button on the Rooms page
3. **Create Bookings** - Click "New Booking" button on the Bookings page
4. **Filter Data** - Use dropdown filters on the Rooms page
5. **Manage Records** - Use edit/delete buttons on various items

## Project Structure

```
workspace/
├── index.html      # Main HTML file with all page structures
├── styles.css      # Complete styling and responsive design
├── script.js       # JavaScript logic and interactivity
└── README.md       # Project documentation
```

## Features in Detail

### Dashboard Statistics
- **Total Rooms**: Shows the total number of rooms in the hotel
- **Available Rooms**: Displays currently available rooms for booking
- **Active Bookings**: Count of confirmed and checked-in bookings
- **Total Revenue**: Sum of all booking revenues (excluding cancelled bookings)

### Room Types
- **Standard**: Budget-friendly rooms ($99/night)
- **Deluxe**: Enhanced comfort ($149/night)
- **Suite**: Spacious luxury ($249/night)
- **Presidential**: Ultimate luxury experience ($499/night)

### Booking Status
- **Confirmed**: Booking is confirmed but guest hasn't checked in
- **Checked-In**: Guest has checked in and is currently staying
- **Pending**: Awaiting confirmation
- **Cancelled**: Booking has been cancelled

## Responsive Design

The application is fully responsive and works on:
- Desktop computers (1200px and above)
- Tablets (768px - 1199px)
- Mobile devices (below 768px)

## Color Scheme

- **Primary**: Purple gradient (#667eea to #764ba2)
- **Success**: Green (#10b981)
- **Warning**: Orange (#f59e0b)
- **Danger**: Red (#ef4444)
- **Info**: Blue (#3b82f6)

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Future Enhancements

Potential features for future development:
- Backend integration with REST API
- User authentication and authorization
- Email notifications for bookings
- Payment gateway integration
- Advanced reporting with charts
- Multi-language support
- Dark mode toggle
- Export data to PDF/Excel

## Contributing

Feel free to fork this project and submit pull requests for any enhancements.

## License

This project is open source and available for educational and commercial use.

---

**Note**: This is a front-end demonstration system. All data is stored in browser memory and will be lost on page refresh. For production use, integrate with a backend API and database.
