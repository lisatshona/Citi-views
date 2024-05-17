const jwt = require('jsonwebtoken');
const config = require('../config/db');
const Admin = require('../models/Admin');

const authenticateAdmin = async (req, res, next) => {
  try {
    // Extract token from header
    const token = req.headers.authorization.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Authorization header is missing' });
    }

    // Verify token
    const decodedToken = jwt.verify(token, config.secret);
    if (!decodedToken) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    // Check if user exists and is admin
    const admin = await Admin.findById(decodedToken.id);
    if (!admin) {
      return res.status(401).json({ message: 'Admin not found' });
    }

    // Attach user object to request
    req.admin = admin;
    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = authenticateAdmin;
