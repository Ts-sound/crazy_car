# Crazy Car 🚗

A fun and exciting HTML5 browser-based driving game with multiple levels, power-ups, and strategic gameplay!

## 🎮 Game Overview

Crazy Car is a fast-paced arcade driving game where you navigate through traffic, collect power-ups, and progress through increasingly challenging levels. Test your reflexes and strategic thinking as you dodge obstacles and maximize your score!

## ✨ Features

### 🎯 3-Level Progression System
- **Level 1: Beginner** (0-1000 points)
    - Gray asphalt road
    - Base speed with moderate obstacle frequency
    - Perfect for learning the basics

- **Level 2: Intermediate** (1000-3000 points)
    - Desert-themed sandy road
    - 20% faster gameplay
    - Increased obstacle density
    - Level-up animation

- **Level 3: Expert** (3000+ points)
    - Neon purple road with glowing effects
    - 40% faster gameplay
    - Maximum obstacle density
    - Ultimate challenge for skilled players

### ⚡ 5 Power-Ups

| Power-Up | Effect | Duration |
|----------|--------|----------|
| 🛡️ **Shield** | Invincibility - pass through obstacles safely | 5 seconds |
| ⏰ **Slow Motion** | Obstacles move 50% slower | 5 seconds |
| 🧲 **Magnet** | Attracts nearby coins | 5 seconds |
| 2x **Double Score** | All points doubled | 8 seconds |
| ❤️ **Extra Life** | Adds one life instantly | Instant |

### ❤️ Lives System
- Start with 3 lives
- Collision with obstacle = lose 1 life
- Collect Extra Life power-ups to gain more lives
- Game over when lives reach 0

### 🎨 Visual Features
- Dynamic road themes per level
- Active power-up display with progress bars and countdown timers
- Level-up transition animations
- Visual effects for active power-ups:
    - Shield: Blue glowing circle around car
    - Speed Boost: Orange trail behind car
    - Magnet: Green dashed circle showing attraction range
- Smooth 60fps gameplay

## 🕹️ How to Play

### Controls
- **← → Arrow Keys** or **A/D** - Move between lanes
- **SPACE** or **ENTER** - Start game / Restart / Pause toggle
- **P** or **ESC** - Pause / Resume

### Gameplay
1. Press SPACE or ENTER to start
2. Use arrow keys to dodge oncoming cars
3. Collect coins for bonus points (+100 each)
4. Grab power-ups for strategic advantages
5. Survive as long as possible to increase your score
6. Reach score thresholds to advance to higher levels
7. Beat your high score!

### Scoring
- **+1 point** per frame survived
- **+10 points** for each obstacle avoided
- **+100 points** for each coin collected
- Score multiplier applies when Double Score is active

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- No installation required!

### Running the Game

**Option 1: Use pre-built single file**

```bash
# Open the built single-file version
open dist/index.html  # macOS
start dist/index.html # Windows
xdg-open dist/index.html # Linux
```

**Option 2: Build yourself**

```bash
# Install dependencies
npm install

# Build single HTML file
npm run build

# Open dist/index.html in browser
```

**Option 3: Development mode**

```bash
npm run dev      # Start dev server with hot reload
npm run test     # Run unit tests
```

## 📊 Game Mechanics

### Level Progression
- Levels automatically unlock when you reach score thresholds
- Each level has unique visual theme and increased difficulty
- Level-up screen displays when advancing

### Power-Up Strategy
- **Shield**: Use when surrounded by obstacles or in tight spots
- **Slow Motion**: Perfect for dodging dense traffic
- **Magnet**: Combine with Double Score for massive coin collection
- **Double Score**: Activate when approaching many coins or obstacles
- **Extra Life**: Collect whenever available for safety net

### Obstacle Patterns
- Obstacles spawn randomly across 3 lanes
- Spawn rate increases with level progression
- Obstacles move faster in higher levels
- Use power-ups strategically to navigate difficult patterns

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests once
npm run test:run
```

Unit tests cover:
- EventBus (publish/subscribe)
- ObjectPool (acquire/release)
- Collision detection (AABB)
- PowerUpManager (effects, timers)
- Player movement
- Entity base class

- **Language**: HTML5, CSS3, JavaScript (ES6+)
- **Rendering**: HTML5 Canvas API
- **Performance**: 60fps game loop using requestAnimationFrame
- **Storage**: localStorage for high score persistence
- **Dependencies**: None (standalone HTML file)

### Game Architecture

```bash
Game Loop (60fps)
├── Input Handling
├── State Update
│   ├── Player Movement
│   ├── Obstacle Spawning & Movement
│   ├── Power-Up Spawning & Effects
│   ├── Collision Detection
│   └── Level Progression
└── Rendering
    ├── Road & Environment
    ├── Player & Vehicles
    ├── Power-Ups & Effects
    └── UI Overlay
```

## 📁 Project Structure

```
crazy_car/
├── src/                    # Source code
│   ├── core/              # Core systems (Game, Input, EventBus)
│   ├── entities/          # Game entities (Player, Enemy, Coin, etc.)
│   ├── systems/           # Game systems (Rendering, Collision, etc.)
│   ├── utils/             # Utilities (ObjectPool)
│   ├── constants.js       # Game configuration
│   ├── main.js            # Entry point
│   ├── index.html         # HTML file
│   └── style.css          # Styles
├── tests/                  # Unit tests
├── config/                 # Build configuration
│   ├── vite.config.js
│   └── vitest.config.js
├── scripts/                # Automation scripts
│   ├── build.sh           # Build project
│   ├── test.sh            # Run tests
│   └── release.sh         # Create release
├── docs/                   # Documentation
│   ├── plans/             # Design documents
│   └── sessions/          # Session notes
├── memory-bank/            # Project context
├── dist/                   # Build output
├── .editorconfig           # Code style
├── CHANGELOG.md            # Version history
├── package.json
└── README.md
```

## 🛠️ Development

### Setup

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Run tests
npm run test

# Build for production
npm run build
```

### Scripts

```bash
./scripts/build.sh      # Build single HTML file
./scripts/test.sh       # Run all tests
./scripts/release.sh v1.0.1  # Create new release
```

## 🚀 CI/CD

GitHub Actions automatically builds and creates releases on tagged commits:

```bash
# Create a release
git tag v1.0.0
git push origin v1.0.0

# Triggers: tests → build → GitHub Release with dist/index.html
```

## 📄 License

This project is open source and available under the terms of the LICENSE file.

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest new features
- Submit pull requests
- Improve documentation

## 🎮 Enjoy the Game!

Have fun playing Crazy Car! Try to beat your high score and reach the Expert level! 🏆

---

**Version**: 1.0.0  
**Last Updated**: 2026-02-27  
**Status**: ✅ Complete and Fully Functional  
**Tests**: ✅ 67 passing