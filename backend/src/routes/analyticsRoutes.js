import express from 'express';

const router = express.Router();

router.get('/overview', (req, res) => {
  res.json({
    totalTraffic: 0,
    totalAlerts: 0,
    activeThreats: 0,
    criticalAlerts: 0,
    blockedIps: 0,
  });
});

router.get('/attacks', (req, res) => {
  res.json({ attacks: [] });
});

router.get('/timeline', (req, res) => {
  res.json({ timeline: [] });
});

router.get('/top-attackers', (req, res) => {
  res.json({ attackers: [] });
});

export default router;
