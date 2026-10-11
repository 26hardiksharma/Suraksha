import app from './app.js';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Suraksha backend running on http://localhost:${PORT}`);
  console.log('Persistence mode: in-memory (set up MongoDB persistence when the database layer is added).');
});
