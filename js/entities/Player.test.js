import { describe, it, expect, beforeEach } from 'vitest';
import Player from './Player.js';
import { LANE_COUNT, LANE_WIDTH } from '../constants.js';

describe('Player', () => {
  let player;

  beforeEach(() => {
    player = new Player();
  });

  describe('constructor', () => {
    it('starts in center lane', () => {
      expect(player.lane).toBe(1);
    });

    it('has correct dimensions', () => {
      expect(player.width).toBe(60);
      expect(player.height).toBe(100);
    });

    it('starts at correct Y position', () => {
      expect(player.y).toBe(600 - 100 - 20);
    });
  });

  describe('moveLeft', () => {
    it('moves to left lane when in center', () => {
      player.moveLeft();

      expect(player.lane).toBe(0);
    });

    it('does not move when already in left lane', () => {
      player.lane = 0;
      player.moveLeft();

      expect(player.lane).toBe(0);
    });

    it('updates targetX position', () => {
      player.moveLeft();

      expect(player.targetX).toBe(0 * LANE_WIDTH + LANE_WIDTH / 2 - player.width / 2);
    });
  });

  describe('moveRight', () => {
    it('moves to right lane when in center', () => {
      player.moveRight();

      expect(player.lane).toBe(2);
    });

    it('does not move when already in right lane', () => {
      player.lane = 2;
      player.moveRight();

      expect(player.lane).toBe(2);
    });

    it('updates targetX position', () => {
      player.moveRight();

      expect(player.targetX).toBe(2 * LANE_WIDTH + LANE_WIDTH / 2 - player.width / 2);
    });
  });

  describe('update', () => {
    it('interpolates toward targetX', () => {
      player.moveRight();
      const startX = player.x;

      player.update();

      expect(player.x).not.toBe(startX);
      expect(Math.abs(player.x - player.targetX)).toBeLessThan(Math.abs(startX - player.targetX));
    });

    it('reaches targetX after multiple updates', () => {
      player.moveRight();

      for (let i = 0; i < 50; i++) {
        player.update();
      }

      expect(player.x).toBeCloseTo(player.targetX, 0.5);
    });
  });

  describe('reset', () => {
    it('resets to center lane', () => {
      player.lane = 2;
      player.moveRight();

      player.reset();

      expect(player.lane).toBe(1);
    });

    it('resets to starting position', () => {
      player.reset();

      expect(player.y).toBe(600 - 100 - 20);
    });
  });
});
