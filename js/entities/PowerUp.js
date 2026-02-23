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
