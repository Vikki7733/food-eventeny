const express = require("express");
const { organizerViewApplication } = require("../dao/OrganizerApplicationViewDAO.js");
const router = express.Router();

router.get('/:id', async (req, res) => {
    const applicationId = req.params.id;

    organizerViewApplication(applicationId, (err, result) => {
        if (err) {
            console.error('Error fetching application:', err);
            return res.status(500).json({ message: 'Error fetching application' });
        }
        if (!result) {
            return res.status(404).json({ message: 'Application not found' });
        }
        res.status(200).json(result);
    });
});

module.exports = router;
