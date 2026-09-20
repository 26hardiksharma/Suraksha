import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    message: 'Blocked IPs endpoint ready',
    blockedIps: [],
  });
});

router.post('/', (req, res) => {
  const { ipAddress, reason, attackType } = req.body || {};

  if (!ipAddress || !reason || !attackType) {
    return res.status(400).json({ message: 'Blocked IP payload is invalid' });
  }

  return res.status(201).json({
    message: 'IP blocked successfully',
    blockedIp: {
      id: Date.now().toString(),
      ipAddress,
      reason,
      attackType,
      blockedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
      active: true,
    },
  });
});

router.delete('/:id', (req, res) => {
  res.json({ message: `Blocked IP ${req.params.id} removed` });
});

export default router;
