import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    message: 'Alerts endpoint ready',
    alerts: [],
  });
});

router.get('/:id', (req, res) => {
  res.json({ message: `Alert ${req.params.id}` });
});

router.patch('/:id', (req, res) => {
  res.json({
    message: `Alert ${req.params.id} updated`,
    update: req.body,
  });
});

export default router;
