import { POWERUP_TYPES, CANVAS_WIDTH, CANVAS_HEIGHT } from '../constants.js';

class Rendering {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
    }

    clear() {
        this.ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    }

    drawEntity(entity) {
        if (entity && entity.draw) {
            entity.draw(this.ctx);
        }
    }

    drawEntities(entities) {
        entities.forEach(entity => this.drawEntity(entity));
    }

    drawPlayer(player, effects) {
        if (effects.shield) {
            this.ctx.strokeStyle = '#3498db';
            this.ctx.lineWidth = 4;
            this.ctx.shadowColor = '#3498db';
            this.ctx.shadowBlur = 15;
            this.ctx.beginPath();
            this.ctx.arc(
                player.x + player.width / 2,
                player.y + player.height / 2,
                player.width / 2 + 10,
                0,
                Math.PI * 2
            );
            this.ctx.stroke();
            this.ctx.shadowBlur = 0;
        }

        player.draw(this.ctx);

        if (effects.speedBoost) {
            this.ctx.fillStyle = 'rgba(230, 126, 34, 0.3)';
            this.ctx.fillRect(
                player.x - 10,
                player.y + player.height,
                player.width + 20,
                20
            );
        }

        if (effects.magnet) {
            this.ctx.strokeStyle = '#2ecc71';
            this.ctx.lineWidth = 2;
            this.ctx.setLineDash([5, 5]);
            this.ctx.beginPath();
            this.ctx.arc(
                player.x + player.width / 2,
                player.y + player.height / 2,
                100,
                0,
                Math.PI * 2
            );
            this.ctx.stroke();
            this.ctx.setLineDash([]);
        }
    }

    drawUI(score, highScore, level, lives, levelConfig) {
        const ctx = this.ctx;

        ctx.fillStyle = 'white';
        ctx.font = '24px Arial';
        ctx.textAlign = 'left';
        ctx.fillText(`Score: ${score}`, 10, 30);

        ctx.fillStyle = '#ffd700';
        ctx.font = '18px Arial';
        ctx.fillText(`High: ${highScore}`, 10, 55);

        ctx.fillStyle = '#00ff00';
        ctx.textAlign = 'center';
        ctx.fillText(`Level: ${level} (${levelConfig.name})`, CANVAS_WIDTH / 2, 30);

        ctx.fillStyle = '#ff6b6b';
        ctx.textAlign = 'right';
        ctx.fillText('Lives: ' + '❤️'.repeat(lives), CANVAS_WIDTH - 10, 30);
    }

    drawActivePowerUps(activePowerUps) {
        if (activePowerUps.length === 0) return;

        const ctx = this.ctx;
        const startY = 10;
        const spacing = 25;

        activePowerUps.forEach((powerUp, index) => {
            const y = startY + index * spacing;
            const progress = powerUp.timer / POWERUP_TYPES[powerUp.type].duration;

            ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
            ctx.fillRect(10, y, 150, 20);

            ctx.fillStyle = POWERUP_TYPES[powerUp.type].color;
            ctx.fillRect(10, y, 150 * progress, 20);

            ctx.font = '14px Arial';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';
            ctx.fillText(`${powerUp.emoji} ${powerUp.name}`, 15, y + 10);

            ctx.fillStyle = '#fff';
            ctx.textAlign = 'right';
            ctx.fillText(`${powerUp.seconds}s`, 155, y + 10);
        });
    }

    drawStartScreen() {
        const ctx = this.ctx;
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        ctx.fillStyle = '#fff';
        ctx.font = 'bold 48px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('CRAZY CAR', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 100);

        ctx.font = '24px Arial';
        ctx.fillText('Press SPACE or ENTER to Start', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 50);

        const powerUps = Object.values(POWERUP_TYPES);
        powerUps.forEach((p, i) => {
            ctx.fillStyle = p.color;
            ctx.font = '16px Arial';
            ctx.fillText(
                `${p.emoji} ${p.name}`,
                CANVAS_WIDTH / 2,
                CANVAS_HEIGHT / 2 + i * 25
            );
        });
    }

    drawGameOverScreen(score, highScore, level, levelConfig) {
        const ctx = this.ctx;
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        ctx.fillStyle = '#e74c3c';
        ctx.font = 'bold 48px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('GAME OVER', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 80);

        ctx.fillStyle = '#fff';
        ctx.font = '32px Arial';
        ctx.fillText(`Score: ${score}`, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 30);

        ctx.font = '20px Arial';
        ctx.fillText(`Level: ${level} (${levelConfig.name})`, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 10);

        if (score >= highScore && score > 0) {
            ctx.fillStyle = '#f1c40f';
            ctx.font = '24px Arial';
            ctx.fillText('NEW HIGH SCORE!', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 50);
        }

        ctx.fillStyle = '#fff';
        ctx.font = '20px Arial';
        ctx.fillText('Press SPACE to Restart', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 90);
    }

    drawPauseScreen() {
        const ctx = this.ctx;
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        ctx.fillStyle = '#fff';
        ctx.fillRect(CANVAS_WIDTH / 2 - 35, CANVAS_HEIGHT / 2 - 40, 20, 80);
        ctx.fillRect(CANVAS_WIDTH / 2 + 15, CANVAS_HEIGHT / 2 - 40, 20, 80);

        ctx.font = 'bold 48px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('PAUSED', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 70);

        ctx.font = '20px Arial';
        ctx.fillText('Press SPACE to Resume', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 110);
    }

    drawLevelUpScreen(level, levelConfig, timer) {
        const ctx = this.ctx;
        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        ctx.fillStyle = '#00ff00';
        ctx.font = 'bold 48px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('LEVEL UP!', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 30);

        ctx.fillStyle = '#fff';
        ctx.font = '32px Arial';
        ctx.fillText(`Level ${level}`, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 20);
        ctx.font = '24px Arial';
        ctx.fillText(levelConfig.name, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 60);
    }
}

export default Rendering;
