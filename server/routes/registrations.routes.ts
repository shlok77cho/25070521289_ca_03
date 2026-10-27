import { Router } from 'express';
import { getDb } from '../db/mongodb.js';
import type { Registration, Competition } from '../models/types.js';

const router = Router();

// GET all registrations
router.get('/', async (req, res) => {
  try {
    const db = getDb();
    const { competitionId, search } = req.query;
    let query: Record<string, any> = {};

    if (competitionId && competitionId !== 'all') {
      query.competitionId = competitionId;
    }

    let registrations = await db.collection('registrations').find(query).toArray();

    if (search && typeof search === 'string') {
      const q = search.toLowerCase();
      registrations = registrations.filter(
        (r: Registration) =>
          r.petName.toLowerCase().includes(q) ||
          r.ownerName.toLowerCase().includes(q) ||
          r.breed.toLowerCase().includes(q) ||
          r.registrationCode.toLowerCase().includes(q)
      );
    }

    res.json({ success: true, count: registrations.length, data: registrations });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

// GET single registration by code or id
router.get('/:idOrCode', async (req, res) => {
  try {
    const db = getDb();
    const target = req.params.idOrCode;

    let registration = await db.collection('registrations').findOne({ id: target });
    if (!registration) {
      registration = await db.collection('registrations').findOne({ registrationCode: target });
    }

    if (!registration) {
      return res.status(404).json({ success: false, message: 'Registration record not found' });
    }

    res.json({ success: true, data: registration });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

// POST submit registration
router.post('/', async (req, res) => {
  try {
    const db = getDb();
    const body: Partial<Registration> = req.body;

    if (!body.competitionId || !body.petName || !body.ownerName || !body.ownerEmail) {
      return res.status(400).json({
        success: false,
        message: 'Competition, Pet Name, Owner Name, and Email are required',
      });
    }

    // Verify competition exists
    const competition = await db.collection('competitions').findOne({ id: body.competitionId });
    const competitionTitle = competition ? competition.title : (body.competitionTitle || 'Local Pet Exhibition');

    // Generate unique registration code e.g. PAW-2026-9281
    const randomCode = Math.floor(1000 + Math.random() * 9000);
    const regCode = `PAW-2026-${randomCode}`;
    const id = `reg_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

    const newRegistration: Registration = {
      id,
      competitionId: body.competitionId,
      competitionTitle,
      petName: body.petName.trim(),
      species: body.species || 'Dog',
      breed: body.breed?.trim() || 'Companion Mixed Breed',
      ageYears: Number(body.ageYears) || 2,
      gender: body.gender || 'Male',
      division: body.division || 'Conformation',
      classCategory: body.classCategory || 'Open Class',
      microchipNumber: body.microchipNumber || undefined,
      vaccinationVerified: Boolean(body.vaccinationVerified),
      ownerName: body.ownerName.trim(),
      ownerEmail: body.ownerEmail.trim(),
      ownerPhone: body.ownerPhone?.trim() || '(555) 000-0000',
      handlerName: body.handlerName || body.ownerName,
      clubAffiliation: body.clubAffiliation || 'Independent Exhibitor',
      photoUrl: body.photoUrl || undefined,
      notes: body.notes || undefined,
      status: 'Confirmed',
      registrationCode: regCode,
      createdAt: new Date().toISOString(),
    };

    await db.collection('registrations').insertOne(newRegistration as any);

    // Increment registeredCount in competition
    await db.collection('competitions').updateOne(
      { id: body.competitionId },
      { $inc: { registeredCount: 1 } }
    );

    res.status(201).json({
      success: true,
      message: 'Exhibitor registration confirmed successfully',
      data: newRegistration,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

// PUT update status (e.g. check in pet at venue)
router.put('/:id/status', async (req, res) => {
  try {
    const db = getDb();
    const id = req.params.id;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ success: false, message: 'Status is required' });
    }

    const result = await db.collection('registrations').updateOne(
      { id },
      { $set: { status } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ success: false, message: 'Registration not found' });
    }

    const updated = await db.collection('registrations').findOne({ id });
    res.json({ success: true, message: 'Status updated', data: updated });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

// DELETE cancel registration
router.delete('/:id', async (req, res) => {
  try {
    const db = getDb();
    const id = req.params.id;

    const existing = await db.collection('registrations').findOne({ id });
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Registration not found' });
    }

    await db.collection('registrations').deleteOne({ id });

    // Decrement count
    if (existing.competitionId) {
      await db.collection('competitions').updateOne(
        { id: existing.competitionId },
        { $inc: { registeredCount: -1 } }
      );
    }

    res.json({ success: true, message: 'Registration cancelled' });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

export default router;
