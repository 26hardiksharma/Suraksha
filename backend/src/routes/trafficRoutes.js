import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    message: 'Traffic endpoint ready',
    records: [],
  });
});

router.get('/:id', (req, res) => {
  res.json({ message: `Traffic record ${req.params.id}` });
});

router.post('/', (req, res) => {
  const { sourceIP, destinationIP, protocol, endpoint, payload } = req.body || {};

  if (!sourceIP || !destinationIP || !protocol || !endpoint) {
    return res.status(400).json({ message: 'Invalid traffic payload' });
  }

  const record = {
    id: Date.now().toString(),
    sourceIP,
    destinationIP,
    protocol,
    endpoint,
    payload: payload || '',
    timestamp: new Date().toISOString(),
    processingStatus: 'received',
  };

  return res.status(201).json({
    message: 'Traffic ingested successfully',
    record,
  });
});

export default router;
