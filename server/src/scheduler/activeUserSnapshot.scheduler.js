import cron from 'node-cron';
import ActiveUserSnapshot from '../models/activeUserSnapshot.model.js';
import { getSocketStats } from '../controllers/socket.controller.js';

// If your getSocketStats() returns a snapshot with duplicate socket counts,
// you may instead use your connectedUsers Map to get a deduplicated count.
// For this example, we assume activeSockets is acceptable.
const recordActiveUserSnapshot = async () => {
  try {
    // You might replace this with a deduplicated count from your connectedUsers map.
    const { activeSockets } = getSocketStats(); 
    const snapshot = new ActiveUserSnapshot({
      activeUserCount: activeSockets,
    });
    await snapshot.save();
    console.log('Active user snapshot recorded:', snapshot);
  } catch (error) {
    console.error('Error recording active user snapshot:', error);
  }
};

// Schedule the job to run every 5 minutes:
cron.schedule('*/60 * * * *', recordActiveUserSnapshot);
