import { describe, it, expect } from 'vitest';
import Entity from './Entity.js';

describe('Entity', () => {
  describe('constructor', () => {
    it('creates entity with position and size', () => {
      const entity = new Entity(10, 20, 30, 40);

      expect(entity.x).toBe(10);
      expect(entity.y).toBe(20);
      expect(entity.width).toBe(30);
      expect(entity.height).toBe(40);
    });

    it('starts active', () => {
      const entity = new Entity(0, 0, 10, 10);

      expect(entity.active).toBe(true);
    });

    it('has poolId of -1 by default', () => {
      const entity = new Entity(0, 0, 10, 10);

      expect(entity.poolId).toBe(-1);
    });
  });

  describe('reset', () => {
    it('sets new position and activates entity', () => {
      const entity = new Entity(0, 0, 10, 10);
      entity.active = false;

      entity.reset(100, 200);

      expect(entity.x).toBe(100);
      expect(entity.y).toBe(200);
      expect(entity.active).toBe(true);
    });
  });

  describe('isOffScreen', () => {
    it('returns true when below screen', () => {
      const entity = new Entity(0, 700, 10, 10);

      expect(entity.isOffScreen(600)).toBe(true);
    });

    it('returns false when on screen', () => {
      const entity = new Entity(0, 100, 10, 10);

      expect(entity.isOffScreen(600)).toBe(false);
    });
  });

  describe('getBounds', () => {
    it('returns bounding box', () => {
      const entity = new Entity(10, 20, 30, 40);

      const bounds = entity.getBounds();

      expect(bounds).toEqual({ x: 10, y: 20, width: 30, height: 40 });
    });
  });

  describe('update and draw', () => {
    it('has empty update method', () => {
      const entity = new Entity(0, 0, 10, 10);

      expect(() => entity.update(16)).not.toThrow();
    });

    it('has empty draw method', () => {
      const entity = new Entity(0, 0, 10, 10);
      const ctx = { fillRect: () => {} };

      expect(() => entity.draw(ctx)).not.toThrow();
    });
  });
});
