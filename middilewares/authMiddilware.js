// const jwt = require("jsonwebtoken");

// module.exports = (req, res, next) => {
//   const authHeader = req.headers["authorization"];

//   if (!authHeader) {
//     return res.status(401).json({ message: "No token provided" });
//   }

//   const token = authHeader.split(" ")[1];

//   if (!token) {
//     return res
//       .status(401)
//       .json({ message: "Token is missing or improperly formatted" });
//   }

//   jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
//     if (err) {
//       return res.status(400).json({ message: "Invalid token", error: err });
//     }

//     req.userId = decoded.id;
//     req.isAdmin= decoded.isAdmin
//     next();
//   });
// };
const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Check if authorization header exists
  if (!authHeader) {
    return res.status(401).json({ message: "Authorization header missing" });
  }

  // Extract the token from the header
  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Token is missing or malformed" });
  }

  // Verify the token
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Invalid or expired token", error: err.message });
    }

    // Pass decoded user info to the next middleware
    req.userId = decoded.id;
    req.isAdmin = decoded.isAdmin;
    next();
  });
};

module.exports = verifyToken;
