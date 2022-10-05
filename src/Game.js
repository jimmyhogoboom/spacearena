
import Bullet from './Bullet.js';

const BRAKE_VELOCITY_DELTA = 15;
const KEY_GREATER_THAN = 190;
const KEY_LESS_THAN = 188;
const MAXIMUM_VELOCITY = 600;
const PRIMARY_ACCELERATION = 600;
const SECONDARY_ACCELERATION = 300;
const BULLET_DAMAGE = 10;

export default class MainGame {
  constructor() {
    // super('MainGame')
    this.ships = [];
    this.lastFired = [0, 0];
  }

  preload() {
    this.load.setBaseURL('');
    this.load.image('ship01', 'assets/green.png');
    this.load.image('ship02', 'assets/orange.png');
    this.load.image('sky', 'assets/nebula.jpg');
    this.load.image('projectile', 'assets/projectile-red.png');
    this.load.spritesheet(
      'explosion',
      'assets/explosion_46x46.png',
      { frameWidth: 46, frameHeight: 46 });

    // this.load.setBaseURL('http://labs.phaser.io');
    // TODO: bring these into assets directory
    this.load.image('red', 'assets/particles/red.png');
  }

  hit(ship, bullet, ...args) {
    ship.data.health -= BULLET_DAMAGE;
    bullet.lifespan = 0;
  }

  create() {
    this.sky = this.add.tileSprite(640, 360, 1280, 720, 'sky').setScrollFactor(0);
    this.bullets = this.physics.add.group({
      classType: Bullet,
      maxSize: 30,
      runChildUpdate: true
    });
    this.anims.create({
      key: 'explode',
      frames: this.anims.generateFrameNumbers('explosion', { start: 0, end: 10 }),
      frameRate: 10,
      hideOnComplete: true,
    });
    this.explosion = this.add.sprite(506, 46, 'explosion');

    this.initShip();
    this.initShip();

    this.physics.add.collider(this.ships[0], this.bullets, this.hit, null, this);
    this.physics.add.collider(this.ships[1], this.bullets, this.hit, null, this);

    if (!this.cursors) {
      this.cursors = this.input.keyboard.createCursorKeys()
    }

    if (!this.keys) {
      this.keys = this.input.keyboard.addKeys({
        'lateralLeft': KEY_LESS_THAN,
        'lateralRight': KEY_GREATER_THAN,
        'spaceBrake': Phaser.Input.Keyboard.KeyCodes.M,
        'fire': Phaser.Input.Keyboard.KeyCodes.L,
        'p2Up': Phaser.Input.Keyboard.KeyCodes.W,
        'p2Down': Phaser.Input.Keyboard.KeyCodes.S,
        'p2Left': Phaser.Input.Keyboard.KeyCodes.A,
        'p2Right': Phaser.Input.Keyboard.KeyCodes.D,
        'p2LateralLeft': Phaser.Input.Keyboard.KeyCodes.Q,
        'p2LateralRight': Phaser.Input.Keyboard.KeyCodes.E,
        'p2SpaceBrake': Phaser.Input.Keyboard.KeyCodes.X,
        'p2Fire': Phaser.Input.Keyboard.KeyCodes.SPACE,
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

  update(time) {
    this.ships.forEach(ship => {
      if (ship.data.health < 1) {
        ship.setActive(false);
        ship.setVisible(false);
        this.explosion.setScale(2);
        this.explosion.setPosition(ship.x, ship.y);
        this.explosion.play('explode', true);
      }
    });

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
      this.physics.velocityFromRotation(this.ships[0].rotation, PRIMARY_ACCELERATION, this.ships[0].body.acceleration);
    } else if (this.cursors.down.isDown) {
      this.physics.velocityFromRotation(this.ships[0].rotation, -SECONDARY_ACCELERATION, this.ships[0].body.acceleration);
    }
    else {
      this.emitter.stopFollow(this.ships[0]);
      this.ships[0].setAcceleration(0);
    }

    if (this.keys.lateralLeft.isDown) {
      const newRads = this.addDegreesToRads(this.ships[0].rotation, -90);
      this.physics.velocityFromRotation(newRads, SECONDARY_ACCELERATION, this.ships[0].body.acceleration);
    } else if (this.keys.lateralRight.isDown) {
      const newRads = this.addDegreesToRads(this.ships[0].rotation, 90);
      this.physics.velocityFromRotation(newRads, SECONDARY_ACCELERATION, this.ships[0].body.acceleration);
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

    if (this.keys.fire.isDown && time > this.lastFired[0]) {
      var bullet = this.bullets.get();

      if (bullet) {
        bullet.fire(this.ships[0]);

        this.lastFired[0] = time + 200;
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
      this.physics.velocityFromRotation(this.ships[1].rotation, PRIMARY_ACCELERATION, this.ships[1].body.acceleration);
    } else if (this.keys.p2Down.isDown) {
      this.physics.velocityFromRotation(this.ships[1].rotation, -SECONDARY_ACCELERATION, this.ships[1].body.acceleration);
    }
    else {
      this.emitter.stopFollow(this.ships[1]);
      this.ships[1].setAcceleration(0);
    }

    if (this.keys.p2LateralLeft.isDown) {
      const newRads = this.addDegreesToRads(this.ships[1].rotation, -90);
      this.physics.velocityFromRotation(newRads, SECONDARY_ACCELERATION, this.ships[1].body.acceleration);
    } else if (this.keys.p2LateralRight.isDown) {
      const newRads = this.addDegreesToRads(this.ships[1].rotation, 90);
      this.physics.velocityFromRotation(newRads, SECONDARY_ACCELERATION, this.ships[1].body.acceleration);
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

    if (this.keys.p2Fire.isDown && time > this.lastFired[1]) {
      var bullet = this.bullets.get();

      if (bullet) {
        bullet.fire(this.ships[1]);

        this.lastFired[1] = time + 100;
      }
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

  // TODO: use Phaser.Math.DegToRad instead
  degreesToRads(degrees) {
    return (degrees * Math.PI) / 180;
  }

  initShip() {
    if (this.ships.length < 2) {
      const newShip = this.physics.add.image(48, 48, `ship0${this.ships.length + 1}`).setDepth(2);
      newShip.data = { health: 100 };
      newShip.setCollideWorldBounds(true);
      newShip.setMaxVelocity(MAXIMUM_VELOCITY);
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
