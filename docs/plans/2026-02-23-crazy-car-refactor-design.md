# Crazy Car Refactor Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Refactor single-file Crazy Car game into modular architecture with OOP patterns, object pooling, and touch controls.

**Architecture:** Module-based structure with core systems (Game, Input, EventBus), entity components (Player, Obstacle, Coin, PowerUp), and system managers (Rendering, Collision, Spawn, PowerUp).

**Tech Stack:** HTML5 Canvas, ES6+ JavaScript (modules/classes), CSS3

**Date**: 2026-02-23  
**Status**: Approved  
**Author**: AI Assistant

---

## Overview

Refactor the single-file Crazy Car game into a modular, object-oriented architecture with improved maintainability, performance, and extensibility.

## Goals

1. Split monolithic `index.html` into organized module structure
2. Introduce object-oriented design patterns
3. Implement object pooling for performance
4. Add event bus for loose coupling
5. Support mobile touch controls
6. Maintain backward compatibility with existing gameplay

## Architecture

### Module Structure

```
crazy_car/
├── index.html          # HTML structure + canvas
├── style.css           # All styles
├── js/
│   ├── main.js         # Entry point
│   ├── constants.js    # Game constants
│   ├── core/
│   │   ├── Game.js     # Game loop & state machine
│   │   ├── Input.js    # Keyboard & touch input
│   │   └── EventBus.js # Event system
│   ├── entities/
│   │   ├── Entity.js   # Base class
│   │   ├── Player.js
│   │   ├── Obstacle.js
│   │   ├── Coin.js
│   │   └── PowerUp.js
│   ├── systems/
│   │   ├── Rendering.js
│   │   ├── Collision.js
│   │   ├── SpawnManager.js
│   │   └── PowerUpManager.js
│   └── utils/
│       └── ObjectPool.js
└── docs/plans/
```

### Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│                     Game Loop                           │
│  ┌─────────────┐  ┌─────────────┐  ┌───────────────┐   │
│  │ Input.js    │→ │ Game.js     │→ │ Rendering.js  │   │
│  └─────────────┘  └──────┬──────┘  └───────────────┘   │
│                          │                               │
│  ┌───────────────────────┼───────────────────────────┐   │
│  │         EventBus.js (Publish/Subscribe)            │   │
│  └───────────────────────┼───────────────────────────┘   │
│                          │                               │
│  ┌─────────────┐  ┌──────┴──────┐  ┌───────────────┐   │
│  │SpawnManager │  │Collision.js │  │PowerUpManager │   │
│  └─────────────┘  └─────────────┘  └───────────────┘   │
│                          │                               │
│  ┌───────────────────────┼───────────────────────────┐   │
│  │         Entity Components                           │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

## Core Classes

### Game Class
- Manages game state: 'start' | 'playing' | 'paused' | 'gameover' | 'levelUp'
- Controls main loop (60fps via requestAnimationFrame)
- Handles score, level, lives management
- Coordinates all systems

### Entity Base Class
```javascript
class Entity {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.active = true;
  }
  update(deltaTime) {}
  draw(ctx) {}
  reset(x, y) {} // For object pool reuse
}
```

### Player Class
- Extends Entity
- Lane-based movement (0, 1, 2)
- Smooth interpolation to target lane
- Input handling via EventBus

### Obstacle Class
- Extends Entity
- Random color assignment
- Movement down screen

### Coin Class
- Extends Entity
- Collection detection
- Point value

### PowerUp Class
- Extends Entity
- Types: Shield, SpeedBoost, SlowMotion, Magnet, DoubleScore, ExtraLife
- Duration and effect properties

### ObjectPool<T> Class
- Generic pool implementation
- Pre-allocate entities
- acquire() / release() methods
- Auto-expand when needed

### EventBus Class
- Static event hub
- subscribe(event, callback)
- publish(event, data)
- unsubscribe(event, callback)

## System Components

### Rendering.js
- `drawRoad(level)` - Road with level theme
- `drawEntity(entity)` - Generic entity rendering
- `drawUI(score, level, lives)` - HUD elements
- `drawScreen(state)` - Start/Game Over/Pause screens

### Collision.js
- AABB collision detection
- `check(entity1, entity2)` - Returns boolean
- Optimized with spatial partitioning (future)

### SpawnManager.js
- Controls obstacle/coin/powerup spawning
- Difficulty scaling with level
- Configurable spawn rates

### PowerUpManager.js
- Active powerup tracking
- Timer management
- Effect application/removal

## Data Flow

```
User Input → Input Handler → EventBus.publish('INPUT_LEFT')
                                              ↓
                              Player (subscribed) → Update Position
                                              ↓
Game Loop → update() → Collision.check() → EventBus.publish('COLLISION')
                                              ↓
                              Game (subscribed) → Handle collision
                                              ↓
                              Rendering.draw() → Canvas
```

## Error Handling

1. **Input Validation**
   - Boundary checks for lane changes
   - Touch coordinate validation

2. **Entity Management**
   - Object pool returns null → create new instance
   - Entity out of bounds → auto-release

3. **Storage Fallback**
   - localStorage unavailable → in-memory storage
   - Graceful degradation

## Testing Strategy

### Unit Tests
- Collision detection accuracy
- Object pool acquire/release cycle
- PowerUp effect application
- Score calculation with multipliers

### Integration Tests
- Full game flow: start → playing → gameover
- Level progression
- Powerup chain activation

### Manual Testing
- Keyboard controls (← → A D SPACE)
- Touch controls (mobile)
- Browser compatibility

## Migration Plan

1. Create new module structure
2. Implement core systems (Game, EventBus, Input)
3. Migrate entities one at a time
4. Implement object pooling
5. Add touch controls
6. Test and iterate

## Success Criteria

- [ ] All existing gameplay features preserved
- [ ] Code organized into logical modules
- [ ] Performance maintained at 60fps
- [ ] Touch controls functional
- [ ] No breaking changes to user experience

## Appendix: Constants Migration

From inline values to `constants.js`:

```javascript
// Lane configuration
export const LANE_COUNT = 3;
export const LANE_WIDTH = 400 / LANE_COUNT;

// Entity dimensions
export const PLAYER_WIDTH = 60;
export const PLAYER_HEIGHT = 100;
export const OBSTACLE_WIDTH = 60;
export const OBSTACLE_HEIGHT = 100;
export const COIN_SIZE = 30;
export const POWERUP_SIZE = 35;

// Level thresholds
export const LEVELS = { ... };

// Power-up definitions
export const POWERUP_TYPES = { ... };
```
