import cron from 'node-cron';
import { ChatMessage } from '../models/chatMessage.model.js';
import { User } from '../models/user.model.js';
import mongoose from 'mongoose';

/**
 * Message retention policy:
 * - Friend messages: keep for 48 hours (2 days)
 * - Nearby user messages (non-friends): keep for 1 hour
 * - Unread messages from both users: keep for 60 hours
 */
async function cleanupMessages() {
  try {
    console.log('Running message retention cleanup job...');
    const now = new Date();
    
    // Get all chat messages
    const messages = await ChatMessage.find().lean();
    const messageIds = [];
    
    console.log(`Processing ${messages.length} messages for retention policy`);
    
    for (const message of messages) {
      try {
        const { roomId, sender, recipient, status, createdAt } = message;
        
        // Calculate message age in milliseconds
        const messageCreatedAt = new Date(createdAt);
        const messageAgeMs = now.getTime() - messageCreatedAt.getTime();
        const messageAgeMinutes = Math.floor(messageAgeMs / (60 * 1000));
        
        // Debug log
        console.log(`Message ${message._id}: age=${messageAgeMinutes} minutes, status=${status}`);
        
        // Skip processing if message is new (less than 1 hour old)
        const ONE_HOUR_MS = 60 * 60 * 1000;
        if (messageAgeMs < ONE_HOUR_MS) {
          console.log(`Message ${message._id} is less than 1 hour old, skipping`);
          continue;
        }
        
        // Check if sender and recipient are friends
        const senderUser = await User.findById(sender).select('friendList').lean();
        const recipientUser = await User.findById(recipient).select('friendList').lean();
        
        if (!senderUser || !recipientUser) {
          // If either user doesn't exist anymore, delete the message
          console.log(`Message ${message._id}: User not found, marking for deletion`);
          messageIds.push(message._id);
          continue;
        }
        
        // Check if they are friends
        const areFriends = senderUser.friendList.some(f => 
          f.friendId.toString() === recipient.toString()
        ) || recipientUser.friendList.some(f => 
          f.friendId.toString() === sender.toString()
        );
        
        // Define time constants in milliseconds
        const FRIEND_RETENTION_MS = 48 * 60 * 60 * 1000;  // 48 hours
        const NEARBY_RETENTION_MS = 60 * 60 * 1000;      // 1 hour
        const UNREAD_RETENTION_MS = 60 * 60 * 60 * 1000; // 60 hours
        
        // Apply retention policies
        if (areFriends) {
          console.log(`Message ${message._id}: Between friends (retention: 48h)`);
          // Friend messages: 48 hours retention
          if (messageAgeMs > FRIEND_RETENTION_MS) {
            // Unless the message is unread, which gets 60 hours
            if (status !== 'read' && messageAgeMs <= UNREAD_RETENTION_MS) {
              console.log(`Message ${message._id}: Unread, keeping for extended period`);
              continue; // Keep unread messages for up to 60 hours
            }
            console.log(`Message ${message._id}: Friend message older than 48h, marking for deletion`);
            messageIds.push(message._id);
          }
        } else {
          console.log(`Message ${message._id}: Between non-friends (retention: 1h)`);
          // Non-friend (nearby user) messages: 1 hour retention
          if (messageAgeMs > NEARBY_RETENTION_MS) {
            // Unless the message is unread, which gets 60 hours
            if (status !== 'read' && messageAgeMs <= UNREAD_RETENTION_MS) {
              console.log(`Message ${message._id}: Unread, keeping for extended period`);
              continue; // Keep unread messages for up to 60 hours
            }
            console.log(`Message ${message._id}: Non-friend message older than 1h, marking for deletion`);
            messageIds.push(message._id);
          }
        }
      } catch (err) {
        console.error(`Error processing message ${message._id}:`, err);
      }
    }
    
    // Delete expired messages
    if (messageIds.length > 0) {
      const result = await ChatMessage.deleteMany({ _id: { $in: messageIds } });
      console.log(`Cleaned up ${result.deletedCount} expired messages`);
    } else {
      console.log('No messages to clean up');
    }
  } catch (error) {
    console.error('Error in message retention cleanup job:', error);
  }
}

// Schedule the job to run hourly (not every minute)
cron.schedule('0 * * * *', cleanupMessages);

// Do not run immediately on startup to avoid cleaning messages too frequently
// This was causing the immediate cleanup issue
// setTimeout(cleanupMessages, 10000);

console.log('Message retention scheduler initialized');