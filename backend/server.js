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

const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('Created uploads directory at', uploadsDir);
}

app.get('/uploads/:filename', (req, res, next) => {
  try {
    const name = req.params.filename; // already decoded by express
    if (!name) return res.status(400).end('Bad request');
    const directPath = path.join(uploadsDir, name);
    if (fs.existsSync(directPath)) return res.sendFile(directPath);

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
  next();
});

app.use('/uploads', express.static(uploadsDir));

app.use('/api/auth', authRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/categories', categoryRoutes);

const PORT = process.env.PORT || 5000;

sequelize.authenticate()
  .then(() => console.log('Database connected'))
  .catch(err => console.error('Unable to connect:', err));

sequelize.sync()
  .then(() => {
    app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));
  })
  .catch(err => {
    console.error('Failed to sync database', err);
    app.listen(PORT, () => console.log(`Backend running (db sync failed) on http://localhost:${PORT}`));
  });
