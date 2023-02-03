const express = require('express');
const app = express();
const path = require('path');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const corsOptions = require('./config/corsOptions');
const { logger } = require('./middleware/logger');
const errorHandler = require('./middleware/errorHandler');
const PORT = process.env.PORT || 3500;

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

app.listen(PORT, () => console.log(`Server running on port: ${PORT}.`));