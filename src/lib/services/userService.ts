import { API_CONFIG } from '../api-config';

export interface User {
  id: number;
  email: string;
  providerId: string | null;
  provider: string;
}

export class UserService {
  private static instance: UserService;
  private userCache: Map<string, number> = new Map();

  private constructor() {}

  static getInstance(): UserService {
    if (!this.instance) {
      this.instance = new UserService();
    }
    return this.instance;
  }

  async getInternalUserId(email: string, providerId?: string): Promise<number> {
    const cacheKey = `${email}-${providerId}`;
    
    // Check cache first
    if (this.userCache.has(cacheKey)) {
      return this.userCache.get(cacheKey)!;
    }

    try {
      console.log('Fetching user for email:', email);
      const response = await fetch(
        `${API_CONFIG.API_BASE_URL}/users/email/${encodeURIComponent(email)}`
      );
      
      if (!response.ok) {
        console.error('Failed to fetch user:', await response.text());
        throw new Error('User not found');
      }

      const user: User = await response.json();
      console.log('Found user:', user);
      
      // Only verify provider ID if the user has one set
      if (providerId && user.providerId && user.providerId !== providerId) {
        console.warn('Provider ID mismatch:', {
          expected: user.providerId,
          received: providerId
        });
      }

      // Cache the result
      this.userCache.set(cacheKey, user.id);
      return user.id;

    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  }

  clearCache() {
    this.userCache.clear();
  }
}

export const userService = UserService.getInstance(); 