import express from 'express';
import { store } from '../services/store.js';

const router = express.Router();

router.get('/', (req, res) => {
  res.json({ rules: store.rules });
});

router.post('/', (req, res) => {
  const { name, attackType, pattern, severity, description, autoBlock = false } = req.body || {};

  if (!name || !attackType || !pattern || !severity) {
    return res.status(400).json({ message: 'Rule validation failed' });
  }
  if (!['Low', 'Medium', 'High', 'Critical'].includes(severity)) return res.status(400).json({ message: 'Invalid rule severity' });
  try { new RegExp(pattern); } catch { return res.status(400).json({ message: 'Rule pattern must be a valid regular expression' }); }

  const rule = {
    id: store.nextId('RULE'), name, attackType, pattern, severity,
    description: description || `Detects ${attackType} traffic.`, enabled: true, autoBlock,
    createdAt: store.now(), updatedAt: store.now(),
  };
  store.rules.push(rule);
  return res.status(201).json({
    message: 'Rule created successfully',
    rule,
  });
});

router.get('/:id', (req, res) => {
  const rule = store.rules.find((item) => item.id === req.params.id);
  if (!rule) return res.status(404).json({ message: 'Rule not found' });
  return res.json({ rule });
});

router.put('/:id', (req, res) => {
  const rule = store.rules.find((item) => item.id === req.params.id);
  if (!rule) return res.status(404).json({ message: 'Rule not found' });
  const updates = { ...req.body };
  if (updates.pattern) { try { new RegExp(updates.pattern); } catch { return res.status(400).json({ message: 'Rule pattern must be a valid regular expression' }); } }
  Object.assign(rule, updates, { updatedAt: store.now() });
  return res.json({ message: 'Rule updated successfully', rule });
});

router.delete('/:id', (req, res) => {
  const index = store.rules.findIndex((item) => item.id === req.params.id);
  if (index === -1) return res.status(404).json({ message: 'Rule not found' });
  const [rule] = store.rules.splice(index, 1);
  return res.json({ message: 'Rule deleted successfully', rule });
});

router.patch('/:id/toggle', (req, res) => {
  const rule = store.rules.find((item) => item.id === req.params.id);
  if (!rule) return res.status(404).json({ message: 'Rule not found' });
  rule.enabled = req.body?.enabled ?? !rule.enabled;
  rule.updatedAt = store.now();
  return res.json({ message: 'Rule toggled successfully', rule });
});

export default router;
