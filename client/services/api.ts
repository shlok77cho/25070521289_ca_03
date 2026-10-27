import type { Competition, GalleryItem, Registration, User, DbStatus } from '../types/index.ts';

const API_BASE = '/api';

export const api = {
  getAuthHeaders(): Record<string, string> {
    const token = localStorage.getItem('paw_token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  },

  // Competitions
  async getCompetitions(params?: { status?: string; search?: string }): Promise<Competition[]> {
    const query = new URLSearchParams();
    if (params?.status) query.set('status', params.status);
    if (params?.search) query.set('search', params.search);

    const res = await fetch(`${API_BASE}/competitions?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch competitions');
    const json = await res.json();
    return json.data || [];
  },

  async getCompetition(id: string): Promise<Competition> {
    const res = await fetch(`${API_BASE}/competitions/${id}`);
    if (!res.ok) throw new Error('Failed to fetch competition');
    const json = await res.json();
    return json.data;
  },

  async createCompetition(data: Partial<Competition>): Promise<Competition> {
    const res = await fetch(`${API_BASE}/competitions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeaders(),
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create competition');
    const json = await res.json();
    return json.data;
  },

  // Registrations
  async getRegistrations(params?: { competitionId?: string; search?: string }): Promise<Registration[]> {
    const query = new URLSearchParams();
    if (params?.competitionId) query.set('competitionId', params.competitionId);
    if (params?.search) query.set('search', params.search);

    const res = await fetch(`${API_BASE}/registrations?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch registrations');
    const json = await res.json();
    return json.data || [];
  },

  async getRegistration(idOrCode: string): Promise<Registration> {
    const res = await fetch(`${API_BASE}/registrations/${idOrCode}`);
    if (!res.ok) throw new Error('Failed to fetch registration');
    const json = await res.json();
    return json.data;
  },

  async submitRegistration(data: Partial<Registration>): Promise<Registration> {
    const res = await fetch(`${API_BASE}/registrations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeaders(),
      },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.message || 'Failed to submit registration');
    }
    return json.data;
  },

  async updateRegistrationStatus(id: string, status: string): Promise<Registration> {
    const res = await fetch(`${API_BASE}/registrations/${id}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeaders(),
      },
      body: JSON.stringify({ status }),
    });
    if (!res.ok) throw new Error('Failed to update status');
    const json = await res.json();
    return json.data;
  },

  async cancelRegistration(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/registrations/${id}`, {
      method: 'DELETE',
      headers: {
        ...this.getAuthHeaders(),
      },
    });
    if (!res.ok) throw new Error('Failed to cancel registration');
  },

  // Gallery
  async getGallery(params?: { category?: string; species?: string; sort?: string; search?: string }): Promise<GalleryItem[]> {
    const query = new URLSearchParams();
    if (params?.category) query.set('category', params.category);
    if (params?.species) query.set('species', params.species);
    if (params?.sort) query.set('sort', params.sort);
    if (params?.search) query.set('search', params.search);

    const res = await fetch(`${API_BASE}/gallery?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch gallery');
    const json = await res.json();
    return json.data || [];
  },

  async submitGalleryItem(data: Partial<GalleryItem>): Promise<GalleryItem> {
    const res = await fetch(`${API_BASE}/gallery`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeaders(),
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to submit photo');
    const json = await res.json();
    return json.data;
  },

  async voteGalleryItem(id: string): Promise<number> {
    const res = await fetch(`${API_BASE}/gallery/${id}/vote`, {
      method: 'POST',
      headers: {
        ...this.getAuthHeaders(),
      },
    });
    if (!res.ok) throw new Error('Failed to vote');
    const json = await res.json();
    return json.votes;
  },

  // Authentication & Session Management
  async login(email: string, password: string): Promise<{ jwtToken: string; user: User }> {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.message || 'Login failed');
    }
    localStorage.setItem('paw_token', json.jwtToken);
    localStorage.setItem('paw_user', JSON.stringify(json.user));
    return json;
  },

  async register(data: { name: string; email: string; password: string; role?: string }): Promise<{ jwtToken: string; user: User }> {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.message || 'Registration failed');
    }
    localStorage.setItem('paw_token', json.jwtToken);
    localStorage.setItem('paw_user', JSON.stringify(json.user));
    return json;
  },

  async getCurrentUser(): Promise<User | null> {
    const token = localStorage.getItem('paw_token');
    if (!token) return null;
    try {
      const res = await fetch(`${API_BASE}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        this.logout();
        return null;
      }
      const json = await res.json();
      if (json.success && json.user) {
        localStorage.setItem('paw_user', JSON.stringify(json.user));
        return json.user;
      }
      return null;
    } catch {
      return this.getStoredUser();
    }
  },

  async getDemoUsers(): Promise<Array<{ name: string; email: string; role: string; label: string; badge: string }>> {
    try {
      const res = await fetch(`${API_BASE}/auth/demo-users`);
      if (!res.ok) return [];
      const json = await res.json();
      return json.data || [];
    } catch {
      return [];
    }
  },

  getStoredUser(): User | null {
    try {
      const stored = localStorage.getItem('paw_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  },

  logout(): void {
    localStorage.removeItem('paw_token');
    localStorage.removeItem('paw_user');
  },

  // Ultra-fast unified bootstrap loader with local SWR cache
  async getBootstrapData(): Promise<{
    competitions: Competition[];
    gallery: GalleryItem[];
    registrations: Registration[];
    database: DbStatus;
    latencyMs: number;
  }> {
    const start = performance.now();
    try {
      const res = await fetch(`${API_BASE}/bootstrap`, {
        headers: { Accept: 'application/json' },
      });
      if (!res.ok) throw new Error('Bootstrap endpoint failed');
      const json = await res.json();
      const elapsed = Math.max(1, Math.round(performance.now() - start));

      const payload = {
        competitions: json.competitions || [],
        gallery: json.gallery || [],
        registrations: json.registrations || [],
        database: {
          ...(json.database || { mode: 'MongoDB', collections: [], connected: true }),
          latencyMs: elapsed,
        },
        latencyMs: elapsed,
      };

      try {
        localStorage.setItem('paw_bootstrap_cache', JSON.stringify(payload));
      } catch {}

      return payload;
    } catch (err) {
      const cached = localStorage.getItem('paw_bootstrap_cache');
      if (cached) {
        try {
          return JSON.parse(cached);
        } catch {}
      }
      throw err;
    }
  },

  getCachedBootstrap(): {
    competitions: Competition[];
    gallery: GalleryItem[];
    registrations: Registration[];
    database?: DbStatus;
  } | null {
    try {
      const cached = localStorage.getItem('paw_bootstrap_cache');
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  },

  // Health
  async getDbStatus(): Promise<DbStatus> {
    const res = await fetch(`${API_BASE}/health`);
    if (!res.ok) throw new Error('Failed to get status');
    const json = await res.json();
    return json.database;
  },
};
