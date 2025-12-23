# API Endpoints Reference

## Base URL
```
http://localhost:3000/api
```

## Authentication

All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

---

## User Endpoints

### Register User
```
POST /users/register
Content-Type: application/json

Request Body:
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "Donor",  // or "NGO"
  "contactInfo": "1234567890"
}

Response: 201 Created
{
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "Donor"
  },
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

### Login User
```
POST /users/login
Content-Type: application/json

Request Body:
{
  "email": "john@example.com",
  "password": "password123"
}

Response: 200 OK
{
  "message": "Login successful",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "Donor"
  },
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

### Get User Profile
```
GET /users/profile
Authorization: Bearer <token>

Response: 200 OK
{
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "Donor",
    "contact_info": "1234567890",
    "created_at": "2025-12-23T10:00:00.000Z"
  }
}
```

### Update User Profile
```
PUT /users/profile
Authorization: Bearer <token>
Content-Type: application/json

Request Body:
{
  "name": "John Updated",
  "contactInfo": "9876543210"
}

Response: 200 OK
{
  "message": "Profile updated",
  "user": {
    "id": 1,
    "name": "John Updated",
    "email": "john@example.com",
    "role": "Donor",
    "contact_info": "9876543210"
  }
}
```

---

## Donation Endpoints

### Create Donation (NGO Only)
```
POST /donations
Authorization: Bearer <token>
Content-Type: application/json

Request Body:
{
  "donationType": "Food",
  "quantity": 50,
  "location": "New York, NY",
  "pickupDateTime": "2025-12-25T10:00:00",
  "images": "url_to_image.jpg",  // optional
  "priority": "Urgent"  // or "Normal"
}

Response: 201 Created
{
  "message": "Donation request created successfully",
  "donation": {
    "id": 1,
    "ngoId": 2,
    "donationType": "Food",
    "quantity": 50,
    "location": "New York, NY",
    "pickupDateTime": "2025-12-25T10:00:00"
  }
}
```

### Get All Donations
```
GET /donations
GET /donations?type=Food&location=New York&status=Pending
Content-Type: application/json

Query Parameters:
- type: Filter by donation type (optional)
- location: Filter by location (optional)
- status: Filter by status (optional)

Response: 200 OK
{
  "donations": [
    {
      "id": 1,
      "ngo_id": 2,
      "donation_type": "Food",
      "quantity_or_amount": 50,
      "location": "New York, NY",
      "pickup_date_time": "2025-12-25T10:00:00",
      "priority": "Urgent",
      "status": "Pending",
      "ngo_name": "Help Organization",
      "contact_info": "ngo@example.com",
      "created_at": "2025-12-23T10:00:00"
    }
  ]
}
```

### Get Donation Details
```
GET /donations/:id

Response: 200 OK
{
  "donation": {
    "id": 1,
    "ngo_id": 2,
    "donation_type": "Food",
    "quantity_or_amount": 50,
    "location": "New York, NY",
    "pickup_date_time": "2025-12-25T10:00:00",
    "images": "url_to_image.jpg",
    "priority": "Urgent",
    "status": "Pending",
    "ngo_name": "Help Organization",
    "contact_info": "ngo@example.com",
    "created_at": "2025-12-23T10:00:00"
  }
}
```

### Update Donation (NGO Only)
```
PUT /donations/:id
Authorization: Bearer <token>
Content-Type: application/json

Request Body:
{
  "donationType": "Food",
  "quantity": 75,
  "location": "New York, NY",
  "pickupDateTime": "2025-12-25T10:00:00",
  "priority": "Normal"
}

Response: 200 OK
{
  "message": "Donation updated successfully"
}
```

### Delete/Cancel Donation (NGO Only)
```
DELETE /donations/:id
Authorization: Bearer <token>

Response: 200 OK
{
  "message": "Donation cancelled successfully"
}
```

### Get NGO's Donations (NGO Only)
```
GET /donations/my-donations
Authorization: Bearer <token>

Response: 200 OK
{
  "donations": [
    {
      "id": 1,
      "ngo_id": 2,
      "donation_type": "Food",
      "quantity_or_amount": 50,
      "location": "New York, NY",
      "status": "Pending",
      ...
    }
  ]
}
```

---

## Contribution Endpoints

### Create Contribution (Donor Only)
```
POST /contributions
Authorization: Bearer <token>
Content-Type: application/json

Request Body:
{
  "donationId": 1,
  "amount": 50,
  "notes": "Can pickup on weekends"
}

Response: 201 Created
{
  "message": "Contribution created successfully",
  "contribution": {
    "id": 1,
    "donationId": 1,
    "amount": 50
  }
}
```

### Get All Contributions (Protected)
```
GET /contributions
GET /contributions?donationId=1&donorId=2
Authorization: Bearer <token>

Query Parameters:
- donationId: Filter by donation (optional)
- donorId: Filter by donor (optional)

Response: 200 OK
{
  "contributions": [
    {
      "id": 1,
      "donation_id": 1,
      "donor_id": 2,
      "amount": 50,
      "notes": "Can pickup on weekends",
      "donation_type": "Food",
      "donor_name": "John Doe",
      "contributed_at": "2025-12-23T10:00:00"
    }
  ]
}
```

### Get Donor's Contributions (Donor Only)
```
GET /contributions/my-contributions
Authorization: Bearer <token>

Response: 200 OK
{
  "contributions": [
    {
      "id": 1,
      "donation_id": 1,
      "donor_id": 2,
      "amount": 50,
      "notes": "Can pickup on weekends",
      "donation_type": "Food",
      "location": "New York, NY",
      "ngo_id": 3,
      "contributed_at": "2025-12-23T10:00:00"
    }
  ]
}
```

---

## Pickup Endpoints

### Schedule Pickup (Donor Only)
```
POST /pickups
Authorization: Bearer <token>
Content-Type: application/json

Request Body:
{
  "donationId": 1,
  "pickupDate": "2025-12-25",
  "pickupTime": "10:00",
  "notes": "Please call 10 minutes before"
}

Response: 201 Created
{
  "message": "Pickup scheduled successfully",
  "pickup": {
    "id": 1,
    "donationId": 1,
    "pickupDate": "2025-12-25",
    "pickupTime": "10:00"
  }
}
```

### Get All Pickups (Protected)
```
GET /pickups
GET /pickups?donationId=1&status=Scheduled
Authorization: Bearer <token>

Query Parameters:
- donationId: Filter by donation (optional)
- status: Filter by status (optional)

Response: 200 OK
{
  "pickups": [
    {
      "id": 1,
      "donation_id": 1,
      "donor_id": 2,
      "pickup_date": "2025-12-25",
      "pickup_time": "10:00",
      "notes": "Please call 10 minutes before",
      "status": "Scheduled",
      "donation_type": "Food",
      "location": "New York, NY",
      "donor_name": "John Doe",
      "scheduled_at": "2025-12-23T10:00:00"
    }
  ]
}
```

### Update Pickup Status (Protected)
```
PUT /pickups/:id
Authorization: Bearer <token>
Content-Type: application/json

Request Body:
{
  "status": "Completed"  // or "Cancelled"
}

Response: 200 OK
{
  "message": "Pickup status updated successfully"
}
```

### Get NGO's Pickups (NGO Only)
```
GET /pickups/ngo/schedule
Authorization: Bearer <token>

Response: 200 OK
{
  "pickups": [
    {
      "id": 1,
      "donation_id": 1,
      "donor_id": 2,
      "pickup_date": "2025-12-25",
      "pickup_time": "10:00",
      "status": "Scheduled",
      "donation_type": "Food",
      "location": "New York, NY",
      "donor_name": "John Doe"
    }
  ]
}
```

### Get Donor's Pickups (Donor Only)
```
GET /pickups/donor/schedule
Authorization: Bearer <token>

Response: 200 OK
{
  "pickups": [
    {
      "id": 1,
      "donation_id": 1,
      "donor_id": 2,
      "pickup_date": "2025-12-25",
      "pickup_time": "10:00",
      "status": "Scheduled",
      "donation_type": "Food",
      "location": "New York, NY"
    }
  ]
}
```

---

## Leaderboard Endpoints

### Get Leaderboard (Public)
```
GET /leaderboard

Response: 200 OK
{
  "leaderboard": [
    {
      "rank": 1,
      "id": 2,
      "name": "John Doe",
      "total_contributions": 15,
      "total_amount": 1500
    },
    {
      "rank": 2,
      "id": 3,
      "name": "Jane Smith",
      "total_contributions": 12,
      "total_amount": 1200
    }
  ]
}
```

### Get Donor Stats (Donor Only)
```
GET /leaderboard/stats
Authorization: Bearer <token>

Response: 200 OK
{
  "stats": {
    "total_contributions": 5,
    "total_amount": 500
  }
}
```

---

## Health Check Endpoint

### Server Health
```
GET /health

Response: 200 OK
{
  "message": "Server is running"
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "message": "Missing required fields"
}
```

### 401 Unauthorized
```json
{
  "message": "Invalid credentials" or "No token provided"
}
```

### 403 Forbidden
```json
{
  "message": "Not authorized" or "Only NGOs can create donations"
}
```

### 404 Not Found
```json
{
  "message": "Donation not found"
}
```

### 500 Internal Server Error
```json
{
  "message": "Server error"
}
```

---

## Status Codes Reference

| Code | Meaning |
|------|---------|
| 200 | OK - Request successful |
| 201 | Created - Resource created successfully |
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Missing or invalid token |
| 403 | Forbidden - Not authorized for this action |
| 404 | Not Found - Resource doesn't exist |
| 500 | Internal Server Error - Server-side error |

---

## Example cURL Requests

### Register
```bash
curl -X POST http://localhost:3000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "role": "Donor",
    "contactInfo": "1234567890"
  }'
```

### Login
```bash
curl -X POST http://localhost:3000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Get All Donations
```bash
curl -X GET http://localhost:3000/api/donations
```

### Create Donation (with token)
```bash
curl -X POST http://localhost:3000/api/donations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "donationType": "Food",
    "quantity": 50,
    "location": "New York, NY",
    "pickupDateTime": "2025-12-25T10:00:00",
    "priority": "Urgent"
  }'
```

### Create Contribution (with token)
```bash
curl -X POST http://localhost:3000/api/contributions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "donationId": 1,
    "amount": 50,
    "notes": "Can pickup on weekends"
  }'
```

### Schedule Pickup (with token)
```bash
curl -X POST http://localhost:3000/api/pickups \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "donationId": 1,
    "pickupDate": "2025-12-25",
    "pickupTime": "10:00",
    "notes": "Please call before"
  }'
```

---

## Testing Tool Recommendations

1. **Postman** - https://www.postman.com/
2. **Insomnia** - https://insomnia.rest/
3. **Thunder Client** - VS Code Extension
4. **REST Client** - VS Code Extension

---

**API Version**: 1.0.0  
**Last Updated**: December 23, 2025
