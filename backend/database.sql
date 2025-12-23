-- Create Users Table
CREATE TABLE IF NOT EXISTS users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('Donor', 'NGO', 'Admin') NOT NULL,
  contact_info VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Donations Table
CREATE TABLE IF NOT EXISTS donations (
  id INT PRIMARY KEY AUTO_INCREMENT,
  ngo_id INT NOT NULL,
  donation_type VARCHAR(100) NOT NULL,
  quantity_or_amount DECIMAL(10, 2) NOT NULL,
  location VARCHAR(255) NOT NULL,
  pickup_date_time DATETIME NOT NULL,
  images TEXT,
  priority ENUM('Normal', 'Urgent') DEFAULT 'Normal',
  status ENUM('Pending', 'Confirmed', 'Completed', 'Cancelled') DEFAULT 'Pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (ngo_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create Contributions Table
CREATE TABLE IF NOT EXISTS contributions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  donation_id INT NOT NULL,
  donor_id INT NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  notes TEXT,
  contributed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (donation_id) REFERENCES donations(id) ON DELETE CASCADE,
  FOREIGN KEY (donor_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create Pickups Table
CREATE TABLE IF NOT EXISTS pickups (
  id INT PRIMARY KEY AUTO_INCREMENT,
  donation_id INT NOT NULL,
  donor_id INT NOT NULL,
  pickup_date DATE NOT NULL,
  pickup_time TIME NOT NULL,
  notes TEXT,
  status ENUM('Scheduled', 'Completed', 'Cancelled') DEFAULT 'Scheduled',
  scheduled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (donation_id) REFERENCES donations(id) ON DELETE CASCADE,
  FOREIGN KEY (donor_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create Indexes for better performance
CREATE INDEX idx_ngo_id ON donations(ngo_id);
CREATE INDEX idx_donation_id ON contributions(donation_id);
CREATE INDEX idx_donor_id ON contributions(donor_id);
CREATE INDEX idx_pickup_donation ON pickups(donation_id);
CREATE INDEX idx_pickup_donor ON pickups(donor_id);
CREATE INDEX idx_donation_status ON donations(status);
