import mongoose from 'mongoose';
import { config } from './env.js';

export const connectDB = async () => {
  mongoose.connect(config.mongoUri)
    .then((conn) => {
      console.log(`MongoDB Connected: ${conn.connection.host}`);
    })
    .catch((error) => {
      console.warn(`[WARNING] MongoDB unavailable — running in offline mode. Error: ${error.message}`);
    });
};
