# Donation & Charity Management Portal

A full-stack web application that connects donors with verified NGOs for donations (food, funds, clothes, etc.), including donation tracking, pickup scheduling, and donor leaderboards.

## Project Overview

This is a complete MEAN-like stack (but with Angular & TypeScript backend) application built with:

- **Frontend**: Angular 18 with Angular Material
- **Backend**: Node.js with Express and TypeScript
- **Database**: MySQL
- **Authentication**: JWT-based authentication
- **Animations**: Medium-level CSS animations for smooth UX

## Project Structure

```
Donation-Charity-Management-Portal/
├── frontend/                 # Angular 18 Application
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/   # UI Components
│   │   │   ├── services/     # API Communication Services
│   │   │   ├── guards/       # Route Guards (Auth, Role-based)
│   │   │   ├── interceptors/ # HTTP Interceptors
│   │   │   └── app-routing.module.ts
│   │   └── main.ts
│   └── package.json
│
└── backend/                  # Node.js + Express API
    ├── src/
    │   ├── config/           # Database Configuration
    │   ├── controllers/      # Business Logic
    │   ├── routes/           # API Routes
    │   ├── middleware/       # Auth & Validation Middleware
    │   └── server.ts         # Entry Point
    ├── database.sql          # MySQL Schema
    └── package.json
```

## Features

### 1. User Roles

- **Donor**: Can browse donation requests, contribute, schedule pickups, and view donation history
- **NGO**: Can post donation requests, manage contributions, and schedule pickups
- **Admin (Optional)**: Can oversee all donors, NGOs, and donation records

### 2. Donation Management

- **Browse Donations**: Filter by type and location
- **Create Requests (NGO)**: Post donation requests with details
- **Update/Cancel**: Modify or cancel donation requests
- **Priority Levels**: Mark donations as Normal or Urgent

### 3. Contribution System

- **Make Contributions**: Donors contribute to active donation requests
- **Pickup Scheduling**: Schedule convenient pickup times
- **Contribution History**: View all contributions and pickups
- **Status Tracking**: Track contribution status (Scheduled, Completed, Cancelled)

### 4. Donor Leaderboard

- **Top Donors**: View leaderboard of top contributors
- **Personal Stats**: See your own contribution statistics

## Installation & Setup

### Prerequisites

- Node.js (v14 or higher)
- MySQL (v5.7 or higher)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create MySQL database and tables:
   ```bash
   mysql -u root -p < database.sql
   ```

4. Create `.env` file:
   ```env
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=donation_portal
   JWT_SECRET=your_jwt_secret_key_here
   PORT=3000
   NODE_ENV=development
   ```

5. Start the backend server:
   ```bash
   npm run dev
   ```

   The server will run on `http://localhost:3000`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

   The application will open at `http://localhost:4200`

## Database Schema

### Users Table
```sql
- id (Primary Key)
- name
- email (Unique)
- password (Hashed)
- role (Donor/NGO/Admin)
- contact_info
- created_at
```

### Donations Table
```sql
- id (Primary Key)
- ngo_id (Foreign Key → Users)
- donation_type
- quantity_or_amount
- location
- pickup_date_time
- images (Optional)
- priority (Normal/Urgent)
- status (Pending/Confirmed/Completed/Cancelled)
- created_at
```

### Contributions Table
```sql
- id (Primary Key)
- donation_id (Foreign Key → Donations)
- donor_id (Foreign Key → Users)
- amount
- notes (Optional)
- contributed_at
```

### Pickups Table
```sql
- id (Primary Key)
- donation_id (Foreign Key → Donations)
- donor_id (Foreign Key → Users)
- pickup_date
- pickup_time
- notes (Optional)
- status (Scheduled/Completed/Cancelled)
- scheduled_at
```

## API Endpoints

### User Authentication
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - Login user
- `GET /api/users/profile` - Get user profile (Protected)
- `PUT /api/users/profile` - Update profile (Protected)

### Donations
- `GET /api/donations` - Get all donations (with filters)
- `GET /api/donations/:id` - Get donation details
- `POST /api/donations` - Create donation (NGO only)
- `PUT /api/donations/:id` - Update donation (NGO only)
- `DELETE /api/donations/:id` - Cancel donation (NGO only)
- `GET /api/donations/my-donations` - Get NGO's donations (Protected)

### Contributions
- `POST /api/contributions` - Create contribution (Donor only)
- `GET /api/contributions` - Get contributions (Protected)
- `GET /api/contributions/my-contributions` - Get donor's contributions (Protected)

### Pickups
- `POST /api/pickups` - Schedule pickup (Donor only)
- `GET /api/pickups` - Get pickups (Protected)
- `PUT /api/pickups/:id` - Update pickup status (Protected)
- `GET /api/pickups/ngo/schedule` - Get NGO pickups (NGO only)
- `GET /api/pickups/donor/schedule` - Get donor pickups (Donor only)

### Leaderboard
- `GET /api/leaderboard` - Get top donors
- `GET /api/leaderboard/stats` - Get donor stats (Donor only)

## Authentication

The application uses JWT (JSON Web Tokens) for authentication:

1. User logs in → Server returns JWT token
2. Token is stored in localStorage
3. All protected requests include token in Authorization header
4. Routes are protected with AuthGuard and RoleGuard

## Frontend Components

1. **Login Component** - User authentication
2. **Register Component** - New user registration
3. **Home Component** - Landing page with feature overview
4. **Donation List Component** - Browse all donations with filters
5. **Donation Details Component** - View donation details and contribute
6. **Contribution Component** - Schedule pickup for donations
7. **NGO Dashboard Component** - Manage donation requests
8. **Donor Dashboard Component** - View contribution history and pickups
9. **Leaderboard Component** - View top donors and personal stats

## Frontend Animations

The application includes medium-level animations:

- **Slide animations**: Components slide in from sides
- **Fade animations**: Smooth opacity transitions
- **Hover effects**: Cards and buttons respond to user interaction
- **Progress indicators**: Loading states with spinners

## UI/UX Features

- Clean Material Design interface
- Responsive grid layouts
- Form validation with helpful error messages
- Loading states and success notifications
- Tab-based navigation for dashboards
- Color-coded status indicators
- Leaderboard with medal icons for top 3 donors

## Validation Rules

### User Registration
- Name: 3+ characters
- Email: Valid email format
- Password: 6+ characters
- Role: Must be Donor or NGO
- Contact info: Required

### Donation Creation
- Type: Required
- Quantity: > 0
- Location: Required
- Pickup Date/Time: Must be in future

### Contribution
- Amount: > 0
- Must be logged in as Donor
- Must select valid donation

## Security Features

1. **Password Hashing**: bcryptjs for secure password storage
2. **JWT Authentication**: Secure token-based auth
3. **Route Guards**: AuthGuard for authentication, RoleGuard for authorization
4. **Input Validation**: Server-side validation for all inputs
5. **CORS**: Configured for secure cross-origin requests
6. **HTTP Interceptor**: Automatic token injection in requests

## Error Handling

- Meaningful error messages for users
- Server-side error logging
- Graceful error handling in UI
- Proper HTTP status codes
- Validation error feedback

## Running Tests

```bash
# Backend tests (if configured)
cd backend
npm test

# Frontend tests (if configured)
cd frontend
npm test
```

## Deployment

### Backend (Node.js)
1. Build: `npm run build`
2. Deploy to Node.js hosting (Heroku, AWS, DigitalOcean, etc.)
3. Set environment variables on hosting platform

### Frontend (Angular)
1. Build: `npm run build`
2. Deploy to static hosting (Netlify, Vercel, GitHub Pages, etc.)
3. Update API endpoint in environment configuration

## Future Enhancements

- Email notifications for donations
- SMS notifications
- Admin dashboard with analytics
- Advanced filtering and search
- Donation history export
- Mobile app version
- Payment gateway integration
- Ratings and reviews
- Live chat support

## Technology Stack

- **Frontend**: Angular 18, TypeScript, RxJS, Angular Material, SCSS
- **Backend**: Node.js, Express, TypeScript
- **Database**: MySQL
- **Authentication**: JWT, bcryptjs
- **HTTP Client**: Angular HttpClient
- **Form Validation**: Angular Reactive Forms

## License

This project is open source and available under the MIT License.

## Support

For issues, questions, or suggestions, please open an issue in the repository.

---

**Version**: 1.0.0  
**Last Updated**: December 2025
