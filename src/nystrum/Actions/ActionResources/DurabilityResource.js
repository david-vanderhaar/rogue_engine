import {ActionResource} from './ActionResource';

export class DurabilityResource extends ActionResource {
  constructor({ ...args }) {
    super({ ...args });
    this.name = 'Life Force';
    this.actorResourcePath = 'durability';
    this.renderer = { color: '#121212', background: '#dc322f', character: 'o', sprite: '' }
  }
}