import { MESSAGE_TYPE } from '../message';
import { Base } from './Base';
export class Say extends Base {
  constructor({ message, messageType = MESSAGE_TYPE.INFORMATION, processDelay = 50, ...args }) {
    super({ ...args });
    this.message = message;
    this.messageType = messageType;
    this.processDelay = processDelay;
  }
  perform() {
    if (this.message) {
      this.game.addMessage(`${this.actor.name} "${this.message}"`, this.messageType);
    }
    return {
      success: true,
      alternative: null,
    };
  }
};
