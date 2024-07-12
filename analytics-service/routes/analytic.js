import express from 'express';
import Analytics from '../models/Analytics.js';
import dotenv from 'dotenv';
dotenv.config();  // Load local .env file

const router = express.Router();

// Endpoint to get clicks over time
router.get('/clicks-over-time', async (req, res) => {
  try {
    const pipeline = [
      {
        $group: {
          _id: {
            year: { $year: '$timestamp' },
            month: { $month: '$timestamp' },
            day: { $dayOfMonth: '$timestamp' },
          },
          totalClicks: { $sum: '$clicks' },
        },
      },
      {
        $sort: {
          '_id.year': 1,
          '_id.month': 1,
          '_id.day': 1,
        },
      },
    ];
    const data = await Analytics.aggregate(pipeline);
    res.json(data);
  } catch (err) {
    console.error('Error querying MongoDB', err);
    res.status(500).send('Error querying MongoDB');
  }
});

// Endpoint to get distribution of clicks by country
router.get('/clicks-by-country', async (req, res) => {
  try {
    const pipeline = [
      {
        $group: {
          _id: '$country',
          totalClicks: { $sum: '$clicks' },
        },
      },
      {
        $sort: { totalClicks: -1 },
      },
    ];
    const data = await Analytics.aggregate(pipeline);
    res.json(data);
  } catch (err) {
    console.error('Error querying MongoDB', err);
    res.status(500).send('Error querying MongoDB');
  }
});

export default router;



