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
