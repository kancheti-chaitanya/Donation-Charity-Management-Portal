# MySQL Setup Guide for Windows

## Error: MySQL Database Not Running

You're getting the error `ECONNREFUSED on port 3306` because **MySQL Server is not installed or not running**.

---

## Solution 1: Install MySQL Server (Recommended)

### Step 1: Download MySQL
1. Go to: https://dev.mysql.com/downloads/mysql/
2. Download **MySQL Community Server** (latest version)
3. Choose **Windows (x86, 64-bit, MSI Installer)**

### Step 2: Run the Installer
1. Double-click the `.msi` file
2. Follow the installation wizard
3. **Important**: When asked for configuration:
   - Port: `3306` (default)
   - MySQL Root Password: `root` (or your preferred password)
   - Install as Windows Service: **YES**

### Step 3: Verify Installation
- Open **Services** (press `Win + R`, type `services.msc`)
- Look for **MySQL80** or **MySQL Server**
- Ensure it's set to **Automatic** startup

### Step 4: Create the Database
1. Open **Command Prompt** or **PowerShell**
2. Navigate to your project backend folder:
   ```bash
   cd backend
   ```
3. Create and import the database:
   ```bash
   mysql -u root -proot < database.sql
   ```

---

## Solution 2: Use Docker (Quick Alternative)

If you don't want to install MySQL locally, use Docker:

### Step 1: Install Docker
- Download from: https://www.docker.com/products/docker-desktop/

### Step 2: Start MySQL Container
```bash
docker run --name donation-mysql -e MYSQL_ROOT_PASSWORD=root -e MYSQL_DATABASE=donation_portal -p 3306:3306 -d mysql:5.7
```

### Step 3: Wait for MySQL to Start
```bash
docker exec donation-mysql mysql -u root -proot -e "CREATE TABLE test (id INT);"
```

### Step 4: Import Database Schema
```bash
docker exec -i donation-mysql mysql -u root -proot donation_portal < backend/database.sql
```

---

## Solution 3: Use Online MySQL (Easiest, No Installation)

You can use a cloud-hosted MySQL for quick testing:

1. Sign up at: https://db4free.net/
2. Create a free MySQL database
3. Update `.env` file with the cloud credentials:
   ```env
   DB_HOST=your_db4free_host
   DB_USER=your_username
   DB_PASSWORD=your_password
   DB_NAME=your_database
   JWT_SECRET=donation_portal_secret_key_2025
   PORT=3000
   NODE_ENV=development
   ```

---

## Verify MySQL is Running

After setup, verify with one of these methods:

### Method 1: Command Line
```bash
mysql -u root -proot -e "SELECT 1;"
```
(If successful, you'll see: `1`)

### Method 2: Check Windows Services
1. Press `Win + R`
2. Type `services.msc`
3. Look for **MySQL80** or **MySQL Server**
4. Status should be **Running**

### Method 3: MySQL Workbench
1. Open MySQL Workbench
2. Click on your configured connection
3. If it connects, MySQL is running

---

## After MySQL is Running

Once MySQL is running, restart your backend server:

```bash
cd backend
npm run dev
```

You should see:
```
Server is running on port 3000
```

Then try registering a user at: **http://localhost:4200/register**

---

## Common Issues

### Issue: "Access denied for user 'root'@'localhost'"
**Solution**: Check your password in `.env` file matches what you set during MySQL installation

### Issue: "Can't connect to MySQL server"
**Solution**: 
- Verify MySQL Service is running (check Windows Services)
- Verify port 3306 is not blocked by firewall

### Issue: "Unknown database 'donation_portal'"
**Solution**: Run the database import command:
```bash
mysql -u root -proot < backend/database.sql
```

---

## Quick Checklist

✅ MySQL Server installed and running
✅ `.env` file created in `backend/` folder
✅ Database created with `database.sql`
✅ Backend restarted: `npm run dev`
✅ Frontend still running: `npm start`
✅ Try registering at: http://localhost:4200/register

