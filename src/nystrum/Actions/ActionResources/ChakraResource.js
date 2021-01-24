import {ActionResource} from './ActionResource';

export class ChakraResource extends ActionResource {
  constructor({ ...args }) {
    super({ ...args });
    this.name = 'Chakra';
    this.actorResourcePath = 'charge';
    this.renderer = { background: '#224c92', color: '#13b8d7', character: '' }
  }
}