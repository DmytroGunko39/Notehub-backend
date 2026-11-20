import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import { createApp } from '../server.js';
import UsersCollection from '../db/models/user.js';
import { setupTestDb } from '../tests/setupTestDb.js';

describe('POST /auth/register', () => {
  setupTestDb();

  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  // Test for successful user registration
  it('creates a user and never returns the password', async () => {
    const app = createApp();

    const response = await request(app)
      .post('/auth/register')
      .send({ email: 'dima@example.com', password: 'secret123' });

    expect(response.status).toBe(201);
    expect(response.body.data.email).toBe('dima@example.com');
    expect(response.body.data.password).toBeUndefined();

    const userInDb = await UsersCollection.findOne({
      email: 'dima@example.com',
    });

    expect(userInDb).not.toBeNull();
    expect(userInDb.password).not.toBe('secret123');
  });

  // Test for duplicate email registration
  it('rejects a duplicate email', async () => {
    const app = createApp();

    await request(app)
      .post('/auth/register')
      .send({ email: 'dima@example.com', password: 'secret123' });

    const response = await request(app)
      .post('/auth/register')
      .send({ email: 'dima@example.com', password: 'secret123' });

    expect(response.status).toBe(409);
    expect(response.body.message).toBe('Email already in use');
  });
});
