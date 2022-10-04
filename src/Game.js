

export default class MainGame {
  constructor() {
    // super('MainGame')
  }

  preload() {
    this.load.setBaseURL('http://labs.phaser.io');

    this.load.image('sky', 'assets/skies/space3.png');
    this.load.image('logo', 'assets/sprites/phaser3-logo.png');
    this.load.image('red', 'assets/particles/red.png');
  }

  create() {
    this.add.image(400, 300, 'sky');

    this.initShip();

    this.cameras.main.startFollow(this.ship);

    if (!this.cursors) {
      this.cursors = this.input.keyboard.createCursorKeys()
    }

    const controlConfig = {
      camera: this.cameras.main,
      left: this.cursors.left,
      right: this.cursors.right,
      up: this.cursors.up,
      down: this.cursors.down,
      zoomIn: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q),
      zoomOut: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E),
      acceleration: 0.06,
      drag: 0.0005,
      maxSpeed: 1.0
    };

    new Phaser.Cameras.Controls.SmoothedKeyControl(controlConfig);

  }

  update() {
    if (this.cursors.left.isDown) {
      this.ship.setAngularVelocity(-150);
    }
  }

  initShip() {
    if (!this.ship) {
      this.ship = this.physics.add.image(400, 100, 'logo');
      this.ship.setCollideWorldBounds(true);
      const particles = this.add.particles('red');
      const emitter = particles.createEmitter({
        speed: 100,
        scale: { start: 1, end: 0 },
        blendMode: 'ADD'
      });
      emitter.startFollow(this.ship);
    }
  }
}
