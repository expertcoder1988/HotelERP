// Data Storage
let rooms = [];
let bookings = [];
let guests = [];
let staff = [];

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeSampleData();
    setupEventListeners();
    updateDashboard();
    renderRooms();
    renderBookings();
    renderGuests();
    renderStaff();
});

// Setup Event Listeners
function setupEventListeners() {
    // Navigation
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const page = this.getAttribute('data-page');
            navigateToPage(page);
        });
    });

    // View All links
    document.querySelectorAll('.view-all').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const page = this.getAttribute('data-page');
            navigateToPage(page);
        });
    });

    // Form submissions
    document.getElementById('add-room-form').addEventListener('submit', handleAddRoom);
    document.getElementById('add-booking-form').addEventListener('submit', handleAddBooking);
}

// Navigation
function navigateToPage(pageName) {
    // Update nav items
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('data-page') === pageName) {
            item.classList.add('active');
        }
    });

    // Update pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    document.getElementById(pageName + '-page').classList.add('active');
}

// Initialize Sample Data
function initializeSampleData() {
    // Sample Rooms
    rooms = [
        { id: 1, roomNumber: '101', type: 'Standard', price: 99, floor: 1, status: 'Available' },
        { id: 2, roomNumber: '102', type: 'Standard', price: 99, floor: 1, status: 'Occupied' },
        { id: 3, roomNumber: '103', type: 'Deluxe', price: 149, floor: 1, status: 'Available' },
        { id: 4, roomNumber: '201', type: 'Deluxe', price: 149, floor: 2, status: 'Available' },
        { id: 5, roomNumber: '202', type: 'Suite', price: 249, floor: 2, status: 'Occupied' },
        { id: 6, roomNumber: '203', type: 'Suite', price: 249, floor: 2, status: 'Maintenance' },
        { id: 7, roomNumber: '301', type: 'Presidential', price: 499, floor: 3, status: 'Available' },
        { id: 8, roomNumber: '302', type: 'Presidential', price: 499, floor: 3, status: 'Available' }
    ];

    // Sample Bookings
    bookings = [
        { 
            id: 1, 
            bookingId: 'BK-001', 
            guestName: 'John Smith', 
            roomNumber: '102', 
            checkIn: '2025-10-23', 
            checkOut: '2025-10-28', 
            status: 'Checked-In', 
            total: 495 
        },
        { 
            id: 2, 
            bookingId: 'BK-002', 
            guestName: 'Emily Johnson', 
            roomNumber: '202', 
            checkIn: '2025-10-24', 
            checkOut: '2025-10-30', 
            status: 'Confirmed', 
            total: 1494 
        },
        { 
            id: 3, 
            bookingId: 'BK-003', 
            guestName: 'Michael Brown', 
            roomNumber: '301', 
            checkIn: '2025-10-26', 
            checkOut: '2025-10-29', 
            status: 'Confirmed', 
            total: 1497 
        },
        { 
            id: 4, 
            bookingId: 'BK-004', 
            guestName: 'Sarah Davis', 
            roomNumber: '103', 
            checkIn: '2025-10-25', 
            checkOut: '2025-10-27', 
            status: 'Pending', 
            total: 298 
        },
        { 
            id: 5, 
            bookingId: 'BK-005', 
            guestName: 'David Wilson', 
            roomNumber: '201', 
            checkIn: '2025-10-22', 
            checkOut: '2025-10-24', 
            status: 'Cancelled', 
            total: 298 
        }
    ];

    // Sample Guests
    guests = [
        { id: 1, guestId: 'G-001', name: 'John Smith', email: 'john.smith@email.com', phone: '+1 234-567-8901', totalStays: 5, status: 'Active' },
        { id: 2, guestId: 'G-002', name: 'Emily Johnson', email: 'emily.j@email.com', phone: '+1 234-567-8902', totalStays: 3, status: 'Active' },
        { id: 3, guestId: 'G-003', name: 'Michael Brown', email: 'michael.b@email.com', phone: '+1 234-567-8903', totalStays: 8, status: 'Active' },
        { id: 4, guestId: 'G-004', name: 'Sarah Davis', email: 'sarah.d@email.com', phone: '+1 234-567-8904', totalStays: 2, status: 'Active' },
        { id: 5, guestId: 'G-005', name: 'David Wilson', email: 'david.w@email.com', phone: '+1 234-567-8905', totalStays: 1, status: 'Active' }
    ];

    // Sample Staff
    staff = [
        { id: 1, name: 'Alice Anderson', role: 'Manager', email: 'alice.a@hotel.com', phone: '+1 234-567-8911', shift: 'Morning' },
        { id: 2, name: 'Bob Baker', role: 'Receptionist', email: 'bob.b@hotel.com', phone: '+1 234-567-8912', shift: 'Morning' },
        { id: 3, name: 'Carol Carter', role: 'Housekeeping', email: 'carol.c@hotel.com', phone: '+1 234-567-8913', shift: 'Morning' },
        { id: 4, name: 'Daniel Davis', role: 'Receptionist', email: 'daniel.d@hotel.com', phone: '+1 234-567-8914', shift: 'Evening' },
        { id: 5, name: 'Emma Evans', role: 'Housekeeping', email: 'emma.e@hotel.com', phone: '+1 234-567-8915', shift: 'Evening' },
        { id: 6, name: 'Frank Foster', role: 'Maintenance', email: 'frank.f@hotel.com', phone: '+1 234-567-8916', shift: 'Night' }
    ];
}

// Dashboard Functions
function updateDashboard() {
    // Update stats
    const totalRooms = rooms.length;
    const availableRooms = rooms.filter(r => r.status === 'Available').length;
    const activeBookings = bookings.filter(b => b.status === 'Checked-In' || b.status === 'Confirmed').length;
    const revenue = bookings.reduce((sum, b) => b.status !== 'Cancelled' ? sum + b.total : sum, 0);

    document.getElementById('total-rooms').textContent = totalRooms;
    document.getElementById('available-rooms').textContent = availableRooms;
    document.getElementById('active-bookings').textContent = activeBookings;
    document.getElementById('revenue').textContent = '$' + revenue.toLocaleString();

    // Update recent bookings
    const recentBookingsHTML = bookings.slice(0, 5).map(booking => `
        <div style="padding: 15px; border-bottom: 1px solid var(--border-color); display: flex; justify-content: space-between; align-items: center;">
            <div>
                <div style="font-weight: 600; color: var(--dark-color); margin-bottom: 5px;">${booking.guestName}</div>
                <div style="font-size: 13px; color: #6b7280;">Room ${booking.roomNumber} • ${formatDate(booking.checkIn)} - ${formatDate(booking.checkOut)}</div>
            </div>
            <span class="status-badge ${booking.status.toLowerCase().replace('-', '')}">${booking.status}</span>
        </div>
    `).join('');
    document.getElementById('recent-bookings').innerHTML = recentBookingsHTML;

    // Update room status chart
    const occupiedRooms = rooms.filter(r => r.status === 'Occupied').length;
    const maintenanceRooms = rooms.filter(r => r.status === 'Maintenance').length;
    
    document.getElementById('room-status-chart').innerHTML = `
        <div class="status-item">
            <div class="status-label">
                <div class="status-dot available"></div>
                <span>Available</span>
            </div>
            <div class="status-value">${availableRooms}</div>
        </div>
        <div class="status-item">
            <div class="status-label">
                <div class="status-dot occupied"></div>
                <span>Occupied</span>
            </div>
            <div class="status-value">${occupiedRooms}</div>
        </div>
        <div class="status-item">
            <div class="status-label">
                <div class="status-dot maintenance"></div>
                <span>Maintenance</span>
            </div>
            <div class="status-value">${maintenanceRooms}</div>
        </div>
    `;

    // Update reports page
    const occupancyRate = ((totalRooms - availableRooms) / totalRooms * 100).toFixed(1);
    const avgDailyRate = (revenue / activeBookings).toFixed(0);
    
    document.getElementById('occupancy-rate').textContent = occupancyRate + '%';
    document.getElementById('avg-daily-rate').textContent = '$' + (avgDailyRate || 0);
    document.getElementById('customer-satisfaction').textContent = '4.8';
    document.getElementById('total-guests').textContent = guests.length;
}

// Render Rooms
function renderRooms() {
    const roomsGrid = document.getElementById('rooms-grid');
    roomsGrid.innerHTML = rooms.map(room => `
        <div class="room-card">
            <div class="room-image">
                <i class="fas fa-bed"></i>
            </div>
            <div class="room-info">
                <div class="room-header">
                    <div class="room-number">Room ${room.roomNumber}</div>
                    <span class="status-badge ${room.status.toLowerCase()}">${room.status}</span>
                </div>
                <div class="room-details">
                    <div class="room-detail">
                        <i class="fas fa-door-open"></i>
                        <span>${room.type}</span>
                    </div>
                    <div class="room-detail">
                        <i class="fas fa-layer-group"></i>
                        <span>Floor ${room.floor}</span>
                    </div>
                </div>
                <div class="room-price">$${room.price}<span style="font-size: 14px; font-weight: 400; color: #6b7280;">/night</span></div>
                <div class="room-actions">
                    <button class="btn btn-primary btn-sm" style="flex: 1;" ${room.status !== 'Available' ? 'disabled' : ''}>
                        <i class="fas fa-calendar"></i> Book
                    </button>
                    <button class="btn btn-secondary btn-sm" onclick="editRoom(${room.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Filter Rooms
function filterRooms() {
    const typeFilter = document.getElementById('room-type-filter').value;
    const statusFilter = document.getElementById('room-status-filter').value;
    
    const filtered = rooms.filter(room => {
        const matchType = !typeFilter || room.type === typeFilter;
        const matchStatus = !statusFilter || room.status === statusFilter;
        return matchType && matchStatus;
    });
    
    const roomsGrid = document.getElementById('rooms-grid');
    roomsGrid.innerHTML = filtered.map(room => `
        <div class="room-card">
            <div class="room-image">
                <i class="fas fa-bed"></i>
            </div>
            <div class="room-info">
                <div class="room-header">
                    <div class="room-number">Room ${room.roomNumber}</div>
                    <span class="status-badge ${room.status.toLowerCase()}">${room.status}</span>
                </div>
                <div class="room-details">
                    <div class="room-detail">
                        <i class="fas fa-door-open"></i>
                        <span>${room.type}</span>
                    </div>
                    <div class="room-detail">
                        <i class="fas fa-layer-group"></i>
                        <span>Floor ${room.floor}</span>
                    </div>
                </div>
                <div class="room-price">$${room.price}<span style="font-size: 14px; font-weight: 400; color: #6b7280;">/night</span></div>
                <div class="room-actions">
                    <button class="btn btn-primary btn-sm" style="flex: 1;" ${room.status !== 'Available' ? 'disabled' : ''}>
                        <i class="fas fa-calendar"></i> Book
                    </button>
                    <button class="btn btn-secondary btn-sm" onclick="editRoom(${room.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Render Bookings
function renderBookings() {
    const bookingsTable = document.getElementById('bookings-table');
    bookingsTable.innerHTML = bookings.map(booking => `
        <tr>
            <td>${booking.bookingId}</td>
            <td>${booking.guestName}</td>
            <td>Room ${booking.roomNumber}</td>
            <td>${formatDate(booking.checkIn)}</td>
            <td>${formatDate(booking.checkOut)}</td>
            <td><span class="status-badge ${booking.status.toLowerCase().replace('-', '')}">${booking.status}</span></td>
            <td>$${booking.total}</td>
            <td>
                <button class="action-btn edit" onclick="editBooking(${booking.id})"><i class="fas fa-edit"></i></button>
                <button class="action-btn delete" onclick="deleteBooking(${booking.id})"><i class="fas fa-trash"></i></button>
            </td>
        </tr>
    `).join('');
}

// Render Guests
function renderGuests() {
    const guestsTable = document.getElementById('guests-table');
    guestsTable.innerHTML = guests.map(guest => `
        <tr>
            <td>${guest.guestId}</td>
            <td>${guest.name}</td>
            <td>${guest.email}</td>
            <td>${guest.phone}</td>
            <td>${guest.totalStays}</td>
            <td><span class="status-badge ${guest.status.toLowerCase()}">${guest.status}</span></td>
            <td>
                <button class="action-btn edit" onclick="editGuest(${guest.id})"><i class="fas fa-edit"></i></button>
                <button class="action-btn delete" onclick="deleteGuest(${guest.id})"><i class="fas fa-trash"></i></button>
            </td>
        </tr>
    `).join('');
}

// Render Staff
function renderStaff() {
    const staffGrid = document.getElementById('staff-grid');
    staffGrid.innerHTML = staff.map(member => `
        <div class="staff-card">
            <img src="https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=667eea&color=fff" 
                 alt="${member.name}" class="staff-avatar">
            <div class="staff-name">${member.name}</div>
            <div class="staff-role">${member.role}</div>
            <div class="staff-details">
                <div class="staff-detail">
                    <i class="fas fa-envelope"></i>
                    <span>${member.email}</span>
                </div>
                <div class="staff-detail">
                    <i class="fas fa-phone"></i>
                    <span>${member.phone}</span>
                </div>
                <div class="staff-detail">
                    <i class="fas fa-clock"></i>
                    <span>${member.shift} Shift</span>
                </div>
            </div>
            <div class="room-actions" style="margin-top: 15px;">
                <button class="btn btn-secondary btn-sm" style="flex: 1;" onclick="editStaff(${member.id})">
                    <i class="fas fa-edit"></i> Edit
                </button>
                <button class="btn btn-danger btn-sm" onclick="deleteStaff(${member.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');
}

// Modal Functions
function showAddRoomModal() {
    document.getElementById('add-room-modal').classList.add('active');
}

function showAddBookingModal() {
    const select = document.getElementById('booking-room-select');
    const availableRooms = rooms.filter(r => r.status === 'Available');
    select.innerHTML = availableRooms.map(room => 
        `<option value="${room.roomNumber}">${room.roomNumber} - ${room.type} ($${room.price}/night)</option>`
    ).join('');
    
    document.getElementById('add-booking-modal').classList.add('active');
}

function showAddGuestModal() {
    alert('Add Guest modal would open here. This is a demo feature.');
}

function showAddStaffModal() {
    alert('Add Staff modal would open here. This is a demo feature.');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}

// Handle Add Room
function handleAddRoom(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    const newRoom = {
        id: rooms.length + 1,
        roomNumber: formData.get('roomNumber'),
        type: formData.get('roomType'),
        price: parseInt(formData.get('price')),
        floor: parseInt(formData.get('floor')),
        status: 'Available'
    };
    
    rooms.push(newRoom);
    renderRooms();
    updateDashboard();
    closeModal('add-room-modal');
    e.target.reset();
    
    alert('Room added successfully!');
}

// Handle Add Booking
function handleAddBooking(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    const roomNumber = formData.get('roomNumber');
    const room = rooms.find(r => r.roomNumber === roomNumber);
    
    const checkIn = new Date(formData.get('checkIn'));
    const checkOut = new Date(formData.get('checkOut'));
    const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
    const total = room.price * nights;
    
    const newBooking = {
        id: bookings.length + 1,
        bookingId: 'BK-' + String(bookings.length + 1).padStart(3, '0'),
        guestName: formData.get('guestName'),
        roomNumber: roomNumber,
        checkIn: formData.get('checkIn'),
        checkOut: formData.get('checkOut'),
        status: 'Confirmed',
        total: total
    };
    
    bookings.push(newBooking);
    
    // Update room status
    room.status = 'Occupied';
    
    renderBookings();
    renderRooms();
    updateDashboard();
    closeModal('add-booking-modal');
    e.target.reset();
    
    alert('Booking created successfully!');
}

// Edit Functions (placeholder)
function editRoom(id) {
    alert('Edit room #' + id + ' - This is a demo feature.');
}

function editBooking(id) {
    alert('Edit booking #' + id + ' - This is a demo feature.');
}

function editGuest(id) {
    alert('Edit guest #' + id + ' - This is a demo feature.');
}

function editStaff(id) {
    alert('Edit staff #' + id + ' - This is a demo feature.');
}

// Delete Functions
function deleteBooking(id) {
    if (confirm('Are you sure you want to delete this booking?')) {
        const index = bookings.findIndex(b => b.id === id);
        if (index > -1) {
            const booking = bookings[index];
            const room = rooms.find(r => r.roomNumber === booking.roomNumber);
            if (room) room.status = 'Available';
            
            bookings.splice(index, 1);
            renderBookings();
            renderRooms();
            updateDashboard();
            alert('Booking deleted successfully!');
        }
    }
}

function deleteGuest(id) {
    if (confirm('Are you sure you want to delete this guest?')) {
        const index = guests.findIndex(g => g.id === id);
        if (index > -1) {
            guests.splice(index, 1);
            renderGuests();
            alert('Guest deleted successfully!');
        }
    }
}

function deleteStaff(id) {
    if (confirm('Are you sure you want to delete this staff member?')) {
        const index = staff.findIndex(s => s.id === id);
        if (index > -1) {
            staff.splice(index, 1);
            renderStaff();
            alert('Staff member deleted successfully!');
        }
    }
}

// Utility Functions
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

// Close modal when clicking outside
window.addEventListener('click', function(e) {
    if (e.target.classList.contains('modal')) {
        e.target.classList.remove('active');
    }
});
