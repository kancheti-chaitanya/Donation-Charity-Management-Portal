# MySQL Installation Guide for Windows

## Quick Setup (5 minutes)

### Step 1: Download MySQL
1. Go to: https://dev.mysql.com/downloads/mysql/
2. Select **MySQL Community Server** (version 5.7 or 8.0)
3. Choose **Windows (x86, 64-bit) MSI Installer**
4. Click **Download** (you may need to create a free Oracle account)

### Step 2: Run the Installer
1. Double-click the downloaded `.msi` file
2. Click **Next** through the setup wizard
3. When asked about **Setup Type**, choose **Server Machine** (recommended)
4. **Important**: When setting the MySQL Server port, ensure it's **3306** (default)

### Step 3: Configure MySQL
1. In the installer, when asked for **MySQL Server Config**:
   - Port: `3306`
   - Config Type: `Development Machine`
   - MySQL Root Password: **Set a password** (we'll use `root` for simplicity)
   - **Confirm Password**
   - Click **Next**

2. When asked to install as Windows Service:
   - ✅ Check "Configure MySQL Server as a Windows Service"
   - Service Name: `MySQL80` (or similar)
   - ✅ Check "Start the MySQL Server at System Startup"
   - Click **Next** and complete installation

### Step 4: Verify Installation

Open **Command Prompt** or **PowerShell** and run:
```bash
mysql --version
```

You should see:
```
mysql  Ver 8.0.x for Win64 on x86_64 (MySQL Community Server)
```

### Step 5: Create the Database

In the same Command Prompt/PowerShell, navigate to your project and run:

```bash
cd C:\Users\91995\Downloads\Donation-Charity-Management-Portal-main\backend
mysql -u root -proot < database.sql
```

You should see no errors.

### Step 6: Verify Database Creation

```bash
mysql -u root -proot -e "SHOW DATABASES;"
```

You should see `donation_portal` in the list.

### Step 7: Check Database Tables

```bash
mysql -u root -proot -D donation_portal -e "SHOW TABLES;"
```

You should see:
```
+---------------------------+
| Tables_in_donation_portal |
+---------------------------+
| contributions             |
| donations                 |
| pickups                   |
| users                     |
+---------------------------+
```

---

## If MySQL Installation Fails

**Alternative: Use Chocolatey** (if installed):
```bash
choco install mysql-server
```

**Alternative: Use Docker**:
1. Install Docker: https://www.docker.com/products/docker-desktop/
2. Run:
```bash
docker run --name donation-mysql -e MYSQL_ROOT_PASSWORD=root -e MYSQL_DATABASE=donation_portal -p 3306:3306 -d mysql:5.7
```

3. Wait 10 seconds, then import database:
```bash
docker exec -i donation-mysql mysql -u root -proot donation_portal < backend\database.sql
```

---

## Troubleshooting

### Port 3306 Already in Use
```bash
netstat -ano | findstr :3306
taskkill /PID <PID> /F
```

### MySQL Service Not Starting
1. Open **Services** (Win + R, type `services.msc`)
2. Find **MySQL80**
3. Right-click → **Start**

### Can't Connect with mysql command
Add MySQL to your PATH:
1. Find MySQL bin folder (usually `C:\Program Files\MySQL\MySQL Server 8.0\bin`)
2. Press Win + X → System
3. Click "Advanced system settings"
4. Click "Environment Variables"
5. Under "System variables", find "Path" and click "Edit"
6. Click "New" and add: `C:\Program Files\MySQL\MySQL Server 8.0\bin`
7. Click "OK" and restart Command Prompt

---

## Next Steps

Once MySQL is set up and database is created:
1. Your `.env` file already has:
   ```
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=root
   DB_NAME=donation_portal
   ```

2. Restart the backend (it will use real MySQL instead of mock database)

3. Test the application at http://localhost:4200

---

## Need Help?

If you encounter any issues:
1. Check MySQL Service is running: `net start MySQL80`
2. Test connection: `mysql -u root -proot -e "SELECT 1;"`
3. Verify database exists: `mysql -u root -proot -e "SHOW DATABASES;"`
