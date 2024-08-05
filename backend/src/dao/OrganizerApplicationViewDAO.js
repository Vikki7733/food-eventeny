const connection = require("../../config/db");

const organizerViewApplication = (applicationId, callback) => {
    const fetchAllJoinedDataQuery = `
    SELECT 
        a.application_id,
        a.applicant_name,
        a.status,
        a.description,
        a.applicant_phone,
        a.applicant_email,
        a.created_date,
        a.venue_location,
        a.cuisine_type,
        a.requester_comments,
        a.allocated_location,
        a.total_price,
        o.organizer_id,
        o.organizer_comments,
        o.allocated_location,
        o.update_date AS organizer_updated_date
    FROM 
        application_table a
    JOIN 
        organizer_table o ON a.application_id = o.application_id
    WHERE a.application_id = ?`;

    connection.query(fetchAllJoinedDataQuery, [applicationId], (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            if (typeof callback === 'function') {
                callback(err, null);
            } else {
                throw new TypeError('Callback is not a function');
            }
            return;
        }
        if (!results.length) {
            return callback(null, null); // No results found
        }
        const applicationData = results[0];
        // Fetch items for the application
        const fetchItemsQuery = `
        SELECT 
            item_name,
            price,
            quantity
        FROM 
            application_items
        WHERE application_id = ?`;

        connection.query(fetchItemsQuery, [applicationId], (err, itemsResults) => {
            if (err) {
                console.error('Error executing query:', err);
                if (typeof callback === 'function') {
                    callback(err, null);
                } else {
                    throw new TypeError('Callback is not a function');
                }
                return;
            }

            applicationData.items = itemsResults;
            if (typeof callback === 'function') {
                callback(null, applicationData);
            }
        });
    });

};

module.exports = { organizerViewApplication };
