import { connectDatabase } from '../src/config/database';
import app from '../src/index';

// Connect to database once (reused across invocations)
let isConnected = false;

const handler = async (req: any, res: any) => {
  if (!isConnected) {
    try {
      await connectDatabase();
      isConnected = true;
    } catch (error) {
      console.error('Database connection failed:', error);
    }
  }
  return app(req, res);
};

export default handler;
