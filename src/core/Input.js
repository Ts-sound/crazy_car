import eventBus from './EventBus.js';
import PowerUp from '../entities/PowerUp.js';

class Input {
    constructor() {
        this.keys = {};
        this.touchStartX = null;
        this.setupKeyboard();
        this.setupTouch();
    }

    setupKeyboard() {
        document.addEventListener('keydown', (e) => {
            this.keys[e.key] = true;

            // Prevent default for game keys
            if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', ' '].includes(e.key)) {
                e.preventDefault();
            }

            // Movement
            if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
                eventBus.publish('INPUT_LEFT');
            }
            if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
                eventBus.publish('INPUT_RIGHT');
            }
            // Game state (start/restart)
            if (e.key === ' ' || e.key === 'Enter') {
                eventBus.publish('INPUT_ACTION');
            }
            // Pause toggle (space during gameplay)
            if (e.key === 'p' || e.key === 'P' || e.key === 'Escape') {
                eventBus.publish('INPUT_PAUSE');
            }

            // Print PowerUp stats
            if (e.key === 'e' || e.key === 'E') {
                PowerUp.printStats('Manual Stats (E key)');
            }
        });

        document.addEventListener('keyup', (e) => {
            this.keys[e.key] = false;
        });
    }

    setupTouch() {
        document.addEventListener('touchstart', (e) => {
            this.touchStartX = e.touches[0].clientX;
        });

        document.addEventListener('touchend', (e) => {
            if (this.touchStartX === null) return;

            const touchEndX = e.changedTouches[0].clientX;
            const diff = touchEndX - this.touchStartX;

            if (Math.abs(diff) > 30) {
                if (diff > 0) {
                    eventBus.publish('INPUT_RIGHT');
                } else {
                    eventBus.publish('INPUT_LEFT');
                }
            }

            this.touchStartX = null;
        });
    }

    dispose() {
        // Cleanup if needed
    }
}

export default Input;
