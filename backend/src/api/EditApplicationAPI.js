const express = require("express");
const { updateApplication } = require("../dao/EditApplicationDAO");
const router = express.Router();

router.put('/:id', (req, res) => {
    const applicationId = req.params.id;
    const applicationData = req.body;
    updateApplication(applicationId, applicationData, (err, result) => {
        if (err) {
            if (err.message === 'Application not found') {
                return res.status(404).send('Application not found');
            }
            console.error('Error updating application:', err);
            return res.status(500).send('Error updating application');
        }
        res.status(200).send('Application updated successfully');

    });
});

module.exports = router;
