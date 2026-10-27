export interface Competition {
  _id?: any;
  id: string;
  title: string;
  theme: string;
  date: string;
  time: string;
  location: string;
  venue: string;
  address: string;
  categories: string[];
  entryFee: number;
  prizePool: string;
  registrationDeadline: string;
  capacity: number;
  registeredCount: number;
  status: 'Upcoming' | 'Live' | 'Completed';
  judges: Array<{ name: string; title: string; certification: string }>;
  description: string;
  rules: string[];
}

export interface Registration {
  _id?: any;
  id: string;
  competitionId: string;
  competitionTitle: string;
  petName: string;
  species: 'Dog' | 'Cat' | 'Bird' | 'Small Animal' | 'Exotic';
  breed: string;
  ageYears: number;
  gender: 'Male' | 'Female';
  division: string;
  classCategory: string;
  microchipNumber?: string;
  vaccinationVerified: boolean;
  ownerName: string;
  ownerEmail: string;
  ownerPhone: string;
  handlerName?: string;
  clubAffiliation?: string;
  photoUrl?: string;
  notes?: string;
  status: 'Confirmed' | 'Checked-In' | 'Pending Review';
  registrationCode: string;
  createdAt: string;
}

export interface GalleryItem {
  _id?: any;
  id: string;
  petName: string;
  species: 'Dog' | 'Cat' | 'Bird' | 'Other';
  breed: string;
  category: string;
  ownerName: string;
  location: string;
  title: string;
  story: string;
  imageUrl: string;
  votes: number;
  ribbons: string[];
  judgeScore?: number;
  featured?: boolean;
  competitionTitle?: string;
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'exhibitor' | 'judge' | 'organizer';
  status: string;
}

export interface DbStatus {
  mode: string;
  collections: string[];
  connected: boolean;
  latencyMs?: number;
}
