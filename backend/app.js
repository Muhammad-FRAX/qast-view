const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const db = require('./db/database');

const usersRouter = require('./routes/users');
const templatesRouter = require('./routes/templates');
const reportsRouter = require('./routes/reports');

const app = express();
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'], // Allow both localhost and IP
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true // Allow credentials
}));
app.use(bodyParser.json({limit: '10mb'}));

// Run migrations on startup
const migrations = fs.readFileSync(path.join(__dirname, 'db', 'migrations.sql'), 'utf-8');
db.exec(migrations, (err) => {
  if (err) {
    console.error('Failed to run migrations:', err);
    process.exit(1);
  } else {
    console.log('Database migrations applied.');
  }
});

app.get('/health', (req, res) => res.json({ status: 'ok' }));
app.use('/api/users', usersRouter);
app.use('/api/templates', templatesRouter);
app.use('/api/reports', reportsRouter);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
