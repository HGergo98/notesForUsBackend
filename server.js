require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const mongoose = require('mongoose');

const connectDB = require('./config/dbConn');
const corsOptions = require('./config/corsOptions');

const { logger, logEvents } = require('./middleware/logger');
const errorHandler = require('./middleware/errorHandler');
const PORT = process.env.PORT || 3500;

connectDB();

// logging requests
app.use(logger);

// set up cors
app.use(cors(corsOptions));

// handling json files
app.use(express.json());

// parsing received cookies
app.use(cookieParser());

// loading static files like: css, images
app.use('/', express.static(path.join(__dirname, 'public')));

// handling the / route
app.use('/', require('./routes/root'));

// handling the /users route
app.use('/users', require('./routes/userRoutes'));

// handling the /notes route
app.use('/notes', require('./routes/noteRoutes'));

// hanndling any route that not exist
app.all('*', (req, res) => {
  res.status(404);

  if (req.accepts('html')) {
    res.sendFile(path.join(__dirname, 'views', '404.html'));
  } else if (req.accepts('json')) {
    res.json({ message: '404 Not Found' });
  } else {
    res.type('txt').send('404 Not Found');
  }
});

// handling and logging errors
app.use(errorHandler);

mongoose.connection.once('open', () => {
  console.log('connected to mongodb');
  app.listen(PORT, () => console.log(`Server running on port: ${PORT}.`));
});

mongoose.connection.on('error', err => {
  console.log(err);
  logEvents(`${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`, 'mongoError.log');
});