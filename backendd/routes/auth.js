const jwt = require('jsonwebtoken');
require("dotenv").config();

const authenticateToken = (req, res, next) => {
    const header = req.header('authorization');
    const token = header && header.split(" ")[1]; 
    // if (!authHeader) {
    //   return res.status(403).json({ message: 'Access denied' });
    // }
  
    if (!token) {
      return res.status(403).json({ message: 'Token missing' });
    }
  
    jwt.verify(token, "SECRETKEY", (err, user) => {
      if (err) {
        return res.status(403).json({ message: 'Invalid token' });
      }
  
      req.user = user;  
      next();           
    });
  };

  module.exports={authenticateToken}