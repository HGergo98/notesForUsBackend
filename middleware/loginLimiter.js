const rateLimit = require('express-rate-limit');
const { logEvents } = require('../middleware/logger');

const loginLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5, // Limit each IP to 5 login requests per 'window' per minute
  message:
    { message: 'Too many login attempts from this IP, please try again after 60 second.' },
  handler: (req, res, next, options) => {
    logEvents(
      `Too many Requests: ${options.message.message}\t${req.method}\t${req.url}\t${req.headers.origin}`,
      'loginErrLog.log'
    );
    res.status(options.statusCode).send(options.message);
  },
  standardHeaders: true, // Return rate limit info in the 'RareLimit-*' headers
  legacyHeaders: false
});

module.exports = loginLimiter;