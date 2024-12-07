const express = require("express");
const router = express.Router();
const {registerUser,loginUser,getSeatAvailability,bookSeat,getBookingDetails,} = require("../controllers/authController");
const authMiddleware = require("../middlewares/authMiddleware");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/seat-availability", authMiddleware, getSeatAvailability);
router.post("/book-seat", authMiddleware, bookSeat);
router.get("/booking/:bookingId", authMiddleware, getBookingDetails);

module.exports = router;
