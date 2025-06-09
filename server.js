const express = require('express');
const path = require('path');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const app = express();

// Middlewares
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Database connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '', // ปรับตามจริง
  database: 'ble_web' // ตั้งชื่อฐานข้อมูลให้ตรง
});

db.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL database');
});

// Floor images config
const floorConfig = {
  1: 'อาคาร Wellnese 9 ชั้น-1-black-modified.png',
  2: 'อาคาร Wellnese 9 ชั้น-2-modified.png',
  3: 'อาคาร Wellnese 9 ชั้น-3-modified.png',
  4: 'อาคาร Wellnese 9 ชั้น-4-modified.png',
  5: 'อาคาร Wellnese 9 ชั้น-5-modified.png',
  6: 'อาคาร Wellnese 9 ชั้น-6-modified.png',
  7: 'อาคาร Wellnese 9 ชั้น-7-modified.png',
  8: 'อาคาร Wellnese 9 ชั้น-8-modified.png',
  9: 'อาคาร Wellnese 9 ชั้น-9-modified.png'
};

// Route: Floor Viewer
app.get('/floor:floorNumber', (req, res) => {
  const floorNumber = parseInt(req.params.floorNumber);
  const imageFile = floorConfig[floorNumber];

  if (!imageFile) return res.status(404).send('Floor not found');

  res.render('floor', {
    backgroundImage: `/img/${imageFile}`,
    viewLink: `/ViewArubaFloor${floorNumber}.html`,
    selectedFloor: floorNumber
  });
});

// Route: Login
app.get('/login', (req, res) => {
  res.render('login', { message: '' });
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  db.query('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], (err, results) => {
    if (err) throw err;
    if (results.length > 0) {
      res.redirect('/floor1'); // 👈 เปลี่ยนตรงนี้
    } else {
      res.render('login', { message: 'Invalid credentials' });
    }
  });
});

// Route: Register
app.get('/register', (req, res) => {
  res.render('register', { message: '' });
});

app.post('/register', (req, res) => {
  const { username, password } = req.body;
  db.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, password], (err) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        return res.render('register', { message: 'Username already exists' });
      }
      throw err;
    }
    res.redirect('/login');
  });
});

// Start Server
app.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});
