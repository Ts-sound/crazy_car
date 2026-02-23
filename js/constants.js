// Lane configuration
export const LANE_COUNT = 3;
export const LANE_WIDTH = 400 / LANE_COUNT;

// Entity dimensions
export const PLAYER_WIDTH = 60;
export const PLAYER_HEIGHT = 100;
export const OBSTACLE_WIDTH = 60;
export const OBSTACLE_HEIGHT = 100;
export const COIN_SIZE = 30;
export const POWERUP_SIZE = 35;

// Level configurations
export const LEVELS = {
    1: { name: 'Beginner', threshold: 0, speedMultiplier: 1.0, roadColor: '#333', lineColor: '#fff' },
    2: { name: 'Intermediate', threshold: 1000, speedMultiplier: 1.2, roadColor: '#d4a574', lineColor: '#8b7355' },
    3: { name: 'Expert', threshold: 3000, speedMultiplier: 1.4, roadColor: '#2d1b4e', lineColor: '#9b59b6' }
};

// Power-up types
export const POWERUP_TYPES = {
    SHIELD: { name: 'Shield', emoji: '🛡️', color: '#3498db', duration: 300, effect: 'shield' },
    SPEED_BOOST: { name: 'Speed Boost', emoji: '⚡', color: '#e67e22', duration: 300, effect: 'speedBoost' },
    SLOW_MOTION: { name: 'Slow Motion', emoji: '⏰', color: '#9b59b6', duration: 300, effect: 'slowMotion' },
    MAGNET: { name: 'Magnet', emoji: '🧲', color: '#2ecc71', duration: 300, effect: 'magnet' },
    DOUBLE_SCORE: { name: 'Double Score', emoji: '2x', color: '#f1c40f', duration: 480, effect: 'doubleScore' },
    EXTRA_LIFE: { name: 'Extra Life', emoji: '❤️', color: '#e74c3c', duration: 0, effect: 'extraLife' }
};

// Game constants
export const CANVAS_WIDTH = 400;
export const CANVAS_HEIGHT = 600;
export const INITIAL_LIVES = 3;
export const BASE_GAME_SPEED = 5;
