const express = require("express");
const { updateApplicationStatus } = require("../dao/OrganizerApplicationWorkflowDAO");
const router = express.Router();

router.put('/:id', async (req, res) => {
    const applicationId = req.params.id;
    const { action, ...organizerData } = req.body;

    if (!applicationId || !action) {
        return res.status(400).json({ message: 'Application ID and action are required' });
    }

    try {
        const result = await updateApplicationStatus(applicationId, action, organizerData);
        res.status(200).json({ message: 'Application updated successfully', result });
    } catch (err) {
        console.error('Error updating application:', err);
        res.status(500).json({ message: 'Error updating application' });
    }
});

module.exports = router;
