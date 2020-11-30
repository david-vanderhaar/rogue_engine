import {ActionResource} from './ActionResource';

export class ChakraResource extends ActionResource {
  constructor({ ...args }) {
    super({ ...args });
    this.name = 'Chakra';
    this.actorResourcePath = 'charge';
  }
}