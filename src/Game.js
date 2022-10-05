
const BRAKE_VELOCITY_DELTA = 15;

export default class MainGame {
  constructor() {
    // super('MainGame')
    this.ships = [];
  }

  preload() {
    this.load.image('ship01', 'assets/green_05.png');
    this.load.image('ship02', 'assets/orange_01.png');

    this.load.setBaseURL('http://labs.phaser.io');
    this.load.image('sky', 'assets/skies/space3.png');
    this.load.image('red', 'assets/particles/red.png');
    this.sky = this.add.tileSprite(640, 360, 1280, 720, 'sky').setScrollFactor(0);
  }

  create() {
    this.add.image(400, 300, 'sky');

    this.initShip();
    this.initShip();

    if (!this.cursors) {
      this.cursors = this.input.keyboard.createCursorKeys()
    }

    if (!this.keys) {
      this.keys = this.input.keyboard.addKeys({
        'lateralLeft': 188,
        'lateralRight': 190,
        'spaceBrake': Phaser.Input.Keyboard.KeyCodes.M,
        'p2Up': Phaser.Input.Keyboard.KeyCodes.W,
        'p2Down': Phaser.Input.Keyboard.KeyCodes.S,
        'p2Left': Phaser.Input.Keyboard.KeyCodes.A,
        'p2Right': Phaser.Input.Keyboard.KeyCodes.D,
        'p2LateralLeft': Phaser.Input.Keyboard.KeyCodes.Q,
        'p2LateralRight': Phaser.Input.Keyboard.KeyCodes.E,
        'p2SpaceBrake': Phaser.Input.Keyboard.KeyCodes.SPACE,
      })
    }

    const controlConfig = {
      camera: this.cameras.main,
      left: this.cursors.left,
      right: this.cursors.right,
      up: this.cursors.up,
      down: this.cursors.down,
      acceleration: 0.06,
      drag: 0.0005,
      maxSpeed: 0.0005,
    };

    new Phaser.Cameras.Controls.SmoothedKeyControl(controlConfig);

  }

  update() {
    if (this.cursors.left.isDown) {
      this.ships[0].setAngularVelocity(-150);
    } else if (this.cursors.right.isDown) {
      this.ships[0].setAngularVelocity(150);
    } else {
      this.ships[0].setAngularVelocity(0);
    }

    // TODO: only play emitter when thrust is active
    // TODO: combine inputs. Currently, whichever key is handled last is the only input considered.

    if (this.cursors.up.isDown) {
      this.emitter.startFollow(this.ships[0]);
      this.physics.velocityFromRotation(this.ships[0].rotation, 600, this.ships[0].body.acceleration);
    } else if (this.cursors.down.isDown) {
      this.physics.velocityFromRotation(this.ships[0].rotation, -400, this.ships[0].body.acceleration);
    }
    else {
      this.emitter.stopFollow(this.ships[0]);
      this.ships[0].setAcceleration(0);
    }

    if (this.keys.lateralLeft.isDown) {
      const newRads = this.addDegreesToRads(this.ships[0].rotation, -90);
      this.physics.velocityFromRotation(newRads, 400, this.ships[0].body.acceleration);
    } else if (this.keys.lateralRight.isDown) {
      const newRads = this.addDegreesToRads(this.ships[0].rotation, 90);
      this.physics.velocityFromRotation(newRads, 400, this.ships[0].body.acceleration);
    }

    if (this.keys.spaceBrake.isDown) {
      const [x, y] = [this.ships[0].body.velocity.x, this.ships[0].body.velocity.y];

      if (x != 0) {
        const velocityDelta =
          Math.abs(this.ships[0].body.velocity.x) < BRAKE_VELOCITY_DELTA
            ? Math.abs(this.ships[0].body.velocity.x)
            : BRAKE_VELOCITY_DELTA;

        if (x > 0) {
          this.ships[0].body.velocity.x -= velocityDelta;
        } else {
          this.ships[0].body.velocity.x += velocityDelta;
        }
      }

      if (y != 0) {
        const velocityDelta =
          Math.abs(this.ships[0].body.velocity.y) < BRAKE_VELOCITY_DELTA
            ? Math.abs(this.ships[0].body.velocity.y)
            : BRAKE_VELOCITY_DELTA;

        if (y > 0) {
          this.ships[0].body.velocity.y -= velocityDelta;
        } else {
          this.ships[0].body.velocity.y += velocityDelta;
        }
      }
    }

    ////// Player 2 //////
    if (this.keys.p2Left.isDown) {
      this.ships[1].setAngularVelocity(-150);
    } else if (this.keys.p2Right.isDown) {
      this.ships[1].setAngularVelocity(150);
    } else {
      this.ships[1].setAngularVelocity(0);
    }

    // TODO: only play emitter when thrust is active
    // TODO: combine inputs. Currently, whichever key is handled last is the only input considered.

    if (this.keys.p2Up.isDown) {
      this.emitter.startFollow(this.ships[1]);
      this.physics.velocityFromRotation(this.ships[1].rotation, 600, this.ships[1].body.acceleration);
    } else if (this.keys.p2Down.isDown) {
      this.physics.velocityFromRotation(this.ships[1].rotation, -400, this.ships[1].body.acceleration);
    }
    else {
      this.emitter.stopFollow(this.ships[1]);
      this.ships[1].setAcceleration(0);
    }

    if (this.keys.p2LateralLeft.isDown) {
      const newRads = this.addDegreesToRads(this.ships[1].rotation, -90);
      this.physics.velocityFromRotation(newRads, 400, this.ships[1].body.acceleration);
    } else if (this.keys.p2LateralRight.isDown) {
      const newRads = this.addDegreesToRads(this.ships[1].rotation, 90);
      this.physics.velocityFromRotation(newRads, 400, this.ships[1].body.acceleration);
    }

    if (this.keys.p2SpaceBrake.isDown) {
      const [x, y] = [this.ships[1].body.velocity.x, this.ships[1].body.velocity.y];

      if (x != 0) {
        const velocityDelta =
          Math.abs(this.ships[1].body.velocity.x) < BRAKE_VELOCITY_DELTA
            ? Math.abs(this.ships[1].body.velocity.x)
            : BRAKE_VELOCITY_DELTA;

        if (x > 0) {
          this.ships[1].body.velocity.x -= velocityDelta;
        } else {
          this.ships[1].body.velocity.x += velocityDelta;
        }
      }

      if (y != 0) {
        const velocityDelta =
          Math.abs(this.ships[1].body.velocity.y) < BRAKE_VELOCITY_DELTA
            ? Math.abs(this.ships[1].body.velocity.y)
            : BRAKE_VELOCITY_DELTA;

        if (y > 0) {
          this.ships[1].body.velocity.y -= velocityDelta;
        } else {
          this.ships[1].body.velocity.y += velocityDelta;
        }
      }
    }


    this.sky.tilePositionX += this.ships[0].body.deltaX();
    this.sky.tilePositionY += this.ships[0].body.deltaY();
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
    if (this.ships.length < 2) {
      const newShip = this.physics.add.image(400, 100, 'logo').setDepth(2);
      newShip.setCollideWorldBounds(false);
      newShip.setMaxVelocity(600);
      newShip.body.setCollideWorldBounds(true);
      this.ships.push(newShip);

      const particles = this.add.particles('red');
      this.emitter = particles.createEmitter({
        speed: 10,
        scale: { start: 1, end: 0 },
        blendMode: 'ADD'
      });
    }
  }
}
