
import MainGame from './Game.js';

const config = {
  type: Phaser.AUTO,
  width: window.innerWidth,
  height: window.innerHeight,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 }
    }
  },
  audio: { disableWebAudio: true },
  scene: [MainGame],
};

export default config;
