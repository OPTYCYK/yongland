// YONGLAND - Bert Yong vs Fraud Yong Platformer Game
// Phaser 3 Game Engine
// Set in Etihad Stadium with Man City theming

const gameConfig = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: [PreloadScene, MenuScene, GameScene, GameOverScene],
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        expandParent: true
    },
    render: {
        pixelArt: true,
        antialias: true
    }
};

const game = new Phaser.Game(gameConfig);

// ============================================================================
// PRELOAD SCENE
// ============================================================================
class PreloadScene extends Phaser.Scene {
    constructor() {
        super('PreloadScene');
    }

    preload() {
        // Load graphics using graphics API (no external assets needed)
        this.load.scenePlugin('rexuiplugin', 'https://cdn.jsdelivr.net/npm/phaser3-rex-plugins@1.1.48/dist/rexuiplugin.min.js', 'rexUI', 'rexUI');
    }

    create() {
        this.scene.start('MenuScene');
    }
}

// ============================================================================
// MENU SCENE
// ============================================================================
class MenuScene extends Phaser.Scene {
    constructor() {
        super('MenuScene');
    }

    create() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        // Background - Etihad Stadium theme (sky blue)
        this.cameras.main.setBackgroundColor('#87CEEB');

        // Draw stadium background
        const graphics = this.make.graphics({ x: 0, y: 0, add: false });
        graphics.fillStyle(0x0066CC, 1); // Manchester City blue
        graphics.fillRect(0, 0, width, height * 0.5);
        graphics.fillStyle(0x87CEEB, 1); // Sky
        graphics.fillRect(0, height * 0.5, width, height * 0.5);
        graphics.generateTexture('stadium_bg', width, height);
        graphics.destroy();

        this.add.image(width / 2, height / 2, 'stadium_bg');

        // Title
        const titleText = this.add.text(width / 2, height * 0.15, 'YONGLAND', {
            fontSize: '72px',
            fill: '#FFFFFF',
            fontStyle: 'bold',
            fontFamily: 'Arial'
        });
        titleText.setOrigin(0.5);
        this.tweens.add({
            targets: titleText,
            scale: 1.1,
            duration: 1000,
            yoyo: true,
            repeat: -1
        });

        // Subtitle
        this.add.text(width / 2, height * 0.28, 'Bert Yong vs Fraud Yong', {
            fontSize: '32px',
            fill: '#FFD700',
            fontFamily: 'Arial'
        }).setOrigin(0.5);

        // Etihad Stadium subtitle
        this.add.text(width / 2, height * 0.36, 'Manchester is Blue!', {
            fontSize: '24px',
            fill: '#FFFFFF',
            fontFamily: 'Arial'
        }).setOrigin(0.5);

        // Instructions
        const instructions = [
            'Controls:',
            'LEFT/RIGHT Arrow - Move Bert',
            'SPACE - Jump',
            'Mobile: Touch arrows to move/jump',
            '',
            'Objective:',
            'Jump on Fraud Yongs to defeat them!',
            'Mini Frauds (1 jump to defeat)',
            'Giant Frauds (3 jumps to defeat)',
            'Survive with 5 lives and reach the goal!',
            '',
            'Manchester is Blue! Bert Yong Forever!!!'
        ];

        let yPos = height * 0.48;
        instructions.forEach((line, index) => {
            const color = line.includes('Controls') || line.includes('Objective') ? '#FFD700' : '#FFFFFF';
            const size = line.includes('Controls') || line.includes('Objective') ? '18px' : '14px';
            this.add.text(width / 2, yPos + (index * 20), line, {
                fontSize: size,
                fill: color,
                fontFamily: 'Arial'
            }).setOrigin(0.5);
        });

        // Play Button
        const playButton = this.add.rectangle(width / 2, height * 0.85, 200, 60, 0x00AA00);
        playButton.setInteractive({ useHandCursor: true });
        playButton.on('pointerover', () => playButton.setFillStyle(0x00DD00));
        playButton.on('pointerout', () => playButton.setFillStyle(0x00AA00));
        playButton.on('pointerdown', () => this.scene.start('GameScene'));

        this.add.text(width / 2, height * 0.85, 'PLAY', {
            fontSize: '32px',
            fill: '#FFFFFF',
            fontStyle: 'bold',
            fontFamily: 'Arial'
        }).setOrigin(0.5);
    }
}

// ============================================================================
// GAME SCENE
// ============================================================================
class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene');
    }

    create() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        // Game variables
        this.gameWidth = width;
        this.gameHeight = height;
        this.lives = 5;
        this.kills = 0;
        this.levelHeight = height * 0.8;
        this.gameActive = true;

        // Background - Etihad Stadium
        this.cameras.main.setBackgroundColor('#87CEEB');
        this.drawStadiumBackground();

        // Create groups
        this.platforms = this.physics.add.staticGroup();
        this.enemies = this.physics.add.group();
        this.particles = this.add.particles(0xFFFFFF);

        // Create player (Bert Yong)
        this.createPlayer();

        // Create level
        this.createLevel();

        // Create goal
        this.createGoal();

        // Create UI
        this.createUI();

        // Input handling
        this.createInputHandling();

        // Collisions
        this.physics.add.collider(this.player, this.platforms);
        this.physics.add.collider(this.enemies, this.platforms);

        // Enemy collision with player
        this.physics.add.overlap(this.player, this.enemies, this.playerHitEnemy, null, this);

        // Jump on enemy heads
        this.physics.add.overlap(this.player, this.enemies, this.jumpOnEnemy, null, this);

        // Goal collision
        this.physics.add.overlap(this.player, this.goal, this.reachedGoal, null, this);

        // Spawn enemies
        this.spawnEnemies();

        // Enemy AI update
        this.time.addEvent({
            delay: 500,
            callback: this.updateEnemyAI,
            callbackScope: this,
            loop: true
        });
    }

    drawStadiumBackground() {
        const graphics = this.make.graphics({ x: 0, y: 0, add: false });
        const width = this.gameWidth;
        const height = this.gameHeight;

        // Sky
        graphics.fillStyle(0x87CEEB, 1);
        graphics.fillRect(0, 0, width, height * 0.4);

        // Stadium - Manchester City blue
        graphics.fillStyle(0x0066CC, 1);
        graphics.fillRect(0, height * 0.35, width, height * 0.65);

        // Crowd pattern (represents Man City fans)
        graphics.fillStyle(0x004499, 0.6);
        for (let i = 0; i < width; i += 50) {
            for (let j = 0; j < height * 0.3; j += 30) {
                graphics.fillCircle(i, height * 0.5 + j, 8);
            }
        }

        // Goal posts (football theme)
        graphics.lineStyle(4, 0xFFFFFF, 1);
        graphics.lineBetween(width * 0.1, height * 0.25, width * 0.1, height * 0.4);
        graphics.lineBetween(width * 0.15, height * 0.25, width * 0.15, height * 0.4);
        graphics.lineBetween(width * 0.1, height * 0.25, width * 0.15, height * 0.25);

        graphics.lineBetween(width * 0.85, height * 0.25, width * 0.85, height * 0.4);
        graphics.lineBetween(width * 0.9, height * 0.25, width * 0.9, height * 0.4);
        graphics.lineBetween(width * 0.85, height * 0.25, width * 0.9, height * 0.25);

        graphics.generateTexture('bg', width, height);
        graphics.destroy();

        this.add.image(width / 2, height / 2, 'bg');
    }

    createPlayer() {
        const startX = this.gameWidth * 0.1;
        const startY = this.gameHeight * 0.5;

        // Create player graphics
        const playerGraphics = this.make.graphics({ x: 0, y: 0, add: false });
        playerGraphics.fillStyle(0xFF6600, 1); // Orange (Bert)
        playerGraphics.fillRect(0, 0, 30, 40);
        playerGraphics.fillStyle(0xFFDBAC, 1); // Skin tone
        playerGraphics.fillCircle(15, 10, 8); // Head
        playerGraphics.fillStyle(0x000000, 1);
        playerGraphics.fillCircle(12, 8, 2); // Left eye
        playerGraphics.fillCircle(18, 8, 2); // Right eye
        playerGraphics.generateTexture('player', 30, 40);
        playerGraphics.destroy();

        this.player = this.physics.add.sprite(startX, startY, 'player');
        this.player.setBounce(0.2);
        this.player.setCollideWorldBounds(true);
        this.player.body.onWorldBounds = true;
        this.player.name = 'Bert';

        // Player properties
        this.player.speed = 200;
        this.player.jumpPower = 330;
        this.player.isJumping = false;
        this.player.jumpedOnEnemy = false;
        this.player.velocityY = 0;
    }

    createLevel() {
        const width = this.gameWidth;
        const height = this.gameHeight;

        // Ground platform
        let ground = this.platforms.create(width / 2, height * 0.9, null);
        ground.setScale(width / 100, 1).refreshBody();
        ground.body.immovable = true;
        this.drawPlatform(ground, width, 40, 0x0066CC);

        // Platform 1 - left side
        let plat1 = this.platforms.create(width * 0.15, height * 0.75, null);
        plat1.setScale(2.5, 0.8).refreshBody();
        plat1.body.immovable = true;
        this.drawPlatform(plat1, 250, 40, 0x003399);

        // Platform 2 - middle
        let plat2 = this.platforms.create(width * 0.5, height * 0.6, null);
        plat2.setScale(2.5, 0.8).refreshBody();
        plat2.body.immovable = true;
        this.drawPlatform(plat2, 250, 40, 0x003399);

        // Platform 3 - right side
        let plat3 = this.platforms.create(width * 0.85, height * 0.75, null);
        plat3.setScale(2.5, 0.8).refreshBody();
        plat3.body.immovable = true;
        this.drawPlatform(plat3, 250, 40, 0x003399);

        // Platform 4 - high left
        let plat4 = this.platforms.create(width * 0.25, height * 0.45, null);
        plat4.setScale(2, 0.8).refreshBody();
        plat4.body.immovable = true;
        this.drawPlatform(plat4, 200, 40, 0x003399);

        // Platform 5 - high right
        let plat5 = this.platforms.create(width * 0.75, height * 0.45, null);
        plat5.setScale(2, 0.8).refreshBody();
        plat5.body.immovable = true;
        this.drawPlatform(plat5, 200, 40, 0x003399);

        // Platform 6 - top middle (goal platform)
        let platGoal = this.platforms.create(width * 0.5, height * 0.25, null);
        platGoal.setScale(2.2, 0.8).refreshBody();
        platGoal.body.immovable = true;
        this.drawPlatform(platGoal, 220, 40, 0x00AA00);

        // Store platforms for reference
        this.platformList = [ground, plat1, plat2, plat3, plat4, plat5, platGoal];
    }

    drawPlatform(platform, width, height, color) {
        const graphics = this.make.graphics({ x: 0, y: 0, add: false });
        graphics.fillStyle(color, 1);
        graphics.fillRect(0, 0, width, height);
        // Add football texture (horizontal lines)
        graphics.lineStyle(2, 0xFFFFFF, 0.3);
        for (let i = 0; i < width; i += 30) {
            graphics.lineBetween(i, 0, i, height);
        }
        graphics.generateTexture(`platform_${platform.x}_${platform.y}`, width, height);
        graphics.destroy();

        platform.setTexture(`platform_${platform.x}_${platform.y}`);
    }

    createGoal() {
        const graphics = this.make.graphics({ x: 0, y: 0, add: false });
        graphics.fillStyle(0xFFD700, 1); // Gold
        graphics.fillCircle(20, 20, 18);
        graphics.fillStyle(0x000000, 1);
        graphics.fillText('⭐', 10, 25);
        graphics.generateTexture('goal', 40, 40);
        graphics.destroy();

        this.goal = this.physics.add.sprite(this.gameWidth * 0.5, this.gameHeight * 0.18, 'goal');
        this.goal.setCollideWorldBounds(true);

        // Add tween to make goal pulse
        this.tweens.add({
            targets: this.goal,
            scale: 1.2,
            duration: 500,
            yoyo: true,
            repeat: -1
        });
    }

    spawnEnemies() {
        // Spawn mini frauds (half size, 1 hit to kill)
        const miniFraudPositions = [
            { x: this.gameWidth * 0.15, y: this.gameHeight * 0.68 },
            { x: this.gameWidth * 0.5, y: this.gameHeight * 0.53 },
            { x: this.gameWidth * 0.85, y: this.gameHeight * 0.68 }
        ];

        miniFraudPositions.forEach(pos => {
            this.spawnEnemy(pos.x, pos.y, 'mini', 1);
        });

        // Spawn giant fraud (twice size, 3 hits to kill)
        this.spawnEnemy(this.gameWidth * 0.5, this.gameHeight * 0.35, 'giant', 3);
    }

    spawnEnemy(x, y, type, hitPoints) {
        const enemyGraphics = this.make.graphics({ x: 0, y: 0, add: false });

        let width = 30;
        let height = 40;
        let scale = 1;

        if (type === 'mini') {
            scale = 0.5;
            width = 15;
            height = 20;
        } else if (type === 'giant') {
            scale = 2;
            width = 60;
            height = 80;
        }

        // Draw enemy (red for Fraud Yong)
        enemyGraphics.fillStyle(0xCC0000, 1); // Red
        enemyGraphics.fillRect(0, 0, width, height);
        enemyGraphics.fillStyle(0xFFDBAC, 1); // Skin
        enemyGraphics.fillCircle(width / 2, width / 4, width / 4); // Head
        enemyGraphics.fillStyle(0xFFFFFF, 1);
        enemyGraphics.fillCircle(width / 3, width / 6, 3); // Left eye
        enemyGraphics.fillCircle(2 * width / 3, width / 6, 3); // Right eye
        enemyGraphics.fillStyle(0x000000, 1);
        enemyGraphics.fillCircle(width / 3, width / 6, 1.5); // Left pupil
        enemyGraphics.fillCircle(2 * width / 3, width / 6, 1.5); // Right pupil

        const textureName = `enemy_${type}_${x}_${y}`;
        enemyGraphics.generateTexture(textureName, width, height);
        enemyGraphics.destroy();

        const enemy = this.enemies.create(x, y, textureName);
        enemy.setBounce(0.2);
        enemy.setCollideWorldBounds(true);

        // Enemy properties
        enemy.type = type;
        enemy.hitPoints = hitPoints;
        enemy.maxHitPoints = hitPoints;
        enemy.speed = type === 'giant' ? 80 : 120;
        enemy.direction = Phaser.Math.Between(0, 1) === 0 ? -1 : 1;
        enemy.changeDirectionTimer = 0;

        return enemy;
    }

    createUI() {
        const width = this.gameWidth;
        const uiHeight = 30;

        // UI Background
        const uiGraphics = this.make.graphics({ x: 0, y: 0, add: false });
        uiGraphics.fillStyle(0x000000, 0.7);
        uiGraphics.fillRect(0, 0, width, uiHeight);
        uiGraphics.generateTexture('ui_bg', width, uiHeight);
        uiGraphics.destroy();

        this.add.image(0, 0, 'ui_bg').setOrigin(0, 0);

        // Lives display
        this.livesText = this.add.text(20, 5, `Lives: ${this.lives}`, {
            fontSize: '20px',
            fill: '#FF0000',
            fontFamily: 'Arial'
        });

        // Kills display
        this.killsText = this.add.text(width / 2 - 80, 5, `Fraud Yongs Defeated: ${this.kills}`, {
            fontSize: '20px',
            fill: '#00FF00',
            fontFamily: 'Arial'
        });

        // Instructions (mobile)
        this.instructionText = this.add.text(width - 280, 5, 'Use Arrow Keys or Touch Controls', {
            fontSize: '14px',
            fill: '#FFFFFF',
            fontFamily: 'Arial'
        });
    }

    createInputHandling() {
        this.cursors = this.input.keyboard.createCursorKeys();
        this.spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        // Mobile button support
        this.createMobileControls();
    }

    createMobileControls() {
        const width = this.gameWidth;
        const height = this.gameHeight;
        const buttonSize = 50;
        const spacing = 10;

        // Left button
        this.leftButton = this.add.rectangle(
            spacing + buttonSize / 2,
            height - spacing - buttonSize / 2,
            buttonSize,
            buttonSize,
            0x0066CC
        );
        this.leftButton.setInteractive();
        this.leftButton.setScrollFactor(0);
        this.leftButton.on('pointerdown', () => { this.mobileLeft = true; });
        this.leftButton.on('pointerup', () => { this.mobileLeft = false; });
        this.leftButton.on('pointerout', () => { this.mobileLeft = false; });

        // Right button
        this.rightButton = this.add.rectangle(
            spacing + buttonSize / 2 + buttonSize + spacing,
            height - spacing - buttonSize / 2,
            buttonSize,
            buttonSize,
            0x0066CC
        );
        this.rightButton.setInteractive();
        this.rightButton.setScrollFactor(0);
        this.rightButton.on('pointerdown', () => { this.mobileRight = true; });
        this.rightButton.on('pointerup', () => { this.mobileRight = false; });
        this.rightButton.on('pointerout', () => { this.mobileRight = false; });

        // Jump button
        this.jumpButton = this.add.rectangle(
            width - spacing - buttonSize / 2,
            height - spacing - buttonSize / 2,
            buttonSize,
            buttonSize,
            0x00CC00
        );
        this.jumpButton.setInteractive();
        this.jumpButton.setScrollFactor(0);
        this.jumpButton.on('pointerdown', () => { this.mobileJump = true; });
        this.jumpButton.on('pointerup', () => { this.mobileJump = false; });
        this.jumpButton.on('pointerout', () => { this.mobileJump = false; });

        // Add text labels
        this.add.text(spacing + buttonSize / 2, height - spacing - buttonSize / 2, '◀', {
            fontSize: '24px',
            fill: '#FFFFFF',
            fontFamily: 'Arial'
        }).setOrigin(0.5).setScrollFactor(0);

        this.add.text(spacing + buttonSize / 2 + buttonSize + spacing, height - spacing - buttonSize / 2, '▶', {
            fontSize: '24px',
            fill: '#FFFFFF',
            fontFamily: 'Arial'
        }).setOrigin(0.5).setScrollFactor(0);

        this.add.text(width - spacing - buttonSize / 2, height - spacing - buttonSize / 2, '⬆', {
            fontSize: '24px',
            fill: '#FFFFFF',
            fontFamily: 'Arial'
        }).setOrigin(0.5).setScrollFactor(0);

        this.mobileLeft = false;
        this.mobileRight = false;
        this.mobileJump = false;
    }

    update() {
        if (!this.gameActive) return;

        // Player movement
        const moveLeft = this.cursors.left.isDown || this.mobileLeft;
        const moveRight = this.cursors.right.isDown || this.mobileRight;
        const jump = this.cursors.up.isDown || this.spacebar.isDown || this.mobileJump;

        if (moveLeft) {
            this.player.setVelocityX(-this.player.speed);
            this.player.setFlip(true, false);
        } else if (moveRight) {
            this.player.setVelocityX(this.player.speed);
            this.player.setFlip(false, false);
        } else {
            this.player.setVelocityX(0);
        }

        // Jump
        if (jump && this.player.body.touching.down) {
            this.player.setVelocityY(-this.player.jumpPower);
            this.player.isJumping = true;
        } else if (!jump) {
            this.player.isJumping = false;
        }

        // Fall off world
        if (this.player.y > this.gameHeight + 100) {
            this.loseLife();
        }

        // Update enemy AI
        this.updateEnemyMovement();

        // Check if all enemies defeated
        if (this.enemies.children.entries.length === 0) {
            this.reachedGoal();
        }
    }

    updateEnemyMovement() {
        this.enemies.children.entries.forEach(enemy => {
            enemy.changeDirectionTimer++;

            // Change direction randomly or at edges
            if (enemy.changeDirectionTimer > 120 || enemy.x < 50 || enemy.x > this.gameWidth - 50) {
                enemy.direction = enemy.direction === 1 ? -1 : 1;
                enemy.changeDirectionTimer = 0;
            }

            // Move enemy
            enemy.setVelocityX(enemy.speed * enemy.direction);
        });
    }

    updateEnemyAI() {
        this.enemies.children.entries.forEach(enemy => {
            // Simple AI - patrol and avoid falling
            if (enemy.body.velocity.y > 0) {
                // Falling, try to jump to platform
                if (Math.random() > 0.7) {
                    enemy.setVelocityY(-200);
                }
            }
        });
    }

    jumpOnEnemy(player, enemy) {
        // Check if player is above enemy and moving downward
        if (player.body.velocity.y > 0 && player.y < enemy.y) {
            enemy.hitPoints--;

            // Create hit effect
            this.particles.emitParticleAt(enemy.x, enemy.y, 5);

            if (enemy.hitPoints <= 0) {
                // Enemy defeated
                enemy.destroy();
                this.kills++;
                this.killsText.setText(`Fraud Yongs Defeated: ${this.kills}`);

                // Spawn new enemy randomly
                setTimeout(() => {
                    if (this.gameActive && this.enemies.children.entries.length < 4) {
                        const randomType = Math.random() > 0.7 ? 'giant' : 'mini';
                        const randomX = Phaser.Math.Between(this.gameWidth * 0.1, this.gameWidth * 0.9);
                        const randomY = Phaser.Math.Between(this.gameHeight * 0.2, this.gameHeight * 0.6);
                        const hitPoints = randomType === 'giant' ? 3 : 1;
                        this.spawnEnemy(randomX, randomY, randomType, hitPoints);
                    }
                }, 500);
            } else {
                // Flash enemy on hit
                this.tweens.add({
                    targets: enemy,
                    alpha: 0.5,
                    duration: 100,
                    yoyo: true
                });
            }

            // Bounce player up
            player.setVelocityY(-250);
        }
    }

    playerHitEnemy(player, enemy) {
        // Side collision with enemy
        if (player.body.velocity.y <= 0 || player.y >= enemy.y) {
            // Only hurt if not jumping on head
            if (!(player.body.velocity.y > 0 && player.y < enemy.y)) {
                this.loseLife();
            }
        }
    }

    loseLife() {
        if (!this.gameActive) return;

        this.lives--;
        this.livesText.setText(`Lives: ${this.lives}`);

        if (this.lives <= 0) {
            this.gameActive = false;
            this.time.delayedCall(500, () => {
                this.scene.start('GameOverScene', { kills: this.kills, won: false });
            });
        } else {
            // Reset player position
            this.player.setPosition(this.gameWidth * 0.1, this.gameHeight * 0.5);
            this.player.setVelocity(0, 0);
        }
    }

    reachedGoal() {
        this.gameActive = false;
        this.scene.start('GameOverScene', { kills: this.kills, won: true });
    }
}

// ============================================================================
// GAME OVER SCENE
// ============================================================================
class GameOverScene extends Phaser.Scene {
    constructor() {
        super('GameOverScene');
    }

    init(data) {
        this.kills = data.kills || 0;
        this.won = data.won || false;
    }

    create() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        // Background
        this.cameras.main.setBackgroundColor('#1a1a2e');

        // Draw victory/defeat background
        const graphics = this.make.graphics({ x: 0, y: 0, add: false });
        if (this.won) {
            graphics.fillStyle(0x00AA00, 0.3);
        } else {
            graphics.fillStyle(0xAA0000, 0.3);
        }
        graphics.fillRect(0, 0, width, height);
        graphics.generateTexture('endgame_bg', width, height);
        graphics.destroy();

        this.add.image(width / 2, height / 2, 'endgame_bg');

        // Title
        let titleText = this.won ? 'VICTORY!!!' : 'GAME OVER';
        let titleColor = this.won ? '#00FF00' : '#FF0000';

        this.add.text(width / 2, height * 0.2, titleText, {
            fontSize: '72px',
            fill: titleColor,
            fontStyle: 'bold',
            fontFamily: 'Arial'
        }).setOrigin(0.5);

        // Victory message
        if (this.won) {
            this.add.text(width / 2, height * 0.35, 'Bert Yong Forever!!', {
                fontSize: '48px',
                fill: '#FFD700',
                fontFamily: 'Arial'
            }).setOrigin(0.5);

            this.add.text(width / 2, height * 0.45, 'Manchester is Blue!!', {
                fontSize: '48px',
                fill: '#0066CC',
                fontFamily: 'Arial'
            }).setOrigin(0.5);

            // Draw celebration (simple shapes)
            for (let i = 0; i < 5; i++) {
                const star = this.add.text(
                    Phaser.Math.Between(width * 0.1, width * 0.9),
                    Phaser.Math.Between(height * 0.05, height * 0.15),
                    '⭐',
                    { fontSize: '32px' }
                );
                this.tweens.add({
                    targets: star,
                    y: star.y - 50,
                    alpha: 0,
                    duration: 2000,
                    repeat: -1
                });
            }
        }

        // Stats
        this.add.text(width / 2, height * 0.6, `Fraud Yongs Defeated: ${this.kills}`, {
            fontSize: '36px',
            fill: '#FFFFFF',
            fontFamily: 'Arial'
        }).setOrigin(0.5);

        // Restart button
        const restartButton = this.add.rectangle(width / 2, height * 0.75, 200, 60, 0x0066CC);
        restartButton.setInteractive({ useHandCursor: true });
        restartButton.on('pointerover', () => restartButton.setFillStyle(0x0099FF));
        restartButton.on('pointerout', () => restartButton.setFillStyle(0x0066CC));
        restartButton.on('pointerdown', () => this.scene.start('MenuScene'));

        this.add.text(width / 2, height * 0.75, 'RESTART', {
            fontSize: '32px',
            fill: '#FFFFFF',
            fontStyle: 'bold',
            fontFamily: 'Arial'
        }).setOrigin(0.5);

        // Menu button
        const menuButton = this.add.rectangle(width / 2, height * 0.85, 200, 60, 0x666666);
        menuButton.setInteractive({ useHandCursor: true });
        menuButton.on('pointerover', () => menuButton.setFillStyle(0x999999));
        menuButton.on('pointerout', () => menuButton.setFillStyle(0x666666));
        menuButton.on('pointerdown', () => this.scene.start('MenuScene'));

        this.add.text(width / 2, height * 0.85, 'MENU', {
            fontSize: '32px',
            fill: '#FFFFFF',
            fontStyle: 'bold',
            fontFamily: 'Arial'
        }).setOrigin(0.5);
    }
}

// Handle window resize for responsiveness
window.addEventListener('resize', () => {
    game.scale.resize(window.innerWidth, window.innerHeight);
});
