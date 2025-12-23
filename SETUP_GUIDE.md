# Donation & Charity Management Portal - Setup Guide

## Quick Start Guide

This document provides step-by-step instructions to set up and run the complete application.

---

## Prerequisites

Before you begin, ensure you have installed:

1. **Node.js** (v14 or higher)
   - Download from: https://nodejs.org/
   - Verify installation: `node --version`

2. **npm** (comes with Node.js)
   - Verify installation: `npm --version`

3. **MySQL Server** (v5.7 or higher)
   - Download from: https://dev.mysql.com/downloads/mysql/
   - Or use MySQL Community Edition

4. **Git** (optional, for version control)
   - Download from: https://git-scm.com/

5. **VS Code** (recommended for development)
   - Download from: https://code.visualstudio.com/

---

## Step 1: Database Setup

### 1.1 Create MySQL Database

1. Open MySQL Command Line or MySQL Workbench
2. Execute the following commands:

```sql
-- Create database
CREATE DATABASE donation_portal;

-- Use the database
USE donation_portal;

-- Import schema (run the SQL file)
source database.sql;
```

Or if using a database GUI, import the `database.sql` file from the backend folder.

### 1.2 Verify Database Creation

```sql
USE donation_portal;
SHOW TABLES;
```

You should see these tables:
- users
- donations
- contributions
- pickups

---

## Step 2: Backend Setup

### 2.1 Install Dependencies

```bash
cd backend
npm install
```

### 2.2 Configure Environment Variables

1. Create a `.env` file in the `backend` directory:

```bash
cp .env.example .env
```

2. Edit `.env` with your MySQL credentials:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=donation_portal
JWT_SECRET=donation_portal_secret_key_2025
PORT=3000
NODE_ENV=development
```

### 2.3 Start Backend Server

```bash
npm run dev
```

You should see:
```
Server is running on port 3000
```

**Verify API is running**: Open `http://localhost:3000/api/health` in your browser. You should see:
```json
{"message":"Server is running"}
```

---

## Step 3: Frontend Setup

### 3.1 Install Dependencies

Open a new terminal and navigate to the frontend folder:

```bash
cd frontend
npm install
```

This will install Angular 16 and all required dependencies.

### 3.2 Start Frontend Development Server

```bash
npm start
```

Or alternatively:
```bash
ng serve
```

The application will automatically open at `http://localhost:4200`

If it doesn't open automatically, manually navigate to `http://localhost:4200`

---

## Step 4: Access the Application

### 4.1 First Time Access

1. Open browser: `http://localhost:4200`
2. You should see the home page with features overview
3. Click "Get Started" or "Browse Donations"

### 4.2 Create Your First Account

#### Option A: Register as Donor

1. Click "Register" or navigate to `/register`
2. Fill in the form:
   - Name: Your name
   - Email: your-email@example.com
   - Role: **Donor**
   - Contact Information: Your phone number
   - Password: At least 6 characters
3. Click "Register"
4. You will be logged in automatically

#### Option B: Register as NGO

1. Click "Register" or navigate to `/register`
2. Fill in the form:
   - Name: NGO name
   - Email: ngo-email@example.com
   - Role: **NGO**
   - Contact Information: NGO phone/address
   - Password: At least 6 characters
3. Click "Register"
4. You will be logged in automatically

### 4.3 Test the Application

#### As a Donor:
1. Browse donations at `/donations`
2. Click "View Details" on any donation
3. Click "Contribute" to make a contribution
4. Schedule a pickup
5. View your donation history in "My Donations" dashboard

#### As an NGO:
1. Go to NGO Dashboard (`/ngo/dashboard`)
2. Click "New Donation Request"
3. Fill in donation details:
   - Type: Food/Clothes/etc.
   - Quantity: Enter amount
   - Location: Pickup location
   - Pickup Date & Time: When donors can pickup
   - Priority: Normal or Urgent
4. Click "Create Request"
5. View your posted donations in the table

#### General:
1. Check Leaderboard at `/leaderboard` (visible to all)
2. View top donors
3. As a donor, see your own contribution stats

---

## Troubleshooting

### Backend Issues

#### Port 3000 Already in Use
```bash
# Find process using port 3000
netstat -ano | findstr :3000

# Kill the process (Windows)
taskkill /PID <PID> /F

# Or change PORT in .env to 3001
```

#### Database Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:3306
```

**Solution**:
1. Ensure MySQL is running
2. Check DB credentials in `.env`
3. Verify database exists: `mysql -u root -p < backend/database.sql`

#### Missing Dependencies
```bash
cd backend
rm -rf node_modules
npm install
```

### Frontend Issues

#### Port 4200 Already in Use
```bash
# Use different port
ng serve --port 4201
```

#### Node Modules Issues
```bash
cd frontend
rm -rf node_modules
npm install
```

#### Blank Page on Load
1. Open browser console (F12)
2. Check for errors
3. Ensure backend is running on port 3000
4. Clear browser cache and hard refresh (Ctrl+Shift+R)

---

## Project Workflows

### Workflow 1: Create & Contribute to Donation

**NGO Flow:**
1. Login as NGO
2. Go to `/ngo/dashboard`
3. Create a new donation request
4. Monitor incoming contributions

**Donor Flow:**
1. Login as Donor (different browser or incognito)
2. Go to `/donations`
3. Browse and view donation details
4. Click "Contribute"
5. Enter contribution amount and notes
6. Schedule pickup date and time
7. View in "My Donations" dashboard

### Workflow 2: Track Contribution

1. Login as Donor
2. Click user menu → "My Donations"
3. View "Contributions" tab for contribution history
4. View "Pickups" tab for scheduled pickups

---

## API Testing

### Using cURL (Backend Testing)

#### 1. Register User
```bash
curl -X POST http://localhost:3000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123",
    "role": "Donor",
    "contactInfo": "1234567890"
  }'
```

#### 2. Login
```bash
curl -X POST http://localhost:3000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

Copy the token from response.

#### 3. Get All Donations
```bash
curl -X GET http://localhost:3000/api/donations
```

#### 4. Create Donation (with Bearer token)
```bash
curl -X POST http://localhost:3000/api/donations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "donationType": "Food",
    "quantity": 50,
    "location": "New York",
    "pickupDateTime": "2025-12-25T10:00:00",
    "priority": "Urgent"
  }'
```

---

## Folder Structure Reference

```
Donation-Charity-Management-Portal/
├── backend/
│   ├── src/
│   │   ├── config/database.ts          ← MySQL connection
│   │   ├── controllers/                ← Business logic
│   │   │   ├── userController.ts
│   │   │   ├── donationController.ts
│   │   │   ├── contributionController.ts
│   │   │   ├── pickupController.ts
│   │   │   └── leaderboardController.ts
│   │   ├── routes/                     ← API routes
│   │   ├── middleware/auth.ts          ← JWT verification
│   │   └── server.ts                   ← Entry point
│   ├── database.sql                    ← Schema
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/
│   │   │   │   ├── login/
│   │   │   │   ├── register/
│   │   │   │   ├── home/
│   │   │   │   ├── donation-list/
│   │   │   │   ├── donation-details/
│   │   │   │   ├── contribution/
│   │   │   │   ├── ngo-dashboard/
│   │   │   │   ├── donor-dashboard/
│   │   │   │   └── leaderboard/
│   │   │   ├── services/               ← API calls
│   │   │   ├── guards/                 ← Route protection
│   │   │   ├── interceptors/           ← Token injection
│   │   │   ├── app.component.*
│   │   │   └── app-routing.module.ts
│   │   ├── main.ts
│   │   ├── index.html
│   │   └── styles.scss
│   ├── angular.json
│   ├── package.json
│   └── tsconfig.json
│
├── README.md                           ← Main documentation
└── SETUP_GUIDE.md                      ← This file
```

---

## Environment Configuration

### Development
- Frontend: `http://localhost:4200`
- Backend: `http://localhost:3000`
- Database: Local MySQL

### Production
1. Deploy backend to cloud (Heroku, AWS, Azure)
2. Deploy frontend to CDN (Netlify, Vercel)
3. Use production database
4. Update API endpoint in frontend

---

## Security Notes

1. **Never commit `.env` file to git** - Add to `.gitignore`
2. **Use strong JWT_SECRET** in production
3. **Use HTTPS** in production
4. **Validate all inputs** on backend (already done)
5. **Use environment variables** for sensitive data
6. **Regular backups** of production database

---

## Performance Tips

1. **Enable gzip compression** on backend
2. **Use CDN** for frontend static files
3. **Optimize images** before uploading
4. **Implement caching** for API responses
5. **Use database indexes** (already configured)

---

## Additional Resources

- [Angular Documentation](https://angular.io/docs)
- [Express.js Guide](https://expressjs.com/)
- [MySQL Documentation](https://dev.mysql.com/doc/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

## Support

If you encounter any issues:

1. Check this guide again
2. Review error messages in console (F12)
3. Check backend logs in terminal
4. Verify all prerequisites are installed

---

**Happy Coding!**

Version: 1.0.0  
Last Updated: December 2025
