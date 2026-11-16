import { describe, it, expect, vi } from 'vitest';
import { isValidId } from './isValidId.js';

describe('isValidId', () => {
  it('calls next with no error when the id is valid', () => {
    const middleware = isValidId('noteId');

    const req = { params: { noteId: '507f1f77bcf86cd799439011' } };
    const res = {};
    const next = vi.fn();

    middleware(req, res, next);

    expect(next).toHaveBeenCalledWith();
  });

  it('calls next with an error when the id is invalid', () => {
    const middleware = isValidId('noteId');

    const req = { params: { noteId: 'invalid-id' } };
    const res = {};
    const next = vi.fn();

    middleware(req, res, next);

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 400,
        message: 'Invalid noteId format',
      }),
    );
  });
});
