import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { paychanguRouter } from './routes/paychangu';
import { errorHandler } from './middleware/error';
import { AfromomoSDK } from 'afrimomo-sdk';
import { pawapayRouter } from './routes/pawapay';

// Initialize the SDK
AfromomoSDK.initialize();

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/paychangu', paychanguRouter);
app.use('/api/pawapay', pawapayRouter);

// Error handling
app.use(errorHandler);

export default app; 