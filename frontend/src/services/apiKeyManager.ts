// API Key Rotation Manager
// Automatically switches between multiple API keys when rate limits are hit

export interface APIKey {
  key: string;
  name: string;
  isActive: boolean;
  lastUsed: Date;
  rateLimitHit: boolean;
  rateLimitResetTime?: Date;
}

class APIKeyManager {
  private keys: APIKey[] = [];
  private currentKeyIndex = 0;

  constructor() {
    // Initialize with your keys
    this.keys = [
      {
        key: "AIzaSyAWHvDx2wyRVwYyuTuqenEvioc3JsVKSjE",
        name: "Your Key",
        isActive: true,
        lastUsed: new Date(),
        rateLimitHit: false
      },
      {
        key: "YOUR_FRIEND_API_KEY_HERE", // Replace with your friend's actual key
        name: "Friend's Key",
        isActive: true,
        lastUsed: new Date(),
        rateLimitHit: false
      }
    ];
  }

  // Get the next available key
  getNextAvailableKey(): string | null {
    // Find a key that's not rate limited
    const availableKey = this.keys.find(key => 
      key.isActive && !key.rateLimitHit
    );

    if (availableKey) {
      availableKey.lastUsed = new Date();
      return availableKey.key;
    }

    // If all keys are rate limited, check if any have reset
    this.checkRateLimitResets();
    
    const resetKey = this.keys.find(key => 
      key.isActive && !key.rateLimitHit
    );

    return resetKey ? resetKey.key : null;
  }

  // Mark a key as rate limited
  markKeyAsRateLimited(apiKey: string): void {
    const key = this.keys.find(k => k.key === apiKey);
    if (key) {
      key.rateLimitHit = true;
      key.rateLimitResetTime = new Date(Date.now() + 2 * 60 * 60 * 1000); // 2 hours from now
      console.log(`🔑 Key "${key.name}" marked as rate limited. Will reset at ${key.rateLimitResetTime}`);
    }
  }

  // Check if any rate-limited keys have reset
  private checkRateLimitResets(): void {
    const now = new Date();
    this.keys.forEach(key => {
      if (key.rateLimitHit && key.rateLimitResetTime && now >= key.rateLimitResetTime) {
        key.rateLimitHit = false;
        key.rateLimitResetTime = undefined;
        console.log(`🔄 Key "${key.name}" rate limit has reset and is now available`);
      }
    });
  }

  // Get status of all keys
  getKeysStatus(): APIKey[] {
    return this.keys.map(key => ({
      ...key,
      lastUsed: key.lastUsed,
      rateLimitResetTime: key.rateLimitResetTime
    }));
  }

  // Add a new key
  addKey(key: string, name: string): void {
    this.keys.push({
      key,
      name,
      isActive: true,
      lastUsed: new Date(),
      rateLimitHit: false
    });
    console.log(`🔑 Added new API key: ${name}`);
  }

  // Remove a key
  removeKey(apiKey: string): void {
    const index = this.keys.findIndex(k => k.key === apiKey);
    if (index !== -1) {
      const removedKey = this.keys.splice(index, 1)[0];
      console.log(`🗑️ Removed API key: ${removedKey.name}`);
    }
  }

  // Get current key info
  getCurrentKeyInfo(): { key: string; name: string } | null {
    const currentKey = this.getNextAvailableKey();
    if (currentKey) {
      const keyInfo = this.keys.find(k => k.key === currentKey);
      return keyInfo ? { key: currentKey, name: keyInfo.name } : null;
    }
    return null;
  }

  // Check if any keys are available
  hasAvailableKeys(): boolean {
    return this.keys.some(key => key.isActive && !key.rateLimitHit);
  }

  // Get count of available keys
  getAvailableKeysCount(): number {
    return this.keys.filter(key => key.isActive && !key.rateLimitHit).length;
  }
}

// Export singleton instance
export const apiKeyManager = new APIKeyManager();
export default apiKeyManager;
