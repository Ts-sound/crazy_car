import { describe, it, expect, beforeEach } from 'vitest';
import PowerUpManager from './PowerUpManager.js';

describe('PowerUpManager', () => {
  let manager;

  beforeEach(() => {
    manager = new PowerUpManager();
  });

  describe('activate', () => {
    it('activates duration power-up', () => {
      const result = manager.activate('SHIELD');

      expect(result.type).toBe('ACTIVATED');
      expect(result.powerUp).toBe('SHIELD');
      expect(manager.hasEffect('shield')).toBe(true);
    });

    it('returns INSTANT_LIFE for EXTRA_LIFE', () => {
      const result = manager.activate('EXTRA_LIFE');

      expect(result.type).toBe('INSTANT_LIFE');
      expect(result.data.amount).toBe(1);
    });

    it('extends duration when already active', () => {
      manager.activate('SHIELD');
      const active = manager.activePowerUps.find(p => p.type === 'SHIELD');
      const initialTimer = active.timer;

      manager.activate('SHIELD');
      const extended = manager.activePowerUps.find(p => p.type === 'SHIELD');

      expect(extended.timer).toBe(initialTimer);
    });
  });

  describe('update', () => {
    it('decrements timer each frame', () => {
      manager.activate('SHIELD');
      const initialTimer = manager.activePowerUps[0].timer;

      manager.update();

      expect(manager.activePowerUps[0].timer).toBe(initialTimer - 1);
    });

    it('removes expired power-ups', () => {
      manager.activate('SHIELD');
      // Set timer to expire
      manager.activePowerUps[0].timer = 1;

      manager.update();

      expect(manager.activePowerUps.length).toBe(0);
    });

    it('returns expired power-ups', () => {
      manager.activate('SHIELD');
      manager.activePowerUps[0].timer = 1;

      const expired = manager.update();

      expect(expired.length).toBe(1);
      expect(expired[0].type).toBe('SHIELD');
    });
  });

  describe('hasEffect', () => {
    it('returns true when effect is active', () => {
      manager.activate('SHIELD');

      expect(manager.hasEffect('shield')).toBe(true);
    });

    it('returns false when effect is not active', () => {
      expect(manager.hasEffect('shield')).toBe(false);
    });

    it('returns false after power-up expires', () => {
      manager.activate('SHIELD');
      manager.activePowerUps[0].timer = 1;
      manager.update();

      expect(manager.hasEffect('shield')).toBe(false);
    });
  });

  describe('getMultiplier', () => {
    it('returns 2 when doubleScore is active', () => {
      manager.activate('DOUBLE_SCORE');

      expect(manager.getMultiplier()).toBe(2);
    });

    it('returns 1 when no multiplier', () => {
      expect(manager.getMultiplier()).toBe(1);
    });
  });

  describe('getSpeedModifier', () => {
    it('returns 0.5 when slowMotion is active', () => {
      manager.activate('SLOW_MOTION');

      expect(manager.getSpeedModifier()).toBe(0.5);
    });

    it('returns 1 when no speed modifiers', () => {
      expect(manager.getSpeedModifier()).toBe(1);
    });
  });

  describe('getActiveList', () => {
    it('returns active power-ups with seconds', () => {
      manager.activate('SHIELD');

      const list = manager.getActiveList();

      expect(list.length).toBe(1);
      expect(list[0].type).toBe('SHIELD');
      expect(list[0].seconds).toBeDefined();
    });

    it('returns empty array when no power-ups', () => {
      expect(manager.getActiveList()).toEqual([]);
    });
  });

  describe('reset', () => {
    it('clears all power-ups', () => {
      manager.activate('SHIELD');
      manager.activate('SLOW_MOTION');

      manager.reset();

      expect(manager.activePowerUps.length).toBe(0);
    });
  });
});
