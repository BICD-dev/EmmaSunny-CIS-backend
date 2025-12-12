import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { errorHandler, notFoundHandler, methodNotAllowedHandler,logger } from './utils/middleware/error-handler';

dotenv.config();

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.send('welcome to EmmaSunny home');
});


app.use(notFoundHandler);
app.use(methodNotAllowedHandler(['GET', 'POST', 'PUT', 'DELETE']));
// Global error handler - must be last middleware
app.use(errorHandler);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  logger.info(`App is running on port ${port}`);
  console.log(`App is running on port ${port}`);
});