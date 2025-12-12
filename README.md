# YONGLAND

**Bert Yong vs Fraud Yong** - A browser-based platformer game built with Phaser 3, set in Etihad Stadium, Manchester.

![YONGLAND Menu](https://github.com/user-attachments/assets/312a2ae3-0836-42f4-8173-8427caa51827)

## 🎮 Game Overview

Help Bert Yong defeat the Fraud Yongs at Etihad Stadium! Jump on the heads of 5 Mini Frauds, then take down the Giant Fraud boss to prove **Manchester is Blue!!**

### Game Features

- **Bert Yong (Protagonist)**: 8-bit pixel art character in Man City blue suit
- **5 Lives System**: Respawn without resetting enemy progress
- **5 Mini Frauds**: Half Bert's size, avoid the player, jump 2x higher
- **Giant Fraud Boss**: Twice Bert's size, requires 3 head stomps to defeat
- **Head Stomp Mechanics**: Jump on enemy heads to defeat them; body contact kills Bert
- **Etihad Stadium Theme**: Man City fans, banners, and football-inspired platforms

### Controls

- **Arrow Keys** or **A/D** - Move Left/Right
- **Space** or **W** - Jump

---

## 🚀 Quick Start

### Prerequisites

- Node.js (v14.0.0 or higher)
- npm (v6.0.0 or higher)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/OPTYCYK/yongland.git
   cd yongland
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run development server**
   ```bash
   npm start
   ```
   Open your browser to `http://localhost:8080`

4. **Build for production**
   ```bash
   npm run build
   ```
   Production files will be in the `dist/` directory

---

## 📁 Project Structure

```
yongland/
├── public/
│   └── index.html          # HTML template
├── src/
│   ├── index.js            # Main game entry point
│   └── scenes/
│       ├── PreloadScene.js # Asset loading
│       ├── MenuScene.js    # Main menu
│       ├── GameScene.js    # Core gameplay
│       └── GameOverScene.js # Victory/defeat screens
├── dist/                   # Build output (generated)
├── webpack.config.js       # Webpack configuration
├── package.json            # Dependencies and scripts
└── manifest.json           # PWA manifest

Legacy files (from previous implementation):
├── index.html              # Standalone version (backup)
└── js/game.js              # Old game code (reference)
```

---

## 🎯 Game Mechanics

### Bert Yong (Player)
- **Movement Speed**: 200 units/second
- **Jump Force**: -350
- **Lives**: 5 (respawn at starting position)
- **Size**: 40x57 pixels

### Mini Frauds (Enemies)
- **Movement Speed**: 80 units/second (slower than Bert)
- **Jump Force**: -600 (jumps ~2x higher than Bert)
- **AI Behavior**: Avoids player within 150px range
- **Size**: 20x28 pixels (half of Bert)
- **Count**: 5 total

### Giant Fraud (Boss)
- **Movement Speed**: 120 units/second
- **AI Behavior**: Aggressively chases player
- **Size**: 80x114 pixels (2x Bert's size)
- **Defeat Condition**: 3 head stomps required
- **Appears**: After all Mini Frauds are defeated

### Collision Detection
- **Head Stomp**: Player must be falling (velocity.y > 0) and land on top of enemy
- **Body Contact**: Any other collision results in losing a life
- **Invulnerability**: Brief invulnerability after respawn (flashing animation)

---

## 🌐 Deployment

### Deploy to GitHub Pages

1. Add to `package.json`:
   ```json
   "homepage": "https://OPTYCYK.github.io/yongland"
   ```

2. Install gh-pages:
   ```bash
   npm install --save-dev gh-pages
   ```

3. Add deploy scripts:
   ```json
   "predeploy": "npm run build",
   "deploy": "gh-pages -d dist"
   ```

4. Deploy:
   ```bash
   npm run deploy
   ```

### Deploy to Netlify

1. Build the project:
   ```bash
   npm run build
   ```

2. Deploy the `dist/` folder through Netlify CLI or web interface

### Deploy to Vercel

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Deploy:
   ```bash
   vercel
   ```

---

## 🛠️ Development

### NPM Scripts

- `npm start` - Start development server (port 8080)
- `npm run build` - Build for production
- `npm run dev` - Build in development mode with watch

### Code Structure

The game uses a modular scene-based architecture:

1. **PreloadScene**: Loads game assets and shows loading screen
2. **MenuScene**: Main menu with game title and instructions
3. **GameScene**: Core gameplay with player, enemies, and platforms
4. **GameOverScene**: Victory or defeat screen with restart option

### Key Configuration

- **Game Dimensions**: 1200x700 pixels
- **Physics**: Arcade physics with 400 gravity
- **Render Mode**: WebGL with pixel art rendering
- **Scaling**: FIT mode with auto-centering

---

## 🎨 Theme & Visuals

### Manchester City Colors
- **Primary Blue**: #6CABDD (Man City blue)
- **Dark Blue**: #1C2C5B (Navy)
- **White**: #FFFFFF (Platforms, text)
- **Green**: #228B22 (Grass)

### Stadium Elements
- Cheering fans represented as animated white dots
- "BERT YONG" and "ETIHAD STADIUM" banners
- Fan sections in Man City blue
- White platforms inspired by football goalposts
- Green grass ground

---

## 🏆 Victory Condition

Defeat all 5 Mini Frauds, then defeat the Giant Fraud by stomping on its head 3 times.

**Victory Message**: "Bert Yong Forever!! Manchester is Blue!!"

---

## 📝 Version History

- **v1.0.0** - Complete game implementation
  - Bert Yong character with 5 lives
  - 5 Mini Frauds with avoidance AI
  - Giant Fraud boss battle
  - Etihad Stadium theme
  - Head stomp mechanics
  - Full game cycle (menu → gameplay → victory/defeat)

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 🙏 Acknowledgments

- Built with [Phaser 3](https://phaser.io/)
- Inspired by classic platformer games
- Dedicated to all Manchester City fans

---

**Manchester is Blue!! 💙**
