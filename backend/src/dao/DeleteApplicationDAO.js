const connection = require("../../config/db");

const deleteApplication = (applicationId, callback) => {
    const deleteOrganizerQuery = `DELETE FROM organizer_table WHERE application_id = ?`;
    const deleteApplicationQuery = `DELETE FROM application_table WHERE application_id = ?`;
    const deleteItemsQuery = `DELETE FROM application_items WHERE application_id = ?`;

    connection.beginTransaction((err) => {
        if (err) {
            console.error('Error starting transaction:', err);
            callback(err, null);
            return;
        }

        connection.query(deleteOrganizerQuery, [applicationId], (err, results) => {
            if (err) {
                return connection.rollback(() => {
                    console.error('Error deleting from organizer_table:', err);
                    callback(err, null);
                });
            }

            connection.query(deleteItemsQuery, [applicationId], (err, results) => {
                if (err) {
                    console.error('Error deleting related items:', err);
                    callback(err, null);
                    return;
                }
            });

            connection.query(deleteApplicationQuery, [applicationId], (err, results) => {
                if (err) {
                    return connection.rollback(() => {
                        console.error('Error deleting from application_table:', err);
                        callback(err, null);
                    });
                }

                connection.commit((err) => {
                    if (err) {
                        return connection.rollback(() => {
                            console.error('Error committing transaction:', err);
                            callback(err, null);
                        });
                    }
                    callback(null, results);
                });
            });
        });
    });
};

module.exports = { deleteApplication };