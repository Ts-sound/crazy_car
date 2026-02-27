import Game from './core/Game.js';
import Input from './core/Input.js';

function init() {
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
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    // DOM already loaded (script in head with defer/inline)
    init();
}
