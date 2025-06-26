const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const User = require('./models/User');
const initPassport = require('./passport-config');

const app = express();
let vehicles = [];
let id = 1;

// Mongoose connection
mongoose.connect('mongodb://127.0.0.1:27017/vehicleDB');

// Middleware
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

// Session and passport
app.use(session({
  secret: 'secret123',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
initPassport(passport);

// Auth Middleware
function ensureAuth(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect('/login');
}

// Auth Routes
app.get('/register', (req, res) => {
  res.render('register');
});

app.post('/register', async (req, res) => {
  const { username, password, email, age } = req.body;
  try {
    const newUser = new User({ username, password, email, age });
    await newUser.save();
    res.redirect('/login');
  } catch (e) {
    res.send('Error registering user.');
  }
});

app.get('/login', (req, res) => {
  res.render('login');
});

app.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login'
}));

app.get('/logout', (req, res) => {
  req.logout(() => res.redirect('/login'));
});

// CRUD Routes (Protected)
app.get('/', ensureAuth, (req, res) => {
  res.render('index', { vehicles });
});

app.get('/vehicles/new', ensureAuth, (req, res) => {
  res.render('new');
});

app.post('/vehicles', ensureAuth, (req, res) => {
  const { vehicleName, price, image, desc, brand } = req.body;
  vehicles.push({ id: id++, vehicleName, price, image, desc, brand });
  res.redirect('/');
});

app.get('/vehicles/edit/:id', ensureAuth, (req, res) => {
  const vehicle = vehicles.find(v => v.id == req.params.id);
  res.render('edit', { vehicle });
});

app.post('/vehicles/update/:id', ensureAuth, (req, res) => {
  const { vehicleName, price, image, desc, brand } = req.body;
  const index = vehicles.findIndex(v => v.id == req.params.id);
  vehicles[index] = { id: parseInt(req.params.id), vehicleName, price, image, desc, brand };
  res.redirect('/');
});

app.post('/vehicles/delete/:id', ensureAuth, (req, res) => {
  vehicles = vehicles.filter(v => v.id != req.params.id);
  res.redirect('/');
});

// API Endpoint
app.get('/api/vehicles', ensureAuth, (req, res) => {
  res.json(vehicles);
});

app.listen(4000, () => console.log('Server running at http://localhost:4000'));
