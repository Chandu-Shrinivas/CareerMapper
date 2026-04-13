import express from 'express';
import cors from 'cors';
import skillRoutes from './routes/skill.routes.js';

const app = express();

app.use(cors());
app.use(express.json());

// Routes Setup
app.use('/api/skills', skillRoutes);

export default app;
