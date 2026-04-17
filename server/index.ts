import express from 'express';
import cors from 'cors';
import Database from 'better-sqlite3';
import { v4 as uuidv4 } from 'uuid';

const app = express();
const db = new Database('bismak.db');

app.use(cors());
app.use(express.json());

// Init DB Schema
db.exec(`
  CREATE TABLE IF NOT EXISTS routine (
    id TEXT PRIMARY KEY,
    title TEXT,
    time TEXT,
    type TEXT,
    completed INTEGER
  );

  CREATE TABLE IF NOT EXISTS uber (
    id TEXT PRIMARY KEY,
    date TEXT,
    earnings REAL,
    fuel REAL,
    fees REAL,
    profit REAL
  );

  CREATE TABLE IF NOT EXISTS goals (
    id TEXT PRIMARY KEY,
    title TEXT,
    progress INTEGER,
    deadline TEXT
  );

  CREATE TABLE IF NOT EXISTS weekly (
    day TEXT PRIMARY KEY,
    morning TEXT,
    afternoon TEXT,
    night TEXT
  );
`);

// Authentication Endpoint (Mock for SaaS)
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (email === 'admin@bismak.com' && password === 'admin123') {
    res.json({ token: 'mock-jwt-token' });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

// ROUTINE
app.get('/api/routine', (req, res) => {
  const stmt = db.prepare('SELECT * FROM routine');
  const tasks = stmt.all().map((t: any) => ({ ...t, completed: !!t.completed }));
  res.json(tasks);
});

app.post('/api/routine', (req, res) => {
  const { id, title, time, type, completed } = req.body;
  const stmt = db.prepare('INSERT INTO routine (id, title, time, type, completed) VALUES (?, ?, ?, ?, ?)');
  stmt.run(id, title, time, type, completed ? 1 : 0);
  res.json({ success: true });
});

app.put('/api/routine', (req, res) => {
  const { id, title, time, type, completed } = req.body;
  const stmt = db.prepare('UPDATE routine SET title=?, time=?, type=?, completed=? WHERE id=?');
  stmt.run(title, time, type, completed ? 1 : 0, id);
  res.json({ success: true });
});

app.delete('/api/routine/:id', (req, res) => {
  const stmt = db.prepare('DELETE FROM routine WHERE id=?');
  stmt.run(req.params.id);
  res.json({ success: true });
});

// UBER
app.get('/api/uber', (req, res) => {
  const stmt = db.prepare('SELECT * FROM uber ORDER BY date DESC');
  res.json({ history: stmt.all() });
});

app.post('/api/uber', (req, res) => {
  const { id, date, earnings, fuel, fees, profit } = req.body;
  const stmt = db.prepare('INSERT INTO uber (id, date, earnings, fuel, fees, profit) VALUES (?, ?, ?, ?, ?, ?)');
  stmt.run(id, date, earnings, fuel, fees, profit);
  res.json({ success: true });
});

// GOALS
app.get('/api/goals', (req, res) => {
  const stmt = db.prepare('SELECT * FROM goals');
  res.json(stmt.all());
});

app.post('/api/goals', (req, res) => {
  const { id, title, progress, deadline } = req.body;
  const stmt = db.prepare('INSERT INTO goals (id, title, progress, deadline) VALUES (?, ?, ?, ?)');
  stmt.run(id, title, progress, deadline);
  res.json({ success: true });
});

app.put('/api/goals', (req, res) => {
  const { id, progress } = req.body;
  const stmt = db.prepare('UPDATE goals SET progress=? WHERE id=?');
  stmt.run(progress, id);
  res.json({ success: true });
});

// WEEKLY
app.get('/api/weekly', (req, res) => {
  const stmt = db.prepare('SELECT * FROM weekly');
  let result = stmt.all();
  if (result.length === 0) {
    const days = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];
    const insert = db.prepare('INSERT INTO weekly (day, morning, afternoon, night) VALUES (?, ?, ?, ?)');
    days.forEach(d => insert.run(d, '', '', ''));
    result = db.prepare('SELECT * FROM weekly').all();
  }
  res.json(result);
});

// WEBHOOK n8n
app.post('/api/webhook/n8n', (req, res) => {
  console.log('Recebido payload do n8n:', req.body);
  // Logica de automação aqui
  res.json({ status: 'Recebido com sucesso', data_received: req.body });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
