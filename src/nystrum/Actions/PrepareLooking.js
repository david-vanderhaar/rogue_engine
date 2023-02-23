import { Base } from './Base';
import { GoToPreviousKeymap } from './GoToPreviousKeymap';
import { DIRECTIONS, ENERGY_THRESHOLD } from '../constants';
import * as Helper from '../../helper';
import * as Constant from '../constants'
import { MoveTargetingCursor } from './MoveTargetingCursor';

export class PrepareLooking extends Base {
  constructor({ 
    passThroughEnergyCost = ENERGY_THRESHOLD, 
    passThroughRequiredResources = [], 
    ...args 
  }) {
    super({ ...args });
    this.passThroughEnergyCost = passThroughEnergyCost;
    this.passThroughRequiredResources = passThroughRequiredResources;
    this.processDelay = 0;
    this.energyCost = 0;
  }

  updateLookedAt(positions = this.actor.getCursorPositions()) {
    const targets = positions.reduce((acc, pos) => {
      return [
        ...acc,
        ...Helper.getEntitiesByPosition({game: this.game, position: pos})
      ]
    }, [])

    this.game.entityLog.setLookedAt(targets)
  }

  perform() {
    const pos = this.actor.getPosition();
    const positionsInRange = Helper.getPointsWithinRadius(pos, this.game.mapWidth);

    let targets = [];
    let targetIndex = 0;
    positionsInRange.forEach((position) => {
      let tile = this.game.map[Helper.coordsToString(position)];
      if (tile) { targets = [...targets, ...tile.entities] }
    })

    let positions = [];
    if (targets.length) {
      positions.push(targets[0].getPosition());
      if (targets.length > 1) targetIndex = 1;
    } else {
      positions.push({...pos})
    }

    this.actor.activateCursor(positions);
    this.updateLookedAt(positions)

    const goToPreviousKeymap = new GoToPreviousKeymap({
      actor: this.actor,
      game: this.game,
      onAfter: () => {
        this.actor.deactivateCursor()
        this.game.entityLog.setLookedAt()
      },
    })

    let keymap = {
      Escape: () => goToPreviousKeymap,
      
      e: () => { 
        return new MoveTargetingCursor({
          actor: this.actor,
          game: this.game,
          label: 'Next Target',
          targetPos: targets.length ? targets[targetIndex].getPosition() : null,
          onSuccess: () => {
            targetIndex = (targetIndex + 1) % targets.length;
            // this.updateLookedAt()
          },
        })
      },
      q: () => { 
        return new MoveTargetingCursor({
          actor: this.actor,
          game: this.game,
          label: 'Previous Target',
          targetPos: targets.length ? targets[targetIndex].getPosition() : null,
          onSuccess: () => {
            if (targetIndex === 0) {
              targetIndex = targets.length - 1
            } else {
              targetIndex -= 1
            }

            // this.updateLookedAt()
          }
        })
      },
      'w,ArrowUp': () => { 
        return new MoveTargetingCursor({
          actor: this.actor,
          game: this.game,
          label: 'move N',
          direction: DIRECTIONS.N,
          // onSuccess: this.updateLookedAt
        })
      },
      'a,ArrowLeft': () => { 
        return new MoveTargetingCursor({
          actor: this.actor,
          game: this.game,
          label: 'move W',
          direction: DIRECTIONS.W,
          // onSuccess: this.updateLookedAt
        })
      },
      's,ArrowDown': () => { 
        return new MoveTargetingCursor({
          actor: this.actor,
          game: this.game,
          label: 'move S',
          direction: DIRECTIONS.S,
          // onSuccess: this.updateLookedAt
        })
      },
      'd,ArrowRight': () => { 
        return new MoveTargetingCursor({
          actor: this.actor,
          game: this.game,
          label: 'move E',
          direction: DIRECTIONS.E,
          // onSuccess: this.updateLookedAt
        })
      },
    };
    this.actor.setKeymap(keymap);
    return {
      success: true,
      alternative: null,
    };
  }
};
