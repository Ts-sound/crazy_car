import Entity from './Entity.js';
import { POWERUP_SIZE, LANE_COUNT, LANE_WIDTH, POWERUP_TYPES } from '../constants.js';
import { WeightedPool } from '../utils/shuffle.js';

// Shared weighted pool for power-up types (configurable pool size)
const TYPES = ['EXTRA_LIFE', 'SHIELD', 'SLOW_MOTION', 'MAGNET', 'DOUBLE_SCORE'];
const WEIGHTS = [8, 22, 22, 22, 26];  // Current weights (unchanged)
const pool = new WeightedPool(TYPES, WEIGHTS, 50);  // Default pool size: 50

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
        const type = pool.pick();  // Use shuffled pool for fair distribution
        return new PowerUp(x, -POWERUP_SIZE, type);
    }

    /**
     * Reset the power-up pool (call on game start)
     * @param {boolean} printStats - Whether to print stats before reset
     */
    static resetPool(printStats = false) {
        pool.reset(printStats);
    }

    /**
     * Print power-up generation statistics
     * @param {string} message - Message to display
     */
    static printStats(message) {
        pool.printStats(message);
    }

    /**
     * Get current pool instance (for stats access)
     */
    static getPool() {
        return pool;
    }
}

export default PowerUp;
