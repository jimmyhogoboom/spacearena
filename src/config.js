
import MainGame from './Game.js';

const config = ({ preload, create, update }) => ({
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 }
    }
  },
  scene: [MainGame]
});

export default config;
