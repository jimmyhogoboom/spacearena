
let cursorKeys;

export default function cursors() {
  if (!cursorKeys) {
    cursorKeys = this.input.keyboard.createCursorKeys()
  }
  return cursorKeys;
}
