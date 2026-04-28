import express from 'express';
import cors from 'cors';
import skillRoutes from './routes/skill.routes.js';
import knowledgeRoutes from './routes/knowledge.routes.js';
import resumeRoutes from './routes/resume.routes.js';
import roleRoutes from './routes/role.routes.js';

const app = express();

app.use(cors());
app.use(express.json());

// Routes Setup (Mounted at root as requested)
app.use('/', skillRoutes);
app.use('/', knowledgeRoutes);
app.use('/', resumeRoutes);
app.use('/', roleRoutes);

export default app;
