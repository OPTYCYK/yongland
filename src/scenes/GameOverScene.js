import Phaser from 'phaser';

/**
 * GameOverScene - Victory and defeat screens
 */
export default class GameOverScene extends Phaser.Scene {
    constructor() {
        super('GameOverScene');
    }

    init(data) {
        this.victory = data.victory || false;
        this.score = data.score || 0;
    }

    create() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        if (this.victory) {
            // Victory screen with Man City colors
            this.cameras.main.setBackgroundColor('#6CABDD');

            // Victory title
            const victoryText = this.add.text(width / 2, 120, 'VICTORY!', {
                font: 'bold 90px courier',
                fill: '#ffffff',
                stroke: '#1C2C5B',
                strokeThickness: 6
            });
            victoryText.setOrigin(0.5);

            // Exact victory message from specifications
            const messageText = this.add.text(width / 2, 250, 
                'Bert Yong Forever!!\nManchester is Blue!!', 
                {
                    font: 'bold 36px courier',
                    fill: '#1C2C5B',
                    stroke: '#ffffff',
                    strokeThickness: 3,
                    align: 'center',
                    lineSpacing: 8
                }
            );
            messageText.setOrigin(0.5);

            // Celebration animation
            this.tweens.add({
                targets: messageText,
                scale: { from: 1, to: 1.1 },
                duration: 1000,
                repeat: -1,
                yoyo: true,
                ease: 'Sine.easeInOut'
            });

            // Stars/sparkles animation
            for (let i = 0; i < 20; i++) {
                const star = this.add.circle(
                    Phaser.Math.Between(100, width - 100),
                    Phaser.Math.Between(50, height - 50),
                    3,
                    0xFFFFFF
                );
                
                this.tweens.add({
                    targets: star,
                    alpha: { from: 1, to: 0 },
                    scale: { from: 1, to: 2 },
                    duration: Phaser.Math.Between(1000, 2000),
                    repeat: -1,
                    delay: Phaser.Math.Between(0, 1000)
                });
            }

            // Score display
            const scoreText = this.add.text(width / 2, 400, 'Final Score: ' + this.score, {
                font: 'bold 28px courier',
                fill: '#ffffff',
                backgroundColor: '#1C2C5B',
                padding: { x: 15, y: 8 }
            });
            scoreText.setOrigin(0.5);

        } else {
            // Game over screen
            this.cameras.main.setBackgroundColor('#4d1a1a');

            const gameOverText = this.add.text(width / 2, 120, 'GAME OVER', {
                font: 'bold 80px courier',
                fill: '#ff0000',
                stroke: '#000000',
                strokeThickness: 5
            });
            gameOverText.setOrigin(0.5);

            const defeatMsg = this.add.text(width / 2, 250, 
                'Defeated by Fraud Yong!', 
                {
                    font: 'bold 32px courier',
                    fill: '#ff6600',
                    stroke: '#000000',
                    strokeThickness: 2
                }
            );
            defeatMsg.setOrigin(0.5);

            // Still show support message
            const supportText = this.add.text(width / 2, 330, 
                'But Bert Yong Forever!\nManchester is Blue!!', 
                {
                    font: 'bold 24px courier',
                    fill: '#6CABDD',
                    align: 'center',
                    lineSpacing: 4
                }
            );
            supportText.setOrigin(0.5);

            // Score display
            const scoreText = this.add.text(width / 2, 420, 'Final Score: ' + this.score, {
                font: 'bold 24px courier',
                fill: '#ffffff',
                stroke: '#000000',
                strokeThickness: 2
            });
            scoreText.setOrigin(0.5);
        }

        // Restart button
        const restartText = this.add.text(width / 2, height - 80, 'PRESS SPACE TO RESTART', {
            font: 'bold 24px courier',
            fill: '#ffffff',
            backgroundColor: this.victory ? '#1C2C5B' : '#000000',
            padding: { x: 20, y: 12 }
        });
        restartText.setOrigin(0.5);

        // Blinking animation
        this.tweens.add({
            targets: restartText,
            alpha: { from: 1, to: 0.4 },
            duration: 600,
            repeat: -1,
            yoyo: true
        });

        // Input handlers
        this.input.keyboard.on('keydown-SPACE', () => {
            this.scene.start('MenuScene');
        });

        this.input.keyboard.on('keydown-ENTER', () => {
            this.scene.start('MenuScene');
        });
    }
}
