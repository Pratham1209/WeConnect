// backend/utils/logger.js
const logRequest = (req, res, next) => {
    console.log(`Request made to: ${req.url}`);
    next();
  };
  
  module.exports = logRequest;
  