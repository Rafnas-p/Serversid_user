const express = require('express');
const connectDB = require('./Config/db'); 
const errorHandler=require('./middilewares/errorHandler')
const userRoutes = require('./routes/userRoutes');
const app = express();
const PORT = 3002;

// Connect to the database
connectDB();

// Middleware to parse JSON requests
app.use(express.json());

app.use(errorHandler)
// Import and use the user routes
app.use('/users', userRoutes); 

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
