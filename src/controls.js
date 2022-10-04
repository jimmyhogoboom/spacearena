
import cursors from './cursors.js';

export default function controls() {

  this.cameras.main.startFollow(logo);
  const controlConfig = {
    camera: this.cameras.main,
    left: cursors.left,
    right: cursors.right,
    up: cursors.up,
    down: cursors.down,
    zoomIn: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q),
    zoomOut: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E),
    acceleration: 0.06,
    drag: 0.0005,
    maxSpeed: 1.0
  };

  return new Phaser.Cameras.Controls.SmoothedKeyControl(controlConfig);
};

