
import Bullet from './Bullet.js';

const BRAKE_VELOCITY_DELTA = 15;
const KEY_GREATER_THAN = 190;
const KEY_LESS_THAN = 188;
const MAXIMUM_VELOCITY = 600;
const PRIMARY_ACCELERATION = 600;
const SECONDARY_ACCELERATION = 300;
const ANGULAR_VELOCITY = 200;
const BULLET_DAMAGE = 10;
const FIRE_DELAY = 200;

export default class MainGame {
  constructor() {
    this.ships = [];
    this.lastFired = [0, 0];
  }

  preload() {
    this.load.setBaseURL('');

    this.load.audio('exlosion_sound', 'assets/Retro_8-Bit_Game-Bomb_Explosion_09.wav')
    this.load.audio('weapon1_sound', 'assets/Retro_8-Bit_Game-Gun_Laser_Weapon_Shoot_Beam_03.wav')
    this.load.audio('weapon2_sound', 'assets/Retro_8-Bit_Game-Gun_Laser_Weapon_Shoot_Beam_09.wav')
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
    var container = this.add.container(window.innerWidth, window.innerHeight);
    const ts = this.add.tileSprite(-(window.innerWidth / 2), -(window.innerHeight / 2), window.innerWidth, window.innerHeight, 'sky');
    container.add(ts);

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
    this.explosion.setPosition(-100, -100);

    this.sound.add('exlosion_sound');
    this.sound.add('weapon1_sound');
    this.sound.add('weapon2_sound');

    this.initShip(window.innerWidth * .8, window.innerHeight / 2);
    this.initShip(window.innerWidth * .2, window.innerHeight / 2, 180);

    if (!this.keys) {
      this.keys = this.input.keyboard.addKeys({
        'left': 37,
        'up': 38,
        'right': 39,
        'down': 40,
        'lateralLeft': KEY_LESS_THAN,
        'lateralRight': KEY_GREATER_THAN,
        'spaceBrake': Phaser.Input.Keyboard.KeyCodes.CTRL,
        'fire': Phaser.Input.Keyboard.KeyCodes.SHIFT,
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
  }

  update(time) {
    this.ships.forEach(ship => {
      if (!ship.data.destroyed && ship.data.health < 1) {
        ship.data.destroyed = true;
        ship.setActive(false);
        ship.setVisible(false);
        this.explosion.setScale(2);
        this.explosion.setPosition(ship.x, ship.y);
        this.explosion.play('explode', true);
        this.sound.play('exlosion_sound');
      }
    });

    if (this.keys.left.isDown) {
      this.ships[0].setAngularVelocity(-ANGULAR_VELOCITY);
    } else if (this.keys.right.isDown) {
      this.ships[0].setAngularVelocity(ANGULAR_VELOCITY);
    } else {
      this.ships[0].setAngularVelocity(0);
    }

    // TODO: show thrust sprite on correct side when thrust is active
    // TODO: combine inputs. Currently, whichever key is handled last is the only input considered.

    if (this.keys.up.isDown) {
      this.physics.velocityFromRotation(this.ships[0].rotation, PRIMARY_ACCELERATION, this.ships[0].body.acceleration);
    } else if (this.keys.down.isDown) {
      this.physics.velocityFromRotation(this.ships[0].rotation, -SECONDARY_ACCELERATION, this.ships[0].body.acceleration);
    }
    else {
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

    if (this.keys.fire.isDown && time > this.lastFired[0] && !this.ships[0].data.destroyed) {
      var bullet = this.bullets.get();

      if (bullet) {
        bullet.fire(this.ships[0]);
        this.sound.play('weapon1_sound');
        this.lastFired[0] = time + FIRE_DELAY;
      }
    }

    ////// Player 2 //////
    if (this.keys.p2Left.isDown) {
      this.ships[1].setAngularVelocity(-ANGULAR_VELOCITY);
    } else if (this.keys.p2Right.isDown) {
      this.ships[1].setAngularVelocity(ANGULAR_VELOCITY);
    } else {
      this.ships[1].setAngularVelocity(0);
    }

    // TODO: only play emitter when thrust is active
    // TODO: combine inputs. Currently, whichever key is handled last is the only input considered.

    if (this.keys.p2Up.isDown) {
      this.physics.velocityFromRotation(this.ships[1].rotation, PRIMARY_ACCELERATION, this.ships[1].body.acceleration);
    } else if (this.keys.p2Down.isDown) {
      this.physics.velocityFromRotation(this.ships[1].rotation, -SECONDARY_ACCELERATION, this.ships[1].body.acceleration);
    }
    else {
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

    if (this.keys.p2Fire.isDown && time > this.lastFired[1] && !this.ships[1].data.destroyed) {
      var bullet = this.bullets.get();

      if (bullet) {
        bullet.fire(this.ships[1]);
        this.sound.play('weapon2_sound');
        this.lastFired[1] = time + FIRE_DELAY;
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

  initShip(x, y, angle) {
    if (this.ships.length < 2) {
      const newShip = this.physics.add.image(48, 48, `ship0${this.ships.length + 1}`).setDepth(2);
      newShip.data = { health: 100 };
      newShip.setCollideWorldBounds(true);
      newShip.setMaxVelocity(MAXIMUM_VELOCITY);
      this.physics.add.collider(newShip, this.bullets, this.hit, null, this);
      newShip.setPosition(x, y);
      if (angle) {
        newShip.setAngle(angle);
      }
      this.ships.push(newShip);
    }
  }
}
