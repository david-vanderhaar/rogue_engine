import {ActionResource} from './ActionResource';

export class MindResource extends ActionResource {
  constructor({ ...args }) {
    super({ ...args });
    this.name = 'Mind';
    this.actorResourcePath = 'charge';
    this.renderer = { color: '#8eac86', background: '#2e2a39', character: '&', sprite: '&' }
  }
}