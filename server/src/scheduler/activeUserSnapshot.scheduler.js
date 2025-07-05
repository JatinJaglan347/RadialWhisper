import cron from 'node-cron';
import ActiveUserSnapshot from '../models/activeUserSnapshot.model.js';
import { getSocketStats } from '../controllers/socket.controller.js';


const recordActiveUserSnapshot = async () => {
  try {
   
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
