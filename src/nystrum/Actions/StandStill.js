import { MESSAGE_TYPE } from '../message';
import { Say } from './Say';
import { SOUNDS as HIDDEN_LEAF_SOUNDS} from '../Modes/HiddenLeaf/sounds';

export class StandStill extends Say {
  constructor({ processDelay = 50, ...args }) {
    super({ ...args });
    this.message = '...';
    this.messageType = MESSAGE_TYPE.INFORMATION;
    this.processDelay = processDelay;
  }
  perform() {
    const result = super.perform();

    if (result.success) {
      HIDDEN_LEAF_SOUNDS.pass_turn.play();
    }

    return result;
  }
};
