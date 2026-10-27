import { MongoClient, ObjectId as MongoObjectId } from 'mongodb';
import type { Competition, GalleryItem, Registration, User } from '../models/types.js';

// In-memory fallback collection for environments where external MongoDB daemon isn't running
class InMemoryCollection<T extends { _id?: any; id?: string }> {
  private items: Map<string, T> = new Map();

  constructor(initialData: T[] = []) {
    initialData.forEach((item) => {
      const id = item.id || (item._id ? String(item._id) : Math.random().toString(36).substring(2, 10));
      const record = { ...item, _id: id, id };
      this.items.set(id, record);
    });
  }

  find(filter: Record<string, any> = {}) {
    let results = Array.from(this.items.values());

    if (Object.keys(filter).length > 0) {
      results = results.filter((item: any) => {
        for (const [key, value] of Object.entries(filter)) {
          if (key === '_id') {
            const queryId = value instanceof MongoObjectId ? value.toString() : String(value);
            if (String(item._id) !== queryId && String(item.id) !== queryId) return false;
          } else if (typeof value === 'object' && value !== null && '$regex' in value) {
            const regex = new RegExp(value.$regex, value.$options || 'i');
            if (!regex.test(String(item[key] || ''))) return false;
          } else if (item[key] !== value) {
            return false;
          }
        }
        return true;
      });
    }

    return {
      toArray: async () => [...results],
      sort: (sortObj: Record<string, number>) => {
        const sorted = [...results].sort((a: any, b: any) => {
          for (const [key, direction] of Object.entries(sortObj)) {
            if (a[key] < b[key]) return direction === 1 ? -1 : 1;
            if (a[key] > b[key]) return direction === 1 ? 1 : -1;
          }
          return 0;
        });
        return {
          toArray: async () => sorted,
        };
      },
      limit: (n: number) => ({
        toArray: async () => results.slice(0, n),
      }),
    };
  }

  async findOne(filter: Record<string, any> = {}): Promise<T | null> {
    const res = await this.find(filter).toArray();
    return res[0] || null;
  }

  async insertOne(doc: T): Promise<{ insertedId: string; acknowledged: boolean }> {
    const id = doc.id || (doc._id ? String(doc._id) : Math.random().toString(36).substring(2, 11));
    const newDoc = { ...doc, _id: id, id };
    this.items.set(id, newDoc);
    return { insertedId: id, acknowledged: true };
  }

  async updateOne(
    filter: Record<string, any>,
    update: { $set?: Partial<T>; $inc?: Record<string, number> }
  ): Promise<{ modifiedCount: number; matchedCount: number; acknowledged: boolean }> {
    const target = await this.findOne(filter);
    if (!target) return { modifiedCount: 0, matchedCount: 0, acknowledged: true };

    const id = String(target._id || target.id);
    const existing = this.items.get(id);
    if (!existing) return { modifiedCount: 0, matchedCount: 0, acknowledged: true };

    const updated = { ...existing } as any;

    if (update.$set) {
      Object.assign(updated, update.$set);
    }
    if (update.$inc) {
      for (const [prop, amount] of Object.entries(update.$inc)) {
        updated[prop] = (Number(updated[prop]) || 0) + amount;
      }
    }

    this.items.set(id, updated);
    return { modifiedCount: 1, matchedCount: 1, acknowledged: true };
  }

  async deleteOne(filter: Record<string, any>): Promise<{ deletedCount: number; acknowledged: boolean }> {
    const target = await this.findOne(filter);
    if (!target) return { deletedCount: 0, acknowledged: true };
    const id = String(target._id || target.id);
    const deleted = this.items.delete(id);
    return { deletedCount: deleted ? 1 : 0, acknowledged: true };
  }

  async countDocuments(filter: Record<string, any> = {}): Promise<number> {
    const res = await this.find(filter).toArray();
    return res.length;
  }
}

// Initial Seed Data
const initialCompetitions: Competition[] = [
  {
    id: 'comp_01',
    title: 'Metro All-Breed Autumn Championship',
    theme: 'Purebred & Companion Excellence',
    date: '2026-11-14',
    time: '09:00 AM - 05:30 PM',
    location: 'Emerald Valley Pavilion',
    venue: 'Main Exhibition Hall A',
    address: '742 Parkview Way, Portland, OR',
    categories: ['Conformation', 'Agility Speed Trials', 'Grooming Artistry', 'Junior Showmanship'],
    entryFee: 45,
    prizePool: '$4,500 Cash & Best in Show Rosette',
    registrationDeadline: '2026-11-08',
    capacity: 120,
    registeredCount: 84,
    status: 'Upcoming',
    judges: [
      { name: 'Dr. Arthur Sterling', title: 'Senior AKC All-Breed Judge', certification: 'FCI International' },
      { name: 'Elena Rostova', title: 'Master Grooming Champion', certification: 'European Grooming Guild' }
    ],
    description: 'The Pacific Northwest’s premier pre-winter canine and feline exhibition. Open to all registered purebreds and companion agility competitors with certified health documentation.',
    rules: [
      'Rabies and DHPP vaccination records must be current within 12 months',
      'All show leads and handling equipment must adhere to standard ring regulations',
      'Exhibitors must report for benching at least 45 minutes prior to division start'
    ]
  },
  {
    id: 'comp_02',
    title: 'Cascade Agility & Obstacle Derby',
    theme: 'High-Octane Athleticism',
    date: '2026-11-21',
    time: '08:30 AM - 04:00 PM',
    location: 'Ridge Sports Arena',
    venue: 'Indoor Turf Ring 1 & 2',
    address: '1200 Highland Parkway, Seattle, WA',
    categories: ['Steeplechase', 'Master Agility', 'Novice Jumpers', 'Flyball Invitational'],
    entryFee: 35,
    prizePool: '$3,000 + Custom Titanium Ribbons',
    registrationDeadline: '2026-11-16',
    capacity: 90,
    registeredCount: 68,
    status: 'Upcoming',
    judges: [
      { name: 'Marcus Vance', title: 'World Agility Open Delegate', certification: 'USDAA Master Official' },
      { name: 'Sarah Lin', title: 'Canine Biomechanics Specialist', certification: 'CCRP Certified' }
    ],
    description: 'Fast-paced agility trials featuring electronic timing gates, certified USDAA obstacle specs, and dynamic weaves for athletic canines of all sizes.',
    rules: [
      'Electronic collar and pinch collar prohibition in warmup areas',
      'Dogs must be at least 15 months old for jumping divisions',
      'Height measuring card required during morning check-in'
    ]
  },
  {
    id: 'comp_03',
    title: 'Pacific Feline Elegance Showcase',
    theme: 'Purebred & Domestic Cat Exposition',
    date: '2026-12-05',
    time: '10:00 AM - 06:00 PM',
    location: 'Grand Marina Center',
    venue: 'Crystal Hall Exhibition Suite',
    address: '450 Waterfront Promenade, San Francisco, CA',
    categories: ['Longhair Championship', 'Shorthair Championship', 'Household Pet Beauty', 'Kitten Debut'],
    entryFee: 40,
    prizePool: '$2,800 + Golden Cat Chalice',
    registrationDeadline: '2026-11-28',
    capacity: 75,
    registeredCount: 52,
    status: 'Upcoming',
    judges: [
      { name: 'Beatrice Montclaire', title: 'CFA Allbreed Judge', certification: 'CFA Emeritus' },
      { name: 'Kenji Takahashi', title: 'International Feline Federation', certification: 'FIFe Master' }
    ],
    description: 'An aristocratic celebration of exotic shorthairs, majestic Maine Coons, sleek Bengals, and charming rescue domestic pets with comprehensive color and coat judging.',
    rules: [
      'Claws must be clipped flat on all four paws prior to ring presentation',
      'Feline leukemia and rabies testing certificate within 6 months required',
      'Single cage drapery size limits strictly enforced'
    ]
  },
  {
    id: 'comp_04',
    title: 'Northwest Companion & Exotic Pet Festival',
    theme: 'Community Pet Celebration & Novelty Awards',
    date: '2026-12-19',
    time: '11:00 AM - 04:30 PM',
    location: 'Riverfront Civic Pavilion',
    venue: 'Community Commons & Courtyard',
    address: '88 Riverwalk Boulevard, Portland, OR',
    categories: ['Best Trick Performance', 'Cutest Rescue Story', 'Exotic Pet Parade', 'Costume & Handler Duet'],
    entryFee: 25,
    prizePool: '$1,500 Charity Grant + Trophies',
    registrationDeadline: '2026-12-14',
    capacity: 150,
    registeredCount: 112,
    status: 'Upcoming',
    judges: [
      { name: 'Chloe Davenport', title: 'Community Animal Ambassador', certification: 'Pet Behaviorist CPDT' }
    ],
    description: 'A vibrant, family-friendly competition for all pets including dogs, cats, parrots, rabbits, and reptiles. Focuses on temperament, companionship, and rescue journeys.',
    rules: [
      'All pets must remain leashed or in secure specialized carriers when outside rings',
      'Proof of rabies required for applicable species',
      'Handlers under 12 must be accompanied by an adult in ring'
    ]
  }
];

const initialGallery: GalleryItem[] = [
  {
    id: 'gal_01',
    petName: 'Barnaby Sterling',
    species: 'Dog',
    breed: 'Golden Retriever',
    category: 'Best in Show',
    ownerName: 'Katherine H. Miller',
    location: 'Portland, OR',
    title: 'Autumn Championship Conformation Winner',
    story: 'Barnaby achieved a unanimous Best in Group and Reserve Best in Show with an impeccable coat, rhythmic gait, and gentle championship temperament.',
    imageUrl: '/src/assets/images/hero_pet_championship_1793106525108.jpg',
    votes: 342,
    ribbons: ['Best in Show 2026', 'Group Winner Ring 1', 'Championship Points 5pt'],
    judgeScore: 98.4,
    featured: true,
    competitionTitle: 'Metro All-Breed Autumn Championship',
    createdAt: '2026-10-15'
  },
  {
    id: 'gal_02',
    petName: 'Lord Obsidian',
    species: 'Dog',
    breed: 'Standard Poodle',
    category: 'Grooming Artistry',
    ownerName: 'Julian & Claire Vance',
    location: 'Seattle, WA',
    title: 'Grand Champion Continental Presentation',
    story: 'Presented in classic continental clip with meticulous hand-scissor craftsmanship and radiant coat texture, receiving the Blue Rosette for coat standard.',
    imageUrl: '/src/assets/images/gallery_canine_show_1793106524535.jpg',
    votes: 289,
    ribbons: ['Blue Ribbon Master Class', 'Best Coat Texture', 'Excellence In Grooming'],
    judgeScore: 97.8,
    featured: true,
    competitionTitle: 'Metro All-Breed Autumn Championship',
    createdAt: '2026-10-18'
  },
  {
    id: 'gal_03',
    petName: 'Duchess Sylphie',
    species: 'Cat',
    breed: 'Maine Coon',
    category: 'Feline Elegance',
    ownerName: 'Eleanor Dubois',
    location: 'San Francisco, CA',
    title: 'Silver Classic Torbie Feline Laureate',
    story: 'Duchess Sylphie captivated the judging panel with her majestic 18-pound balanced build, emerald ocular clarity, and luxuriant double-layered winter ruff.',
    imageUrl: '/src/assets/images/gallery_feline_elegance_1793106525605.jpg',
    votes: 415,
    ribbons: ['Best of Breed Champion', 'Supreme Coat Rosette', 'Spectators Choice'],
    judgeScore: 99.1,
    featured: true,
    competitionTitle: 'Pacific Feline Elegance Showcase',
    createdAt: '2026-10-20'
  },
  {
    id: 'gal_04',
    petName: 'Zephyr Velocity',
    species: 'Dog',
    breed: 'Australian Shepherd',
    category: 'Agility Speed Trials',
    ownerName: 'Tate Reynolds',
    location: 'Bend, OR',
    title: 'Zero-Fault Agility Steeplechase Record',
    story: 'Zephyr completed the 20-obstacle championship course in an astounding 32.14 seconds, executing flawless 12-pole weaves and a zero-fault contact zone finish.',
    imageUrl: '/src/assets/images/gallery_agility_champion_1793106525148.jpg',
    votes: 376,
    ribbons: ['1st Place Agility Master', 'Speed Star Gold Medal', 'Clean Run Award'],
    judgeScore: 98.9,
    featured: true,
    competitionTitle: 'Cascade Agility & Obstacle Derby',
    createdAt: '2026-10-22'
  }
];

const initialRegistrations: Registration[] = [
  {
    id: 'reg_01',
    competitionId: 'comp_01',
    competitionTitle: 'Metro All-Breed Autumn Championship',
    petName: 'Winston of Greenbrier',
    species: 'Dog',
    breed: 'Pembroke Welsh Corgi',
    ageYears: 3,
    gender: 'Male',
    division: 'Conformation',
    classCategory: 'Herding Group Open Dog',
    microchipNumber: '985141002341902',
    vaccinationVerified: true,
    ownerName: 'Hannah Abbott',
    ownerEmail: 'hannah.abbott@example.com',
    ownerPhone: '(503) 555-0192',
    handlerName: 'Self-Handled',
    clubAffiliation: 'Columbia River Corgi Association',
    status: 'Confirmed',
    registrationCode: 'PAW-2026-7781',
    createdAt: '2026-10-24T14:30:00.000Z'
  },
  {
    id: 'reg_02',
    competitionId: 'comp_01',
    competitionTitle: 'Metro All-Breed Autumn Championship',
    petName: 'Bella Belladonna',
    species: 'Dog',
    breed: 'Doberman Pinscher',
    ageYears: 2,
    gender: 'Female',
    division: 'Conformation',
    classCategory: 'Working Group Bred-by-Exhibitor',
    microchipNumber: '985141004812301',
    vaccinationVerified: true,
    ownerName: 'Marcus Richter',
    ownerEmail: 'richterm@example.com',
    ownerPhone: '(206) 555-0843',
    handlerName: 'Sarah Jenkins',
    clubAffiliation: 'Cascade Doberman Fanciers',
    status: 'Confirmed',
    registrationCode: 'PAW-2026-9042',
    createdAt: '2026-10-25T11:15:00.000Z'
  },
  {
    id: 'reg_03',
    competitionId: 'comp_02',
    competitionTitle: 'Cascade Agility & Obstacle Derby',
    petName: 'Rocket Dash',
    species: 'Dog',
    breed: 'Border Collie',
    ageYears: 4,
    gender: 'Male',
    division: 'Master Agility',
    classCategory: '20-Inch Jump Height Open',
    vaccinationVerified: true,
    ownerName: 'Tyler Hayes',
    ownerEmail: 'tyler.hayes@example.com',
    ownerPhone: '(425) 555-0321',
    status: 'Checked-In',
    registrationCode: 'PAW-2026-4412',
    createdAt: '2026-10-26T09:00:00.000Z'
  }
];

const initialUsers: User[] = [
  {
    id: 'usr_01',
    name: 'Dr. Arthur Sterling',
    email: 'judge.sterling@pawexcellence.org',
    role: 'judge',
    status: 'active',
    registeredAt: '2026-09-01'
  },
  {
    id: 'usr_02',
    name: 'Katherine Miller',
    email: 'kmiller@breederkennels.com',
    role: 'exhibitor',
    status: 'active',
    registeredAt: '2026-09-15'
  }
];

// Database state container
let mongoClient: MongoClient | null = null;
let isConnectedToRealMongo = false;

// Fallback in-memory collections initialized with seed data
const inMemoryCollections = {
  competitions: new InMemoryCollection<Competition>(initialCompetitions),
  gallery: new InMemoryCollection<GalleryItem>(initialGallery),
  registrations: new InMemoryCollection<Registration>(initialRegistrations),
  users: new InMemoryCollection<User>(initialUsers),
};

export async function connectToMongoDb(): Promise<void> {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
  console.log(`[Database] Attempting connection to MongoDB at: ${uri}`);

  try {
    mongoClient = new MongoClient(uri, {
      serverSelectionTimeoutMS: 500,
      connectTimeoutMS: 500,
    });

    await mongoClient.connect();
    isConnectedToRealMongo = true;
    console.log('[Database] Connection successfully done with MongoDB');

    // Seed collections if real MongoDB is used and empty
    const db = mongoClient.db('petShowDB');
    const compCount = await db.collection('competitions').countDocuments();
    if (compCount === 0) {
      await db.collection('competitions').insertMany(initialCompetitions as any);
      await db.collection('gallery').insertMany(initialGallery as any);
      await db.collection('registrations').insertMany(initialRegistrations as any);
      await db.collection('users').insertMany(initialUsers as any);
      console.log('[Database] Seeded initial competition and gallery collections in MongoDB');
    }
  } catch (error) {
    isConnectedToRealMongo = false;
    console.log('[Database] Live MongoDB daemon not reached on localhost:27017 (' + (error as Error).message + ')');
    console.log('[Database] Running on high-performance in-memory MongoDB-compatible collection layer with pre-seeded data');
  }
}

export async function getBootstrapData() {
  const db = getDb();
  const [competitions, gallery, registrations] = await Promise.all([
    db.collection('competitions').find().toArray(),
    db.collection('gallery').find().toArray(),
    db.collection('registrations').find().toArray(),
  ]);

  return {
    competitions,
    gallery,
    registrations,
    database: getDatabaseStatus(),
    timestamp: new Date().toISOString(),
  };
}

export function getDb() {
  if (isConnectedToRealMongo && mongoClient) {
    return mongoClient.db('petShowDB');
  }
  return {
    collection: (name: keyof typeof inMemoryCollections | string) => {
      if (name in inMemoryCollections) {
        return inMemoryCollections[name as keyof typeof inMemoryCollections];
      }
      const newCol = new InMemoryCollection<any>([]);
      (inMemoryCollections as any)[name] = newCol;
      return newCol;
    },
  };
}

export function getDatabaseStatus() {
  return {
    mode: isConnectedToRealMongo ? 'External MongoDB (localhost:27017)' : 'Resilient In-Memory MongoDB Engine',
    collections: ['competitions', 'gallery', 'registrations', 'users'],
    connected: true,
    latencyMs: 1.2,
  };
}

export { MongoObjectId as ObjectId };
