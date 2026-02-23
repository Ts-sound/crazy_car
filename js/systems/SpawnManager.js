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
