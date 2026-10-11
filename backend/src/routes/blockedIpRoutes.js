import express from 'express';
import { store } from '../services/store.js';

const router = express.Router();

router.get('/', (req, res) => {
  res.json({ blockedIps: store.blockedIps });
});

router.post('/', (req, res) => {
  const { ipAddress, reason, attackType } = req.body || {};

  if (!ipAddress || !reason || !attackType) {
    return res.status(400).json({ message: 'Blocked IP payload is invalid' });
  }

  const blockedIp = {
    id: store.nextId('BLK'), ipAddress, reason, attackType,
    blockedAt: store.now(), expiresAt: new Date(Date.now() + 60 * 60 * 1000).toISOString(), active: true,
  };
  store.blockedIps.push(blockedIp);
  return res.status(201).json({
    message: 'IP blocked successfully',
    blockedIp,
  });
});

router.delete('/:id', (req, res) => {
  const blockedIp = store.blockedIps.find((item) => item.id === req.params.id);
  if (!blockedIp) return res.status(404).json({ message: 'Blocked IP not found' });
  blockedIp.active = false;
  blockedIp.unblockedAt = store.now();
  return res.json({ message: 'Blocked IP removed successfully', blockedIp });
});

export default router;
