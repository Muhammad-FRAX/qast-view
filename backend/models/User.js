const db = require('../db/database');
const bcrypt = require('bcrypt');

const SALT_ROUNDS = 10;

module.exports = {
  async create(user) {
    const hash = await bcrypt.hash(user.password, SALT_ROUNDS);
    return new Promise((resolve, reject) => {
      db.run(
        `INSERT INTO users (id, username, password_hash, role, requiresPasswordChange) VALUES (?, ?, ?, ?, ?) `,
        [user.id, user.username, hash, user.role, user.requiresPasswordChange ? 1 : 0], // Ensure requiresPasswordChange is correctly stored as 0 or 1
        function (err) {
          if (err) return reject(err);
          resolve({ ...user, password_hash: hash });
        }
      );
    });
  },
  getById(id) {
    return new Promise((resolve, reject) => {
      db.get(`SELECT * FROM users WHERE id = ?`, [id], (err, row) => {
        if (err) return reject(err);
        resolve(row);
      });
    });
  },
  getByUsername(username) {
    return new Promise((resolve, reject) => {
      db.get(`SELECT * FROM users WHERE username = ?`, [username], (err, row) => {
        if (err) return reject(err);
        resolve(row);
      });
    });
  },
  getAll() {
    return new Promise((resolve, reject) => {
      db.all(`SELECT * FROM users`, [], (err, rows) => {
        if (err) return reject(err);
        resolve(rows);
      });
    });
  },
  update(id, updates) {
    const fields = [];
    const values = [];
    for (const key in updates) {
      if (key === 'password') continue;
      fields.push(`${key} = ?`);
      values.push(updates[key]);
    }
    if (fields.length === 0) return Promise.resolve();
    values.push(id);
    return new Promise((resolve, reject) => {
      db.run(
        `UPDATE users SET ${fields.join(', ')} WHERE id = ?`,
        values,
        function (err) {
          if (err) return reject(err);
          resolve();
        }
      );
    });
  },
  async updatePassword(id, newPassword) {
    const hash = await bcrypt.hash(newPassword, SALT_ROUNDS);
    return new Promise((resolve, reject) => {
      db.run(
        `UPDATE users SET password_hash = ?, requiresPasswordChange = 0 WHERE id = ?`,
        [hash, id],
        function (err) {
          if (err) return reject(err);
          resolve();
        }
      );
    });
  },
  delete(id) {
    return new Promise((resolve, reject) => {
      db.run(`DELETE FROM users WHERE id = ?`, [id], function (err) {
        if (err) return reject(err);
        resolve();
      });
    });
  },
  async checkPassword(user, password) {
    return bcrypt.compare(password, user.password_hash);
  },
};
