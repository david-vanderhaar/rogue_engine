import { destroyEntity } from '../Entities/helper';
import { MESSAGE_TYPE } from '../message';
import { Base } from './Base';
export class SpawnAndPlaceItem extends Base {
  constructor({ targetPos, entitySpawnFunction, processDelay = 25, ...args }) {
    super({ ...args });
    this.targetPos = targetPos;
    this.processDelay = processDelay;
    this.entitySpawnFunction = entitySpawnFunction;
  }
  perform() {
    let success = false;
    let alternative = null;
    const entity = this.entitySpawnFunction(this.game.engine)

    if (this.game.canOccupyPosition(this.targetPos, entity)) {
      entity.pos = this.targetPos;
      success = this.game.placeActorOnMap(entity);
    } else {
      this.game.addMessage('Cannot place item here.', MESSAGE_TYPE.ERROR);
      destroyEntity(entity);
    }
    return {
      success,
      alternative,
    };
  }
}
;
