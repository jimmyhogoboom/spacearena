
import config from './config.js';
import preload from './preload.js';
import create from './create.js';
import update from './update.js';
import controls from './controls.js';

new Phaser.Game(config({ preload: preload, create: create, update: update, controls: controls }));


