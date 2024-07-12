// server.js
import express from 'express';
import connectDB from './config/db.js';  // Use local db.js
import dotenv from 'dotenv';
import cors from 'cors';
dotenv.config();  // Load local .env file

const app = express();

// Connect Database
connectDB();

// Enable CORS
app.use(cors());

// Middleware
app.use(express.json({ extended: false }));

// Define Routes
import urlsRouter from './routes/urls.js';
app.use('/api', urlsRouter);

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => console.log(`URL Shortening Service running on port ${PORT}`));
