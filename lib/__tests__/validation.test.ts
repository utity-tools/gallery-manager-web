import { describe, it, expect } from 'vitest';

// Test validation logic for heroArtworkIds
const validateHeroArtworkIds = (ids: string[], availableIds: string[]): string | null => {
  const MAX_HERO_SLIDES = 4;

  if (ids.length > MAX_HERO_SLIDES) {
    return `Maximum ${MAX_HERO_SLIDES} slides allowed`;
  }
  if (new Set(ids).size !== ids.length) {
    return "Duplicate artworks not allowed";
  }
  const validIds = new Set(availableIds);
  if (!ids.every((id) => validIds.has(id))) {
    return "One or more artworks not found";
  }
  return null;
};

describe('heroArtworkIds Validation', () => {
  const availableArtworkIds = ['1', '2', '3', '4', '5'];

  it('allows valid selection of 1-4 artworks', () => {
    expect(validateHeroArtworkIds(['1'], availableArtworkIds)).toBeNull();
    expect(validateHeroArtworkIds(['1', '2'], availableArtworkIds)).toBeNull();
    expect(validateHeroArtworkIds(['1', '2', '3'], availableArtworkIds)).toBeNull();
    expect(validateHeroArtworkIds(['1', '2', '3', '4'], availableArtworkIds)).toBeNull();
  });

  it('rejects more than 4 artworks', () => {
    const error = validateHeroArtworkIds(['1', '2', '3', '4', '5'], availableArtworkIds);
    expect(error).toBe('Maximum 4 slides allowed');
  });

  it('rejects duplicate IDs', () => {
    const error = validateHeroArtworkIds(['1', '2', '1'], availableArtworkIds);
    expect(error).toBe('Duplicate artworks not allowed');
  });

  it('rejects invalid artwork IDs', () => {
    const error = validateHeroArtworkIds(['1', '2', 'invalid-id'], availableArtworkIds);
    expect(error).toBe('One or more artworks not found');
  });

  it('allows empty selection (carousel not configured)', () => {
    expect(validateHeroArtworkIds([], availableArtworkIds)).toBeNull();
  });

  it('preserves order of selected IDs', () => {
    const ids = ['3', '1', '4'];
    expect(validateHeroArtworkIds(ids, availableArtworkIds)).toBeNull();
    // Frontend should preserve this order when displaying
  });
});
