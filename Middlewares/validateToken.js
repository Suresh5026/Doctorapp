const jwt = require('jsonwebtoken');

const validateToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    console.log('Authorization Header:', authHeader);
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.error("No authorization header found");
      console.log('1');
      return res.status(401).json({ message: "Unauthorized" });
    }
    const token = authHeader.split(' ')[1];
    console.log("Token:", token);
    if (!token ) {
      console.error("No token found after splitting");
      return res.status(401).json({ message: "Unauthorized After Spliting" });
    }

    const decryptObj = jwt.verify(token, process.env.TOKEN_SECRET);
    console.log("Decoded Token:", decryptObj);
    req.user = decryptObj;
    req.token = token;
    next();
  } catch (error) {
    console.error("Token validation error:", error.message);
    res.status(400).json({ message: "Invalid Token" });
    if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Token expired.' });
      }
      if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({ message: 'Invalid token.' });
      }
      res.status(500).json({ message: 'Internal server error.' });
    
  }
};


module.exports = validateToken;