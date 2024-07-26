const express = require("express");
const { viewApplication, viewApplicationById } = require("../dao/ViewApplicationDAO");
const router = express.Router();

router.get('/list', (req, res) => {
  viewApplication((err, results) => {
    if (err) {
      console.error('Error fetching applications:', err);
      return res.status(500).send('Error fetching applications');
    }
    console.log('Viewresults:', results);

    res.status(200).json(results);
  });
});

router.get('/:id', (req, res) => {
  const applicationId = req.params.id;
  viewApplicationById(applicationId, (err, result) => {

    if (err) {
      console.error('Error fetching application:', err);
      return res.status(500).send('Error fetching application');
    }
    if (!result) {
      return res.status(404).send('Application not found');
    }
    res.status(200).json(result);
  });
});

module.exports = router;
