const express = require('express');
const session = require('express-session');
const MemoryStore = require('memorystore')(session);
const path = require('path');
const fs = require('fs');

const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

require('./db');

const { requireAuth } = require('./middleware/auth');
const authRouter = require('./routes/auth');
const strankeRouter = require('./routes/stranke');
const vozilaRouter = require('./routes/vozila');
const narocilniceRouter = require('./routes/narocilnice');
const pdfRouter = require('./routes/pdf');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  store: new MemoryStore({ checkPeriod: 86400000 }),
  secret: process.env.SESSION_SECRET || 'avtoparts-secret-change-me-2025',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 7 * 24 * 60 * 60 * 1000 }
}));

app.use('/', authRouter);
app.use('/api/stranke', requireAuth, strankeRouter);
app.use('/api/vozila', requireAuth, vozilaRouter);
app.use('/api/narocilnice', requireAuth, narocilniceRouter);
app.use('/api/pdf', requireAuth, pdfRouter);
app.get('*', requireAuth, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`AvtoDeli streznik na http://localhost:${PORT}`);
  console.log(`Dostop: admin / admin123`);
});
