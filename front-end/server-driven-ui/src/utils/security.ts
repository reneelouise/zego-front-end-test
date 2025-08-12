import DOMPurify from 'isomorphic-dompurify';

/**
 * Sanitizes user input to prevent XSS attacks
 * @param input - The user input to sanitize
 * @returns Sanitized input
 */
export const sanitizeInput = (input: string): string => {
  if (typeof input !== 'string') {
    return '';
  }

  // Remove any HTML tags and dangerous content
  return DOMPurify.sanitize(input, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });
};

/**
 * Validates and sanitizes form data
 * @param formData - The form data to validate
 * @returns Sanitized form data
 */
export const sanitizeFormData = (
  formData: Record<string, any>
): Record<string, string> => {
  const sanitized: Record<string, string> = {};

  for (const [key, value] of Object.entries(formData)) {
    if (typeof value === 'string') {
      sanitized[key] = sanitizeInput(value);
    } else if (value != null) {
      sanitized[key] = sanitizeInput(String(value));
    } else {
      sanitized[key] = '';
    }
  }

  return sanitized;
};

/**
 * Validates email format and common patterns
 * @param email - Email to validate
 * @returns True if valid
 */
export const isValidEmail = (email: string): boolean => {
  if (!email || typeof email !== 'string') {
    return false;
  }

  // Basic email regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    return false;
  }

  // Additional checks
  const [localPart, domain] = email.split('@');

  // Check length limits
  if (localPart.length > 64 || domain.length > 255) {
    return false;
  }

  // Check for common disposable email domains
  const disposableDomains = [
    'tempmail.org',
    '10minutemail.com',
    'guerrillamail.com',
    'mailinator.com',
    'throwaway.email',
    'temp-mail.org',
  ];

  if (disposableDomains.some(d => domain.toLowerCase().includes(d))) {
    return false;
  }

  return true;
};

/**
 * Validates phone number format
 * @param phone - Phone number to validate
 * @returns True if valid
 */
export const isValidPhone = (phone: string): boolean => {
  if (!phone || typeof phone !== 'string') {
    return false;
  }

  // Remove all non-digit characters
  const digitsOnly = phone.replace(/\D/g, '');

  // Check if it's a reasonable length (7-15 digits)
  if (digitsOnly.length < 7 || digitsOnly.length > 15) {
    return false;
  }

  return true;
};

/**
 * Prevents common injection attacks
 * @param input - Input to check
 * @returns True if potentially dangerous
 */
export const containsInjectionAttempt = (input: string): boolean => {
  if (!input || typeof input !== 'string') {
    return false;
  }

  const dangerousPatterns = [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi,
    /data:text\/html/gi,
    /vbscript:/gi,
    /<iframe/gi,
    /<object/gi,
    /<embed/gi,
  ];

  return dangerousPatterns.some(pattern => pattern.test(input));
};

/**
 * Rate limiting helper
 * @param identifier - Unique identifier (IP, user ID, etc.)
 * @param windowMs - Time window in milliseconds
 * @param maxRequests - Maximum requests per window
 * @returns True if rate limited
 */
export class RateLimiter {
  private store = new Map<string, { count: number; resetTime: number }>();

  isRateLimited(
    identifier: string,
    windowMs: number = 60000,
    maxRequests: number = 100
  ): boolean {
    const now = Date.now();
    const record = this.store.get(identifier);

    if (!record || now > record.resetTime) {
      this.store.set(identifier, { count: 1, resetTime: now + windowMs });
      return false;
    }

    if (record.count >= maxRequests) {
      return true;
    }

    record.count++;
    return false;
  }

  // Clean up old entries periodically
  cleanup(): void {
    const now = Date.now();
    for (const [key, record] of this.store.entries()) {
      if (now > record.resetTime) {
        this.store.delete(key);
      }
    }
  }
}
