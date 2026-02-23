import { describe, it, expect } from 'vitest';
import ObjectPool from './ObjectPool.js';

describe('ObjectPool', () => {
  describe('constructor', () => {
    it('creates pool with specified initial size', () => {
      const createFn = () => ({ active: true });
      const pool = new ObjectPool(createFn, null, 5);

      expect(pool.getAll().length).toBe(0);
    });

    it('pre-allocates objects', () => {
      let createCount = 0;
      const createFn = () => {
        createCount++;
        return { active: true, id: createCount };
      };

      new ObjectPool(createFn, null, 10);

      expect(createCount).toBe(10);
    });
  });

  describe('acquire', () => {
    it('acquires object from pool and calls reset', () => {
      let resetCalled = false;
      const createFn = () => ({ active: true });
      const resetFn = (obj, x, y) => {
        resetCalled = true;
        obj.x = x;
        obj.y = y;
      };

      const pool = new ObjectPool(createFn, resetFn, 5);
      const obj = pool.acquire(10, 20);

      expect(resetCalled).toBe(true);
      expect(obj.x).toBe(10);
      expect(obj.y).toBe(20);
    });

    it('returns different objects on successive acquires', () => {
      const pool = new ObjectPool(() => ({}), null, 5);
      const obj1 = pool.acquire(0, 0);
      const obj2 = pool.acquire(0, 0);

      expect(obj1).not.toBe(obj2);
    });

    it('expands pool when exhausted', () => {
      const pool = new ObjectPool(() => ({}), null, 2);
      pool.acquire(0, 0);
      pool.acquire(0, 0);
      const obj3 = pool.acquire(0, 0);

      expect(obj3).toBeDefined();
    });
  });

  describe('release', () => {
    it('releases object back to pool', () => {
      const pool = new ObjectPool(() => ({ active: true }), (obj) => { obj.active = false; }, 5);
      const obj = pool.acquire(0, 0);

      pool.release(obj);

      expect(obj.active).toBe(false);
    });

    it('makes object available for reuse', () => {
      const pool = new ObjectPool(() => ({}), null, 1);
      const obj1 = pool.acquire(0, 0);
      pool.release(obj1);
      const obj2 = pool.acquire(0, 0);

      expect(obj1).toBe(obj2);
    });

    it('does not throw for undefined', () => {
      const pool = new ObjectPool(() => ({}), null, 5);
      expect(() => pool.release(undefined)).not.toThrow();
    });
  });

  describe('releaseAll', () => {
    it('releases all objects', () => {
      const pool = new ObjectPool(() => ({ active: true }), (obj) => { obj.active = false; }, 5);
      pool.acquire(0, 0);
      pool.acquire(0, 0);

      pool.releaseAll();

      expect(pool.getAll().length).toBe(0);
    });
  });

  describe('getAll', () => {
    it('returns only active objects', () => {
      const pool = new ObjectPool(() => ({ active: true }), null, 10);
      const obj1 = pool.acquire(0, 0);
      const obj2 = pool.acquire(0, 0);

      const all = pool.getAll();

      expect(all.length).toBe(2);
      expect(all).toContain(obj1);
      expect(all).toContain(obj2);
    });

    it('returns empty array when no objects acquired', () => {
      const pool = new ObjectPool(() => ({}), null, 5);

      expect(pool.getAll().length).toBe(0);
    });
  });
});
