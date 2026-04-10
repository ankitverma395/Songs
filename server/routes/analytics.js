import express from 'express';
import ListeningHistory from '../models/ListeningHistory.js';
import Song from '../models/Song.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticateToken);

router.post('/track', async (req, res) => {
  try {
    const { songId, durationListened } = req.body;
    const history = new ListeningHistory({
      user: req.user.userId,
      song: songId,
      durationListened: durationListened || 0
    });
    await history.save();
    
    await Song.findByIdAndUpdate(songId, {
      $inc: { playCount: 1, totalListeningTime: durationListened || 0 }
    });
    
    res.json({ message: 'Tracked' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/stats', async (req, res) => {
  try {
    const totalListeningTime = await ListeningHistory.aggregate([
      { $match: { user: req.user.userId } },
      { $group: { _id: null, total: { $sum: '$durationListened' } } }
    ]);
    
    const mostPlayed = await ListeningHistory.aggregate([
      { $match: { user: req.user.userId } },
      { $group: { _id: '$song', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
      { $lookup: { from: 'songs', localField: '_id', foreignField: '_id', as: 'song' } }
    ]);
    
    res.json({
      totalListeningTime: totalListeningTime[0]?.total || 0,
      mostPlayed: mostPlayed.filter(item => item.song[0])
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/recent', async (req, res) => {
  try {
    const recent = await ListeningHistory.find({ user: req.user.userId })
      .sort({ listenedAt: -1 })
      .limit(20)
      .populate('song');
    res.json(recent.map(h => h.song).filter(s => s));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;