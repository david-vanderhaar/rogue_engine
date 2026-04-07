import { MESSAGE_TYPE } from '../message';
import { Base } from './Base';
export class NoopFail extends Base {
  constructor({ message, messageType = MESSAGE_TYPE.ERROR, processDelay = 50, ...args }) {
    super({ ...args });
    this.message = message;
    this.messageType = messageType;
    this.processDelay = processDelay;
  }
  perform() {
    this.game.addMessage(`${this.actor.name} says "noop fail"`, this.messageType);
    return {
      success: false,
      alternative: null,
    };
  }
};
