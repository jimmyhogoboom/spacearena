

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

    if (!this.keys) {
      this.keys = this.input.keyboard.addKeys({
        'lateralLeft': 188,
        'lateralRight': 190,
      })
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
      // drag: 0.0005,
      maxSpeed: 1.0
    };

    new Phaser.Cameras.Controls.SmoothedKeyControl(controlConfig);

  }

  update() {
    if (this.cursors.left.isDown) {
      this.ship.setAngularVelocity(-150);
    } else if (this.cursors.right.isDown) {
      this.ship.setAngularVelocity(150);
    } else {
      this.ship.setAngularVelocity(0);
    }

    if (this.cursors.up.isDown) {
      this.physics.velocityFromRotation(this.ship.rotation, 600, this.ship.body.acceleration);
    } else if (this.cursors.down.isDown) {
      this.physics.velocityFromRotation(this.ship.rotation, -600, this.ship.body.acceleration);
    }
    else {
      this.ship.setAcceleration(0);
    }

    if (this.keys.lateralLeft.isDown) {
      const newRads = this.addDegreesToRads(this.ship.rotation, -90);
      this.physics.velocityFromRotation(newRads, 600, this.ship.body.acceleration);
    } else if (this.keys.lateralRight.isDown) {
      const newRads = this.addDegreesToRads(this.ship.rotation, 90);
      this.physics.velocityFromRotation(newRads, 600, this.ship.body.acceleration);
    }
  }

  addDegreesToRads(rads, degrees) {
    const rotationDegrees = this.radsToDegrees(rads);
    const newDegrees = this.addDegrees(rotationDegrees, degrees);
    return this.degreesToRads(newDegrees);
  }

  addDegrees(currentAngle, difference) {
    if (currentAngle + difference >= 360) return currentAngle + difference - 360;
    if (currentAngle + difference <= 0) return currentAngle + difference + 360;
    return currentAngle + difference;
  }

  radsToDegrees(rads) {
    return rads * 180 / Math.PI;
  }

  degreesToRads(degrees) {
    return (degrees * Math.PI) / 180;
  }

  initShip() {
    if (!this.ship) {
      this.ship = this.physics.add.image(400, 100, 'logo');
      this.ship.setCollideWorldBounds(false);
      const particles = this.add.particles('red');
      const emitter = particles.createEmitter({
        speed: 10,
        scale: { start: 1, end: 0 },
        blendMode: 'ADD'
      });
      emitter.startFollow(this.ship);
    }
  }
}
