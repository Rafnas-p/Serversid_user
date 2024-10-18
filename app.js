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
app.use(
  cors({
    origin: "https://e-comerce-shoe.vercel.app",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);


app.options('*', cors());

app.use(errorHandler);

app.use("/users", userRoutes);

app.use("/admin", adminRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
