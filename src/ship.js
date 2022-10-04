
export default function ship(self) {
  const logo = self.physics.add.image(400, 100, 'logo');
  logo.setCollideWorldBounds(true);

  return logo;

  // logo.setVelocity(100, 200);
  // logo.setBounce(1, 1);
}
