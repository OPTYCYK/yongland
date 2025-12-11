// YONGLAND - Phaser 3 Platformer Game
// Bert Yong vs Fraud Yong - Complete Game Implementation

const gameConfig = {
    type: Phaser.AUTO,
    width: 1200,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: [PreloadScene, MenuScene, GameScene, GameOverScene],
    render: {
        pixelArt: true,
        antialias: false
    }
};

const game = new Phaser.Game(gameConfig);

// =====================
// PRELOAD SCENE
// =====================
class PreloadScene extends Phaser.Scene {
    constructor() {
        super('PreloadScene');
    }

    preload() {
        // Display loading progress
        const progressBar = this.add.graphics();
        const progressBox = this.add.graphics();
        progressBox.fillStyle(0x222222, 0.8);
        progressBox.fillRect(240, 270, 320, 50);

        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        const loadingText = this.make.text({
            x: width / 2,
            y: height / 2 - 50,
            text: 'Loading YONGLAND...',
            style: {
                font: '20px courier',
                fill: '#ffffff'
            }
        });
        loadingText.setOrigin(0.5, 0.5);

        const percentText = this.make.text({
            x: width / 2,
            y: height / 2,
            text: '0%',
            style: {
                font: '18px courier',
                fill: '#ffffff'
            }
        });
        percentText.setOrigin(0.5, 0.5);

        this.load.on('progress', (value) => {
            percentText.setText(parseInt(value * 100) + '%');
            progressBar.clear();
            progressBar.fillStyle(0x00ff00, 1);
            progressBar.fillRect(250, 280, 300 * value, 30);
        });

        this.load.on('complete', () => {
            progressBar.destroy();
            progressBox.destroy();
            loadingText.destroy();
            percentText.destroy();
        });

        // Create graphics for game assets
        this.createAssets();
    }

    createAssets() {
        // We'll create visual assets dynamically in each scene
        // This ensures all assets are ready before game starts
    }

    create() {
        this.scene.start('MenuScene');
    }
}

// =====================
// MENU SCENE
// =====================
class MenuScene extends Phaser.Scene {
    constructor() {
        super('MenuScene');
    }

    create() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        // Background
        this.cameras.main.setBackgroundColor('#1a1a2e');

        // Title
        const title = this.add.text(width / 2, 100, 'YONGLAND', {
            font: 'bold 80px courier',
            fill: '#00ff00',
            stroke: '#000000',
            strokeThickness: 4
        });
        title.setOrigin(0.5);

        // Subtitle
        const subtitle = this.add.text(width / 2, 180, 'Bert Yong vs Fraud Yong', {
            font: '24px courier',
            fill: '#00ccff',
            stroke: '#000000',
            strokeThickness: 2
        });
        subtitle.setOrigin(0.5);

        // Instructions
        const instructions = this.add.text(width / 2, 280, 'Help Bert Yong escape from Fraud Yong!\nCollect the victory flag to win!', {
            font: '18px courier',
            fill: '#ffffff',
            align: 'center'
        });
        instructions.setOrigin(0.5);

        // Controls
        const controls = this.add.text(width / 2, 380, 'CONTROLS\nArrow Keys or A/D - Move Left/Right\nSpace or W - Jump\nDouble Jump Available', {
            font: '16px courier',
            fill: '#ffff00',
            align: 'center'
        });
        controls.setOrigin(0.5);

        // Start Button
        const startButton = this.add.text(width / 2, 520, 'PRESS SPACE TO START', {
            font: 'bold 24px courier',
            fill: '#00ff00',
            backgroundColor: '#000000',
            padding: { x: 20, y: 10 }
        });
        startButton.setOrigin(0.5);

        // Blinking effect
        this.tweens.add({
            targets: startButton,
            alpha: { from: 1, to: 0.3 },
            duration: 600,
            repeat: -1,
            yoyo: true
        });

        // Input
        this.input.keyboard.on('keydown-SPACE', () => {
            this.scene.start('GameScene');
        });
    }
}

// =====================
// GAME SCENE
// =====================
class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene');
    }

    create() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        // Background
        this.cameras.main.setBackgroundColor('#87ceeb');

        // Game variables
        this.lives = 3;
        this.score = 0;
        this.gameOver = false;
        this.victory = false;
        this.canDoubleJump = true;

        // Physics groups
        this.platforms = this.physics.add.staticGroup();
        this.enemies = this.physics.add.group();
        this.coins = this.physics.add.group();
        this.victoryFlag = null;

        // Create player
        this.createPlayer();

        // Create level
        this.createLevel();

        // Create enemies
        this.createEnemies();

        // Create collectibles
        this.createCollectibles();

        // Create victory flag
        this.createVictoryFlag();

        // Physics collisions
        this.physics.add.collider(this.player, this.platforms);
        this.physics.add.collider(this.enemies, this.platforms);
        this.physics.add.collider(this.coins, this.platforms);
        this.physics.add.collider(this.victoryFlag, this.platforms);

        // Overlap checks
        this.physics.add.overlap(this.player, this.enemies, this.handleEnemyCollision, null, this);
        this.physics.add.overlap(this.player, this.coins, this.handleCoinCollision, null, this);
        this.physics.add.overlap(this.player, this.victoryFlag, this.handleVictoryCollision, null, this);

        // Input
        this.cursors = this.input.keyboard.createCursorKeys();
        this.wasdKeys = this.input.keyboard.addKeys('W,A,S,D');
        this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        // UI
        this.createUI();

        // Camera follow
        this.cameras.main.setBounds(0, 0, 1200, 600);
        this.cameras.main.startFollow(this.player);
    }

    createPlayer() {
        // Create Bert Yong player
        const playerGraphics = this.make.graphics({ x: 0, y: 0, add: false });
        
        // Draw Bert Yong (player character)
        playerGraphics.fillStyle(0xff6600, 1); // Orange body
        playerGraphics.fillRect(0, 0, 30, 40); // Body

        playerGraphics.fillStyle(0xffdbac, 1); // Skin tone
        playerGraphics.fillCircle(15, 12, 10); // Head

        playerGraphics.fillStyle(0x000000, 1);
        playerGraphics.fillCircle(11, 10, 2); // Left eye
        playerGraphics.fillCircle(19, 10, 2); // Right eye

        playerGraphics.fillStyle(0xffffff, 1);
        playerGraphics.fillRect(5, 35, 8, 6); // Left shoe
        playerGraphics.fillRect(17, 35, 8, 6); // Right shoe

        playerGraphics.fillStyle(0xff6600, 1);
        playerGraphics.fillRect(3, 22, 6, 12); // Left arm
        playerGraphics.fillRect(21, 22, 6, 12); // Right arm

        const texture = playerGraphics.generateTexture('player', 30, 41);
        playerGraphics.destroy();

        this.player = this.physics.add.sprite(100, 400, 'player');
        this.player.setBounce(0);
        this.player.setCollideWorldBounds(true);
        this.player.setDrag(0.2);
        this.player.body.setGravityY(0);
    }

    createLevel() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        // Ground
        this.createPlatform(0, height - 40, 1200, 40);

        // Platform layout
        this.createPlatform(150, 500, 250, 20); // Platform 1
        this.createPlatform(500, 450, 250, 20); // Platform 2
        this.createPlatform(850, 400, 250, 20); // Platform 3
        this.createPlatform(250, 350, 200, 20); // Platform 4
        this.createPlatform(650, 300, 200, 20); // Platform 5
        this.createPlatform(1050, 250, 150, 20); // Platform 6

        // Decorative platforms
        this.createPlatform(400, 200, 150, 20); // Platform 7
        this.createPlatform(800, 150, 150, 20); // Platform 8
    }

    createPlatform(x, y, width, height) {
        const platform = this.platforms.create(x, y, null);
        platform.setScale(width / 10, height / 10);
        platform.setOrigin(0, 0);

        // Visual representation
        const graphics = this.make.graphics({ x: x, y: y, add: false });
        graphics.fillStyle(0x8b4513, 1); // Brown color
        graphics.fillRect(0, 0, width, height);
        graphics.lineStyle(2, 0x654321, 1);
        graphics.strokeRect(0, 0, width, height);
        graphics.generateTexture('platform_' + x + '_' + y, width, height);
        graphics.destroy();

        platform.setDisplaySize(width, height);
        platform.setTexture('platform_' + x + '_' + y);
    }

    createEnemies() {
        // Fraud Yong - Main enemy
        this.createEnemy(700, 300, 'main');

        // Secondary enemies
        this.createEnemy(400, 380, 'secondary');
        this.createEnemy(1000, 350, 'secondary');
    }

    createEnemy(x, y, type) {
        const enemyGraphics = this.make.graphics({ x: 0, y: 0, add: false });

        // Draw Fraud Yong (enemy character) - red variant
        enemyGraphics.fillStyle(0xff0000, 1); // Red body
        enemyGraphics.fillRect(0, 0, 30, 40); // Body

        enemyGraphics.fillStyle(0xffdbac, 1); // Skin tone
        enemyGraphics.fillCircle(15, 12, 10); // Head

        enemyGraphics.fillStyle(0x000000, 1);
        enemyGraphics.fillCircle(11, 10, 2); // Left eye
        enemyGraphics.fillCircle(19, 10, 2); // Right eye

        // Evil expression
        enemyGraphics.lineStyle(2, 0x000000, 1);
        enemyGraphics.strokeCircle(15, 18, 3); // Mouth

        enemyGraphics.fillStyle(0xffffff, 1);
        enemyGraphics.fillRect(5, 35, 8, 6); // Left shoe
        enemyGraphics.fillRect(17, 35, 8, 6); // Right shoe

        enemyGraphics.fillStyle(0xff0000, 1);
        enemyGraphics.fillRect(3, 22, 6, 12); // Left arm
        enemyGraphics.fillRect(21, 22, 6, 12); // Right arm

        const textureKey = 'enemy_' + type;
        const texture = enemyGraphics.generateTexture(textureKey, 30, 41);
        enemyGraphics.destroy();

        const enemy = this.enemies.create(x, y, textureKey);
        enemy.setBounce(1);
        enemy.setCollideWorldBounds(true);
        enemy.type = type;
        enemy.speed = type === 'main' ? 80 : 60;
        enemy.direction = 1;
        enemy.patrolDistance = type === 'main' ? 200 : 150;
        enemy.startX = x;

        return enemy;
    }

    createCollectibles() {
        // Add coins throughout the level
        const coinPositions = [
            { x: 300, y: 450 },
            { x: 600, y: 400 },
            { x: 900, y: 350 },
            { x: 400, y: 300 },
            { x: 800, y: 250 },
            { x: 500, y: 150 }
        ];

        coinPositions.forEach(pos => {
            this.createCoin(pos.x, pos.y);
        });
    }

    createCoin(x, y) {
        const coinGraphics = this.make.graphics({ x: 0, y: 0, add: false });
        coinGraphics.fillStyle(0xffff00, 1);
        coinGraphics.fillCircle(8, 8, 8);
        coinGraphics.lineStyle(2, 0xffa500, 1);
        coinGraphics.strokeCircle(8, 8, 8);
        const texture = coinGraphics.generateTexture('coin', 16, 16);
        coinGraphics.destroy();

        const coin = this.coins.create(x, y, 'coin');
        coin.setBounce(0.5);
        coin.setCollideWorldBounds(true);
        coin.setVelocityY(-50);
    }

    createVictoryFlag() {
        const flagGraphics = this.make.graphics({ x: 0, y: 0, add: false });
        
        // Flag pole
        flagGraphics.fillStyle(0x8b4513, 1);
        flagGraphics.fillRect(0, 20, 8, 30);

        // Flag
        flagGraphics.fillStyle(0x00ff00, 1);
        flagGraphics.fillRect(8, 20, 30, 20);

        // Star on flag
        flagGraphics.fillStyle(0xffff00, 1);
        flagGraphics.fillCircle(23, 30, 4);

        const texture = flagGraphics.generateTexture('victoryFlag', 40, 50);
        flagGraphics.destroy();

        this.victoryFlag = this.physics.add.sprite(1100, 150, 'victoryFlag');
        this.victoryFlag.setCollideWorldBounds(true);
        this.victoryFlag.setBounce(0);
    }

    createUI() {
        // Lives display
        this.livesText = this.add.text(20, 20, 'Lives: ' + this.lives, {
            font: '20px courier',
            fill: '#ff0000'
        });
        this.livesText.setScrollFactor(0);

        // Score display
        this.scoreText = this.add.text(20, 50, 'Score: ' + this.score, {
            font: '20px courier',
            fill: '#ffff00'
        });
        this.scoreText.setScrollFactor(0);

        // Level name
        this.levelText = this.add.text(this.cameras.main.width / 2, 20, 'YONGLAND', {
            font: 'bold 20px courier',
            fill: '#00ff00'
        });
        this.levelText.setOrigin(0.5, 0);
        this.levelText.setScrollFactor(0);
    }

    update() {
        if (this.gameOver || this.victory) {
            return;
        }

        // Player input
        this.handlePlayerMovement();

        // Enemy AI
        this.updateEnemyAI();

        // Check if player fell off the world
        if (this.player.y > 650) {
            this.handleEnemyCollision();
        }
    }

    handlePlayerMovement() {
        const moveLeft = this.cursors.left.isDown || this.wasdKeys.A.isDown;
        const moveRight = this.cursors.right.isDown || this.wasdKeys.D.isDown;
        const jump = this.spaceKey.isDown || this.wasdKeys.W.isDown;

        // Horizontal movement
        if (moveLeft) {
            this.player.setVelocityX(-150);
        } else if (moveRight) {
            this.player.setVelocityX(150);
        } else {
            this.player.setVelocityX(0);
        }

        // Jumping
        const isOnGround = this.player.body.touching.down;

        if (jump && isOnGround) {
            this.player.setVelocityY(-300);
            this.canDoubleJump = true;
        } else if (jump && this.canDoubleJump && !isOnGround) {
            this.player.setVelocityY(-250);
            this.canDoubleJump = false;
        } else if (!jump) {
            this.canDoubleJump = false;
        }
    }

    updateEnemyAI() {
        this.enemies.children.entries.forEach(enemy => {
            // Patrol behavior
            enemy.x += enemy.direction * enemy.speed * 0.016; // 0.016 = 1/60 frame time

            // Check if reached patrol boundary
            if (Math.abs(enemy.x - enemy.startX) > enemy.patrolDistance) {
                enemy.direction *= -1;
            }

            // Chase player if close enough
            const distanceToPlayer = Math.abs(this.player.x - enemy.x);
            if (distanceToPlayer < 300) {
                if (this.player.x < enemy.x) {
                    enemy.setVelocityX(-enemy.speed);
                } else {
                    enemy.setVelocityX(enemy.speed);
                }
            } else {
                enemy.setVelocityX(enemy.direction * enemy.speed);
            }

            // Simple jumping behavior
            if (enemy.body.touching.down && Phaser.Math.Between(0, 100) > 95) {
                enemy.setVelocityY(-150);
            }
        });
    }

    handleEnemyCollision() {
        this.lives--;
        this.livesText.setText('Lives: ' + this.lives);

        if (this.lives <= 0) {
            this.gameOver = true;
            this.scene.start('GameOverScene', { victory: false, score: this.score });
        } else {
            // Reset player position
            this.player.x = 100;
            this.player.y = 400;
            this.player.setVelocity(0, 0);
        }
    }

    handleCoinCollision(player, coin) {
        coin.destroy();
        this.score += 10;
        this.scoreText.setText('Score: ' + this.score);

        // Coin collection sound effect simulation
        this.tweens.add({
            targets: this.scoreText,
            scale: { from: 1, to: 1.2 },
            duration: 100,
            yoyo: true
        });
    }

    handleVictoryCollision() {
        this.victory = true;
        this.score += 100; // Bonus for winning
        this.scene.start('GameOverScene', { victory: true, score: this.score });
    }
}

// =====================
// GAME OVER SCENE
// =====================
class GameOverScene extends Phaser.Scene {
    constructor() {
        super('GameOverScene');
    }

    init(data) {
        this.victory = data.victory;
        this.score = data.score;
    }

    create() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        // Background
        if (this.victory) {
            this.cameras.main.setBackgroundColor('#1a4d2e');
        } else {
            this.cameras.main.setBackgroundColor('#4d1a1a');
        }

        if (this.victory) {
            // Victory screen
            const victoryText = this.add.text(width / 2, 100, 'VICTORY!', {
                font: 'bold 80px courier',
                fill: '#00ff00',
                stroke: '#000000',
                strokeThickness: 4
            });
            victoryText.setOrigin(0.5);

            const messageText = this.add.text(width / 2, 220, 'Bert Yong Forever!!\nManchester is Blue!!', {
                font: 'bold 32px courier',
                fill: '#00ccff',
                stroke: '#000000',
                strokeThickness: 3,
                align: 'center'
            });
            messageText.setOrigin(0.5);

            // Celebration animation
            this.tweens.add({
                targets: messageText,
                scale: { from: 0.8, to: 1.2 },
                duration: 800,
                repeat: -1,
                yoyo: true
            });

            const cheerText = this.add.text(width / 2, 380, 'You escaped from Fraud Yong!', {
                font: '24px courier',
                fill: '#ffff00'
            });
            cheerText.setOrigin(0.5);
        } else {
            // Defeat screen
            const defeatText = this.add.text(width / 2, 100, 'GAME OVER', {
                font: 'bold 80px courier',
                fill: '#ff0000',
                stroke: '#000000',
                strokeThickness: 4
            });
            defeatText.setOrigin(0.5);

            const messageText = this.add.text(width / 2, 220, 'Caught by Fraud Yong!', {
                font: 'bold 32px courier',
                fill: '#ff6600',
                stroke: '#000000',
                strokeThickness: 3
            });
            messageText.setOrigin(0.5);

            const defeatMessage = this.add.text(width / 2, 300, 'But Bert Yong Forever!\nManchester is Blue!!', {
                font: 'bold 24px courier',
                fill: '#00ccff',
                align: 'center'
            });
            defeatMessage.setOrigin(0.5);
        }

        // Score display
        const scoreText = this.add.text(width / 2, 450, 'Final Score: ' + this.score, {
            font: 'bold 24px courier',
            fill: '#ffffff',
            stroke: '#000000',
            strokeThickness: 2
        });
        scoreText.setOrigin(0.5);

        // Restart button
        const restartText = this.add.text(width / 2, 520, 'PRESS SPACE TO RETURN TO MENU', {
            font: 'bold 20px courier',
            fill: '#00ff00',
            backgroundColor: '#000000',
            padding: { x: 20, y: 10 }
        });
        restartText.setOrigin(0.5);

        // Blinking effect
        this.tweens.add({
            targets: restartText,
            alpha: { from: 1, to: 0.3 },
            duration: 600,
            repeat: -1,
            yoyo: true
        });

        // Input
        this.input.keyboard.on('keydown-SPACE', () => {
            this.scene.start('MenuScene');
        });
    }
}
