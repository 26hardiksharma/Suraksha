import express from 'express';
import { seedDemoData, store } from '../services/store.js';

const router = express.Router();

router.get('/overview', (req, res) => {
  seedDemoData();
  const activeAlerts = store.alerts.filter((alert) => !['Resolved', 'Ignored'].includes(alert.status));
  res.json({
    totalTraffic: store.traffic.length,
    totalAlerts: store.alerts.length,
    activeThreats: activeAlerts.length,
    criticalAlerts: store.alerts.filter((alert) => alert.severity === 'Critical').length,
    blockedIps: store.blockedIps.filter((item) => item.active).length,
  });
});

router.get('/attacks', (req, res) => {
  seedDemoData();
  const attacks = Object.entries(store.alerts.reduce((counts, alert) => ({ ...counts, [alert.attackType]: (counts[alert.attackType] || 0) + 1 }), {})).map(([name, count]) => ({ name, count }));
  res.json({ attacks });
});

router.get('/timeline', (req, res) => {
  seedDemoData();
  res.json({ timeline: store.alerts.slice(0, 24).map((alert) => ({ timestamp: alert.timestamp, count: 1, severity: alert.severity })) });
});

router.get('/top-attackers', (req, res) => {
  seedDemoData();
  const attackers = Object.entries(store.alerts.reduce((counts, alert) => ({ ...counts, [alert.sourceIP]: (counts[alert.sourceIP] || 0) + 1 }), {})).map(([ip, count]) => ({ ip, count })).sort((left, right) => right.count - left.count);
  res.json({ attackers });
});

export default router;
