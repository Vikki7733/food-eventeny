const express = require("express");
const { filterApplications, getSuggestions } = require("../dao/FilterApplicationDAO");
const router = express.Router();

router.get('/filter', async (req, res) => {
    const filters = {
        application_id: req.query.application_id,
        applicant_name: req.query.applicant_name,
        status: req.query.status,
        venue_location: req.query.venue_location,
        cuisine_type: req.query.cuisine_type
    };

    try {
        const data = await filterApplications(filters);
        const { results = [] } = data;

        if (!results.length) {
            return res.status(404).json({ error: 'No results found' });
        }

        res.json({ results });
    } catch (err) {
        console.error('Error filtering applications:', err);
        res.status(500).send('Error filtering applications');
    }
});

router.get('/suggestions', async (req, res) => {
    try {
        const suggestions = await getSuggestions();
        res.json({ suggestions });
    } catch (err) {
        console.error('Error fetching suggestions:', err);
        res.status(500).send('Error fetching suggestions');
    }
});

module.exports = router;
