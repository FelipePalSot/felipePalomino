const express = require('express');
const path = require('path');
const helmet = require('helmet');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const PORT = 3000;


app.use(helmet.frameguard({ action: 'deny' })); 
app.use(helmet.xssFilter()); 

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));


const db = new sqlite3.Database(':memory:');


db.serialize(() => {
  db.run(`CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
  )`);

 
  const stmt = db.prepare('INSERT INTO users (username, password) VALUES (?, ?)');
  stmt.run('admin', 'admin123');
  stmt.run('usuario', 'usuario123');
  stmt.finalize();
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});


app.post('/login', (req, res) => {
  const { username, password } = req.body;
  
  
  const query = 'SELECT * FROM users WHERE username = ? AND password = ?';
  
  db.get(query, [username, password], (err, user) => {
    if (err) {
      return res.json({ success: false, message: 'Error en el servidor' });
    }
    
    if (user) {
      res.json({ success: true, message: '¡Inicio de sesión exitoso!', username: user.username });
    } else {
      res.json({ success: false, message: 'Usuario o contraseña incorrectos' });
    }
  });
});


app.get('/welcome', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'welcome.html'));
});

app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});