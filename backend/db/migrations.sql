-- Users table
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL CHECK(role IN ('admin', 'user')),
  requiresPasswordChange INTEGER NOT NULL DEFAULT 1
);

-- Templates table
CREATE TABLE IF NOT EXISTS templates (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  pages TEXT NOT NULL, -- JSON
  createdAt TEXT NOT NULL,
  updatedAt TEXT NOT NULL,
  userId TEXT,
  FOREIGN KEY(userId) REFERENCES users(id)
);

-- Reports table
CREATE TABLE IF NOT EXISTS reports (
  id TEXT PRIMARY KEY,
  templateId TEXT NOT NULL,
  name TEXT NOT NULL,
  data TEXT NOT NULL, -- JSON
  createdAt TEXT NOT NULL,
  author TEXT NOT NULL,
  department TEXT NOT NULL,
  FOREIGN KEY(templateId) REFERENCES templates(id)
);
