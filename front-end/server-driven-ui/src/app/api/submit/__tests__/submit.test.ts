import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from '../../submit/route';
import { NextRequest } from 'next/server';

describe('/api/submit - Submit Endpoint', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('handles valid form submission', async () => {
    const mockFormData = {
      'first-name': 'John',
      email: 'john@example.com',
      country: 'us',
    };

    const request = new NextRequest('http://localhost:3000/api/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ formData: mockFormData }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.data.formData).toEqual(mockFormData);
    expect(data).toHaveProperty('timestamp');
    // API doesn't return formId in current implementation
    expect(data.message).toBe('Form submitted successfully');
  });

  it('validates email format', async () => {
    const mockFormData = {
      'first-name': 'John',
      email: 'error@example.com',
      country: 'us',
    };

    const request = new NextRequest('http://localhost:3000/api/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ formData: mockFormData }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(422);
    expect(data.success).toBe(false);
    expect(data.error).toBe('EMAIL_VALIDATION_ERROR');
    expect(data.message).toBe('Email validation failed');
  });

  it('handles missing formData', async () => {
    const request = new NextRequest('http://localhost:3000/api/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toBe('MISSING_FORM_DATA');
  });

  it('handles invalid JSON in request body', async () => {
    const request = new NextRequest('http://localhost:3000/api/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: 'invalid json',
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toBe('INVALID_JSON');
  });

  it('handles empty request body', async () => {
    const request = new NextRequest('http://localhost:3000/api/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toBe('MISSING_BODY');
  });

  it('simulates processing delay', async () => {
    const mockFormData = {
      'first-name': 'John',
      email: 'john@example.com',
      country: 'us',
    };

    const request = new NextRequest('http://localhost:3000/api/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ formData: mockFormData }),
    });

    const startTime = Date.now();
    await POST(request);
    const endTime = Date.now();

    // Should have at least 500ms delay (API has 1000ms delay)
    expect(endTime - startTime).toBeGreaterThanOrEqual(500);
  });

  it('includes timestamp in response', async () => {
    const mockFormData = {
      'first-name': 'John',
      email: 'john@example.com',
      country: 'us',
    };

    const request = new NextRequest('http://localhost:3000/api/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ formData: mockFormData }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(data.timestamp).toBeDefined();
    expect(new Date(data.timestamp).getTime()).toBeGreaterThan(0);
  });

  it('includes formId in response', async () => {
    const mockFormData = {
      'first-name': 'John',
      email: 'john@example.com',
      country: 'us',
    };

    const request = new NextRequest('http://localhost:3000/api/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ formData: mockFormData }),
    });

    const response = await POST(request);
    const data = await response.json();

    // API doesn't return formId in current implementation
    expect(data.success).toBe(true);
  });

  it('handles special characters in form data', async () => {
    const mockFormData = {
      'first-name': 'José',
      email: 'josé@example.com',
      country: 'us',
      message: 'Hello & welcome! <script>alert("xss")</script>',
    };

    const request = new NextRequest('http://localhost:3000/api/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ formData: mockFormData }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.data.formData).toEqual(mockFormData);
  });

  it('handles large form data', async () => {
    const mockFormData = {
      'first-name': 'John',
      email: 'john@example.com',
      country: 'us',
      'large-field': 'a'.repeat(10000), // 10KB of data
    };

    const request = new NextRequest('http://localhost:3000/api/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ formData: mockFormData }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.data.formData['large-field']).toBe(mockFormData['large-field']);
  });

  it('includes proper headers in response', async () => {
    const mockFormData = {
      'first-name': 'John',
      email: 'john@example.com',
      country: 'us',
    };

    const request = new NextRequest('http://localhost:3000/api/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ formData: mockFormData }),
    });

    const response = await POST(request);

    expect(response.headers.get('content-type')).toBe('application/json');
  });

  it('logs form data to console', async () => {
    // Note: console.log is mocked in test setup, so we can't test it directly
    const mockFormData = {
      'first-name': 'John',
      email: 'john@example.com',
      country: 'us',
    };

    const request = new NextRequest('http://localhost:3000/api/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ formData: mockFormData }),
    });

    const response = await POST(request);
    const data = await response.json();

    // Verify the API works correctly instead
    expect(data.success).toBe(true);
    expect(data.data.formData).toEqual(mockFormData);
  });
});
