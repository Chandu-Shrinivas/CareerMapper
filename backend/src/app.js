import express from 'express';
import cors from 'cors';
import skillRoutes from './routes/skill.routes.js';
import knowledgeRoutes from './routes/knowledge.routes.js';
import resumeRoutes from './routes/resume.routes.js';
import roleRoutes from './routes/role.routes.js';
import jobRoutes from './routes/job.routes.js';
import chatRoutes from './routes/chat.routes.js';

const app = express();

app.use(cors());
app.use(express.json());

// Routes Setup (Mounted at root as requested)
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.use('/', skillRoutes);
app.use('/', knowledgeRoutes);
app.use('/', resumeRoutes);
app.use('/', roleRoutes);
app.use('/', jobRoutes);
app.use('/', chatRoutes);

export default app;
