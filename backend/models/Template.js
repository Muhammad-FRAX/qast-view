const db = require('../db/database');

module.exports = {
  create(template) {
    return new Promise((resolve, reject) => {
      db.run(
        `INSERT INTO templates (id, name, description, pages, createdAt, updatedAt, userId) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [template.id, template.name, template.description, JSON.stringify(template.pages), template.createdAt, template.updatedAt, template.userId || null],
        function (err) {
          if (err) return reject(err);
          resolve(template);
        }
      );
    });
  },
  getById(id) {
    return new Promise((resolve, reject) => {
      db.get(`SELECT * FROM templates WHERE id = ?`, [id], (err, row) => {
        if (err) return reject(err);
        if (row) row.pages = JSON.parse(row.pages);
        resolve(row);
      });
    });
  },
  getAll() {
    return new Promise((resolve, reject) => {
      db.all(`SELECT * FROM templates`, [], (err, rows) => {
        if (err) return reject(err);
        rows.forEach(row => row.pages = JSON.parse(row.pages));
        resolve(rows);
      });
    });
  },
  update(id, updates) {
    const fields = [];
    const values = [];
    for (const key in updates) {
      if (key === 'pages') {
        fields.push('pages = ?');
        values.push(JSON.stringify(updates.pages));
      } else {
        fields.push(`${key} = ?`);
        values.push(updates[key]);
      }
    }
    if (fields.length === 0) return Promise.resolve();
    values.push(id);
    return new Promise((resolve, reject) => {
      db.run(
        `UPDATE templates SET ${fields.join(', ')} WHERE id = ?`,
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
      db.run(`DELETE FROM templates WHERE id = ?`, [id], function (err) {
        if (err) return reject(err);
        resolve();
      });
    });
  },
};
