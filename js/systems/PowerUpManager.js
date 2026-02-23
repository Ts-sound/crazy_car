import { POWERUP_TYPES } from '../constants.js';

class PowerUpManager {
    constructor() {
        this.activePowerUps = [];
    }

    activate(type) {
        const typeData = POWERUP_TYPES[type];

        if (type === 'EXTRA_LIFE') {
            return { type: 'INSTANT_LIFE', data: { amount: 1 } };
        }

        const existing = this.activePowerUps.find(p => p.type === type);
        if (existing) {
            existing.timer = typeData.duration;
        } else {
            this.activePowerUps.push({
                type,
                timer: typeData.duration,
                name: typeData.name,
                emoji: typeData.emoji,
                effect: typeData.effect
            });
        }

        return { type: 'ACTIVATED', powerUp: type };
    }

    update() {
        const expired = [];

        this.activePowerUps.forEach((powerUp, index) => {
            powerUp.timer--;
            if (powerUp.timer <= 0) {
                expired.push(powerUp);
            }
        });

        expired.forEach(p => {
            this.activePowerUps = this.activePowerUps.filter(ap => ap !== p);
        });

        return expired;
    }

    hasEffect(effect) {
        return this.activePowerUps.some(p => p.effect === effect);
    }

    getActiveList() {
        return this.activePowerUps.map(p => ({
            ...p,
            seconds: Math.ceil(p.timer / 60)
        }));
    }

    getMultiplier() {
        return this.hasEffect('doubleScore') ? 2 : 1;
    }

    getSpeedModifier() {
        let modifier = 1;
        if (this.hasEffect('speedBoost')) modifier *= 1.5;
        if (this.hasEffect('slowMotion')) modifier *= 0.5;
        return modifier;
    }

    reset() {
        this.activePowerUps = [];
    }
}

export default PowerUpManager;
