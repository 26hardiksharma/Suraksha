import express from 'express';

const router = express.Router();

router.post('/explain', (req, res) => {
  const { alert, question } = req.body || {};

  if (!alert && !question) {
    return res.status(400).json({ message: 'Request body must include alert or question.' });
  }

  return res.json({
    answer: 'This traffic was flagged because it matches suspicious patterns and security heuristics. Review the signature match, confidence score, and SHAP explanations for context.',
    summary: alert ? `Alert ${alert.id || 'unknown'} analyzed.` : 'General threat explanation generated.',
  });
});

router.post('/chat', (req, res) => {
  const { message } = req.body || {};

  if (!message) {
    return res.status(400).json({ message: 'Message is required.' });
  }

  return res.json({
    reply: 'This is a defensive security explanation generated for the demo system. Please validate the alert, review the context, and apply recommended mitigations.',
  });
});

export default router;
