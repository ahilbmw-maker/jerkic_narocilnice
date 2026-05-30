const Database = require('better-sqlite3');
const path = require('path');
const bcrypt = require('bcryptjs');
const fs = require('fs');

const DB_PATH = process.env.DB_PATH || path.join(__dirname, 'data', 'avtoparts.db');
const dataDir = path.dirname(DB_PATH);
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

const db = new Database(DB_PATH);
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS stranke (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sifra TEXT UNIQUE NOT NULL,
    ime TEXT NOT NULL,
    priimek TEXT, podjetje TEXT, telefon TEXT, email TEXT, naslov TEXT, opomba TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS vozila (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    stranka_id INTEGER NOT NULL,
    vin TEXT, marka TEXT NOT NULL, model TEXT NOT NULL, letnik INTEGER,
    tip_motorja TEXT, ccm INTEGER, kw INTEGER, registrska TEXT, km INTEGER, opomba TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (stranka_id) REFERENCES stranke(id) ON DELETE CASCADE
  );
  CREATE TABLE IF NOT EXISTS narocilnice (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    stevilka TEXT UNIQUE NOT NULL,
    stranka_id INTEGER NOT NULL,
    vozilo_id INTEGER,
    tip TEXT NOT NULL DEFAULT 'narocilnica',
    status TEXT NOT NULL DEFAULT 'osnutek',
    opomba TEXT, popust_procent REAL DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (stranka_id) REFERENCES stranke(id),
    FOREIGN KEY (vozilo_id) REFERENCES vozila(id)
  );
  CREATE TABLE IF NOT EXISTS postavke (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    narocilnica_id INTEGER NOT NULL,
    katalog_st TEXT, naziv TEXT NOT NULL,
    kolicina REAL NOT NULL DEFAULT 1, enota TEXT DEFAULT 'kos',
    cena_brez_ddv REAL NOT NULL DEFAULT 0,
    ddv_procent REAL NOT NULL DEFAULT 22,
    popust_procent REAL DEFAULT 0,
    FOREIGN KEY (narocilnica_id) REFERENCES narocilnice(id) ON DELETE CASCADE
  );
  CREATE TABLE IF NOT EXISTS stevilcnik (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    leto INTEGER NOT NULL, tip TEXT NOT NULL,
    zadnja_stevilka INTEGER NOT NULL DEFAULT 0,
    UNIQUE(leto, tip)
  );
`);

const userCount = db.prepare('SELECT COUNT(*) as cnt FROM users').get();
if (userCount.cnt === 0) {
  const hash = bcrypt.hashSync('admin123', 10);
  db.prepare('INSERT INTO users (username, password_hash) VALUES (?, ?)').run('admin', hash);
  console.log('Default user created: admin / admin123');
}

module.exports = db;
