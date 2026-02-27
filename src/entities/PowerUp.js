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
        
        // Weighted random selection - Extra Life less common
        const rand = Math.random();
        let type;
        if (rand < 0.08) type = 'EXTRA_LIFE';        // 8% chance
        else if (rand < 0.30) type = 'SHIELD';        // 22% chance
        else if (rand < 0.52) type = 'SLOW_MOTION';   // 22% chance
        else if (rand < 0.74) type = 'MAGNET';        // 22% chance
        else type = 'DOUBLE_SCORE';                   // 26% chance
        
        return new PowerUp(x, -POWERUP_SIZE, type);
    }
}

export default PowerUp;
