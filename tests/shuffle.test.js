import { describe, it, expect } from 'vitest';
import { shuffle, LaneSequence, weightedPick } from '../src/utils/shuffle.js';

describe('shuffle', () => {
  it('returns array of same length', () => {
    const arr = [1, 2, 3, 4, 5];
    const result = shuffle([...arr]);
    expect(result.length).toBe(5);
  });

  it('contains same elements', () => {
    const arr = [1, 2, 3, 4, 5];
    const result = shuffle([...arr]);
    expect(result.sort()).toEqual(arr);
  });

  it('shuffles differently', () => {
    const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const result = shuffle([...arr]);
    // Very unlikely to be same order
    expect(result).not.toEqual(arr);
  });

  it('handles empty array', () => {
    const result = shuffle([]);
    expect(result).toEqual([]);
  });

  it('handles single element', () => {
    const result = shuffle([42]);
    expect(result).toEqual([42]);
  });
});

describe('LaneSequence', () => {
  it('returns all lanes before repeating', () => {
    const seq = new LaneSequence(3);
    const lanes = [];
    
    for (let i = 0; i < 3; i++) {
      lanes.push(seq.getNext());
    }
    
    // All 3 lanes should appear exactly once
    expect(lanes.sort()).toEqual([0, 1, 2]);
  });

  it('reshuffles after complete cycle', () => {
    const seq = new LaneSequence(3);
    const cycle1 = [seq.getNext(), seq.getNext(), seq.getNext()];
    const cycle2 = [seq.getNext(), seq.getNext(), seq.getNext()];
    
    // Each cycle should have all lanes
    expect(cycle1.sort()).toEqual([0, 1, 2]);
    expect(cycle2.sort()).toEqual([0, 1, 2]);
  });

  it('works with different lane counts', () => {
    const seq = new LaneSequence(5);
    const lanes = [];
    
    for (let i = 0; i < 5; i++) {
      lanes.push(seq.getNext());
    }
    
    expect(lanes.sort()).toEqual([0, 1, 2, 3, 4]);
  });

  it('reset shuffles sequence', () => {
    const seq = new LaneSequence(3);
    const before = [seq.getNext(), seq.getNext(), seq.getNext()];
    seq.reset();
    const after = [seq.getNext(), seq.getNext(), seq.getNext()];
    
    expect(before.sort()).toEqual([0, 1, 2]);
    expect(after.sort()).toEqual([0, 1, 2]);
  });
});

describe('weightedPick', () => {
  it('picks from items array', () => {
    const items = ['A', 'B', 'C'];
    const weights = [10, 10, 10];
    const result = weightedPick(items, weights);
    expect(items).toContain(result);
  });

  it('returns same item with single choice', () => {
    const items = ['only'];
    const weights = [100];
    const result = weightedPick(items, weights);
    expect(result).toBe('only');
  });

  it('respects weights over many trials', () => {
    const items = ['A', 'B'];
    const weights = [90, 10];  // 90% A, 10% B
    const picks = [];
    
    for (let i = 0; i < 1000; i++) {
      picks.push(weightedPick(items, weights));
    }
    
    const countA = picks.filter(p => p === 'A').length;
    const countB = picks.filter(p => p === 'B').length;
    
    // Should be approximately 90% A, 10% B
    expect(countA).toBeGreaterThan(800);
    expect(countA).toBeLessThan(980);
    expect(countB).toBeGreaterThan(20);
    expect(countB).toBeLessThan(200);
  });

  it('handles power-up weights correctly', () => {
    const types = ['EXTRA_LIFE', 'SHIELD', 'SLOW_MOTION', 'MAGNET', 'DOUBLE_SCORE'];
    const weights = [8, 22, 22, 22, 26];
    const picks = [];
    
    for (let i = 0; i < 1000; i++) {
      picks.push(weightedPick(types, weights));
    }
    
    const counts = {};
    types.forEach(t => counts[t] = picks.filter(p => p === t).length);
    
    // Expected ranges (with some tolerance)
    expect(counts.EXTRA_LIFE).toBeGreaterThan(40);   // ~8% = 80
    expect(counts.EXTRA_LIFE).toBeLessThan(130);
    
    expect(counts.SHIELD).toBeGreaterThan(150);      // ~22% = 220
    expect(counts.SHIELD).toBeLessThan(290);
    
    expect(counts.DOUBLE_SCORE).toBeGreaterThan(190); // ~26% = 260
    expect(counts.DOUBLE_SCORE).toBeLessThan(330);
  });
});
