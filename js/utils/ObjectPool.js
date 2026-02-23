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
