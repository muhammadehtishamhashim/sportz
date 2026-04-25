import express from 'express';

import { matchesRouter } from './routes/matches.js';

const app = express();
const PORT = 8000;

// Use JSON middleware
app.use(express.json());

// Root GET route
app.get('/', (req, res) => {
  res.send('Welcome to the Sports Dashboard!');
});

app.use('/matches', matchesRouter);

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
