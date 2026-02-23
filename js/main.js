import Game from './core/Game.js';
import Input from './core/Input.js';

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameCanvas');
    
    if (!canvas) {
        console.error('Game canvas not found!');
        return;
    }

    // Initialize game
    const game = new Game(canvas);
    
    // Initialize input (auto-registers event listeners)
    const input = new Input();

    // Start game loop
    game.gameLoop();

    console.log('Crazy Car initialized!');
});
