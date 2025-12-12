import Phaser from 'phaser';

/**
 * PreloadScene - Handles loading of game assets
 */
export default class PreloadScene extends Phaser.Scene {
    constructor() {
        super('PreloadScene');
    }

    preload() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        // Loading bar background
        const progressBox = this.add.graphics();
        progressBox.fillStyle(0x222222, 0.8);
        progressBox.fillRect(width / 2 - 160, height / 2 - 25, 320, 50);

        // Loading bar
        const progressBar = this.add.graphics();

        // Loading text
        const loadingText = this.add.text(width / 2, height / 2 - 60, 'Loading YONGLAND...', {
            font: '24px courier',
            fill: '#ffffff'
        });
        loadingText.setOrigin(0.5);

        // Percentage text
        const percentText = this.add.text(width / 2, height / 2, '0%', {
            font: '20px courier',
            fill: '#ffffff'
        });
        percentText.setOrigin(0.5);

        // Update progress bar
        this.load.on('progress', (value) => {
            percentText.setText(parseInt(value * 100) + '%');
            progressBar.clear();
            progressBar.fillStyle(0x6CABDD, 1); // Man City blue
            progressBar.fillRect(width / 2 - 150, height / 2 - 15, 300 * value, 30);
        });

        // Hide loading elements when complete
        this.load.on('complete', () => {
            progressBar.destroy();
            progressBox.destroy();
            loadingText.destroy();
            percentText.destroy();
            
            // Hide HTML loading screen
            const loadingDiv = document.getElementById('loading');
            if (loadingDiv) {
                loadingDiv.classList.add('hidden');
            }
        });

        // Create sprite textures programmatically
        this.createSprites();
    }

    createSprites() {
        // Sprites will be created dynamically in the game
        // This ensures compatibility and reduces asset loading
    }

    create() {
        // Start the menu scene
        this.scene.start('MenuScene');
    }
}
