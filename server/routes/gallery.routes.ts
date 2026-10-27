import { Router } from 'express';
import { getDb } from '../db/mongodb.js';
import type { GalleryItem } from '../models/types.js';

const router = Router();

// GET all gallery items
router.get('/', async (req, res) => {
  try {
    const db = getDb();
    const { category, species, sort, search } = req.query;

    let query: Record<string, any> = {};
    if (category && category !== 'All Categories') {
      query.category = category;
    }
    if (species && species !== 'All Species') {
      query.species = species;
    }

    let items = await db.collection('gallery').find(query).toArray();

    if (search && typeof search === 'string') {
      const q = search.toLowerCase();
      items = items.filter(
        (i: GalleryItem) =>
          i.petName.toLowerCase().includes(q) ||
          i.breed.toLowerCase().includes(q) ||
          i.ownerName.toLowerCase().includes(q) ||
          i.title.toLowerCase().includes(q)
      );
    }

    if (sort === 'votes') {
      items.sort((a: GalleryItem, b: GalleryItem) => b.votes - a.votes);
    } else {
      items.sort((a: GalleryItem, b: GalleryItem) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    res.json({ success: true, count: items.length, data: items });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

// POST new photo entry
router.post('/', async (req, res) => {
  try {
    const db = getDb();
    const body: Partial<GalleryItem> = req.body;

    if (!body.petName || !body.imageUrl || !body.ownerName) {
      return res.status(400).json({ success: false, message: 'Pet name, photo, and owner name are required' });
    }

    const newItem: GalleryItem = {
      id: `gal_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      petName: body.petName.trim(),
      species: body.species || 'Dog',
      breed: body.breed?.trim() || 'Show Competitor',
      category: body.category || 'Spectators Choice',
      ownerName: body.ownerName.trim(),
      location: body.location || 'Local Circuit',
      title: body.title || `${body.petName}'s Show Moment`,
      story: body.story || 'Proudly entered in the local pet showcase.',
      imageUrl: body.imageUrl,
      votes: 1,
      ribbons: body.ribbons && body.ribbons.length > 0 ? body.ribbons : ['Show Entrant 2026'],
      judgeScore: body.judgeScore || 95.0,
      featured: false,
      competitionTitle: body.competitionTitle || 'Local Championship Series',
      createdAt: new Date().toISOString().split('T')[0],
    };

    await db.collection('gallery').insertOne(newItem as any);
    res.status(201).json({ success: true, data: newItem });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

// POST vote for pet
router.post('/:id/vote', async (req, res) => {
  try {
    const db = getDb();
    const id = req.params.id;

    const existing = await db.collection('gallery').findOne({ id });
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Gallery entry not found' });
    }

    await db.collection('gallery').updateOne({ id }, { $inc: { votes: 1 } });
    const updated = await db.collection('gallery').findOne({ id });

    res.json({ success: true, votes: updated?.votes || existing.votes + 1 });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

export default router;
