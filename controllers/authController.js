const { findUserByUsername, createUser } = require("../models/users");
const { getTrainsBetweenStations } = require("../models/train");
const { getBookingById } = require("../models/ticketbooking");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Pool, neonConfig } = require('@neondatabase/serverless');
const ws = require ('ws');
neonConfig.webSocketConstructor = ws;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
pool.on('error', (err) => console.error(err));

// function to register user
async function registerUser(req, res) {
    const { username, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
        const user = await createUser(username, hashedPassword, role);
        res.status(201).json(user);
    } catch (error) {
        res.status(500).json({ message: "Error registering user", error });
    }
}

//function to login user
async function loginUser(req, res) {
    const { username, password } = req.body;
    try {
        const user = await findUserByUsername(username);
        if (user.length === 0 || !(await bcrypt.compare(password, user[0].password))) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        const token = jwt.sign({ id: user[0].id, role: user[0].role }, process.env.JWT_SECRET, {
            expiresIn: "1h",
        });
        res.json({ token });
    } catch (error) {
        res.status(500).json({ message: "Error logging in", error });
    }
}

//function to get seat avaailibility in trains
async function getSeatAvailability(req, res) {
    const { source, destination } = req.query;
    try {
        const trains = await getTrainsBetweenStations(source, destination);
        res.json(trains);
    } catch (error) {
        res.status(500).json({ message: "Error fetching trains", error });
    }
}


//seat booking function keeping in mind the race conditions during transactions
async function bookSeat(req, res) {
    const { trainId } = req.body;
    const userId = req.user.id;

    
    const client = await pool.connect();
    await client.query('BEGIN');

    try {
        
        const train = await client.query(`
            SELECT * FROM trains WHERE id = $1 FOR UPDATE`, [trainId]);

        if (train.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(400).json({ message: "Train not found" });
        }

        const availableSeats = train.rows[0].available_seats;

        if (availableSeats <= 0) {
          await client.query('ROLLBACK');
            return res.status(400).json({ message: "No seats available" });
        }

        
        const updateResult = await client.query(`
            UPDATE trains SET available_seats = available_seats - 1 WHERE id = $1 RETURNING *;`, [trainId]);

        if (updateResult.rows[0].available_seats < 0) {
          await client.query('ROLLBACK');
            return res.status(400).json({ message: "No seats available" });
        }

        
        const bookingResult = await client.query(`
            INSERT INTO bookings (user_id, train_id) VALUES ($1, $2) RETURNING *;`, [userId, trainId]);

        const booking = bookingResult.rows[0];

        
        await client.query('COMMIT');

        
        res.status(201).json(booking);

    } catch (error) {
      await client.query('ROLLBACK');
        console.error("Error during seat booking transaction:", error);
        res.status(500).json({ message: "Error booking seat", error });
    } finally {
        client.query("RELEASE");
    }
}



//fucntion to get booking details
async function getBookingDetails(req, res) {
    const { bookingId } = req.params;
    try {
        const booking = await getBookingById(bookingId);
        if (booking.length === 0) return res.status(404).json({ message: "Booking not found" });

        res.json(booking);
    } catch (error) {
        res.status(500).json({ message: "Error fetching booking", error });
    }
}

module.exports = { registerUser, loginUser, getSeatAvailability, bookSeat, getBookingDetails };
