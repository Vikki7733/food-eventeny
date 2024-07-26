const connection = require("../../config/db");

const updateApplication = (applicationId, applicationData, callback) => {
    const { applicant_name, description, applicant_phone, applicant_email, venue_location, requester_comments, } = applicationData;
    const query = `
        UPDATE application_table 
        SET applicant_name = ?, description = ?, applicant_phone = ?, applicant_email = ?, venue_location = ?, requester_comments = ?
        WHERE application_id = ?
    `;
    connection.query(query, [applicant_name, description, applicant_phone, applicant_email, venue_location, requester_comments, applicationId], (err, results) => {
    if (err) {
      return callback(err, null);
    }
    if (results.affectedRows === 0) {
      return callback(new Error('Application not found'), null);
    }
        callback(null, results);
    });
};

module.exports = { updateApplication };
