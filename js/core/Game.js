import eventBus from './EventBus.js';
import { LEVELS, BASE_GAME_SPEED, INITIAL_LIVES, CANVAS_HEIGHT, LEVEL_UP_DURATION, COLLISION } from '../constants.js';
import Player from '../entities/Player.js';
import Collision from '../systems/Collision.js';
import SpawnManager from '../systems/SpawnManager.js';
import PowerUpManager from '../systems/PowerUpManager.js';
import Rendering from '../systems/Rendering.js';

class Game {
    constructor(canvas) {
        this.canvas = canvas;
        this.state = 'start';
        this.score = 0;
        this.highScore = parseInt(localStorage.getItem('crazyCarHighScore')) || 0;
        this.level = 1;
        this.lives = INITIAL_LIVES;
        this.frameCount = 0;
        this.levelUpTimer = 0;

        // DOM elements
        this.ui = {
            score: document.getElementById('scoreDisplay'),
            highScore: document.getElementById('highScoreDisplay'),
            level: document.getElementById('levelDisplay'),
            lives: document.getElementById('livesDisplay')
        };

        // Systems
        this.player = new Player();
        this.spawnManager = new SpawnManager();
        this.powerUpManager = new PowerUpManager();
        this.rendering = new Rendering(canvas);
        this.roadLines = this.createRoadLines();
        this.roadLineOffset = 0;

        this.updateUI();
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
            } else if (this.state === 'playing' || this.state === 'paused') {
                this.state = this.state === 'playing' ? 'paused' : 'playing';
            }
        });

        eventBus.subscribe('INPUT_PAUSE', () => {
            if (this.state === 'playing' || this.state === 'paused') {
                this.state = this.state === 'playing' ? 'paused' : 'playing';
            }
        });
    }

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
        this.updateUI();
    }

    updateUI() {
        const levelConfig = LEVELS[this.level];
        if (this.ui.score) this.ui.score.textContent = `Score: ${this.score}`;
        if (this.ui.highScore) this.ui.highScore.textContent = `High: ${this.highScore}`;
        if (this.ui.level) this.ui.level.textContent = `${levelConfig.name}`;
        if (this.ui.lives) this.ui.lives.textContent = '❤️'.repeat(this.lives);
    }

    gameOver() {
        this.state = 'gameover';
        if (this.score > this.highScore) {
            this.highScore = this.score;
            localStorage.setItem('crazyCarHighScore', this.highScore);
        }
        this.updateUI();
    }

    checkLevelUp() {
        const nextLevel = this.level + 1;
        if (LEVELS[nextLevel] && this.score >= LEVELS[nextLevel].threshold) {
            this.level = nextLevel;
            this.state = 'levelUp';
            this.levelUpTimer = LEVEL_UP_DURATION;
            this.spawnManager.setDifficulty(this.level);
            this.updateUI();
        }
    }

    handleCollisions() {
        const entities = this.spawnManager.getAllEntities();
        const effects = {
            shield: this.powerUpManager.hasEffect('shield'),
            magnet: this.powerUpManager.hasEffect('magnet')
        };

        let livesChanged = false;
        let scoreChanged = false;

        entities.obstacles.forEach((obstacle, index) => {
            if (Collision.check(this.player, obstacle)) {
                if (effects.shield) {
                    this.spawnManager.obstaclePool.release(obstacle);
                    this.powerUpManager.activePowerUps = 
                        this.powerUpManager.activePowerUps.filter(p => p.effect !== 'shield');
                } else if (this.lives > 0) {
                    this.lives--;
                    livesChanged = true;
                    this.spawnManager.obstaclePool.release(obstacle);
                    if (this.lives <= 0) {
                        this.gameOver();
                    }
                }
            }
        });

        entities.coins.forEach((coin, index) => {
            if (Collision.check(this.player, coin)) {
                const multiplier = this.powerUpManager.getMultiplier();
                this.score += coin.value * multiplier;
                scoreChanged = true;
                this.spawnManager.coinPool.release(coin);
            }
        });

        entities.powerUps.forEach((powerUp, index) => {
            if (Collision.check(this.player, powerUp)) {
                const result = this.powerUpManager.activate(powerUp.type);
                this.spawnManager.powerUpPool.release(powerUp);

                if (result.type === 'INSTANT_LIFE') {
                    this.lives++;
                    livesChanged = true;
                }
            }
        });

        if (livesChanged || scoreChanged) {
            this.updateUI();
        }
    }

    update() {
        if (this.state !== 'playing' && this.state !== 'levelUp') return;

        if (this.state === 'levelUp') {
            this.levelUpTimer--;
            if (this.levelUpTimer <= 0) {
                this.state = 'playing';
            }
            return;
        }

        this.frameCount++;

        this.player.update();

        const speed = BASE_GAME_SPEED * LEVELS[this.level].speedMultiplier * 
                      this.powerUpManager.getSpeedModifier();
        const speedMultiplier = this.powerUpManager.getSpeedModifier();
        
        this.roadLines.forEach(line => {
            line.y += speed;
            if (line.y > CANVAS_HEIGHT) {
                line.y = -120;
            }
        });

        this.spawnManager.update(this.level, this.frameCount, speedMultiplier);

        const expired = this.powerUpManager.update();

        const entities = this.spawnManager.getAllEntities();
        entities.obstacles.forEach(o => o.update(1, speed));
        entities.coins.forEach(c => c.update(1, speed));
        entities.powerUps.forEach(p => p.update(1, speed));

        let obstacleCleared = false;
        entities.obstacles.forEach(o => {
            if (o.isOffScreen(CANVAS_HEIGHT)) {
                this.spawnManager.obstaclePool.release(o);
                this.score += COLLISION.obstacleClearPoints * this.powerUpManager.getMultiplier();
                obstacleCleared = true;
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

        this.handleCollisions();

        this.score += this.powerUpManager.getMultiplier();

        // Update UI for score changes
        if (obstacleCleared || this.frameCount % 10 === 0) {
            this.updateUI();
        }

        this.checkLevelUp();
    }

    render() {
        this.rendering.clear();

        const levelConfig = LEVELS[this.level];

        this.rendering.drawRoad(levelConfig);
        this.rendering.drawRoadLines(this.roadLines, levelConfig);

        const entities = this.spawnManager.getAllEntities();

        this.rendering.drawEntities(entities.coins);
        this.rendering.drawEntities(entities.powerUps);
        this.rendering.drawEntities(entities.obstacles);

        const effects = {
            shield: this.powerUpManager.hasEffect('shield'),
            magnet: this.powerUpManager.hasEffect('magnet')
        };
        this.rendering.drawPlayer(this.player, effects);

        this.rendering.drawActivePowerUps(this.powerUpManager.getActiveList());

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
