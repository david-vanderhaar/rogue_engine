import { StatChangeAtTargetPosition } from './StatChangeAtTargetPosition.js';

export class StatChangeOnSelf extends StatChangeAtTargetPosition {
  constructor({...args}) {
    super({ ...args });
  }

  getTarget() {
    return this.actor;
  }
}

