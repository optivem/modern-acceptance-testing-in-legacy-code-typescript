import 'reflect-metadata';
import express from 'express';
import { createConnection } from 'typeorm';
import { orderRouter } from './controllers/OrderController';
import { echoRouter } from './controllers/EchoController';
import { globalErrorHandler } from './middleware/GlobalErrorHandler';
import { Order } from './entities/Order';
import { AppConfig } from './config/AppConfig';
import path from 'path';

const app = express();
const PORT = AppConfig.PORT;

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
        host: AppConfig.DB_HOST,
        port: AppConfig.DB_PORT,
        username: AppConfig.DB_USER,
        password: AppConfig.DB_PASSWORD,
        database: AppConfig.DB_NAME,
        entities: [Order],
        synchronize: true, // Auto-create schema in development
        dropSchema: AppConfig.DB_DROP_SCHEMA,
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
