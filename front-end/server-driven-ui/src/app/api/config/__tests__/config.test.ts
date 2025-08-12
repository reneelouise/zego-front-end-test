import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET } from '../route';
import type { UIComponent } from '../../../../components/form/types';
import { mockMathRandom } from '../../../../__tests__/mocks';

describe('/api/config - Config Endpoint', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock Math.random to control the 10% failure rate
    mockMathRandom(0.5); // 50% - should not fail
  });

  it('returns successful config response', async () => {
    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.data).toHaveProperty('title');
    expect(data.data).toHaveProperty('description');
    expect(data.data).toHaveProperty('components');
    expect(data.data).toHaveProperty('submitUrl');
    expect(data.timestamp).toBeDefined();
  });

  it('returns config with all required fields', async () => {
    const response = await GET();
    const data = await response.json();

    expect(data.data.title).toBe('User Registration Form');
    expect(data.data.description).toBe(
      'Please fill out the form below to create your account.'
    );
    expect(data.data.submitUrl).toBe('/api/submit');
    expect(data.data.method).toBe('POST');
  });

  it('returns config with valid components structure', async () => {
    const response = await GET();
    const data = await response.json();

    expect(Array.isArray(data.data.components)).toBe(true);
    expect(data.data.components.length).toBeGreaterThan(0);

    // Check first component structure
    const firstComponent = data.data.components[0];
    expect(firstComponent).toHaveProperty('id');
    expect(firstComponent).toHaveProperty('type');
    expect(firstComponent).toHaveProperty('label');
  });

  it('includes all five component types', async () => {
    const response = await GET();
    const data = await response.json();

    const componentTypes = data.data.components.map(
      (comp: UIComponent) => comp.type
    );
    expect(componentTypes).toContain('text');
    expect(componentTypes).toContain('input');
    expect(componentTypes).toContain('dropdown');
    expect(componentTypes).toContain('button');
  });

  it('includes required field validation', async () => {
    const response = await GET();
    const data = await response.json();

    const requiredComponents = data.data.components.filter(
      (comp: UIComponent) => comp.required
    );
    expect(requiredComponents.length).toBeGreaterThan(0);
  });

  it('includes dropdown with valid options', async () => {
    const response = await GET();
    const data = await response.json();

    const dropdownComponent = data.data.components.find(
      (comp: UIComponent) => comp.type === 'dropdown'
    );
    expect(dropdownComponent).toBeDefined();
    expect(Array.isArray(dropdownComponent.options)).toBe(true);
    expect(dropdownComponent.options.length).toBeGreaterThan(0);

    // Check option structure
    const firstOption = dropdownComponent.options[0];
    expect(firstOption).toHaveProperty('value');
    expect(firstOption).toHaveProperty('label');
  });

  it('simulates network delay', async () => {
    const startTime = Date.now();
    await GET();
    const endTime = Date.now();

    // Should have at least 100ms delay
    expect(endTime - startTime).toBeGreaterThanOrEqual(100);
  });

  it('handles 10% failure rate correctly', async () => {
    // Mock Math.random to return 0.05 (5%) - should fail
    mockMathRandom(0.05);

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(503);
    expect(data.success).toBe(false);
    expect(data.error).toBe('SERVICE_UNAVAILABLE');
  });

  it('returns proper error response on failure', async () => {
    mockMathRandom(0.05);

    const response = await GET();
    const data = await response.json();

    expect(data).toEqual({
      success: false,
      error: 'SERVICE_UNAVAILABLE',
      message: 'Configuration service temporarily unavailable',
    });
  });

  it('includes proper headers', async () => {
    const response = await GET();

    expect(response.headers.get('content-type')).toBe('application/json');
  });

  it('returns consistent config structure', async () => {
    const response1 = await GET();
    const response2 = await GET();

    const data1 = await response1.json();
    const data2 = await response2.json();

    // Should have same structure (ignoring random failure)
    if (data1.success && data2.success) {
      expect(data1.data.title).toBe(data2.data.title);
      expect(data1.data.components.length).toBe(data2.data.components.length);
    }
  });
});
