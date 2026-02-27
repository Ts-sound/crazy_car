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
