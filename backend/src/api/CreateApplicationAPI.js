const express = require("express");
const { createApplication } = require("../dao/CreateApplicationDAO");
const router = express.Router();
const connection = require("../../config/db");

// Generate a unique ID for the application
const generateUniqueId = (callback) => {
    const prefix = 'fev';
    const randomNumber = Math.floor(Math.random() * 1000000000);
    const newId = `${prefix}${randomNumber}`;

    // Check if the ID already exists
    connection.query('SELECT COUNT(*) AS count FROM application_table WHERE application_id = ?', [newId], (err, results) => {
        if (err) {
            callback(err, null);
            return;
        }

        if (results[0].count > 0) {
            // ID already exists, generate a new one
            generateUniqueId(callback);
        } else {
            callback(null, newId);
        }
    });
};

router.post("/create", (req, res) => {
    const applicationData = req.body;

    const items = applicationData.items;
    generateUniqueId((err, application_id) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Error generating unique ID");
        }

        // Add the generated ID to the application data
        applicationData.application_id = application_id;
        createApplication({ ...applicationData, items }, (err) => {
            if (err) {
                console.error(err);
                if (!res.headersSent) {
                    return res.status(500).send('Error inserting application');
                }
                return;
            }
            if (!res.headersSent) {
                res.status(200).send('Application created successfully');
            }
        });
    });
});
module.exports = router;