const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const sequelize = require('./config/database');

const authRoutes = require('./routes/authRoutes');
const documentRoutes = require('./routes/documentRoutes');
const categoryRoutes = require('./routes/categoryRoutes');

const app = express();
app.use(cors());
app.use(express.json());

// ensure uploads folder exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('Created uploads directory at', uploadsDir);
}

// dedicated route to serve uploads with robust matching (handles mojibake / encoding issues)
app.get('/uploads/:filename', (req, res, next) => {
  try {
    const name = req.params.filename; // already decoded by express
    if (!name) return res.status(400).end('Bad request');
    const directPath = path.join(uploadsDir, name);
    if (fs.existsSync(directPath)) return res.sendFile(directPath);

    // fallback: try to match by timestamp prefix (digits before first '-')
    const m = name.match(/^(\d+)-/);
    if (m) {
      const prefix = m[1];
      const files = fs.readdirSync(uploadsDir);
      const found = files.find(f => f.startsWith(prefix + '-'));
      if (found) return res.sendFile(path.join(uploadsDir, found));
    }
  } catch (err) {
    console.error('/uploads/:filename handler error', err);
  }
  // fallback to static middleware (or 404)
  next();
});

// serve uploaded files statically at /uploads for normal cases
app.use('/uploads', express.static(uploadsDir));

app.use('/api/auth', authRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/categories', categoryRoutes);

sequelize.authenticate()
  .then(() => console.log('Database connected'))
  .catch(err => console.error('Unable to connect:', err));

app.listen(5000, () => console.log('Backend running on http://localhost:5000'));
