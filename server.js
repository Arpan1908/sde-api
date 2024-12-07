const express = require("express");
const app = express();
const helmet = require("helmet");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();
app.use(express.json());
app.use(helmet());               
app.use(cors());
app.use(bodyParser.json());


const adminRoutes = require("./routes/adminRoutes");
const userRoutes = require("./routes/authRoutes");

app.use("/api/admin", adminRoutes);
app.use("/api/user", userRoutes);

const PORT = process.env.PORT || 8000;
app.listen(8000,()=>{
  console.log("Sever is running on port 8000")
})
