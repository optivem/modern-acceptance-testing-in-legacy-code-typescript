import 'reflect-metadata';
import express from 'express';
import { createConnection } from 'typeorm';
import { orderRouter } from './controllers/OrderController';
import { echoRouter } from './controllers/EchoController';
import { globalErrorHandler } from './middleware/GlobalErrorHandler';
import { Order } from './entities/Order';
import path from 'path';

const app = express();
const PORT = process.env.PORT || 8082;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Database connection
const initializeDatabase = async () => {
  const maxRetries = 5;
  const retryDelay = 3000; // 3 seconds
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      await createConnection({
        type: 'postgres',
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '5434'),
        username: process.env.DB_USER || 'eshop_user',
        password: process.env.DB_PASSWORD || 'eshop_password',
        database: process.env.DB_NAME || 'eshop',
        entities: [Order],
        synchronize: true, // Auto-create schema in development
        dropSchema: process.env.DB_DROP_SCHEMA === 'true',
        logging: false,
      });
      console.log('Database connected');
      return;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.log(`Database connection attempt ${attempt}/${maxRetries} failed:`, errorMessage);
      if (attempt < maxRetries) {
        console.log(`Retrying in ${retryDelay/1000} seconds...`);
        await new Promise(resolve => setTimeout(resolve, retryDelay));
      } else {
        throw error;
      }
    }
  }
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
