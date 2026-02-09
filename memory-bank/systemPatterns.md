# System Patterns: Crazy Car

## Game Architecture
```
┌─────────────────────────────────────┐
│         Game Loop (60fps)           │
│  ┌───────────────────────────────┐  │
│  │  1. Handle Input              │  │
│  │  2. Update Game State         │  │
│  │  3. Render to Canvas          │  │
│  │  4. Request Next Frame        │  │
│  └───────────────────────────────┘  │
└─────────────────────────────────────┘
```

## Key Components

### Game State Manager
- `gameState`: 'start' | 'playing' | 'gameover'
- Controls which screen is displayed
- Manages state transitions

### Player Controller
- Lane-based movement (3 lanes: left, center, right)
- Smooth lane transitions with animation
- Input handling (ArrowLeft/ArrowRight or A/D)

### Entity System
- **Player Car**: Fixed Y position, movable X position
- **Obstacles**: Spawn at top, move down, vary by lane
- **Coins**: Spawn randomly, move down, collectible
- **Road Lines**: Animated scrolling effect

### Collision Detection
- AABB (Axis-Aligned Bounding Box) collision
- Player vs Obstacle → Game Over
- Player vs Coin → Score +100

### Scoring System
- Base score: +1 per frame survived
- Bonus: +100 per coin collected
- Speed increase every 500 points
- High score saved to localStorage

## Rendering Pipeline
1. Clear canvas
2. Draw road background
3. Draw moving road lines
4. Draw coins (if any)
5. Draw obstacles
6. Draw player car
7. Draw UI overlay (score, game state screens)