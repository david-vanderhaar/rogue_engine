import { cloneDeep } from 'lodash';
import uuid from 'uuid/v1';
import { PlaceActor } from './PlaceActor';
export class PlaceActors extends PlaceActor {
  constructor({ targetPositions = [], ...args }) {
    super({ ...args });
    this.targetPositions = targetPositions;
  }

  // perform_1() {
  //   let success = false;
  //   let alternative = null;
  //   let canOccupyPosition = this.forcePlacement ? true : this.game.canOccupyPosition(targetPos, this.entity);
  //   const tile = this.game.map[Helper.coordsToString(targetPos)];
  //   if (canOccupyPosition && tile) {
  //     this.entity.pos = targetPos;
  //     tile.entities.push(this.entity);
  //     this.game.engine.addActorAsNext(this.entity);
  //     success = true;
  //   }
  //   return {
  //     success,
  //     alternative,
  //   };
  // }

  perform() {
    let success = false;
    let alternative = null;
    this.targetPositions.forEach((targetPos) => {
      let clone = cloneDeep(this.entity);
      clone.game = this.game;
      clone.id = uuid();
      clone.pos = targetPos;
      let canOccupyPosition = this.forcePlacement ? true : this.game.canOccupyPosition(targetPos, clone);
      if (canOccupyPosition) {
        let placementSuccess = this.game.placeActorOnMap(clone);
        if (placementSuccess)
          success = true;
      }
    });

    return {
      success,
      alternative,
    };
  }
};
