const express = require('express');
const session = require('express-session');
const SQLiteStore = require('connect-sqlite3')(session);
const path = require('path');
const fs = require('fs');

// Ensure data dir
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

// Init DB (creates tables + default user)
require('./db');

const { requireAuth } = require('./middleware/auth');
const authRouter = require('./routes/auth');
const strankeRouter = require('./routes/stranke');
const vozilaRouter = require('./routes/vozila');
const narocilniceRouter = require('./routes/narocilnice');
const pdfRouter = require('./routes/pdf');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  store: new SQLiteStore({ db: 'sessions.db', dir: dataDir }),
  secret: process.env.SESSION_SECRET || 'avtoparts-secret-2025',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 7 * 24 * 60 * 60 * 1000 } // 7 days
}));

// Auth routes (no auth required)
app.use('/', authRouter);

// API routes (auth required)
app.use('/api/stranke', requireAuth, strankeRouter);
app.use('/api/vozila', requireAuth, vozilaRouter);
app.use('/api/narocilnice', requireAuth, narocilniceRouter);
app.use('/api/pdf', requireAuth, pdfRouter);

// Main SPA - serve index.html for all other routes
app.get('*', requireAuth, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 AvtoDeli strežnik teče na http://localhost:${PORT}`);
  console.log(`📋 Privzeti dostop: admin / admin123`);
});
