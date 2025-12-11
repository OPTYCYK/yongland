import Phaser from 'phaser';
import PreloadScene from './scenes/PreloadScene';
import MenuScene from './scenes/MenuScene';
import GameScene from './scenes/GameScene';
import GameOverScene from './scenes/GameOverScene';

/**
 * YONGLAND - Bert Yong vs Fraud Yong
 * A platformer game set in Etihad Stadium, Manchester
 * 
 * Game Features:
 * - Bert Yong as protagonist with 5 lives
 * - 5 Mini Frauds to defeat (half Bert's size, avoid player, jump higher)
 * - Giant Fraud boss (2x Bert's size, requires 3 head stomps)
 * - Head stomp mechanics (only head defeats enemies)
 * - Manchester City themed (Etihad Stadium setting)
 */

const config = {
    type: Phaser.AUTO,
    width: 1200,
    height: 700,
    parent: 'game-container',
    backgroundColor: '#6CABDD',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 400 },
            debug: false
        }
    },
    scene: [PreloadScene, MenuScene, GameScene, GameOverScene],
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 1200,
        height: 700
    },
    render: {
        pixelArt: true,
        antialias: false
    },
    input: {
        keyboard: {
            target: window
        }
    }
};

// Create game instance
const game = new Phaser.Game(config);

// Handle window events
window.addEventListener('focus', () => {
    game.scene.resume();
});

window.addEventListener('blur', () => {
    game.scene.pause();
});

// Export for potential external use
export default game;
