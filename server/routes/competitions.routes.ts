import { Router } from 'express';
import { getDb } from '../db/mongodb.js';
import type { Competition } from '../models/types.js';

const router = Router();

// GET all competitions
router.get('/', async (req, res) => {
  try {
    const db = getDb();
    const { status, search } = req.query;
    let query: Record<string, any> = {};

    if (status && status !== 'all') {
      query.status = status;
    }

    let competitions = await db.collection('competitions').find(query).toArray();

    if (search && typeof search === 'string') {
      const q = search.toLowerCase();
      competitions = competitions.filter(
        (c: Competition) =>
          c.title.toLowerCase().includes(q) ||
          c.location.toLowerCase().includes(q) ||
          c.categories.some((cat) => cat.toLowerCase().includes(q))
      );
    }

    res.json({ success: true, data: competitions });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

// GET single competition
router.get('/:id', async (req, res) => {
  try {
    const db = getDb();
    const id = req.params.id;
    const competition = await db.collection('competitions').findOne({ id });

    if (!competition) {
      return res.status(404).json({ success: false, message: 'Competition not found' });
    }

    res.json({ success: true, data: competition });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

// POST create competition
router.post('/', async (req, res) => {
  try {
    const db = getDb();
    const compData: Partial<Competition> = req.body;

    if (!compData.title || !compData.date || !compData.location) {
      return res.status(400).json({ success: false, message: 'Missing required competition fields' });
    }

    const newComp: Competition = {
      id: `comp_${Date.now()}`,
      title: compData.title,
      theme: compData.theme || 'Open Breed Showcase',
      date: compData.date,
      time: compData.time || '09:00 AM - 05:00 PM',
      location: compData.location,
      venue: compData.venue || 'Exhibition Arena',
      address: compData.address || 'Local Fairgrounds',
      categories: compData.categories || ['Conformation', 'Agility', 'Best Trick'],
      entryFee: Number(compData.entryFee) || 30,
      prizePool: compData.prizePool || 'Ribbons & Awards',
      registrationDeadline: compData.registrationDeadline || compData.date,
      capacity: Number(compData.capacity) || 100,
      registeredCount: 0,
      status: 'Upcoming',
      judges: compData.judges || [{ name: 'Certified AKC Judge', title: 'Ring Master', certification: 'Official' }],
      description: compData.description || 'Regional pet competition welcoming handlers and companions.',
      rules: compData.rules || ['Health certificates required', 'Standard ring etiquette applies']
    };

    await db.collection('competitions').insertOne(newComp as any);
    res.status(201).json({ success: true, data: newComp });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

export default router;
