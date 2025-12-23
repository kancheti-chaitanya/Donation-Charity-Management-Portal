@echo off
REM MySQL Installation and Setup Script for Windows

echo ===============================================
echo MySQL Database Setup for Donation Portal
echo ===============================================
echo.
echo This script will help you set up MySQL
echo.
echo Prerequisites:
echo - MySQL 5.7 or higher must be installed
echo - MySQL should be running as a Windows Service
echo.
echo Checking MySQL installation...
echo.

REM Try to connect to MySQL
mysql -u root -proot -e "SELECT 1" >nul 2>&1

if %ERRORLEVEL% equ 0 (
    echo ✓ MySQL is installed and running!
    echo.
    echo Creating database and tables...
    mysql -u root -proot < database.sql
    echo ✓ Database created successfully!
    echo.
    echo You can now start the backend with: npm run dev
) else (
    echo ✗ MySQL is not running or not installed
    echo.
    echo Please do ONE of the following:
    echo.
    echo Option 1: Install MySQL Community Edition
    echo   1. Download from: https://dev.mysql.com/downloads/mysql/
    echo   2. Run the installer (.msi file)
    echo   3. Set root password to: root
    echo   4. Install as Windows Service
    echo   5. Run this script again
    echo.
    echo Option 2: Start MySQL Service (if already installed)
    echo   1. Open Services (press Win+R, type services.msc)
    echo   2. Find "MySQL80" or "MySQL Server"
    echo   3. Click "Start" if it's not running
    echo   4. Run this script again
    echo.
    echo Option 3: Use Docker
    echo   1. Install Docker from: https://www.docker.com/products/docker-desktop/
    echo   2. Run: docker run --name donation-mysql -e MYSQL_ROOT_PASSWORD=root -e MYSQL_DATABASE=donation_portal -p 3306:3306 -d mysql:5.7
    echo   3. Run: docker exec -i donation-mysql mysql -u root -proot donation_portal ^< database.sql
    echo.
)

pause
