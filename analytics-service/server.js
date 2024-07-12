import express from 'express';
import connectDB from './config/db.js';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();  // Load local .env file

const app = express();

// Connect Database
connectDB();

// Enable CORS
app.use(cors());

// Body Parser
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Define Routes
import analyticRouter from './routes/analytic.js';

app.use('/api/analytics', analyticRouter);

const PORT = process.env.PORT || 5002;

app.listen(PORT, () => console.log(`Analytics Service running on port ${PORT}`));
