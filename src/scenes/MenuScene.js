import Phaser from 'phaser';

/**
 * MenuScene - Main menu and game intro
 */
export default class MenuScene extends Phaser.Scene {
    constructor() {
        super('MenuScene');
    }

    create() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        // Background - Man City colors
        this.cameras.main.setBackgroundColor('#6CABDD');

        // Add stadium ambiance
        this.add.rectangle(0, 0, width, height, 0x6CABDD).setOrigin(0);

        // Title
        const title = this.add.text(width / 2, 100, 'YONGLAND', {
            font: 'bold 80px courier',
            fill: '#ffffff',
            stroke: '#1C2C5B',
            strokeThickness: 6
        });
        title.setOrigin(0.5);

        // Subtitle
        const subtitle = this.add.text(width / 2, 200, 'Bert Yong vs Fraud Yong', {
            font: 'bold 32px courier',
            fill: '#1C2C5B',
            stroke: '#ffffff',
            strokeThickness: 2
        });
        subtitle.setOrigin(0.5);

        // Location text
        const location = this.add.text(width / 2, 250, 'Etihad Stadium, Manchester', {
            font: '20px courier',
            fill: '#ffffff',
            stroke: '#1C2C5B',
            strokeThickness: 1
        });
        location.setOrigin(0.5);

        // Instructions
        const instructions = this.add.text(width / 2, 340, 
            'Jump on the heads of 5 Mini Frauds,\n' +
            'then defeat the Giant Fraud!\n\n' +
            'Avoid touching their bodies!\n' +
            'Manchester is Blue!!',
            {
                font: '18px courier',
                fill: '#1C2C5B',
                align: 'center',
                lineSpacing: 4
            }
        );
        instructions.setOrigin(0.5);

        // Controls
        const controls = this.add.text(width / 2, 480, 
            'CONTROLS\n' +
            'Arrow Keys or A/D - Move Left/Right\n' +
            'Space or W - Jump',
            {
                font: '16px courier',
                fill: '#ffffff',
                backgroundColor: '#1C2C5B',
                padding: { x: 15, y: 10 },
                align: 'center'
            }
        );
        controls.setOrigin(0.5);

        // Start button
        const startButton = this.add.text(width / 2, 580, 'PRESS SPACE TO START', {
            font: 'bold 28px courier',
            fill: '#ffffff',
            backgroundColor: '#1C2C5B',
            padding: { x: 20, y: 12 }
        });
        startButton.setOrigin(0.5);

        // Blinking animation
        this.tweens.add({
            targets: startButton,
            alpha: { from: 1, to: 0.4 },
            duration: 700,
            repeat: -1,
            yoyo: true
        });

        // Floating animation for title
        this.tweens.add({
            targets: title,
            y: { from: 100, to: 110 },
            duration: 2000,
            repeat: -1,
            yoyo: true,
            ease: 'Sine.easeInOut'
        });

        // Input handlers
        this.input.keyboard.on('keydown-SPACE', () => {
            this.scene.start('GameScene');
        });

        this.input.keyboard.on('keydown-ENTER', () => {
            this.scene.start('GameScene');
        });
    }
}
