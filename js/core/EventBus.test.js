import { describe, it, expect, beforeEach } from 'vitest';
import eventBus from './EventBus.js';

describe('EventBus', () => {
  beforeEach(() => {
    eventBus.clear();
  });

  describe('subscribe', () => {
    it('subscribes to an event', () => {
      const callback = () => {};
      eventBus.subscribe('TEST_EVENT', callback);

      // Verify subscription by publishing
      let called = false;
      eventBus.subscribe('TEST_EVENT', () => {
        called = true;
      });
      eventBus.publish('TEST_EVENT');

      expect(called).toBe(true);
    });

    it('returns unsubscribe function', () => {
      let called = false;
      const callback = () => { called = true; };
      const unsubscribe = eventBus.subscribe('TEST_EVENT', callback);

      unsubscribe();
      eventBus.publish('TEST_EVENT');

      expect(called).toBe(false);
    });
  });

  describe('publish', () => {
    it('calls all subscribed callbacks', () => {
      let callCount = 0;
      eventBus.subscribe('TEST_EVENT', () => callCount++);
      eventBus.subscribe('TEST_EVENT', () => callCount++);

      eventBus.publish('TEST_EVENT');

      expect(callCount).toBe(2);
    });

    it('passes data to callbacks', () => {
      let receivedData = null;
      eventBus.subscribe('TEST_EVENT', (data) => {
        receivedData = data;
      });

      eventBus.publish('TEST_EVENT', { value: 42 });

      expect(receivedData).toEqual({ value: 42 });
    });

    it('does not throw when no subscribers', () => {
      expect(() => eventBus.publish('NON_EXISTENT_EVENT')).not.toThrow();
    });
  });

  describe('unsubscribe', () => {
    it('removes specific callback', () => {
      let callCount = 0;
      const callback1 = () => callCount++;
      const callback2 = () => callCount++;

      eventBus.subscribe('TEST_EVENT', callback1);
      eventBus.subscribe('TEST_EVENT', callback2);

      eventBus.unsubscribe('TEST_EVENT', callback1);
      eventBus.publish('TEST_EVENT');

      expect(callCount).toBe(1);
    });

    it('does not throw for non-existent event', () => {
      expect(() => eventBus.unsubscribe('NON_EXISTENT', () => {})).not.toThrow();
    });
  });

  describe('clear', () => {
    it('clears specific event', () => {
      let called = false;
      eventBus.subscribe('TEST_EVENT', () => { called = true; });
      eventBus.subscribe('OTHER_EVENT', () => {});

      eventBus.clear('TEST_EVENT');
      eventBus.publish('TEST_EVENT');

      expect(called).toBe(false);
    });

    it('clears all events when no argument', () => {
      let callCount = 0;
      eventBus.subscribe('EVENT_1', () => callCount++);
      eventBus.subscribe('EVENT_2', () => callCount++);

      eventBus.clear();
      eventBus.publish('EVENT_1');
      eventBus.publish('EVENT_2');

      expect(callCount).toBe(0);
    });
  });
});
