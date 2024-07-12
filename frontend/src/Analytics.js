// src/Analytics.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Analytics = () => {
  const [clicksOverTime, setClicksOverTime] = useState([]);
  const [clicksByCountry, setClicksByCountry] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const clicksOverTimeResponse = await axios.get('http://localhost:5002/api/analytics/clicks-over-time');
        setClicksOverTime(clicksOverTimeResponse.data);

        const clicksByCountryResponse = await axios.get('http://localhost:5002/api/analytics/clicks-by-country');
        setClicksByCountry(clicksByCountryResponse.data);
      } catch (error) {
        console.error('Error fetching analytics data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="analytics">
      <h2>Clicks Over Time</h2>
      <pre>{JSON.stringify(clicksOverTime, null, 2)}</pre>
      
      <h2>Clicks By Country</h2>
      <pre>{JSON.stringify(clicksByCountry, null, 2)}</pre>
    </div>
  );
};

export default Analytics;
