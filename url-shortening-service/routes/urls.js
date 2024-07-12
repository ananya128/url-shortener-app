// routes/urls.js
import express from 'express';
import { nanoid } from 'nanoid';
import Url from '../models/Url.js';
import dotenv from 'dotenv';
dotenv.config();  // Load local .env file

const router = express.Router();

// URL validation function
function validateUrl(value) {
  const urlPattern = new RegExp(
    '^(https?:\\/\\/)?' + // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|' + // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
    '(\\#[-a-z\\d_]*)?$','i' // fragment locator
  );
  return !!urlPattern.test(value);
}

// Short URL Generator
router.post('/shorten', async (req, res) => {
  const { origUrl } = req.body;
  const base = process.env.BASE;

  // Generate a shorter ID with length of 8 characters
  const urlId = nanoid(8); 
  if (validateUrl(origUrl)) {
    try {
      let url = await Url.findOne({ origUrl });
      if (url) {
        res.json(url);
      } else {
        const shortUrl = `${base}/${urlId}`;

        url = new Url({
          origUrl,
          shortUrl,
          urlId,
          date: new Date(),
        });

        await url.save();
        res.json(url);
      }
    } catch (err) {
      console.log(err);
      res.status(500).json('Server Error');
    }
  } else {
    res.status(400).json('Invalid Original Url');
  }
});

// Fetch all URLs (for testing or admin purposes)
router.get('/urls', async (req, res) => {
  try {
    const urls = await Url.find();
    res.json(urls);
  } catch (err) {
    console.log(err);
    res.status(500).json('Server Error');
  }
});

export default router;
