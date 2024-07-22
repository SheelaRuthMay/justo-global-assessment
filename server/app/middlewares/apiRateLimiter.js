const {rateLimit} =  require('express-rate-limit');

 const rateLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 24 hrs in milliseconds
  max: 20,
  message: {
    status: false,
    message: 'You have exceeded Maximum requests limit!'
}, 
  standardHeaders: true,
  legacyHeaders: false,
});
module.exports = rateLimiter;