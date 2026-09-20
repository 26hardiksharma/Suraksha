import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    message: 'Rules endpoint ready',
    rules: [],
  });
});

router.post('/', (req, res) => {
  const { name, attackType, pattern, severity } = req.body || {};

  if (!name || !attackType || !pattern || !severity) {
    return res.status(400).json({ message: 'Rule validation failed' });
  }

  return res.status(201).json({
    message: 'Rule created successfully',
    rule: {
      id: Date.now().toString(),
      name,
      attackType,
      pattern,
      severity,
      enabled: true,
      autoBlock: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  });
});

router.get('/:id', (req, res) => {
  res.json({ message: `Rule ${req.params.id}` });
});

router.put('/:id', (req, res) => {
  res.json({
    message: `Rule ${req.params.id} updated`,
    rule: req.body,
  });
});

router.delete('/:id', (req, res) => {
  res.json({ message: `Rule ${req.params.id} deleted` });
});

router.patch('/:id/toggle', (req, res) => {
  res.json({
    message: `Rule ${req.params.id} toggled`,
    enabled: req.body?.enabled ?? true,
  });
});

export default router;
