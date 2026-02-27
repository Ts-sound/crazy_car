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
