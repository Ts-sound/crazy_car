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

### ⚡ 6 Power-Ups

| Power-Up | Effect | Duration |
|----------|--------|----------|
| 🛡️ **Shield** | Invincibility - pass through obstacles safely | 5 seconds |
| ⚡ **Speed Boost** | 50% faster scoring | 5 seconds |
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
- **SPACE** or **ENTER** - Start game / Restart

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

Simply open `index.html` in your web browser:

```bash
# Option 1: Double-click index.html
# Option 2: Use open command
open index.html  # macOS
start index.html # Windows
xdg-open index.html # Linux

# Option 3: Use a local server (optional)
python -m http.server 8000
# Then navigate to http://localhost:8000
```

## 📊 Game Mechanics

### Level Progression
- Levels automatically unlock when you reach score thresholds
- Each level has unique visual theme and increased difficulty
- Level-up screen displays when advancing

### Power-Up Strategy
- **Shield**: Use when surrounded by obstacles or in tight spots
- **Speed Boost**: Activate during clear roads for maximum scoring
- **Slow Motion**: Perfect for dodging密集 traffic
- **Magnet**: Combine with Double Score for massive coin collection
- **Double Score**: Activate when approaching many coins or obstacles
- **Extra Life**: Collect whenever available for safety net

### Obstacle Patterns
- Obstacles spawn randomly across 3 lanes
- Spawn rate increases with level progression
- Obstacles move faster in higher levels
- Use power-ups strategically to navigate difficult patterns

## 🛠️ Technical Details

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

## 📝 Development

## 📁 Project Structure

```
crazy_car/
├── index.html          # HTML structure
├── style.css           # Styles
├── js/
│   ├── main.js         # Entry point
│   ├── constants.js    # Game configuration
│   ├── core/
│   │   ├── Game.js     # Game controller
│   │   ├── Input.js    # Input handling
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
└── memory-bank/        # Project documentation
```

### Customization
- Modify `LEVELS` object to adjust level thresholds and themes
- Edit `POWERUP_TYPES` to change power-up effects and durations
- Adjust game speed and spawn rates in the update function
- Customize colors and visual effects in drawing functions

## 🎯 Tips for High Scores

1. **Prioritize survival** - Don't take unnecessary risks
2. **Use power-ups strategically** - Save them for difficult moments
3. **Combine power-ups** - Magnet + Double Score = massive points
4. **Learn patterns** - Obstacle spawn patterns become predictable
5. **Stay centered** - Middle lane offers most flexibility
6. **Watch for power-ups** - They spawn regularly, collect them

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

**Version**: 1.0  
**Last Updated**: 2024  
**Status**: ✅ Complete and Fully Functional