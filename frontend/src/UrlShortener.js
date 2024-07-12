// src/UrlShortener.js
import React, { useState } from 'react';
import axios from 'axios';

const UrlShortener = () => {
  const [origUrl, setOrigUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5001/api/short', { origUrl });
      setShortUrl(response.data.shortUrl);
    } catch (error) {
      console.error('Error creating short URL:', error);
    }
  };

  return (
    <div className="url-shortener">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter original URL"
          value={origUrl}
          onChange={(e) => setOrigUrl(e.target.value)}
          required
        />
        <button type="submit">Shorten URL</button>
      </form>
      {shortUrl && (
        <div>
          <p>Short URL: <a href={shortUrl} target="_blank" rel="noopener noreferrer">{shortUrl}</a></p>
        </div>
      )}
    </div>
  );
};

export default UrlShortener;
