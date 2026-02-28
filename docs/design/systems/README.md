# Systems Module Design

## Overview

Systems module implements game mechanics: rendering, collision detection, spawning, and power-up management.

## Architecture

```mermaid
flowchart TB
    subgraph Rendering
        R1[Rendering]
    end
    
    subgraph Collision
        C1[Collision]
    end
    
    subgraph Spawning
        S1[SpawnManager]
    end
    
    subgraph PowerUps
        P1[PowerUpManager]
    end
```

## Components

### Rendering System

**Responsibility**: Draw all game elements to canvas

**Key Methods**:
- `clear()` - Clear canvas
- `drawRoad(levelConfig)` - Draw road with level theme
- `drawRoadLines(lines)` - Animate lane dividers
- `drawEntity(entity)` - Generic entity rendering
- `drawPlayer(player, effects)` - Player with power-up effects
- `drawUI(score, level, lives)` - HUD elements
- `drawActivePowerUps(list)` - Power-up progress bars
- `drawStartScreen()` - Start menu
- `drawGameOverScreen()` - Game over display
- `drawPauseScreen()` - Pause overlay

**Visual Effects**:
| Effect | Trigger | Visual |
|--------|---------|--------|
| Shield | Active | Blue glow circle |
| Speed Boost | Active | Orange trail |
| Magnet | Active | Green dashed circle |

### Collision System

**Responsibility**: AABB collision detection

**API**:
```javascript
Collision.check(a, b)  // Entity vs Entity
Collision.checkWithBounds(entity, bounds)  // Entity vs Bounds
```

**Algorithm**: Axis-Aligned Bounding Box (AABB)
```javascript
check(a, b) {
  return a.x < b.x + b.width &&
         a.x + a.width > b.x &&
         a.y < b.y + b.height &&
         a.y + a.height > b.y;
}
```

### SpawnManager

**Responsibility**: Manage entity spawning with fair distribution

**Key Features**:
- Object pooling for obstacles, coins, power-ups
- LaneSequence for fair lane distribution (Fisher-Yates)
- Speed-adjusted spawn intervals

**Spawn Rates**:
| Entity | Base Interval | Notes |
|--------|---------------|-------|
| Obstacle | 150 frames | Scales with difficulty |
| Coin | 100 frames | Constant |
| PowerUp | 120 frames | Every 2 seconds |

**Fair Lane Distribution**:
```mermaid
flowchart LR
    A[LaneSequence] --> B[Shuffle 0,1,2]
    B --> C[Get Next]
    C --> D{Index < 3?}
    D -->|Yes| C
    D -->|No| B
```

**Spawn Logic**:
```mermaid
flowchart TD
    A[update] --> B{obstacleTimer >= interval?}
    B -->|Yes| C[spawnObstacle]
    B -->|No| D{coinTimer >= interval?}
    D -->|Yes| E[spawnCoin]
    D -->|No| F{powerUpTimer >= interval?}
    F -->|Yes| G[spawnPowerUp]
    F -->|No| H[End]
    C --> H
    E --> H
    G --> H
```

### PowerUpManager

**Responsibility**: Track and apply active power-up effects

**Key Methods**:
- `activate(type)` - Activate power-up
- `update()` - Decrement timers
- `hasEffect(effect)` - Check if effect active
- `getMultiplier()` - Score multiplier (1x or 2x)
- `getSpeedModifier()` - Speed modifier (0.5x, 1.0x, 1.5x)
- `getActiveList()` - Get active power-ups for UI

**Effect Stacking**:
- Same type: Extends duration
- Different types: Stack multiplicatively
- Speed: `speedBoost (1.5x) * slowMotion (0.5x) = 0.75x`

## Interfaces

### Public API

```javascript
// Rendering
const rendering = new Rendering(canvas);
rendering.drawPlayer(player, effects);

// Collision
const hit = Collision.check(player, obstacle);

// SpawnManager
const spawnManager = new SpawnManager();
spawnManager.update(level, frameCount, speedMultiplier);

// PowerUpManager
const powerUpManager = new PowerUpManager();
powerUpManager.activate('SHIELD');
```

### Dependencies

- `entities/` - Entity classes for rendering
- `constants.js` - Configuration values
- `utils/shuffle.js` - Fair distribution

## Data Flow

```mermaid
sequenceDiagram
    participant G as Game
    participant S as SpawnManager
    participant P as PowerUpManager
    participant R as Rendering
    
    G->>S: update(level, frame, speed)
    S->>S: Spawn entities
    G->>P: update()
    P->>P: Decrement timers
    G->>R: render()
    R->>R: Draw all entities
```

---

**Related**: [System Overview](../README.md), [Entities Module](../entities/README.md)
