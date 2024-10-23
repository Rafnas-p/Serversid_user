const express = require("express");
const connectDB = require("./Config/db");
const errorHandler = require("./middilewares/errorHandler");
const userRoutes = require("./routes/userRoutes");
const adminRouter = require("./routes/adminRouter");
const cors = require("cors");
const app = express();
const PORT = 3002;

connectDB();

// Middleware to parse JSON requests
app.use(express.json());

// Configure CORS to allow the frontend origin
app.use(
  cors({
    origin: "https://e-comerce-shoe.vercel.app",  // Allow only your frontend
    credentials: true,  // Allow sending cookies and authorization headers
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Handle preflight requests (OPTIONS)
app.options("*", cors());

// Define routes
app.use("/users", userRoutes);
app.use("/admin", adminRouter);

// Error handling middleware
app.use(errorHandler);

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
