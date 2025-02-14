import { Base } from './Base';
import { GoToPreviousKeymap } from './GoToPreviousKeymap';
import * as Helper from '../../helper';
import * as Constant from '../constants'
import { MoveTargetingCursor } from './MoveTargetingCursor';
import { Say } from './Say';

export class PrepareRangedAction extends Base {
  constructor({ 
    passThroughEnergyCost = Constant.ENERGY_THRESHOLD, 
    passThroughRequiredResources = [],
    validTargetFilter = (entityInTile) => true,
    range = 3,
    cursorShape = Constant.CLONE_PATTERNS.point,
    actionClass = Say,
    actionParams = {message: 'wow, ranged actions'},
    ...args 
  }) {
    super({ ...args });
    this.passThroughEnergyCost = passThroughEnergyCost;
    this.passThroughRequiredResources = passThroughRequiredResources;
    this.validTargetFilter = validTargetFilter;
    this.range = range;
    this.actionClass = actionClass;
    this.actionParams = actionParams;
    this.cursorShape = cursorShape;
    this.processDelay = 0;
    this.energyCost = 0;
  }

  perform() {
    const pos = this.actor.getPosition();
    const positionsInRange = Helper.getPointsWithinRadius(pos, this.range);

    let targets = [];
    let targetIndex = 0;
    positionsInRange.forEach((position) => {
      let tile = this.game.map[Helper.coordsToString(position)];
      if (tile) {
        targets = [
          ...targets,
          ...tile.entities.filter(this.validTargetFilter)
        ]
      }
    })

    let initalPosition = null;
    if (targets.length) {
      initalPosition = targets[0].getPosition();
      if (targets.length > 1) targetIndex = 1;
    } else {
      initalPosition = {...pos}
    }

    const positions = Helper.getPositionsFromStructure(this.cursorShape, initalPosition)
    this.actor.activateCursor(positions);

    const goToPreviousKeymap = new GoToPreviousKeymap({
      actor: this.actor,
      game: this.game,
      onAfter: () => {
        this.actor.deactivateCursor()
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

          }
        })
      },
      'w,ArrowUp': () => { 
        return new MoveTargetingCursor({
          actor: this.actor,
          game: this.game,
          range: this.range,
          label: 'move N',
          direction: Constant.DIRECTIONS.N,
        })
      },
      'a,ArrowLeft': () => { 
        return new MoveTargetingCursor({
          actor: this.actor,
          game: this.game,
          range: this.range,
          label: 'move W',
          direction: Constant.DIRECTIONS.W,
        })
      },
      's,ArrowDown': () => { 
        return new MoveTargetingCursor({
          actor: this.actor,
          game: this.game,
          range: this.range,
          label: 'move S',
          direction: Constant.DIRECTIONS.S,
        })
      },
      'd,ArrowRight': () => { 
        return new MoveTargetingCursor({
          actor: this.actor,
          game: this.game,
          range: this.range,
          label: 'move E',
          direction: Constant.DIRECTIONS.E,
        })
      },
      f: () => {
        return new this.actionClass({
          ...this.actionParams,
          actor: this.actor,
          game: this.game,
          targetPos: { ...this.actor.getCursorPositions()[0] },
          targetPositions: { ...this.actor.getCursorPositions() },
          energyCost: this.passThroughEnergyCost,
          requiredResources: this.passThroughRequiredResources,
          onSuccess: () => {
            this.actor.deactivateCursor();
            this.actor.setNextAction(goToPreviousKeymap);
          }
        })
      }
    };


    this.actor.setKeymap(keymap);
    return {
      success: true,
      alternative: null,
    };
  }
};
