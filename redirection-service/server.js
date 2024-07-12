import express from 'express';
import connectDB from './config/db.js';
import dotenv from 'dotenv';
import indexRouter from './routes/index.js';
import cors from 'cors';

dotenv.config(); // Load local .env file

const app = express();

// Connect Database
connectDB().then(() => {
  // Enable CORS
  app.use(cors({
    origin: 'http://localhost:3001' // Allow requests from your frontend
  }));

  // Body Parser
  app.use(express.json({ extended: false }));

  // Define Routes
  app.use('/', indexRouter);

  const PORT = process.env.PORT || 5003;

  app.listen(PORT, () => console.log(`Redirection Service running on port ${PORT}`));
}).catch(err => {
  console.error('Failed to start server:', err);
});
