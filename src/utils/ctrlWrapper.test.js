import { describe, it, expect, vi } from 'vitest';
import { ctrlWrapper } from './ctrlWrapper.js';

describe('ctrlWrapper', () => {
  it('does not call next when the controller succeeds', async () => {
    const controller = vi.fn(async () => {});
    const wrapped = ctrlWrapper(controller);

    const req = {};
    const res = {};
    const next = vi.fn();

    await wrapped(req, res, next);

    expect(controller).toHaveBeenCalledTimes(1);
    expect(next).not.toHaveBeenCalled();
  });

  it('calls next when the controller fails', async () => {
    const theError = new Error('Something broke');
    const controller = vi.fn(async () => {
      throw theError;
    });
    const wrapped = ctrlWrapper(controller);

    const req = {};
    const res = {};
    const next = vi.fn();

    await wrapped(req, res, next);

    expect(controller).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalled(theError);
  });
});
