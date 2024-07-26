const connection = require("../../config/db");

const createApplication = (applicationData, callback) => {
  const {
    application_id,
    applicant_name,
    description,
    cuisine_type,
    venue_location,
    applicant_phone,
    applicant_email,
    requester_comments,
    items 
  } = applicationData;

  const query = `
    INSERT INTO application_table 
    (application_id, applicant_name, description, created_date, applicant_phone, applicant_email, status, cuisine_type, venue_location, requester_comments) 
    VALUES (?, ?, ?, NOW(), ?, ?, 'Pending', ?, ?, ?)
  `;

  connection.query(query, [application_id, applicant_name, description, applicant_phone, applicant_email, cuisine_type, venue_location, requester_comments], (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      callback(err, null);
      return;
    }

    if (items && Object.keys(items).length > 0) {
      const itemQuery = `
          INSERT INTO application_items (application_id, item_name, quantity, price)
          VALUES ?
      `;

      const itemValues = Object.keys(items).map(key => [
          application_id,
          key,
          items[key].quantity,
          parseFloat(items[key].price)
      ]);

      connection.query(itemQuery, [itemValues], (err, result) => {
        if (err) {
          return callback(err, null);
        }

        // Calculate total price
        const totalPrice = itemValues.reduce((sum, item) => sum + item[2] * item[3], 0);

        // Update total price in application_table
        const updateQuery = `
          UPDATE application_table
          SET total_price = ?
          WHERE application_id = ?
        `;

        connection.query(updateQuery, [totalPrice, application_id], (err, result) => {
          if (err) {
            return callback(err, null);
          }
          callback(null, result);
        });
      });
    } else {
      callback(null, results);
    }
  });
};

module.exports = { createApplication };