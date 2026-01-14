import mongoose from 'mongoose';
import { Logger } from '../utils/logger';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/e-storefront-tickets';

export const connectDatabase = async (): Promise<void> => {
  try {
    await mongoose.connect(MONGODB_URI);
    Logger.info('Connected to MongoDB', undefined, 'Database');
  } catch (error: any) {
    Logger.error('MongoDB connection error', error, 'Database');
    throw error;
  }
};

mongoose.connection.on('disconnected', () => {
  Logger.warn('MongoDB disconnected', undefined, 'Database');
});

mongoose.connection.on('reconnected', () => {
  Logger.info('MongoDB reconnected', undefined, 'Database');
});

export default mongoose;
