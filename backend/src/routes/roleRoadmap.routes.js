import express from 'express';
import { ROLE_ROADMAPS_DATA } from '../data/roleRoadmap.data.js';

const router = express.Router();

router.get('/role-roadmaps', (req, res) => {
  const { category } = req.query;
  let data = ROLE_ROADMAPS_DATA;
  if (category && category !== 'ALL') {
    data = data.filter(r => r.category.toUpperCase() === category.toUpperCase());
  }
  res.json({ status: 'success', data });
});

router.get('/role-roadmaps/:slug', (req, res) => {
  const slug = (req.params.slug || '').toLowerCase();
  const roadmap = ROLE_ROADMAPS_DATA.find(r => r.slug.toLowerCase() === slug);
  if (roadmap) {
    res.json({ status: 'success', data: roadmap });
  } else {
    res.status(404).json({ status: 'error', message: 'Roadmap not found' });
  }
});

export default router;
