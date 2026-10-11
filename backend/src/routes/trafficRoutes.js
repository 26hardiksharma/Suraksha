import express from 'express';
import { ingestTraffic, seedDemoData, store } from '../services/store.js';
import { processTraffic } from '../services/detectionService.js';

const router = express.Router();

router.get('/', (req, res) => {
  seedDemoData();
  const limit = Math.min(Number(req.query.limit) || 50, 200);
  return res.json({ records: store.traffic.slice(0, limit), total: store.traffic.length });
});

router.get('/:id', (req, res) => {
  const record = store.traffic.find((item) => item.id === req.params.id);
  if (!record) return res.status(404).json({ message: 'Traffic record not found' });
  return res.json({ record });
});

router.post('/', (req, res) => {
  const { sourceIP, destinationIP, protocol, endpoint } = req.body || {};

  if (!sourceIP || !destinationIP || !protocol || !endpoint) {
    return res.status(400).json({ message: 'sourceIP, destinationIP, protocol, and endpoint are required' });
  }

  const record = ingestTraffic(req.body);
  const result = processTraffic(record);

  return res.status(201).json({
    message: 'Traffic ingested successfully',
    record,
    alert: result.alert,
  });
});

export default router;
