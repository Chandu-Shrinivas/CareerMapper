import express from 'express';

const router = express.Router();

router.get('/role-roadmaps', (req, res) => {
  res.json({ status: 'success', data: [] });
});

router.get('/role-roadmaps/:slug', (req, res) => {
  res.json({ status: 'success', data: null });
});

export default router;
