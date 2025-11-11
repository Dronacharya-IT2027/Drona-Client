const express = require('express');
const router = express.Router();
const linkedIn = require('linkedin-jobs-api');


router.get('/jobs', async (req, res) => {
  try {
    const queryOptions = {
      keyword: 'software engineer',
      location: 'India',
      dateSincePosted: 'past Week',
      jobType: 'full time',
      remoteFilter: 'remote',
      salary: '100000',
      experienceLevel: 'entry level',
      limit: '50',
      page: "0",
      has_verification: false,
      under_10_applicants: false,
    };

    const response = await linkedIn.query(queryOptions);
    res.json(response);
  } catch (error) {
    console.error('Error fetching LinkedIn jobs:', error);
    res.status(500).json({ error: 'Failed to fetch jobs' });
  }
});

module.exports = router;
