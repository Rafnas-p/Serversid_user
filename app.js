const express = require('express');
const connectDB = require('./Config/db'); 
const errorHandler=require('./middilewares/errorHandler')
const userRoutes = require('./routes/userRoutes');
const adminRouter=require('./routes/adminRouter')
const cors=require('cors')
const app = express();
const PORT = 3002;

// Connect to the database
connectDB();

// Middleware to parse JSON requests
app.use(express.json());
app.use(cors({ origin: 'http://localhost:3000',  
  credentials: true,                
  methods: ['GET', 'POST', 'PUT', 'DELETE'],  
  allowedHeaders: ['Content-Type', 'Authorization']  
}));

app.use(errorHandler)
// Import and use the user routes
app.use('/users', userRoutes); 

app.use('/admin',adminRouter);
// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
