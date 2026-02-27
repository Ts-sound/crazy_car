class Collision {
    static check(a, b) {
        return (
            a.x < b.x + b.width &&
            a.x + a.width > b.x &&
            a.y < b.y + b.height &&
            a.y + a.height > b.y
        );
    }

    static checkWithBounds(entity, bounds) {
        return (
            entity.x < bounds.x + bounds.width &&
            entity.x + entity.width > bounds.x &&
            entity.y < bounds.y + bounds.height &&
            entity.y + entity.height > bounds.y
        );
    }
}

export default Collision;
