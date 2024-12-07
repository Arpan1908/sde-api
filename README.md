A real-time railway management system where users can check train availability, book seats, and manage bookings. The system supports Role-Based Access Control (RBAC) with Admin and User roles. Admins can add and manage trains, while users can book seats and view booking details. The app ensures security with JWT authentication and protects Admin routes with an API key.

Features
User Registration & Login with JWT authentication.
Admin Functionality to add new trains and manage seat availability.
Check Train Availability between two stations.
Real-time Seat Booking with race condition handling.
Get Booking Details for users.
Secure Endpoints with API key protection for Admin routes.
Database powered by PostgreSQL using NeonDB.
Security enhanced with Helmet middleware


Installation and Setup
Follow these steps to set up the project on your local machine.

1. Clone the Repository
```bash
git clone https://github.com/Arpan1908/sde-api.git
cd sde-api
```
3. Install Dependencies
Install the required packages using npm:

```bash
npm install
```
3. Setup Environment Variables
Create a .env file in the root directory and add the following variables:
```bash
# Database URL for NeonDB
DATABASE_URL=postgresql://username:password@your-neon-endpoint/dbname

# JWT Secret Key for Authentication
JWT_SECRET=your_jwt_secret

# API Key for Admin Routes
ADMIN_KEY=your_admin_api_key
```

Instructions to Generate Keys:

NeonDB Connection String: Sign up at Neon and create a PostgreSQL database. Copy the connection string and replace it in DATABASE_URL.
JWT Secret: Generate a secure random string (e.g., using randomkeygen).
Admin API Key: Create a secure API key manually (e.g., a long random string).

4. Database Setup
Create Tables in your NeonDB database:

Execute the following SQL commands to create the required tables:

```sql
Copy code
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT NOT NULL
);

CREATE TABLE trains (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  source TEXT NOT NULL,
  destination TEXT NOT NULL,
  available_seats INTEGER NOT NULL
);

CREATE TABLE bookings (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  train_id INTEGER REFERENCES trains(id)
);
```

5. Start the Server
Run the server using:

```bash

node app.js
//The server will run at http://localhost:8000.
```
