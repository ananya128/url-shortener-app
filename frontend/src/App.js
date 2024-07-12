import React, { useState } from 'react';
import InteractiveBackground from './InteractiveBackground';
import './App.css';
import axios from 'axios';

const App = () => {
  const [url, setUrl] = useState('');
  const [shortenedUrl, setShortenedUrl] = useState('');
  const [showAnalytics, setShowAnalytics] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5001/api/shorten', { origUrl: url });
      // Update the shortened URL to use the correct redirection service port (5003)
      const updatedShortenedUrl = response.data.shortUrl.replace('http://localhost:5001', 'http://localhost:5003');
      setShortenedUrl(updatedShortenedUrl);
      setShowAnalytics(false);  // Hide analytics initially
    } catch (error) {
      console.error('Error shortening URL', error);
    }
  };

  const handleLinkClick = async (e) => {
    e.preventDefault();
    try {
      await axios.get(`http://localhost:5003/log/${shortenedUrl.split('/').pop()}`);  // Call the logging endpoint
      setShowAnalytics(true);  // Show analytics after redirection
      window.open(shortenedUrl, '_blank');  // Open the shortened URL in a new tab
    } catch (error) {
      console.error('Error calling redirection service', error);
    }
  };

  return (
    <div>
      <InteractiveBackground />
      <div className="container">
        <h1>Shrink, Share, Simplify: Your Ultimate URL Shortener</h1>
        <form onSubmit={handleSubmit}>
          <input 
            type="text" 
            value={url} 
            onChange={(e) => setUrl(e.target.value)} 
            placeholder="Enter your URL here" 
          />
          <button type="submit">Shorten</button>
        </form>
        {shortenedUrl && (
          <div className="result-box">
            Shortened URL: <a href={shortenedUrl} target="_blank" rel="noopener noreferrer" onClick={handleLinkClick}>{shortenedUrl}</a>
          </div>
        )}
        {showAnalytics && (
          <div className="analytics">
            <h2>Analytics</h2>
            <div className="chart-container">
              <iframe
                src="https://charts.mongodb.com/charts-project-0-wosgtkl/embed/charts?id=66912540-9b15-44b7-8678-d3f4da21faf0&maxDataAge=3600&theme=light&autoRefresh=true"
                width="450"
                height="300"
                style={{ border: 'none', margin: '10px' }}
              ></iframe>
              <iframe
                src="https://charts.mongodb.com/charts-project-0-wosgtkl/embed/charts?id=66912705-d995-40e6-85bb-087014c5af3d&maxDataAge=3600&theme=light&autoRefresh=true"
                width="450"
                height="300"
                style={{ border: 'none', margin: '10px' }}
              ></iframe>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
