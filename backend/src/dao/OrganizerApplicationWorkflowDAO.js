const connection = require("../../config/db");


async function updateApplicationStatus(applicationId, action, organizerData) {
    const { organizerComments, allocatedLocation } = organizerData;
    let status;
    switch (action) {
        case 'approve':
            status = 'Approved';
            break;
        case 'reject':
            status = 'Rejected';
            break;
        default:
            throw new Error('Invalid action');
    }
try {
     new Promise((resolve, reject) => {
        connection.beginTransaction(err => {
            if (err) {
                return reject(err);
            }

            // Update the application_table
            const updateAppQuery = `
                UPDATE application_table 
                SET status = ?, allocated_location = ?
                WHERE application_id = ?
                `;

            connection.query(updateAppQuery, [status, allocatedLocation, applicationId], (err, result) => {
                if (err) {
                    return connection.rollback(() => reject(err));
                }

                // Insert into the organizer_table
                const insertOrganizerQuery = `
                    INSERT INTO organizer_table (application_id, organizer_comments, allocated_location, update_date) 
                    VALUES (?, ?, ?, NOW())`;
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
            
                        if (typeof callback === 'function') {
                            const applicationData = applicationResults[0];
                            applicationData.items = itemsResults;
                            callback(null, applicationData);
                        }
                    });

                connection.query(insertOrganizerQuery, [applicationId, organizerComments, allocatedLocation], (err, result) => {
                    if (err) {
                        return connection.rollback(() => reject(err));
                    }

                    connection.commit(err => {
                        if (err) {
                            return connection.rollback(() => reject(err));
                        }
                        resolve();
                    });
                });
            });
        });
    });
    return { success: true, message: `${action} operation completed successfully.` };
} catch (error) {
    console.error("Error updating application status:", error);
    return { success: false, message: `Error during ${action} operation.` };
}
}

module.exports = { updateApplicationStatus };
