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
    message: 'Backend API server is running.'
  });
});

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Role Roadmaps
app.use('/', roleRoadmapRoutes);
app.use('/api', roleRoadmapRoutes);

// Job Preparation Roadmaps (Mount on all path variants)
app.use('/job-preparation', jobPreparationRoutes);
app.use('/api/job-preparation', jobPreparationRoutes);
app.use('/job-prep', jobPreparationRoutes);
app.use('/api/job-prep', jobPreparationRoutes);

// Core System Routes
app.use('/', skillRoutes);
app.use('/api', skillRoutes);
app.use('/', knowledgeRoutes);
app.use('/api', knowledgeRoutes);
app.use('/', resumeRoutes);
app.use('/api', resumeRoutes);
app.use('/', roleRoutes);
app.use('/api', roleRoutes);
app.use('/', jobRoutes);
app.use('/api', jobRoutes);
app.use('/', chatRoutes);
app.use('/api', chatRoutes);
app.use('/', savedJobRoutes);
app.use('/api', savedJobRoutes);
app.use('/', roadmapRoutes);
app.use('/api', roadmapRoutes);
app.use('/', userRoutes);
app.use('/api', userRoutes);

export default app;
