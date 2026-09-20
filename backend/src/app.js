import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';

import healthRoutes from './routes/healthRoutes.js';
import trafficRoutes from './routes/trafficRoutes.js';
import alertRoutes from './routes/alertRoutes.js';
import ruleRoutes from './routes/ruleRoutes.js';
import blockedIpRoutes from './routes/blockedIpRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import aiRoutes from './routes/aiRoutes.js';

dotenv.config();

const app = express();

app.use(helmet());
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '1mb' }));

app.use('/api', healthRoutes);
app.use('/api/traffic', trafficRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/rules', ruleRoutes);
app.use('/api/blocked-ips', blockedIpRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/ai', aiRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Something went wrong on the server.',
    error: err.message,
  });
});

export default app;
