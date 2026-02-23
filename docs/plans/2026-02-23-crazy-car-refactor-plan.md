# Crazy Car Refactor Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Refactor single-file Crazy Car game into modular architecture with OOP patterns, object pooling, and touch controls.

**Architecture:** Module-based structure with core systems (Game, Input, EventBus), entity components (Player, Obstacle, Coin, PowerUp), and system managers (Rendering, Collision, Spawn, PowerUp).

**Tech Stack:** HTML5 Canvas, ES6+ JavaScript (modules/classes), CSS3

---

## Phase 1: Project Setup

### Task 1: Create Directory Structure

**Files:**
- Create: `js/core/`
- Create: `js/entities/`
- Create: `js/systems/`
- Create: `js/utils/`

**Steps:**

```bash
mkdir -p js/core js/entities js/systems js/utils
git add js/
git commit -m "chore: create module directory structure"
```

Expected: Empty directories created

---

### Task 2: Create Constants Module

**Files:**
- Create: `js/constants.js`

**Step 1: Write constants module**

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

// Level configurations
export const LEVELS = {
    1: { name: 'Beginner', threshold: 0, speedMultiplier: 1.0, roadColor: '#333', lineColor: '#fff' },
    2: { name: 'Intermediate', threshold: 1000, speedMultiplier: 1.2, roadColor: '#d4a574', lineColor: '#8b7355' },
    3: { name: 'Expert', threshold: 3000, speedMultiplier: 1.4, roadColor: '#2d1b4e', lineColor: '#9b59b6' }
};

// Power-up types
export const POWERUP_TYPES = {
    SHIELD: { name: 'Shield', emoji: '🛡️', color: '#3498db', duration: 300, effect: 'shield' },
    SPEED_BOOST: { name: 'Speed Boost', emoji: '⚡', color: '#e67e22', duration: 300, effect: 'speedBoost' },
    SLOW_MOTION: { name: 'Slow Motion', emoji: '⏰', color: '#9b59b6', duration: 300, effect: 'slowMotion' },
    MAGNET: { name: 'Magnet', emoji: '🧲', color: '#2ecc71', duration: 300, effect: 'magnet' },
    DOUBLE_SCORE: { name: 'Double Score', emoji: '2x', color: '#f1c40f', duration: 480, effect: 'doubleScore' },
    EXTRA_LIFE: { name: 'Extra Life', emoji: '❤️', color: '#e74c3c', duration: 0, effect: 'extraLife' }
};

// Game constants
export const CANVAS_WIDTH = 400;
export const CANVAS_HEIGHT = 600;
export const INITIAL_LIVES = 3;
export const BASE_GAME_SPEED = 5;
```

**Step 2: Commit**

```bash
git add js/constants.js
git commit -m "feat: create constants module with game configuration"
```

---

### Task 3: Create EventBus Utility

**Files:**
- Create: `js/core/EventBus.js`

**Step 1: Write EventBus class**

```javascript
class EventBus {
    constructor() {
        this.events = {};
    }

    subscribe(event, callback) {
        if (!this.events[event]) {
            this.events[event] = [];
        }
        this.events[event].push(callback);
        return () => this.unsubscribe(event, callback);
    }

    unsubscribe(event, callback) {
        if (!this.events[event]) return;
        this.events[event] = this.events[event].filter(cb => cb !== callback);
    }

    publish(event, data) {
        if (!this.events[event]) return;
        this.events[event].forEach(callback => callback(data));
    }

    clear(event) {
        if (event) {
            this.events[event] = [];
        } else {
            this.events = {};
        }
    }
}

export const eventBus = new EventBus();
export default eventBus;
```

**Step 2: Commit**

```bash
git add js/core/EventBus.js
git commit -m "feat: create EventBus for decoupled communication"
```

---

### Task 4: Create ObjectPool Utility

**Files:**
- Create: `js/utils/ObjectPool.js`

**Step 1: Write ObjectPool class**

```javascript
class ObjectPool {
    constructor(createFn, resetFn, initialSize = 10) {
        this.createFn = createFn;
        this.resetFn = resetFn;
        this.pool = [];
        this.available = [];

        // Pre-allocate
        for (let i = 0; i < initialSize; i++) {
            const obj = createFn();
            obj.poolId = i;
            this.pool.push(obj);
            this.available.push(true);
        }
    }

    acquire(x, y) {
        const index = this.available.findIndex(a => a);
        if (index === -1) {
            // Pool exhausted, expand
            const obj = this.createFn();
            obj.poolId = this.pool.length;
            this.pool.push(obj);
            this.available.push(false);
            if (this.resetFn) this.resetFn(obj, x, y);
            return obj;
        }

        this.available[index] = false;
        const obj = this.pool[index];
        if (this.resetFn) this.resetFn(obj, x, y);
        return obj;
    }

    release(obj) {
        if (obj && obj.poolId !== undefined) {
            this.available[obj.poolId] = true;
            obj.active = false;
        }
    }

    releaseAll() {
        this.available.fill(true);
        this.pool.forEach(obj => obj.active = false);
    }

    getAll() {
        return this.pool.filter((_, i) => !this.available[i]);
    }
}

export default ObjectPool;
```

**Step 2: Commit**

```bash
git add js/utils/ObjectPool.js
git commit -m "feat: create generic ObjectPool for entity reuse"
```

---

## Phase 2: Core Systems

### Task 5: Create Entity Base Class

**Files:**
- Create: `js/entities/Entity.js`

**Step 1: Write Entity base class**

```javascript
class Entity {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.active = true;
        this.poolId = -1;
    }

    update(deltaTime) {
        // Override in subclasses
    }

    draw(ctx) {
        // Override in subclasses
    }

    reset(x, y) {
        this.x = x;
        this.y = y;
        this.active = true;
    }

    isOffScreen(canvasHeight) {
        return this.y > canvasHeight;
    }

    getBounds() {
        return {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height
        };
    }
}

export default Entity;
```

**Step 2: Commit**

```bash
git add js/entities/Entity.js
git commit -m "feat: create Entity base class"
```

---

### Task 6: Create Player Entity

**Files:**
- Create: `js/entities/Player.js`

**Step 1: Write Player class**

```javascript
import Entity from './Entity.js';
import { LANE_COUNT, LANE_WIDTH, PLAYER_WIDTH, PLAYER_HEIGHT } from '../constants.js';

class Player extends Entity {
    constructor() {
        const x = LANE_WIDTH * 1.5 - PLAYER_WIDTH / 2;
        const y = 600 - PLAYER_HEIGHT - 20;
        super(x, y, PLAYER_WIDTH, PLAYER_HEIGHT);
        
        this.lane = 1; // 0, 1, 2
        this.targetX = x;
        this.color = '#3498db';
    }

    moveLeft() {
        if (this.lane > 0) {
            this.lane--;
            this.targetX = this.lane * LANE_WIDTH + LANE_WIDTH / 2 - this.width / 2;
        }
    }

    moveRight() {
        if (this.lane < LANE_COUNT - 1) {
            this.lane++;
            this.targetX = this.lane * LANE_WIDTH + LANE_WIDTH / 2 - this.width / 2;
        }
    }

    update(deltaTime) {
        // Smooth interpolation to target lane
        this.x += (this.targetX - this.x) * 0.2;
    }

    draw(ctx) {
        // Car body
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);

        // Windshield
        ctx.fillStyle = '#2980b9';
        ctx.fillRect(this.x + 5, this.y + 10, this.width - 10, 20);

        // Wheels
        ctx.fillStyle = '#333';
        ctx.fillRect(this.x - 5, this.y + 15, 10, 20);
        ctx.fillRect(this.x + this.width - 5, this.y + 15, 10, 20);
        ctx.fillRect(this.x - 5, this.y + 65, 10, 20);
        ctx.fillRect(this.x + this.width - 5, this.y + 65, 10, 20);

        // Headlights
        ctx.fillStyle = '#f1c40f';
        ctx.beginPath();
        ctx.arc(this.x + 10, this.y, 5, 0, Math.PI * 2);
        ctx.arc(this.x + this.width - 10, this.y, 5, 0, Math.PI * 2);
        ctx.fill();
    }

    reset() {
        super.reset(
            LANE_WIDTH * 1.5 - PLAYER_WIDTH / 2,
            600 - PLAYER_HEIGHT - 20
        );
        this.lane = 1;
        this.targetX = this.x;
    }
}

export default Player;
```

**Step 2: Commit**

```bash
git add js/entities/Player.js
git commit -m "feat: create Player entity with lane-based movement"
```

---

### Task 7: Create Obstacle Entity

**Files:**
- Create: `js/entities/Obstacle.js`

**Step 1: Write Obstacle class**

```javascript
import Entity from './Entity.js';
import { OBSTACLE_WIDTH, OBSTACLE_HEIGHT, LANE_COUNT, LANE_WIDTH } from '../constants.js';

const COLORS = ['#ff6b6b', '#4ecdc4', '#ffe66d', '#95e1d3'];

class Obstacle extends Entity {
    constructor(x, y) {
        super(x, y, OBSTACLE_WIDTH, OBSTACLE_HEIGHT);
        this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
        this.speed = 0;
    }

    update(deltaTime, speed) {
        this.y += speed;
    }

    draw(ctx) {
        // Car body
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);

        // Windshield
        ctx.fillStyle = '#333';
        ctx.fillRect(this.x + 5, this.y + 10, this.width - 10, 20);

        // Wheels
        ctx.fillStyle = '#333';
        ctx.fillRect(this.x - 5, this.y + 15, 10, 20);
        ctx.fillRect(this.x + this.width - 5, this.y + 15, 10, 20);
        ctx.fillRect(this.x - 5, this.y + 65, 10, 20);
        ctx.fillRect(this.x + this.width - 5, this.y + 65, 10, 20);
    }

    static createRandom(laneWidth) {
        const lane = Math.floor(Math.random() * LANE_COUNT);
        const x = lane * laneWidth + laneWidth / 2 - OBSTACLE_WIDTH / 2;
        return new Obstacle(x, -OBSTACLE_HEIGHT);
    }

    reset(x, y) {
        super.reset(x, y);
        this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
    }
}

export default Obstacle;
```

**Step 2: Commit**

```bash
git add js/entities/Obstacle.js
git commit -m "feat: create Obstacle entity"
```

---

### Task 8: Create Coin Entity

**Files:**
- Create: `js/entities/Coin.js`

**Step 1: Write Coin class**

```javascript
import Entity from './Entity.js';
import { COIN_SIZE, LANE_COUNT, LANE_WIDTH } from '../constants.js';

class Coin extends Entity {
    constructor(x, y) {
        super(x, y, COIN_SIZE, COIN_SIZE);
        this.value = 100;
        this.rotation = 0;
    }

    update(deltaTime, speed) {
        this.y += speed;
        this.rotation += 0.1;
    }

    draw(ctx) {
        const centerX = this.x + this.width / 2;
        const centerY = this.y + this.height / 2;
        const radius = this.width / 2;

        // Outer ring
        ctx.fillStyle = '#f1c40f';
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.fill();

        // Inner circle
        ctx.fillStyle = '#f39c12';
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius * 0.6, 0, Math.PI * 2);
        ctx.fill();

        // Dollar sign
        ctx.fillStyle = '#f1c40f';
        ctx.font = 'bold 16px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('$', centerX, centerY);
    }

    reset(x, y) {
        super.reset(x, y);
        this.rotation = 0;
    }

    static createRandom(laneWidth) {
        const lane = Math.floor(Math.random() * LANE_COUNT);
        const x = lane * laneWidth + laneWidth / 2 - COIN_SIZE / 2;
        return new Coin(x, -COIN_SIZE);
    }
}

export default Coin;
```

**Step 2: Commit**

```bash
git add js/entities/Coin.js
git commit -m "feat: create Coin entity"
```

---

### Task 9: Create PowerUp Entity

**Files:**
- Create: `js/entities/PowerUp.js`

**Step 1: Write PowerUp class**

```javascript
import Entity from './Entity.js';
import { POWERUP_SIZE, LANE_COUNT, LANE_WIDTH, POWERUP_TYPES } from '../constants.js';

class PowerUp extends Entity {
    constructor(x, y, type) {
        super(x, y, POWERUP_SIZE, POWERUP_SIZE);
        const typeData = POWERUP_TYPES[type];
        this.type = type;
        this.emoji = typeData.emoji;
        this.color = typeData.color;
        this.name = typeData.name;
    }

    update(deltaTime, speed) {
        this.y += speed;
    }

    draw(ctx) {
        const centerX = this.x + this.width / 2;
        const centerY = this.y + this.height / 2;
        const radius = this.width / 2;

        // Background
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.fill();

        // Glow effect
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 15;
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius - 2, 0, Math.PI * 2);
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Emoji
        ctx.font = '20px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(this.emoji, centerX, centerY);
    }

    static createRandom(laneWidth) {
        const lane = Math.floor(Math.random() * LANE_COUNT);
        const x = lane * laneWidth + laneWidth / 2 - POWERUP_SIZE / 2;
        const types = Object.keys(POWERUP_TYPES);
        const type = types[Math.floor(Math.random() * types.length)];
        return new PowerUp(x, -POWERUP_SIZE, type);
    }
}

export default PowerUp;
```

**Step 2: Commit**

```bash
git add js/entities/PowerUp.js
git commit -m "feat: create PowerUp entity"
```

---

## Phase 3: System Managers

### Task 10: Create Input Handler

**Files:**
- Create: `js/core/Input.js`

**Step 1: Write Input class**

```javascript
import eventBus from './EventBus.js';

class Input {
    constructor() {
        this.keys = {};
        this.touchStartX = null;
        this.setupKeyboard();
        this.setupTouch();
    }

    setupKeyboard() {
        document.addEventListener('keydown', (e) => {
            this.keys[e.key] = true;

            // Prevent default for game keys
            if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', ' '].includes(e.key)) {
                e.preventDefault();
            }

            // Movement
            if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
                eventBus.publish('INPUT_LEFT');
            }
            if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
                eventBus.publish('INPUT_RIGHT');
            }
            // Game state
            if (e.key === ' ' || e.key === 'Enter') {
                eventBus.publish('INPUT_ACTION');
            }
            // Pause
            if (e.key === ' ' && (e.ctrlKey || e.metaKey)) {
                eventBus.publish('INPUT_PAUSE');
            }
        });

        document.addEventListener('keyup', (e) => {
            this.keys[e.key] = false;
        });
    }

    setupTouch() {
        document.addEventListener('touchstart', (e) => {
            this.touchStartX = e.touches[0].clientX;
        });

        document.addEventListener('touchend', (e) => {
            if (this.touchStartX === null) return;

            const touchEndX = e.changedTouches[0].clientX;
            const diff = touchEndX - this.touchStartX;

            if (Math.abs(diff) > 30) {
                if (diff > 0) {
                    eventBus.publish('INPUT_RIGHT');
                } else {
                    eventBus.publish('INPUT_LEFT');
                }
            }

            this.touchStartX = null;
        });
    }

    dispose() {
        // Cleanup if needed
    }
}

export default Input;
```

**Step 2: Commit**

```bash
git add js/core/Input.js
git commit -m "feat: create Input handler with keyboard and touch support"
```

---

### Task 11: Create Collision System

**Files:**
- Create: `js/systems/Collision.js`

**Step 1: Write Collision class**

```javascript
class Collision {
    static check(a, b) {
        return (
            a.x < b.x + b.width &&
            a.x + a.width > b.x &&
            a.y < b.y + b.height &&
            a.y + a.height > b.y
        );
    }

    static checkWithBounds(entity, bounds) {
        return (
            entity.x < bounds.x + bounds.width &&
            entity.x + entity.width > bounds.x &&
            entity.y < bounds.y + bounds.height &&
            entity.y + entity.height > bounds.y
        );
    }
}

export default Collision;
```

**Step 2: Commit**

```bash
git add js/systems/Collision.js
git commit -m "feat: create Collision system with AABB detection"
```

---

### Task 12: Create Spawn Manager

**Files:**
- Create: `js/systems/SpawnManager.js`

**Step 1: Write SpawnManager class**

```javascript
import Obstacle from '../entities/Obstacle.js';
import Coin from '../entities/Coin.js';
import PowerUp from '../entities/PowerUp.js';
import ObjectPool from '../utils/ObjectPool.js';
import { LANE_WIDTH, CANVAS_HEIGHT } from '../constants.js';

class SpawnManager {
    constructor() {
        // Object pools
        this.obstaclePool = new ObjectPool(
            () => new Obstacle(0, 0),
            (obj, x, y) => obj.reset(x, y),
            20
        );
        this.coinPool = new ObjectPool(
            () => new Coin(0, 0),
            (obj, x, y) => obj.reset(x, y),
            10
        );
        this.powerUpPool = new ObjectPool(
            (x, y) => PowerUp.createRandom(LANE_WIDTH),
            (obj, x, y) => obj.reset(x, y),
            5
        );

        // Spawn timers
        this.obstacleTimer = 0;
        this.coinTimer = 0;
        this.powerUpTimer = 0;

        // Spawn rates (frames)
        this.obstacleInterval = 60;
        this.coinInterval = 120;
        this.powerUpInterval = 200;
    }

    update(level, frameCount) {
        // Adjust spawn rates based on level
        const difficultyMultiplier = 1 - (level - 1) * 0.15;

        this.obstacleTimer++;
        if (this.obstacleTimer >= this.obstacleInterval * difficultyMultiplier) {
            this.spawnObstacle();
            this.obstacleTimer = 0;
        }

        this.coinTimer++;
        if (this.coinTimer >= this.coinInterval) {
            this.spawnCoin();
            this.coinTimer = 0;
        }

        this.powerUpTimer++;
        if (this.powerUpTimer >= this.powerUpInterval) {
            this.spawnPowerUp();
            this.powerUpTimer = 0;
        }
    }

    spawnObstacle() {
        const lane = Math.floor(Math.random() * 3);
        const x = lane * LANE_WIDTH + LANE_WIDTH / 2 - 30;
        const obstacle = this.obstaclePool.acquire(x, -100);
        obstacle.active = true;
    }

    spawnCoin() {
        const lane = Math.floor(Math.random() * 3);
        const x = lane * LANE_WIDTH + LANE_WIDTH / 2 - 15;
        const coin = this.coinPool.acquire(x, -30);
        coin.active = true;
    }

    spawnPowerUp() {
        const lane = Math.floor(Math.random() * 3);
        const x = lane * LANE_WIDTH + LANE_WIDTH / 2 - 17.5;
        const powerUp = this.powerUpPool.acquire(x, -35);
        powerUp.active = true;
    }

    getAllEntities() {
        return {
            obstacles: this.obstaclePool.getAll(),
            coins: this.coinPool.getAll(),
            powerUps: this.powerUpPool.getAll()
        };
    }

    reset() {
        this.obstaclePool.releaseAll();
        this.coinPool.releaseAll();
        this.powerUpPool.releaseAll();
        this.obstacleTimer = 0;
        this.coinTimer = 0;
        this.powerUpTimer = 0;
    }

    setDifficulty(level) {
        const baseObstacle = 60;
        this.obstacleInterval = Math.max(25, baseObstacle - (level - 1) * 15);
    }
}

export default SpawnManager;
```

**Step 2: Commit**

```bash
git add js/systems/SpawnManager.js
git commit -m "feat: create SpawnManager with object pooling"
```

---

### Task 13: Create PowerUp Manager

**Files:**
- Create: `js/systems/PowerUpManager.js`

**Step 1: Write PowerUpManager class**

```javascript
import { POWERUP_TYPES } from '../constants.js';

class PowerUpManager {
    constructor() {
        this.activePowerUps = [];
    }

    activate(type) {
        const typeData = POWERUP_TYPES[type];

        // Instant effects
        if (type === 'EXTRA_LIFE') {
            return { type: 'INSTANT_LIFE', data: { amount: 1 } };
        }

        // Check if already active - extend duration
        const existing = this.activePowerUps.find(p => p.type === type);
        if (existing) {
            existing.timer = typeData.duration;
        } else {
            this.activePowerUps.push({
                type,
                timer: typeData.duration,
                name: typeData.name,
                emoji: typeData.emoji,
                effect: typeData.effect
            });
        }

        return { type: 'ACTIVATED', powerUp: type };
    }

    update() {
        const expired = [];

        this.activePowerUps.forEach((powerUp, index) => {
            powerUp.timer--;
            if (powerUp.timer <= 0) {
                expired.push(powerUp);
            }
        });

        expired.forEach(p => {
            this.activePowerUps = this.activePowerUps.filter(ap => ap !== p);
        });

        return expired;
    }

    hasEffect(effect) {
        return this.activePowerUps.some(p => p.effect === effect);
    }

    getActiveList() {
        return this.activePowerUps.map(p => ({
            ...p,
            seconds: Math.ceil(p.timer / 60)
        }));
    }

    getMultiplier() {
        return this.hasEffect('doubleScore') ? 2 : 1;
    }

    getSpeedModifier() {
        let modifier = 1;
        if (this.hasEffect('speedBoost')) modifier *= 1.5;
        if (this.hasEffect('slowMotion')) modifier *= 0.5;
        return modifier;
    }

    reset() {
        this.activePowerUps = [];
    }
}

export default PowerUpManager;
```

**Step 2: Commit**

```bash
git add js/systems/PowerUpManager.js
git commit -m "feat: create PowerUpManager for active power-up tracking"
```

---

### Task 14: Create Rendering System

**Files:**
- Create: `js/systems/Rendering.js`

**Step 1: Write Rendering class (Part 1)**

```javascript
import { LEVELS, CANVAS_WIDTH, CANVAS_HEIGHT, PLAYER_WIDTH, PLAYER_HEIGHT, POWERUP_TYPES } from '../constants.js';

class Rendering {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
    }

    clear() {
        this.ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    }

    drawRoad(levelConfig) {
        const ctx = this.ctx;

        // Road background
        ctx.fillStyle = levelConfig.roadColor;
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        // Road edges
        ctx.fillStyle = levelConfig.lineColor;
        ctx.fillRect(0, 0, 10, CANVAS_HEIGHT);
        ctx.fillRect(CANVAS_WIDTH - 10, 0, 10, CANVAS_HEIGHT);

        // Lane dividers
        ctx.fillStyle = levelConfig.lineColor;
    }

    drawRoadLines(roadLines, levelConfig) {
        const ctx = this.ctx;
        roadLines.forEach(line => {
            ctx.fillRect(CANVAS_WIDTH / 3 - 5, line.y, 10, 60);
            ctx.fillRect((CANVAS_WIDTH / 3) * 2 - 5, line.y, 10, 60);
        });

        // Level 3 glow
        if (levelConfig.name === 'Expert') {
            ctx.shadowColor = '#9b59b6';
            ctx.shadowBlur = 20;
            ctx.strokeStyle = '#9b59b6';
            ctx.lineWidth = 2;
            ctx.strokeRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
            ctx.shadowBlur = 0;
        }
    }
}

export default Rendering;
```

**Step 2: Commit**

```bash
git add js/systems/Rendering.js
git commit -m "feat: create Rendering system (part 1 - road)"
```

---

### Task 15: Complete Rendering System

**Files:**
- Modify: `js/systems/Rendering.js`

**Step 1: Add remaining render methods**

```javascript
    // Add to Rendering class
    drawEntity(entity) {
        if (entity && entity.draw) {
            entity.draw(this.ctx);
        }
    }

    drawEntities(entities) {
        entities.forEach(entity => this.drawEntity(entity));
    }

    drawPlayer(player, effects) {
        // Draw shield if active
        if (effects.shield) {
            this.ctx.strokeStyle = '#3498db';
            this.ctx.lineWidth = 4;
            this.ctx.shadowColor = '#3498db';
            this.ctx.shadowBlur = 15;
            this.ctx.beginPath();
            this.ctx.arc(
                player.x + player.width / 2,
                player.y + player.height / 2,
                player.width / 2 + 10,
                0,
                Math.PI * 2
            );
            this.ctx.stroke();
            this.ctx.shadowBlur = 0;
        }

        player.draw(this.ctx);

        // Speed boost trail
        if (effects.speedBoost) {
            this.ctx.fillStyle = 'rgba(230, 126, 34, 0.3)';
            this.ctx.fillRect(
                player.x - 10,
                player.y + player.height,
                player.width + 20,
                20
            );
        }

        // Magnet range indicator
        if (effects.magnet) {
            this.ctx.strokeStyle = '#2ecc71';
            this.ctx.lineWidth = 2;
            this.ctx.setLineDash([5, 5]);
            this.ctx.beginPath();
            this.ctx.arc(
                player.x + player.width / 2,
                player.y + player.height / 2,
                100,
                0,
                Math.PI * 2
            );
            this.ctx.stroke();
            this.ctx.setLineDash([]);
        }
    }

    drawUI(score, highScore, level, lives, levelConfig) {
        const ctx = this.ctx;

        // Score
        ctx.fillStyle = 'white';
        ctx.font = '24px Arial';
        ctx.textAlign = 'left';
        ctx.fillText(`Score: ${score}`, 10, 30);

        // High Score
        ctx.fillStyle = '#ffd700';
        ctx.font = '18px Arial';
        ctx.fillText(`High: ${highScore}`, 10, 55);

        // Level
        ctx.fillStyle = '#00ff00';
        ctx.textAlign = 'center';
        ctx.fillText(`Level: ${level} (${levelConfig.name})`, CANVAS_WIDTH / 2, 30);

        // Lives
        ctx.fillStyle = '#ff6b6b';
        ctx.textAlign = 'right';
        ctx.fillText('Lives: ' + '❤️'.repeat(lives), CANVAS_WIDTH - 10, 30);
    }

    drawActivePowerUps(activePowerUps) {
        if (activePowerUps.length === 0) return;

        const ctx = this.ctx;
        const startY = 10;
        const spacing = 25;

        activePowerUps.forEach((powerUp, index) => {
            const y = startY + index * spacing;
            const progress = powerUp.timer / POWERUP_TYPES[powerUp.type].duration;

            // Background
            ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
            ctx.fillRect(10, y, 150, 20);

            // Progress bar
            ctx.fillStyle = POWERUP_TYPES[powerUp.type].color;
            ctx.fillRect(10, y, 150 * progress, 20);

            // Label
            ctx.font = '14px Arial';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';
            ctx.fillText(`${powerUp.emoji} ${powerUp.name}`, 15, y + 10);

            // Time
            ctx.fillStyle = '#fff';
            ctx.textAlign = 'right';
            ctx.fillText(`${powerUp.seconds}s`, 155, y + 10);
        });
    }
```

**Step 2: Add screen drawing methods**

```javascript
    drawStartScreen() {
        const ctx = this.ctx;
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        ctx.fillStyle = '#fff';
        ctx.font = 'bold 48px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('CRAZY CAR', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 100);

        ctx.font = '24px Arial';
        ctx.fillText('Press SPACE or ENTER to Start', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 50);

        // Power-up legend
        const powerUps = Object.values(POWERUP_TYPES);
        powerUps.forEach((p, i) => {
            ctx.fillStyle = p.color;
            ctx.font = '16px Arial';
            ctx.fillText(
                `${p.emoji} ${p.name}`,
                CANVAS_WIDTH / 2,
                CANVAS_HEIGHT / 2 + i * 25
            );
        });
    }

    drawGameOverScreen(score, highScore, level, levelConfig) {
        const ctx = this.ctx;
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        ctx.fillStyle = '#e74c3c';
        ctx.font = 'bold 48px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('GAME OVER', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 80);

        ctx.fillStyle = '#fff';
        ctx.font = '32px Arial';
        ctx.fillText(`Score: ${score}`, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 30);

        ctx.font = '20px Arial';
        ctx.fillText(`Level: ${level} (${levelConfig.name})`, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 10);

        if (score >= highScore && score > 0) {
            ctx.fillStyle = '#f1c40f';
            ctx.font = '24px Arial';
            ctx.fillText('NEW HIGH SCORE!', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 50);
        }

        ctx.fillStyle = '#fff';
        ctx.font = '20px Arial';
        ctx.fillText('Press SPACE to Restart', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 90);
    }

    drawPauseScreen() {
        const ctx = this.ctx;
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        // Pause icon
        ctx.fillStyle = '#fff';
        ctx.fillRect(CANVAS_WIDTH / 2 - 35, CANVAS_HEIGHT / 2 - 40, 20, 80);
        ctx.fillRect(CANVAS_WIDTH / 2 + 15, CANVAS_HEIGHT / 2 - 40, 20, 80);

        ctx.font = 'bold 48px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('PAUSED', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 70);

        ctx.font = '20px Arial';
        ctx.fillText('Press SPACE to Resume', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 110);
    }

    drawLevelUpScreen(level, levelConfig, timer) {
        const ctx = this.ctx;
        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        ctx.fillStyle = '#00ff00';
        ctx.font = 'bold 48px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('LEVEL UP!', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 30);

        ctx.fillStyle = '#fff';
        ctx.font = '32px Arial';
        ctx.fillText(`Level ${level}`, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 20);
        ctx.font = '24px Arial';
        ctx.fillText(levelConfig.name, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 60);
    }
```

**Step 3: Commit**

```bash
git add js/systems/Rendering.js
git commit -m "feat: complete Rendering system with all draw methods"
```

---

## Phase 4: Game Controller

### Task 16: Create Main Game Controller

**Files:**
- Create: `js/core/Game.js`

**Step 1: Write Game class (Part 1)**

```javascript
import eventBus from './EventBus.js';
import { LEVELS, BASE_GAME_SPEED, INITIAL_LIVES, CANVAS_HEIGHT } from '../constants.js';
import Player from '../entities/Player.js';
import Collision from '../systems/Collision.js';
import SpawnManager from '../systems/SpawnManager.js';
import PowerUpManager from '../systems/PowerUpManager.js';
import Rendering from '../systems/Rendering.js';

class Game {
    constructor(canvas) {
        this.canvas = canvas;
        this.state = 'start'; // start, playing, paused, gameover, levelUp
        this.score = 0;
        this.highScore = parseInt(localStorage.getItem('crazyCarHighScore')) || 0;
        this.level = 1;
        this.lives = INITIAL_LIVES;
        this.frameCount = 0;
        this.levelUpTimer = 0;

        // Systems
        this.player = new Player();
        this.spawnManager = new SpawnManager();
        this.powerUpManager = new PowerUpManager();
        this.rendering = new Rendering(canvas);
        this.roadLines = this.createRoadLines();

        // Road line animation
        this.roadLineOffset = 0;

        this.setupEventListeners();
    }

    createRoadLines() {
        const lines = [];
        for (let i = 0; i < 6; i++) {
            lines.push({ y: i * 120 });
        }
        return lines;
    }

    setupEventListeners() {
        eventBus.subscribe('INPUT_LEFT', () => {
            if (this.state === 'playing') {
                this.player.moveLeft();
            }
        });

        eventBus.subscribe('INPUT_RIGHT', () => {
            if (this.state === 'playing') {
                this.player.moveRight();
            }
        });

        eventBus.subscribe('INPUT_ACTION', () => {
            if (this.state === 'start' || this.state === 'gameover') {
                this.start();
            }
        });

        eventBus.subscribe('INPUT_PAUSE', () => {
            if (this.state === 'playing') {
                this.state = 'paused';
            } else if (this.state === 'paused') {
                this.state = 'playing';
            }
        });
    }
```

**Step 2: Commit**

```bash
git add js/core/Game.js
git commit -m "feat: create Game controller (part 1 - initialization)"
```

---

### Task 17: Complete Game Controller

**Files:**
- Modify: `js/core/Game.js`

**Step 1: Add game methods**

```javascript
    // Add to Game class
    start() {
        this.state = 'playing';
        this.score = 0;
        this.level = 1;
        this.lives = INITIAL_LIVES;
        this.frameCount = 0;
        this.player.reset();
        this.spawnManager.reset();
        this.powerUpManager.reset();
        this.spawnManager.setDifficulty(1);
    }

    gameOver() {
        this.state = 'gameover';
        if (this.score > this.highScore) {
            this.highScore = this.score;
            localStorage.setItem('crazyCarHighScore', this.highScore);
        }
    }

    checkLevelUp() {
        const nextLevel = this.level + 1;
        if (LEVELS[nextLevel] && this.score >= LEVELS[nextLevel].threshold) {
            this.level = nextLevel;
            this.state = 'levelUp';
            this.levelUpTimer = 120; // 2 seconds at 60fps
            this.spawnManager.setDifficulty(this.level);
        }
    }

    handleCollisions() {
        const entities = this.spawnManager.getAllEntities();
        const effects = {
            shield: this.powerUpManager.hasEffect('shield'),
            speedBoost: this.powerUpManager.hasEffect('speedBoost'),
            magnet: this.powerUpManager.hasEffect('magnet')
        };

        // Obstacle collisions
        entities.obstacles.forEach((obstacle, index) => {
            if (Collision.check(this.player, obstacle)) {
                if (effects.shield) {
                    this.spawnManager.obstaclePool.release(obstacle);
                    this.powerUpManager.activePowerUps = 
                        this.powerUpManager.activePowerUps.filter(p => p.effect !== 'shield');
                } else if (this.lives > 0) {
                    this.lives--;
                    this.spawnManager.obstaclePool.release(obstacle);
                    if (this.lives <= 0) {
                        this.gameOver();
                    }
                }
            }
        });

        // Coin collisions
        entities.coins.forEach((coin, index) => {
            if (Collision.check(this.player, coin)) {
                const multiplier = this.powerUpManager.getMultiplier();
                this.score += coin.value * multiplier;
                this.spawnManager.coinPool.release(coin);
            }
        });

        // PowerUp collisions
        entities.powerUps.forEach((powerUp, index) => {
            if (Collision.check(this.player, powerUp)) {
                const result = this.powerUpManager.activate(powerUp.type);
                this.spawnManager.powerUpPool.release(powerUp);

                if (result.type === 'INSTANT_LIFE') {
                    this.lives += result.data.amount;
                }
            }
        });
    }

    update() {
        if (this.state !== 'playing' && this.state !== 'levelUp') return;

        // Update level up timer
        if (this.state === 'levelUp') {
            this.levelUpTimer--;
            if (this.levelUpTimer <= 0) {
                this.state = 'playing';
            }
            return;
        }

        this.frameCount++;

        // Update player
        this.player.update();

        // Update road lines
        const speed = BASE_GAME_SPEED * LEVELS[this.level].speedMultiplier * 
                      this.powerUpManager.getSpeedModifier();
        this.roadLines.forEach(line => {
            line.y += speed;
            if (line.y > CANVAS_HEIGHT) {
                line.y = -120;
            }
        });

        // Update spawn manager
        this.spawnManager.update(this.level, this.frameCount);

        // Update power-ups
        const expired = this.powerUpManager.update();

        // Get all entities and update them
        const entities = this.spawnManager.getAllEntities();
        entities.obstacles.forEach(o => o.update(1, speed));
        entities.coins.forEach(c => c.update(1, speed));
        entities.powerUps.forEach(p => p.update(1, speed));

        // Remove off-screen entities
        entities.obstacles.forEach(o => {
            if (o.isOffScreen(CANVAS_HEIGHT)) {
                this.spawnManager.obstaclePool.release(o);
                this.score += 10 * this.powerUpManager.getMultiplier();
            }
        });
        entities.coins.forEach(c => {
            if (c.isOffScreen(CANVAS_HEIGHT)) {
                this.spawnManager.coinPool.release(c);
            }
        });
        entities.powerUps.forEach(p => {
            if (p.isOffScreen(CANVAS_HEIGHT)) {
                this.spawnManager.powerUpPool.release(p);
            }
        });

        // Handle collisions
        this.handleCollisions();

        // Score over time
        this.score += this.powerUpManager.getMultiplier();

        // Check level up
        this.checkLevelUp();
    }
```

**Step 2: Add render method**

```javascript
    render() {
        this.rendering.clear();

        const levelConfig = LEVELS[this.level];

        // Draw road
        this.rendering.drawRoad(levelConfig);
        this.rendering.drawRoadLines(this.roadLines, levelConfig);

        // Get entities
        const entities = this.spawnManager.getAllEntities();

        // Draw entities
        this.rendering.drawEntities(entities.coins);
        this.rendering.drawEntities(entities.powerUps);
        this.rendering.drawEntities(entities.obstacles);

        // Draw player with effects
        const effects = {
            shield: this.powerUpManager.hasEffect('shield'),
            speedBoost: this.powerUpManager.hasEffect('speedBoost'),
            magnet: this.powerUpManager.hasEffect('magnet')
        };
        this.rendering.drawPlayer(this.player, effects);

        // Draw UI
        this.rendering.drawUI(
            this.score,
            this.highScore,
            this.level,
            this.lives,
            levelConfig
        );

        // Draw active power-ups
        this.rendering.drawActivePowerUps(this.powerUpManager.getActiveList());

        // Draw screens
        if (this.state === 'start') {
            this.rendering.drawStartScreen();
        } else if (this.state === 'gameover') {
            this.rendering.drawGameOverScreen(
                this.score,
                this.highScore,
                this.level,
                levelConfig
            );
        } else if (this.state === 'paused') {
            this.rendering.drawPauseScreen();
        } else if (this.state === 'levelUp') {
            this.rendering.drawLevelUpScreen(this.level, levelConfig, this.levelUpTimer);
        }
    }

    gameLoop() {
        this.update();
        this.render();
        requestAnimationFrame(() => this.gameLoop());
    }
}

export default Game;
```

**Step 3: Commit**

```bash
git add js/core/Game.js
git commit -m "feat: complete Game controller with update and render"
```

---

## Phase 5: Entry Point and Styles

### Task 18: Create Main Entry Point

**Files:**
- Create: `js/main.js`

**Step 1: Write main.js**

```javascript
import Game from './core/Game.js';
import Input from './core/Input.js';

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameCanvas');
    
    if (!canvas) {
        console.error('Game canvas not found!');
        return;
    }

    // Initialize game
    const game = new Game(canvas);
    
    // Initialize input (auto-registers event listeners)
    const input = new Input();

    // Start game loop
    game.gameLoop();

    console.log('Crazy Car initialized!');
});
```

**Step 2: Commit**

```bash
git add js/main.js
git commit -m "feat: create main entry point"
```

---

### Task 19: Extract CSS to Separate File

**Files:**
- Create: `style.css`

**Step 1: Write style.css**

```css
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    font-family: 'Arial', sans-serif;
}

#gameContainer {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
}

#scoreDisplay,
#highScoreDisplay,
#levelDisplay,
#livesDisplay {
    color: white;
    font-size: 24px;
    margin-bottom: 10px;
    text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
}

#highScoreDisplay {
    color: #ffd700;
    font-size: 18px;
}

#levelDisplay {
    color: #00ff00;
    font-size: 18px;
}

#livesDisplay {
    color: #ff6b6b;
    font-size: 18px;
}

canvas {
    border: 5px solid #333;
    border-radius: 10px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.5);
}

#instructions {
    color: white;
    margin-top: 15px;
    text-align: center;
    font-size: 14px;
    text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
}
```

**Step 2: Commit**

```bash
git add style.css
git commit -m "feat: extract CSS to separate file"
```

---

### Task 20: Update HTML File

**Files:**
- Modify: `index.html`

**Step 1: Replace with modular version**

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Crazy Car</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div id="gameContainer">
        <div id="scoreDisplay">Score: 0</div>
        <div id="highScoreDisplay">High Score: 0</div>
        <div id="levelDisplay">Level: 1</div>
        <div id="livesDisplay">Lives: ❤️❤️❤️</div>
        <canvas id="gameCanvas" width="400" height="600"></canvas>
        <div id="instructions">Use ← → Arrow Keys or A/D to move | SPACE to pause | Touch to play on mobile</div>
    </div>

    <script type="module" src="js/main.js"></script>
</body>
</html>
```

**Step 2: Commit**

```bash
git add index.html
git commit -m "refactor: update HTML to use modular JavaScript"
```

---

## Phase 6: Cleanup and Testing

### Task 21: Remove Old Inline Code

**Files:**
- Modify: `index.html`

**Step 1: Backup old file, verify new version works**

```bash
# Keep old as backup
cp index.html index.html.bak

# Test in browser manually
open index.html
```

**Step 2: Verify all features work**
- [ ] Game starts with SPACE
- [ ] Player moves with arrow keys
- [ ] Touch controls work on mobile
- [ ] Obstacles spawn and move
- [ ] Coins can be collected
- [ ] Power-ups activate correctly
- [ ] Collision detection works
- [ ] Lives system works
- [ ] Level progression works
- [ ] High score persists

**Step 3: Commit after verification**

```bash
git commit -am "chore: verify refactored game functionality"
```

---

### Task 22: Update Documentation

**Files:**
- Modify: `README.md`
- Modify: `memory-bank/progress.md`

**Step 1: Update README with new structure**

```markdown
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
```

**Step 2: Update progress.md**

```markdown
## What Works
- Modular architecture with ES6 modules
- Object-oriented entity system
- Object pooling for performance
- Event bus for decoupled communication
- Touch controls for mobile devices
- All original gameplay features preserved
```

**Step 3: Commit**

```bash
git add README.md memory-bank/progress.md
git commit -m "docs: update documentation for refactored structure"
```

---

### Task 23: Final Verification and Cleanup

**Files:**
- All project files

**Step 1: Run final tests**

```bash
# Check for any unused files
git status

# Verify file structure
find js -name "*.js" | sort
```

**Step 2: Remove backup file**

```bash
rm index.html.bak
git rm index.html.bak
git commit -m "chore: remove backup file"
```

**Step 3: Create final commit**

```bash
git add -A
git commit -m "refactor: complete modular architecture migration

- Split monolithic index.html into organized modules
- Implemented OOP patterns with ES6 classes
- Added object pooling for entity management
- Created event bus for decoupled communication
- Added touch controls for mobile support
- Maintained all original gameplay features
- Updated documentation"
```

---

## Testing Checklist

After completing all tasks, verify:

| Feature | Test | Status |
|---------|------|--------|
| Game Start | Press SPACE, game begins | ☐ |
| Player Movement | Arrow keys move car | ☐ |
| Touch Controls | Swipe left/right on mobile | ☐ |
| Obstacles | Cars spawn and move down | ☐ |
| Coins | Collect for 100 points | ☐ |
| Shield PowerUp | Invincibility for 5s | ☐ |
| Speed Boost | Faster scoring | ☐ |
| Slow Motion | Obstacles slow down | ☐ |
| Magnet | Coins attracted to player | ☐ |
| Double Score | 2x points | ☐ |
| Extra Life | +1 life instantly | ☐ |
| Level Progression | 1000→Level 2, 3000→Level 3 | ☐ |
| Lives System | 3 lives, game over at 0 | ☐ |
| High Score | Persists after refresh | ☐ |
| Pause | SPACE during game | ☐ |
| Performance | Smooth 60fps | ☐ |

---

## Rollback Plan

If issues occur:

```bash
# Return to pre-refactor state
git checkout <commit-before-refactor>
```

The original `index.html` contains the working monolithic version as a fallback.
