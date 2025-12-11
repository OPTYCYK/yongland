import Phaser from 'phaser';

/**
 * GameScene - Main gameplay
 * Features:
 * - Bert Yong (protagonist) with 5 lives
 * - 5 Mini Frauds (half Bert's size, avoid player, jump 2x higher)
 * - Giant Fraud (2x Bert's size, appears after mini frauds defeated, needs 3 head stomps)
 * - Head stomp mechanics (only head kills, body touch kills player)
 * - Etihad Stadium theme
 */
export default class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene');
        
        // Constants for collision detection
        this.STOMP_TOLERANCE_MINI = 15; // Pixels of tolerance for mini fraud head stomps
        this.STOMP_TOLERANCE_GIANT = 20; // Pixels of tolerance for giant fraud head stomps
    }

    create() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        // Game state
        this.lives = 5; // Specification: 5 lives
        this.score = 0;
        this.gameOver = false;
        this.miniFraudsDefeated = 0;
        this.giantFraudHits = 0; // Needs 3 hits
        this.giantFraudActive = false;
        this.isInvulnerable = false;

        // Create stadium background
        this.createStadiumBackground();

        // Create platforms
        this.platforms = this.physics.add.staticGroup();
        this.createPlatforms();

        // Create player (Bert Yong)
        this.createPlayer();

        // Create 5 mini Frauds
        this.miniFrauds = this.physics.add.group();
        this.createMiniFrauds();

        // Giant Fraud will be created later
        this.giantFraud = null;

        // Physics collisions
        this.physics.add.collider(this.player, this.platforms);
        this.physics.add.collider(this.miniFrauds, this.platforms);

        // Enemy collision with custom detection
        this.physics.add.overlap(this.player, this.miniFrauds, this.handleMiniFraudCollision, null, this);

        // Controls
        this.cursors = this.input.keyboard.createCursorKeys();
        this.wasdKeys = this.input.keyboard.addKeys('W,A,S,D');

        // UI
        this.createUI();

        // Camera
        this.cameras.main.setBounds(0, 0, width, height);
    }

    createStadiumBackground() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        // Sky blue background (stadium sky)
        this.cameras.main.setBackgroundColor('#87CEEB');

        // Stadium stands with fans
        const standsColor = 0x2C3E50;
        const stands = this.add.rectangle(width / 2, 80, width, 160, standsColor);
        stands.setAlpha(0.7);

        // Add fan sections with Man City blue
        for (let i = 0; i < 8; i++) {
            const fanSection = this.add.rectangle(
                (i * (width / 8)) + (width / 16),
                80,
                width / 9,
                140,
                0x6CABDD
            );
            fanSection.setAlpha(0.6);
        }

        // Banner text - "Support Bert Yong"
        this.add.text(width / 2, 40, 'BERT YONG', {
            font: 'bold 28px courier',
            fill: '#ffffff',
            backgroundColor: '#6CABDD',
            padding: { x: 15, y: 5 }
        }).setOrigin(0.5).setScrollFactor(0);

        this.add.text(width / 2, 90, 'ETIHAD STADIUM', {
            font: 'bold 16px courier',
            fill: '#ffffff',
            stroke: '#1C2C5B',
            strokeThickness: 2
        }).setOrigin(0.5).setScrollFactor(0);

        // Cheering fans representation (simple rectangles)
        for (let i = 0; i < 30; i++) {
            const x = Phaser.Math.Between(50, width - 50);
            const y = Phaser.Math.Between(40, 140);
            const fan = this.add.circle(x, y, 4, 0xFFFFFF);
            fan.setAlpha(0.8);
            
            // Animate fans
            this.tweens.add({
                targets: fan,
                y: y + Phaser.Math.Between(-5, 5),
                duration: Phaser.Math.Between(1000, 2000),
                repeat: -1,
                yoyo: true
            });
        }
    }

    createPlatforms() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        // Ground platform
        this.createPlatform(width / 2, height - 30, width, 60, 0x228B22); // Grass green

        // Goal post inspired platforms (horizontal bars)
        this.createPlatform(200, height - 150, 180, 20, 0xFFFFFF); // White like goalposts
        this.createPlatform(width - 200, height - 150, 180, 20, 0xFFFFFF);
        
        // Mid-level platforms
        this.createPlatform(width / 2, height - 250, 200, 20, 0xFFFFFF);
        this.createPlatform(300, height - 350, 150, 20, 0xFFFFFF);
        this.createPlatform(width - 300, height - 350, 150, 20, 0xFFFFFF);
        
        // Upper platforms
        this.createPlatform(width / 2 - 150, height - 450, 120, 20, 0xFFFFFF);
        this.createPlatform(width / 2 + 150, height - 450, 120, 20, 0xFFFFFF);
    }

    createPlatform(x, y, width, height, color) {
        const platform = this.add.rectangle(x, y, width, height, color);
        this.physics.add.existing(platform, true);
        this.platforms.add(platform);
        
        // Add border
        const border = this.add.rectangle(x, y, width, height);
        border.setStrokeStyle(2, 0x000000);
        border.setFillStyle(color, 1);
    }

    createPlayer() {
        // Create Bert Yong sprite (8-bit style, Man City themed)
        const bertSize = 40;
        const graphics = this.make.graphics({ x: 0, y: 0, add: false });
        
        // Body - Man City blue suit
        graphics.fillStyle(0x6CABDD, 1);
        graphics.fillRect(10, 20, 20, 25); // Torso
        
        // Head - skin tone
        graphics.fillStyle(0xFFDBAC, 1);
        graphics.fillCircle(20, 12, 10);
        
        // Eyes
        graphics.fillStyle(0x000000, 1);
        graphics.fillCircle(16, 10, 2);
        graphics.fillCircle(24, 10, 2);
        
        // Smile
        graphics.lineStyle(2, 0x000000, 1);
        graphics.arc(20, 12, 5, 0, Math.PI, false);
        graphics.strokePath();
        
        // Arms - Man City blue
        graphics.fillStyle(0x6CABDD, 1);
        graphics.fillRect(5, 22, 5, 15); // Left arm
        graphics.fillRect(30, 22, 5, 15); // Right arm
        
        // Legs - white shorts
        graphics.fillStyle(0xFFFFFF, 1);
        graphics.fillRect(12, 45, 7, 12); // Left leg
        graphics.fillRect(21, 45, 7, 12); // Right leg
        
        // Shoes - dark
        graphics.fillStyle(0x1C2C5B, 1);
        graphics.fillRect(12, 54, 7, 3);
        graphics.fillRect(21, 54, 7, 3);
        
        graphics.generateTexture('bert', bertSize, bertSize + 17);
        graphics.destroy();

        this.player = this.physics.add.sprite(100, 400, 'bert');
        this.player.setBounce(0);
        this.player.setCollideWorldBounds(true);
        this.player.body.setSize(30, 50);
        this.player.setDisplaySize(40, 57);
    }

    createMiniFrauds() {
        // Create 5 mini Frauds (half the size of Bert)
        const positions = [
            { x: 300, y: 300 },
            { x: 500, y: 200 },
            { x: 700, y: 350 },
            { x: 900, y: 250 },
            { x: 1100, y: 300 }
        ];

        positions.forEach((pos, index) => {
            this.createMiniFraud(pos.x, pos.y);
        });
    }

    createMiniFraud(x, y) {
        // Mini Fraud - half the size of Bert (approx 20px)
        const fraudSize = 20;
        const graphics = this.make.graphics({ x: 0, y: 0, add: false });
        
        // Body - red for Fraud
        graphics.fillStyle(0xFF0000, 1);
        graphics.fillRect(5, 10, 10, 12);
        
        // Head
        graphics.fillStyle(0xFFDBAC, 1);
        graphics.fillCircle(10, 6, 5);
        
        // Angry eyes
        graphics.fillStyle(0x000000, 1);
        graphics.fillCircle(8, 5, 1);
        graphics.fillCircle(12, 5, 1);
        
        // Angry mouth
        graphics.lineStyle(1, 0x000000, 1);
        graphics.arc(10, 8, 2, 0, Math.PI, true);
        graphics.strokePath();
        
        // Arms
        graphics.fillStyle(0xFF0000, 1);
        graphics.fillRect(3, 11, 2, 8);
        graphics.fillRect(15, 11, 2, 8);
        
        // Legs
        graphics.fillStyle(0x8B0000, 1);
        graphics.fillRect(6, 22, 3, 6);
        graphics.fillRect(11, 22, 3, 6);
        
        graphics.generateTexture('miniFraud', fraudSize, fraudSize + 8);
        graphics.destroy();

        const miniFraud = this.physics.add.sprite(x, y, 'miniFraud');
        miniFraud.setBounce(0.2);
        miniFraud.setCollideWorldBounds(true);
        miniFraud.body.setSize(15, 25);
        miniFraud.setDisplaySize(20, 28);
        
        // Mini Frauds are slower than Bert
        miniFraud.speed = 80; // Slower than player's 200
        miniFraud.direction = Phaser.Math.Between(-1, 1) > 0 ? 1 : -1;
        miniFraud.jumpForce = -600; // Jump much higher than Bert (-350)
        miniFraud.avoidRange = 150; // Distance to avoid player
        
        this.miniFrauds.add(miniFraud);
    }

    createGiantFraud() {
        // Giant Fraud - 2x the size of Bert
        const giantSize = 80;
        const graphics = this.make.graphics({ x: 0, y: 0, add: false });
        
        // Body - dark red
        graphics.fillStyle(0x8B0000, 1);
        graphics.fillRect(20, 40, 40, 50);
        
        // Head
        graphics.fillStyle(0xFFDBAC, 1);
        graphics.fillCircle(40, 24, 20);
        
        // Evil eyes
        graphics.fillStyle(0xFF0000, 1);
        graphics.fillCircle(32, 20, 4);
        graphics.fillCircle(48, 20, 4);
        graphics.fillStyle(0x000000, 1);
        graphics.fillCircle(32, 20, 2);
        graphics.fillCircle(48, 20, 2);
        
        // Evil grin
        graphics.lineStyle(3, 0x000000, 1);
        graphics.arc(40, 28, 10, 0, Math.PI, false);
        graphics.strokePath();
        
        // Arms
        graphics.fillStyle(0x8B0000, 1);
        graphics.fillRect(10, 44, 10, 30);
        graphics.fillRect(60, 44, 10, 30);
        
        // Legs
        graphics.fillStyle(0x4B0000, 1);
        graphics.fillRect(24, 90, 14, 24);
        graphics.fillRect(42, 90, 14, 24);
        
        graphics.generateTexture('giantFraud', giantSize, giantSize + 34);
        graphics.destroy();

        this.giantFraud = this.physics.add.sprite(this.cameras.main.width / 2, 200, 'giantFraud');
        this.giantFraud.setBounce(0.1);
        this.giantFraud.setCollideWorldBounds(true);
        this.giantFraud.body.setSize(60, 100);
        this.giantFraud.setDisplaySize(80, 114);
        this.giantFraud.speed = 120;
        this.giantFraud.direction = 1;
        this.giantFraud.hitsRemaining = 3; // Needs 3 head stomps
        
        // Add physics
        this.physics.add.collider(this.giantFraud, this.platforms);
        this.physics.add.overlap(this.player, this.giantFraud, this.handleGiantFraudCollision, null, this);
        
        this.giantFraudActive = true;

        // Show message
        const msg = this.add.text(this.cameras.main.width / 2, 150, 'GIANT FRAUD APPEARS!', {
            font: 'bold 32px courier',
            fill: '#FF0000',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5).setScrollFactor(0);

        this.time.delayedCall(2000, () => {
            msg.destroy();
        });
    }

    createUI() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        
        // Lives
        this.livesText = this.add.text(20, 180, 'Lives: ❤❤❤❤❤', {
            font: 'bold 20px courier',
            fill: '#FF0000',
            backgroundColor: '#000000',
            padding: { x: 8, y: 4 }
        }).setScrollFactor(0).setDepth(100);
        
        // Mini Frauds counter
        this.fraudsText = this.add.text(20, 210, 'Mini Frauds: 5/5', {
            font: 'bold 18px courier',
            fill: '#FFFF00',
            backgroundColor: '#000000',
            padding: { x: 8, y: 4 }
        }).setScrollFactor(0).setDepth(100);
        
        // Giant Fraud hits
        this.giantText = this.add.text(20, 240, '', {
            font: 'bold 18px courier',
            fill: '#FF6600',
            backgroundColor: '#000000',
            padding: { x: 8, y: 4 }
        }).setScrollFactor(0).setDepth(100);
        
        this.updateUI();
    }

    updateUI() {
        // Update lives display with hearts
        const hearts = '❤'.repeat(this.lives);
        this.livesText.setText('Lives: ' + hearts);
        
        // Update mini frauds counter
        const remaining = 5 - this.miniFraudsDefeated;
        this.fraudsText.setText('Mini Frauds: ' + remaining + '/5');
        
        // Update giant fraud hits
        if (this.giantFraudActive && this.giantFraud) {
            this.giantText.setText('Giant Fraud Hits: ' + this.giantFraudHits + '/3');
        }
    }

    update(time, delta) {
        if (this.gameOver) return;

        // Player movement
        this.handlePlayerMovement();
        
        // Mini Frauds AI
        if (this.miniFrauds) {
            this.updateMiniFraudsAI();
        }
        
        // Giant Fraud AI
        if (this.giantFraudActive && this.giantFraud) {
            this.updateGiantFraudAI();
        }

        // Check if player fell off
        if (this.player.y > this.cameras.main.height + 50) {
            this.loseLife();
        }
    }

    handlePlayerMovement() {
        const speed = 200; // Bert's movement speed
        const jumpForce = -350; // Bert's jump force
        
        // Horizontal movement
        if (this.cursors.left.isDown || this.wasdKeys.A.isDown) {
            this.player.setVelocityX(-speed);
        } else if (this.cursors.right.isDown || this.wasdKeys.D.isDown) {
            this.player.setVelocityX(speed);
        } else {
            this.player.setVelocityX(0);
        }

        // Jumping
        if ((this.cursors.space.isDown || this.wasdKeys.W.isDown || this.cursors.up.isDown) && 
            this.player.body.touching.down) {
            this.player.setVelocityY(jumpForce);
        }
    }

    updateMiniFraudsAI() {
        this.miniFrauds.children.entries.forEach(fraud => {
            if (!fraud.active) return;
            
            const distToPlayer = Phaser.Math.Distance.Between(
                fraud.x, fraud.y, 
                this.player.x, this.player.y
            );
            
            // Avoid player - run away when too close
            if (distToPlayer < fraud.avoidRange) {
                if (this.player.x < fraud.x) {
                    fraud.setVelocityX(fraud.speed); // Move away (right)
                } else {
                    fraud.setVelocityX(-fraud.speed); // Move away (left)
                }
            } else {
                // Random patrol when player is far
                fraud.setVelocityX(fraud.direction * fraud.speed);
            }
            
            // Random direction change
            if (Phaser.Math.Between(0, 100) > 98) {
                fraud.direction *= -1;
            }
            
            // Jump randomly (2x higher than Bert)
            if (fraud.body.touching.down && Phaser.Math.Between(0, 100) > 97) {
                fraud.setVelocityY(fraud.jumpForce);
            }
            
            // Bounce off walls
            if (fraud.body.blocked.left || fraud.body.blocked.right) {
                fraud.direction *= -1;
            }
        });
    }

    updateGiantFraudAI() {
        if (!this.giantFraud || !this.giantFraud.active) return;
        
        // Chase player aggressively
        if (this.player.x < this.giantFraud.x) {
            this.giantFraud.setVelocityX(-this.giantFraud.speed);
        } else {
            this.giantFraud.setVelocityX(this.giantFraud.speed);
        }
        
        // Jump occasionally
        if (this.giantFraud.body.touching.down && Phaser.Math.Between(0, 100) > 95) {
            this.giantFraud.setVelocityY(-300);
        }
    }

    handleMiniFraudCollision(player, fraud) {
        if (!fraud.active || this.isInvulnerable) return;
        
        // Check if player is stomping (falling down and above enemy)
        // Account for player's body height (about 50px) and fraud's height (about 25px)
        const playerBottom = player.y + (player.displayHeight / 2);
        const fraudTop = fraud.y - (fraud.displayHeight / 2);
        const isStomping = player.body.velocity.y > 0 && playerBottom < fraudTop + this.STOMP_TOLERANCE_MINI;
        
        if (isStomping) {
            // Head stomp - kill mini fraud
            fraud.destroy();
            this.miniFraudsDefeated++;
            this.score += 100;
            
            // Bounce player up
            player.setVelocityY(-250);
            
            // Update UI
            this.updateUI();
            
            // Check if all mini frauds defeated
            if (this.miniFraudsDefeated >= 5) {
                this.time.delayedCall(1000, () => {
                    this.createGiantFraud();
                });
            }
        } else {
            // Body touch - lose life
            this.loseLife();
        }
    }

    handleGiantFraudCollision(player, giantFraud) {
        if (!giantFraud.active || this.isInvulnerable) return;
        
        // Check if player is stomping
        // Account for player's body height (about 50px) and giant fraud's height (about 100px)
        const playerBottom = player.y + (player.displayHeight / 2);
        const giantTop = giantFraud.y - (giantFraud.displayHeight / 2);
        const isStomping = player.body.velocity.y > 0 && playerBottom < giantTop + this.STOMP_TOLERANCE_GIANT;
        
        if (isStomping) {
            // Head stomp on giant fraud
            this.giantFraudHits++;
            this.score += 200;
            
            // Bounce player up
            player.setVelocityY(-300);
            
            // Flash the giant fraud
            this.tweens.add({
                targets: giantFraud,
                alpha: { from: 0.5, to: 1 },
                duration: 100,
                repeat: 3,
                yoyo: true
            });
            
            // Make player invulnerable briefly
            this.makeInvulnerable();
            
            // Update UI
            this.updateUI();
            
            // Check if defeated (3 hits)
            if (this.giantFraudHits >= 3) {
                giantFraud.destroy();
                this.victory();
            }
        } else {
            // Body touch - lose life
            this.loseLife();
        }
    }

    loseLife() {
        if (this.isInvulnerable) return;
        
        this.lives--;
        this.updateUI();
        
        if (this.lives <= 0) {
            this.gameOver = true;
            this.scene.start('GameOverScene', { victory: false, score: this.score });
        } else {
            // Respawn player
            this.player.setPosition(100, 300);
            this.player.setVelocity(0, 0);
            this.makeInvulnerable();
        }
    }

    makeInvulnerable() {
        this.isInvulnerable = true;
        
        // Flash player
        this.tweens.add({
            targets: this.player,
            alpha: { from: 0.3, to: 1 },
            duration: 200,
            repeat: 5,
            yoyo: true,
            onComplete: () => {
                this.isInvulnerable = false;
                this.player.alpha = 1;
            }
        });
    }

    victory() {
        this.gameOver = true;
        this.score += 500; // Victory bonus
        
        // Short delay before victory screen
        this.time.delayedCall(500, () => {
            this.scene.start('GameOverScene', { victory: true, score: this.score });
        });
    }
}
