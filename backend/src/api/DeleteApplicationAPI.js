const express = require("express");
const { deleteApplication } = require("../dao/DeleteApplicationDAO");
const router = express.Router();

router.delete('/:id', (req, res) => {
    const applicationId = req.params.id;
    deleteApplication(applicationId, (err, result) => {
        if (err) {
            console.error('Error deleting application:', err);
            return res.status(500).send('Error deleting application');
        }
        res.status(200).send('Application deleted successfully');
    });
});

module.exports = router;
