import express from 'express';
import Url from '../models/Url.js';
import Analytics from '../models/Analytics.js';
import dotenv from 'dotenv';
import requestIp from 'request-ip';
import useragent from 'useragent';
import axios from 'axios';

dotenv.config(); // Load local .env file

const router = express.Router();
const ipstackApiKey = process.env.IPSTACK_API_KEY;

// Function to get geolocation data using ipstack
const getGeolocation = async (ip) => {
  try {
    const response = await axios.get(`http://api.ipstack.com/${ip}?access_key=${ipstackApiKey}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching geolocation data:', error);
    return {};
  }
};

// Log clicks separately
router.get('/log/:urlId', async (req, res) => {
  console.log('Logging click for URL ID:', req.params.urlId);
  try {
    const url = await Url.findOne({ urlId: req.params.urlId });
    if (url) {
      url.clicks++;
      await url.save();

      // Extract IP address and user agent
      const ip = requestIp.getClientIp(req);
      const agent = useragent.parse(req.headers['user-agent']);

      // Get geolocation data
      const geo = await getGeolocation(ip);

      const analyticsEntry = new Analytics({
        urlId: url.urlId,
        origUrl: url.origUrl,
        shortUrl: url.shortUrl,
        clicks: url.clicks,
        ip: ip,
        country: geo.country_name || '',
        city: geo.city || '',
        userAgent: agent.toString(),
        referrer: req.get('Referrer') || '',
        timestamp: new Date(),
      });

      await analyticsEntry.save();
      console.log('Analytics logged:', analyticsEntry);

      res.status(200).json({ message: 'Click logged' });
    } else {
      console.log('URL not found');
      res.status(404).json('Not found');
    }
  } catch (err) {
    console.log('Server Error:', err);
    res.status(500).json('Server Error');
  }
});

// Redirection
router.get('/:urlId', async (req, res) => {
  console.log('Request received for URL ID:', req.params.urlId);
  try {
    const url = await Url.findOne({ urlId: req.params.urlId });
    if (url) {
      console.log('URL found:', url);
      return res.redirect(url.origUrl);
    } else {
      console.log('URL not found');
      res.status(404).json('Not found');
    }
  } catch (err) {
    console.log('Server Error:', err);
    res.status(500).json('Server Error');
  }
});

export default router;
