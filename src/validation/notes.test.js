import { describe, it, expect } from 'vitest';
import { createNoteSchema } from './notes.js';

describe('createNoteSchema', () => {
  it('accepts a valid note', () => {
    const { error } = createNoteSchema.validate({
      title: 'Shopping list',
      content: 'Milk, bread, coffee',
    });
    expect(error).toBeUndefined();
  });

  it('rejects a note with an empty title', () => {
    const { error } = createNoteSchema.validate({
      title: '',
      content: 'Milk, bread, coffee',
    });
    expect(error).toBeDefined();
  });

  it('rejects a note with a title longer than 50 characters', () => {
    const longTitle = 'a'.repeat(51);
    const { error } = createNoteSchema.validate({
      title: longTitle,
      content: 'Milk, bread, coffee',
    });
    expect(error).toBeDefined();
  });

  it('rejects a note with an empty content', () => {
    const { error } = createNoteSchema.validate({
      title: 'Shopping list',
      content: '',
    });
    expect(error).toBeDefined();
  });

  it('accepts a note with a tag', () => {
    const { error } = createNoteSchema.validate({
      title: 'Shopping list',
      content: 'Milk, bread, coffee',
      tag: 'groceries',
    });
    expect(error).toBeUndefined();
  });
});
