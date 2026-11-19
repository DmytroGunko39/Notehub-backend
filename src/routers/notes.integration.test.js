import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import request from 'supertest';
import { createApp } from '../server.js';

describe('GET /notes', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns 401 when no token is provided', async () => {
    const app = createApp();

    const response = await request(app).get('/notes');

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Access token required');
  });
});
