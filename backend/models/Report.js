const db = require('../db/database');

module.exports = {
  create(report) {
    return new Promise((resolve, reject) => {
      db.run(
        `INSERT INTO reports (id, templateId, name, data, createdAt, author, department) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [report.id, report.templateId, report.name, JSON.stringify(report.data), report.createdAt, report.author, report.department],
        function (err) {
          if (err) return reject(err);
          resolve(report);
        }
      );
    });
  },
  getById(id) {
    return new Promise((resolve, reject) => {
      db.get(`SELECT * FROM reports WHERE id = ?`, [id], (err, row) => {
        if (err) return reject(err);
        if (row) row.data = JSON.parse(row.data);
        resolve(row);
      });
    });
  },
  getAll() {
    return new Promise((resolve, reject) => {
      db.all(`SELECT * FROM reports`, [], (err, rows) => {
        if (err) return reject(err);
        rows.forEach(row => row.data = JSON.parse(row.data));
        resolve(rows);
      });
    });
  },
  update(id, updates) {
    const fields = [];
    const values = [];
    for (const key in updates) {
      if (key === 'data') {
        fields.push('data = ?');
        values.push(JSON.stringify(updates.data));
      } else {
        fields.push(`${key} = ?`);
        values.push(updates[key]);
      }
    }
    if (fields.length === 0) return Promise.resolve();
    values.push(id);
    return new Promise((resolve, reject) => {
      db.run(
        `UPDATE reports SET ${fields.join(', ')} WHERE id = ?`,
        values,
        function (err) {
          if (err) return reject(err);
          resolve();
        }
      );
    });
  },
  delete(id) {
    return new Promise((resolve, reject) => {
      db.run(`DELETE FROM reports WHERE id = ?`, [id], function (err) {
        if (err) return reject(err);
        resolve();
      });
    });
  },
};
