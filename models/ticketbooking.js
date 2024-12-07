const sql = require("../config/db");

async function createBooking(userId, trainId) {
    return sql`INSERT INTO bookings (user_id, train_id) VALUES (${userId}, ${trainId}) RETURNING *;`;
}

async function getBookingById(bookingId) {
    return sql`SELECT * FROM bookings WHERE id = ${bookingId};`;
}

module.exports = { createBooking, getBookingById };
