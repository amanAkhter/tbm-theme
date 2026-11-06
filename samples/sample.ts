/**
 * Sample TypeScript file to test Carbonline syntax highlighting.
 */

import { EventEmitter } from 'node:events';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  age?: number;
  roles: Array<'admin' | 'editor' | 'viewer'>;
  metadata: Record<string, unknown>;
}

export class AccountService<T extends UserProfile> extends EventEmitter {
  private readonly accounts: Map<string, T> = new Map();

  constructor(private readonly apiKey: string) {
    super();
    if (!apiKey) {
      throw new Error('API Key required');
    }
  }

  public async authenticate(token: string): Promise<T | null> {
    const regex = /^bearer\s+([a-zA-Z0-9_-]+)$/i;
    const match = token.match(regex);

    if (!match) {
      console.warn('Invalid token format');
      return null;
    }

    const accountId = match[1];
    const account = this.accounts.get(accountId);
    this.emit('authenticated', { accountId, timestamp: Date.now() });

    return account ?? null;
  }
}

