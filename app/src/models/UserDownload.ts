import mongoose from 'mongoose';

// Define the UserDownload schema
const userDownloadSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  downloadCount: {
    type: Number,
    default: 0,
  },
  lastResetDate: {
    type: Date,
    default: Date.now,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Only create the model if it doesn't exist already
const UserDownload = mongoose.models.UserDownload || mongoose.model('UserDownload', userDownloadSchema);

export default UserDownload;
