import mongoose from 'mongoose';

const listeningHistorySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  song: { type: mongoose.Schema.Types.ObjectId, ref: 'Song', required: true },
  listenedAt: { type: Date, default: Date.now },
  durationListened: { type: Number, default: 0 }
});

export default mongoose.model('ListeningHistory', listeningHistorySchema);