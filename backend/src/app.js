import express from 'express';
import cors from 'cors';
import skillRoutes from './routes/skill.routes.js';
import knowledgeRoutes from './routes/knowledge.routes.js';
import resumeRoutes from './routes/resume.routes.js';
import roleRoutes from './routes/role.routes.js';
import jobRoutes from './routes/job.routes.js';
import chatRoutes from './routes/chat.routes.js';
import savedJobRoutes from './routes/savedJob.routes.js';
import roadmapRoutes from './routes/roadmap.routes.js';
import userRoutes from './routes/user.routes.js';
import roleRoadmapRoutes from './routes/roleRoadmap.routes.js';
import jobPreparationRoutes from './routes/jobPreparation.routes.js';

const app = express();

app.use(cors());
app.use(express.json());

// Root & Health check routes
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'online',
    service: 'CareerMapper API Backend',
    frontendUrl: 'http://localhost:5175',
    message: 'Backend API server is running. Please access the CareerMapper Web App at http://localhost:5175'
  });
});

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.use('/api', roleRoadmapRoutes);
app.use('/api', jobPreparationRoutes);

app.use('/', skillRoutes);
app.use('/', knowledgeRoutes);
app.use('/', resumeRoutes);
app.use('/', roleRoutes);
app.use('/', jobRoutes);
app.use('/', chatRoutes);
app.use('/', savedJobRoutes);
app.use('/', roadmapRoutes);
app.use('/', userRoutes);

export default app;
