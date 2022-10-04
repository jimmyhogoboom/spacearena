
import ship from "./ship.js";

export default function create() {
  this.add.image(400, 300, 'sky');

  const particles = this.add.particles('red');

  const ship0 = ship(this);

  const emitter = particles.createEmitter({
    speed: 100,
    scale: { start: 1, end: 0 },
    blendMode: 'ADD'
  });
  emitter.startFollow(ship0);

};
