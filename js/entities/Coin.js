import Entity from './Entity.js';
import { COIN_SIZE, LANE_COUNT, LANE_WIDTH, COLLISION } from '../constants.js';

class Coin extends Entity {
    constructor(x, y) {
        super(x, y, COIN_SIZE, COIN_SIZE);
        this.value = COLLISION.coinValue;
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
