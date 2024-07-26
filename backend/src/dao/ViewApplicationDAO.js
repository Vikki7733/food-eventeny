const connection = require("../../config/db");

const viewApplication = (callback) => {
  const query = `
    SELECT a.*, ai.item_name, ai.price, ai.quantity
    FROM application_table a
    LEFT JOIN application_items ai ON a.application_id = ai.application_id
  `;
  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      if (typeof callback === 'function') {
        callback(err, null);
      } else {
        throw new TypeError('Callback is not a function');
      }
      return;
    }

    const applications = results.reduce((acc, row) => {
      let app = acc.find(a => a.application_id === row.application_id);
      if (!app) {
        app = {
          ...row,
          items: []
        };
        acc.push(app);
      }
      if (row.item_name) {
        app.items.push({
          item_name: row.item_name,
          price: row.price,
          quantity: row.quantity
        });
      }
      return acc;
    }, []);

    if (typeof callback === 'function') {
      callback(null, applications);
    }
  });
};

const viewApplicationById = (applicationId, callback) => {
  const query = `
    SELECT a.*, ai.item_name, ai.price, ai.quantity
    FROM application_table a
    LEFT JOIN application_items ai ON a.application_id = ai.application_id
    WHERE a.application_id = ?
  `;
  connection.query(query, [applicationId], (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      if (typeof callback === 'function') {
        callback(err, null);
      } else {
        throw new TypeError('Callback is not a function');
      }
      return;
    }

    const result = results.reduce((acc, row) => {
      if (!acc) {
        acc = {
          ...row,
          items: []
        };
      }
      if (row.item_name) {
        acc.items.push({
          item_name: row.item_name,
          price: row.price,
          quantity: row.quantity
        });
      }
      return acc;
    }, null);

    if (typeof callback === 'function') {
      callback(null, result);
    }
  });
};

module.exports = { viewApplication, viewApplicationById };
