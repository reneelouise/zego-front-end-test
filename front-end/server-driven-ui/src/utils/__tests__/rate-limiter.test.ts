import { describe, it, expect, beforeEach, vi } from 'vitest';
import { RateLimiter } from '../rate-limiter';

describe('RateLimiter', () => {
  let rateLimiter: RateLimiter;

  beforeEach(() => {
    rateLimiter = new RateLimiter(1000, 3); // 1 second window, 3 requests max
  });

  it('allows requests within limit', () => {
    const identifier = 'test-ip';
    
    expect(rateLimiter.isRateLimited(identifier)).toBe(false);
    expect(rateLimiter.isRateLimited(identifier)).toBe(false);
    expect(rateLimiter.isRateLimited(identifier)).toBe(false);
  });

  it('blocks requests when limit exceeded', () => {
    const identifier = 'test-ip';
    
    // First 3 requests should be allowed
    expect(rateLimiter.isRateLimited(identifier)).toBe(false);
    expect(rateLimiter.isRateLimited(identifier)).toBe(false);
    expect(rateLimiter.isRateLimited(identifier)).toBe(false);
    
    // 4th request should be blocked
    expect(rateLimiter.isRateLimited(identifier)).toBe(true);
  });

  it('resets after window expires', async () => {
    const identifier = 'test-ip';
    
    // Use up the limit
    expect(rateLimiter.isRateLimited(identifier)).toBe(false);
    expect(rateLimiter.isRateLimited(identifier)).toBe(false);
    expect(rateLimiter.isRateLimited(identifier)).toBe(false);
    expect(rateLimiter.isRateLimited(identifier)).toBe(true);
    
    // Wait for window to expire
    await new Promise(resolve => setTimeout(resolve, 1100));
    
    // Should be allowed again
    expect(rateLimiter.isRateLimited(identifier)).toBe(false);
  });

  it('tracks different identifiers separately', () => {
    const ip1 = '192.168.1.1';
    const ip2 = '192.168.1.2';
    
    // Use up limit for ip1
    expect(rateLimiter.isRateLimited(ip1)).toBe(false);
    expect(rateLimiter.isRateLimited(ip1)).toBe(false);
    expect(rateLimiter.isRateLimited(ip1)).toBe(false);
    expect(rateLimiter.isRateLimited(ip1)).toBe(true);
    
    // ip2 should still be allowed
    expect(rateLimiter.isRateLimited(ip2)).toBe(false);
    expect(rateLimiter.isRateLimited(ip2)).toBe(false);
    expect(rateLimiter.isRateLimited(ip2)).toBe(false);
  });

  it('cleans up expired entries', async () => {
    const identifier = 'test-ip';
    
    // Use up the limit
    expect(rateLimiter.isRateLimited(identifier)).toBe(false);
    expect(rateLimiter.isRateLimited(identifier)).toBe(false);
    expect(rateLimiter.isRateLimited(identifier)).toBe(false);
    
    // Wait for window to expire
    await new Promise(resolve => setTimeout(resolve, 1100));
    
    // Should be allowed again (cleanup happens automatically)
    expect(rateLimiter.isRateLimited(identifier)).toBe(false);
  });

  it('provides count information', () => {
    const identifier = 'test-ip';
    
    expect(rateLimiter.getCount(identifier)).toBe(0);
    
    rateLimiter.isRateLimited(identifier);
    expect(rateLimiter.getCount(identifier)).toBe(1);
    
    rateLimiter.isRateLimited(identifier);
    expect(rateLimiter.getCount(identifier)).toBe(2);
  });

  it('allows manual reset', () => {
    const identifier = 'test-ip';
    
    rateLimiter.isRateLimited(identifier);
    expect(rateLimiter.getCount(identifier)).toBe(1);
    
    rateLimiter.reset(identifier);
    expect(rateLimiter.getCount(identifier)).toBe(0);
    expect(rateLimiter.isRateLimited(identifier)).toBe(false);
  });

  it('allows clearing all limits', () => {
    const ip1 = '192.168.1.1';
    const ip2 = '192.168.1.2';
    
    rateLimiter.isRateLimited(ip1);
    rateLimiter.isRateLimited(ip2);
    
    expect(rateLimiter.getCount(ip1)).toBe(1);
    expect(rateLimiter.getCount(ip2)).toBe(1);
    
    rateLimiter.clear();
    
    expect(rateLimiter.getCount(ip1)).toBe(0);
    expect(rateLimiter.getCount(ip2)).toBe(0);
  });

  it('uses default values when not specified', () => {
    const defaultRateLimiter = new RateLimiter();
    const identifier = 'test-ip';
    
    // Should allow 100 requests (default max)
    for (let i = 0; i < 100; i++) {
      expect(defaultRateLimiter.isRateLimited(identifier)).toBe(false);
    }
    
    // 101st should be blocked
    expect(defaultRateLimiter.isRateLimited(identifier)).toBe(true);
  });
});
