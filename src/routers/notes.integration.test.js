import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import { createApp } from '../server.js';
import { setupTestDb } from '../tests/setupTestDb.js';
import NotesCollection from '../db/models/note.js';
import { registerAndLogin } from '../tests/helpers.js';

//!
describe('GET /notes', () => {
  setupTestDb();

  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('returns 401 when no token is provided', async () => {
    const app = createApp();

    const response = await request(app).get('/notes');

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Access token required');
  });
});

//!
describe('PATCH /notes/:noteId', () => {
  setupTestDb();

  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('does not let a user edit a note owned by someone else', async () => {
    const app = createApp();

    const tokenA = await registerAndLogin(app, 'a@example.com');
    const tokenB = await registerAndLogin(app, 'b@example.com');

    const created = await request(app)
      .post('/notes')
      .set('Authorization', `Bearer ${tokenA}`)
      .send({ title: 'Private note', content: 'Only for A' });

    const noteId = created.body.data._id;

    const response = await request(app)
      .patch(`/notes/${noteId}`)
      .set('Authorization', `Bearer ${tokenB}`)
      .send({ title: 'Hacked' });

    expect(response.status).toBe(404);

    const noteInDb = await NotesCollection.findById(noteId);

    expect(noteInDb.title).toBe('Private note');
  });
});
