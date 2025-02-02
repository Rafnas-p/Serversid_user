const express = require("express");
const connectDB = require("./Config/db");
const errorHandler = require("./middilewares/errorHandler");
const userRoutes = require("./routes/userRoutes");
const adminRouter = require("./routes/adminRouter");
const cors = require("cors");

const app = express();
const PORT = 3002;

connectDB();

app.use(express.json());

const allowedOrigins = ["http://localhost:3000", "https://e-comerce-shoe.vercel.app"];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, origin);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,  
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Explicitly include OPTIONS
  allowedHeaders: ["Content-Type", "Authorization", "X-MongoDb-Id"],
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Explicitly handle preflight requests
app.options("*", cors(corsOptions));

app.use("/users", userRoutes);
app.use("/admin", adminRouter);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
