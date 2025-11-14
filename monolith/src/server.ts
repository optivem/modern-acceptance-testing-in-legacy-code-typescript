import 'reflect-metadata';
import express from 'express';
import { createConnection } from 'typeorm';
import { orderRouter } from './controllers/OrderController';
import { echoRouter } from './controllers/EchoController';
import { globalErrorHandler } from './middleware/GlobalErrorHandler';
import { Order } from './entities/Order';
import path from 'path';

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Database connection
const initializeDatabase = async () => {
  await createConnection({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USER || 'eshop_user',
    password: process.env.DB_PASSWORD || 'eshop_password',
    database: process.env.DB_NAME || 'eshop',
    entities: [Order],
    synchronize: true, // Auto-create schema in development
    logging: false,
  });
  console.log('Database connected');
};

// Routes
app.use('/api', echoRouter);
app.use('/api/orders', orderRouter);

// Error handler (must be last)
app.use(globalErrorHandler);

// Start server
const startServer = async () => {
  try {
    await initializeDatabase();
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export { app };
