require('./_server/config/config');
// require('./_server/models/db');
// require('./_server/config/passportConfig');

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
// const passport = require('passport');

const routeIndex = require('./_server/routes/index.router');

var app = express();
let usersCount;

// middleware
app.use(bodyParser.urlencoded( {extended: false} ));
app.use(bodyParser.json());
app.use(cors({
  'origin': '*',
  'methods': 'GET, HEAD, PUT, PATCH, POST, DELETE, OPTIONS',
  'optionsSuccessStatus': 204
}));
app.use(express.static(path.join(__dirname, 'build')));
app.use('/uploads', express.static('uploads'));
// app.use(passport.initialize());

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'build/index.html')));

app.use('/api/v1', routeIndex);

app.use((err, req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET', 'OPTIONS');
    return res.status(200).json({});
  }
  next();
});

// error handler
app.use((err, req, res, next) => {
  if (err.name === 'ValidationError') {
      var valErrors = [];
      Object.keys(err.errors).forEach(key => valErrors.push(err.errors[key].message));
      res.status(422).send(valErrors);
  }

});

app.use((req, res, next) => {
  const error = new Error('Not found');
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  });
});

// start server
app.listen(process.env.PORT, () => 
console.log(`Server started at port :: @${process.env.PORT} and pid: ${process.pid}`));


process.on('message', ({usersCount: count}) => {
  usersCount = count;
});


// setTimeout(() => {
//   process.exit(1); // death by random timeout
// }, Math.random() * 10000);
