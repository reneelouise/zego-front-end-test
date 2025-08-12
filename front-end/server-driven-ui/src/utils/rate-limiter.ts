/**
 * Rate Limiter utility for Next.js middleware
 * Note: This is a simple in-memory implementation for demo purposes
 * In production, use Redis or a proper rate limiting service
 */

interface RateLimitRecord {
  count: number;
  resetTime: number;
}

export class RateLimiter {
  private store: Map<string, RateLimitRecord>;
  private windowMs: number;
  private maxRequests: number;

  constructor(windowMs: number = 60000, maxRequests: number = 100) {
    this.store = new Map();
    this.windowMs = windowMs;
    this.maxRequests = maxRequests;
  }

  isRateLimited(identifier: string): boolean {
    this.cleanup();
    
    const now = Date.now();
    const record = this.store.get(identifier);

    if (!record || now > record.resetTime) {
      this.store.set(identifier, { count: 1, resetTime: now + this.windowMs });
      return false;
    }

    if (record.count >= this.maxRequests) {
      return true;
    }

    record.count++;
    return false;
  }

  private cleanup(): void {
    const now = Date.now();
    for (const [key, record] of this.store.entries()) {
      if (now > record.resetTime) {
        this.store.delete(key);
      }
    }
  }

  // Get current count for an identifier (useful for debugging)
  getCount(identifier: string): number {
    const record = this.store.get(identifier);
    return record ? record.count : 0;
  }

  // Reset rate limit for an identifier
  reset(identifier: string): void {
    this.store.delete(identifier);
  }

  // Clear all rate limits
  clear(): void {
    this.store.clear();
  }
}

// Export a singleton instance for middleware use
// Note: In production, this should be replaced with Redis or similar
export const rateLimiter = new RateLimiter();
