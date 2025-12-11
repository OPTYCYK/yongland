import Phaser from 'phaser';
import GameScene from './scenes/GameScene';
import PreloadScene from './scenes/PreloadScene';
import MenuScene from './scenes/MenuScene';
import GameOverScene from './scenes/GameOverScene';

/**
 * Phaser 3 Game Configuration
 * Configure the game with appropriate settings for YONGLAND
 */
const config = {
  type: Phaser.AUTO,
  width: 1280,
  height: 720,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 300 },
      debug: false,
    },
  },
  render: {
    pixelArt: false,
    antialias: true,
    antialiasGL: true,
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    fullscreenTarget: 'parent',
    expandParent: true,
  },
  scene: [PreloadScene, MenuScene, GameScene, GameOverScene],
  input: {
    keyboard: {
      target: window,
    },
  },
};

/**
 * Initialize and create the Phaser game instance
 */
class Game {
  constructor() {
    this.game = new Phaser.Game(config);
    this.setupEventListeners();
  }

  /**
   * Setup global event listeners for the game
   */
  setupEventListeners() {
    // Handle window focus/blur events
    window.addEventListener('focus', () => {
      if (this.game.isRunning) {
        this.game.resume();
      }
    });

    window.addEventListener('blur', () => {
      if (this.game.isRunning) {
        this.game.pause();
      }
    });

    // Handle window resize
    window.addEventListener('resize', () => {
      if (this.game.isRunning) {
        this.game.scale.refresh();
      }
    });
  }

  /**
   * Get the game instance
   * @returns {Phaser.Game} The Phaser game instance
   */
  getInstance() {
    return this.game;
  }

  /**
   * Pause the game
   */
  pauseGame() {
    this.game.pause();
  }

  /**
   * Resume the game
   */
  resumeGame() {
    this.game.resume();
  }

  /**
   * Stop the game
   */
  stopGame() {
    this.game.destroy();
  }
}

// Initialize the game when the window loads
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new Game();
  });
} else {
  new Game();
}

export default Game;
