# Quick Reference - Commands & Setup

## Backend Commands

### Initial Setup
```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your MySQL credentials

# Setup database
mysql -u root -p < database.sql

# Start development server
npm run dev

# Build for production
npm run build

# Start production server (after build)
npm start
```

### Development
```bash
# Watch mode (auto-reload on changes)
npm run dev

# Build TypeScript
npm run build

# Check TypeScript errors
npx tsc --noEmit
```

---

## Frontend Commands

### Initial Setup
```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Start development server
npm start

# Open browser automatically at:
# http://localhost:4200
```

### Development
```bash
# Start with default settings
npm start

# Start on custom port
ng serve --port 4201

# Build for production
npm run build

# Build with optimization
ng build --configuration production

# Run unit tests
npm test

# Run e2e tests
npm run e2e
```

---

## Database Commands

### MySQL Commands
```bash
# Connect to MySQL
mysql -u root -p

# Create database
CREATE DATABASE donation_portal;

# Use database
USE donation_portal;

# Import schema
source database.sql;
or
mysql -u root -p donation_portal < backend/database.sql

# Show tables
SHOW TABLES;

# View users
SELECT * FROM users;

# View donations
SELECT * FROM donations;

# Reset database (drop and recreate)
DROP DATABASE donation_portal;
CREATE DATABASE donation_portal;
USE donation_portal;
source database.sql;
```

---

## Environment Configuration

### Backend .env File
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=donation_portal
JWT_SECRET=donation_portal_secret_key_2025
PORT=3000
NODE_ENV=development
```

### Production Backend .env
```env
DB_HOST=your_production_host
DB_USER=prod_user
DB_PASSWORD=strong_password
DB_NAME=donation_portal_prod
JWT_SECRET=very_long_random_secret_key
PORT=3000
NODE_ENV=production
```

---

## Testing the Application

### Manual Testing Workflow

#### Step 1: Test Registration
```bash
# Open http://localhost:4200/register
# Register as Donor:
# - Name: Test Donor
# - Email: donor@test.com
# - Role: Donor
# - Contact: 9876543210
# - Password: password123
```

#### Step 2: Test Donations (Create as NGO)
```bash
# Open new private/incognito window
# Register as NGO:
# - Name: Test NGO
# - Email: ngo@test.com
# - Role: NGO
# - Contact: 1234567890
# - Password: password123

# Go to /ngo/dashboard
# Create donation:
# - Type: Food
# - Quantity: 50
# - Location: New York
# - Date/Time: Future date
# - Priority: Urgent
```

#### Step 3: Test Contribution (Back to Donor)
```bash
# Switch back to Donor window
# Go to /donations
# Click "View Details"
# Click "Contribute"
# Enter amount: 50
# Click "Confirm & Schedule Pickup"
# Enter pickup date and time
```

#### Step 4: Test Leaderboard
```bash
# Go to /leaderboard
# Should see the donor ranked
```

---

## Common Issues & Solutions

### Port Already in Use

**Backend Port 3000:**
```bash
# Find process using port 3000
netstat -ano | findstr :3000

# Kill the process (Windows)
taskkill /PID <PID> /F

# Or use different port in .env
PORT=3001
```

**Frontend Port 4200:**
```bash
# Use different port
ng serve --port 4201
```

### Database Connection Error

```bash
# Check MySQL is running
# Restart MySQL service:

# Windows
net stop MySQL80
net start MySQL80

# Mac
brew services restart mysql

# Linux
sudo systemctl restart mysql

# Verify database exists
mysql -u root -p
SHOW DATABASES;
```

### Node Modules Issue

```bash
# Clear and reinstall
cd backend
rm -rf node_modules package-lock.json
npm install

# Same for frontend
cd frontend
rm -rf node_modules package-lock.json
npm install
```

### TypeScript Errors

```bash
# Check for type errors
cd backend
npx tsc --noEmit

# Fix by updating tsconfig.json if needed
```

---

## API Testing with cURL

### Get Health Status
```bash
curl http://localhost:3000/api/health
```

### Register User
```bash
curl -X POST http://localhost:3000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","password":"pass123","role":"Donor","contactInfo":"123"}'
```

### Login User
```bash
curl -X POST http://localhost:3000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"pass123"}'
```

### Get Donations (No Auth Required)
```bash
curl http://localhost:3000/api/donations
```

---

## File Locations Reference

| File/Folder | Purpose |
|-------------|---------|
| `/backend/src/server.ts` | Backend entry point |
| `/backend/src/config/database.ts` | MySQL connection |
| `/backend/src/controllers/` | Business logic |
| `/backend/database.sql` | Database schema |
| `/backend/.env` | Environment variables |
| `/frontend/src/main.ts` | Frontend entry point |
| `/frontend/src/app/app.component.ts` | Root component |
| `/frontend/src/app/app-routing.module.ts` | Routes |
| `/frontend/angular.json` | Angular config |

---

## Development Workflow

### Daily Development
```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend
cd frontend
npm start

# Terminal 3: Optional - Monitor database
mysql -u root -p donation_portal
```

### Making Changes

**Backend:**
1. Edit files in `/backend/src/`
2. Server auto-reloads with `npm run dev`
3. Check console for errors

**Frontend:**
1. Edit files in `/frontend/src/`
2. Browser auto-refreshes
3. Check F12 console for errors

---

## Git Commands (Optional)

```bash
# Initialize git
git init

# Add all files
git add .

# Commit changes
git commit -m "Initial commit: Donation Portal v1.0"

# Add remote (GitHub)
git remote add origin https://github.com/your-username/donation-portal

# Push to remote
git push -u origin main

# Check status
git status
```

---

## Useful Links

- Angular Docs: https://angular.io/docs
- Express Docs: https://expressjs.com/
- MySQL Docs: https://dev.mysql.com/doc/
- TypeScript: https://www.typescriptlang.org/
- Angular Material: https://material.angular.io/
- JWT: https://jwt.io/

---

## Performance Monitoring

### Monitor Memory Usage
```bash
# Terminal
node --trace-warnings backend/dist/server.js
```

### Check API Response Times
Use browser DevTools (F12) → Network tab

### Database Query Performance
```bash
# MySQL
EXPLAIN SELECT * FROM donations WHERE id = 1;
```

---

## Deployment Checklist

- [ ] Update environment variables
- [ ] Build frontend: `npm run build`
- [ ] Build backend: `npm run build`
- [ ] Test all features
- [ ] Check error logs
- [ ] Setup production database
- [ ] Configure HTTPS
- [ ] Setup backups
- [ ] Monitor logs
- [ ] Plan maintenance window

---

## Quick Fixes

### Clear Everything & Start Fresh
```bash
# Backend
cd backend
rm -rf node_modules package-lock.json dist
npm install
npm run build

# Frontend
cd frontend
rm -rf node_modules package-lock.json dist
npm install
npm run build

# Database
mysql -u root -p
DROP DATABASE donation_portal;
CREATE DATABASE donation_portal;
USE donation_portal;
source backend/database.sql;
```

### Restart Everything
```bash
# Kill all node processes
pkill -f node

# Kill backend port
fuser -k 3000/tcp

# Kill frontend port
fuser -k 4200/tcp

# Start fresh
cd backend && npm run dev
cd frontend && npm start
```

---

## Environment Variables Explained

```env
DB_HOST=localhost          # MySQL server address
DB_USER=root               # MySQL username
DB_PASSWORD=password       # MySQL password
DB_NAME=donation_portal    # Database name
JWT_SECRET=secret_key      # Secret for JWT tokens
PORT=3000                  # API port
NODE_ENV=development       # Environment type
```

---

**Last Updated**: December 23, 2025  
**Version**: 1.0.0
