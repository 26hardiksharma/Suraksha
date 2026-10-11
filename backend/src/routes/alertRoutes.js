import express from 'express';
import { seedDemoData, store } from '../services/store.js';

const router = express.Router();

router.get('/', (req, res) => {
  seedDemoData();
  const { severity, attackType, detectionMethod, sourceIP, status } = req.query;
  const alerts = store.alerts.filter((alert) => !severity || alert.severity === severity)
    .filter((alert) => !attackType || alert.attackType === attackType)
    .filter((alert) => !detectionMethod || alert.detectionMethod === detectionMethod)
    .filter((alert) => !sourceIP || alert.sourceIP === sourceIP)
    .filter((alert) => !status || alert.status === status);
  return res.json({ alerts, total: alerts.length });
});

router.get('/:id', (req, res) => {
  const alert = store.alerts.find((item) => item.id === req.params.id);
  if (!alert) return res.status(404).json({ message: 'Alert not found' });
  return res.json({ alert });
});

router.patch('/:id', (req, res) => {
  const alert = store.alerts.find((item) => item.id === req.params.id);
  if (!alert) return res.status(404).json({ message: 'Alert not found' });
  const allowedStatuses = ['New', 'Investigating', 'Resolved', 'Blocked', 'Ignored'];
  if (req.body.status && !allowedStatuses.includes(req.body.status)) return res.status(400).json({ message: 'Invalid alert status' });
  Object.assign(alert, { status: req.body.status, actionTaken: req.body.actionTaken, updatedAt: new Date().toISOString() });
  return res.json({ message: 'Alert updated successfully', alert });
});

export default router;
