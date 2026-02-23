import { describe, it, expect } from 'vitest';
import Collision from './Collision.js';

describe('Collision', () => {
  describe('check', () => {
    it('detects collision when rectangles overlap', () => {
      const a = { x: 0, y: 0, width: 50, height: 50 };
      const b = { x: 25, y: 25, width: 50, height: 50 };

      expect(Collision.check(a, b)).toBe(true);
    });

    it('detects collision when one contains other', () => {
      const a = { x: 0, y: 0, width: 100, height: 100 };
      const b = { x: 25, y: 25, width: 25, height: 25 };

      expect(Collision.check(a, b)).toBe(true);
    });

    it('returns false when rectangles do not overlap', () => {
      const a = { x: 0, y: 0, width: 50, height: 50 };
      const b = { x: 100, y: 100, width: 50, height: 50 };

      expect(Collision.check(a, b)).toBe(false);
    });

    it('returns false when rectangles touch but do not overlap', () => {
      const a = { x: 0, y: 0, width: 50, height: 50 };
      const b = { x: 50, y: 0, width: 50, height: 50 };

      expect(Collision.check(a, b)).toBe(false);
    });

    it('returns false when b is to the left of a', () => {
      const a = { x: 50, y: 0, width: 50, height: 50 };
      const b = { x: 0, y: 0, width: 50, height: 50 };

      expect(Collision.check(a, b)).toBe(false);
    });

    it('returns false when b is above a', () => {
      const a = { x: 0, y: 50, width: 50, height: 50 };
      const b = { x: 0, y: 0, width: 50, height: 50 };

      expect(Collision.check(a, b)).toBe(false);
    });

    it('returns false when b is below a', () => {
      const a = { x: 0, y: 0, width: 50, height: 50 };
      const b = { x: 0, y: 50, width: 50, height: 50 };

      expect(Collision.check(a, b)).toBe(false);
    });
  });

  describe('checkWithBounds', () => {
    it('detects collision with bounds', () => {
      const entity = { x: 10, y: 10, width: 20, height: 20 };
      const bounds = { x: 0, y: 0, width: 50, height: 50 };

      expect(Collision.checkWithBounds(entity, bounds)).toBe(true);
    });

    it('returns false when entity outside bounds', () => {
      const entity = { x: 100, y: 100, width: 20, height: 20 };
      const bounds = { x: 0, y: 0, width: 50, height: 50 };

      expect(Collision.checkWithBounds(entity, bounds)).toBe(false);
    });
  });
});
