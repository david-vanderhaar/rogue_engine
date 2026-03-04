import { Base } from './Base';
import { GoToPreviousKeymap } from './GoToPreviousKeymap';
import * as Helper from '../../helper';
import * as Constant from '../constants'
import { MoveTargetingCursor } from './MoveTargetingCursor';
import { PrepareTelekinesisThrow } from './PrepareTelekinesisThrow';
import { COLORS } from '../Modes/Telekinetic/theme';

export class PrepareRangedTelekinesisAction extends Base {
  constructor({ 
    passThroughEnergyCost = Constant.ENERGY_THRESHOLD, 
    passThroughRequiredResources = [],
    keymapTriggerString = 'f',
    validTargetFilter = (entityInTile) => true,
    triggerRange = 3,
    throwRange = 3,
    cursorShape = Constant.CLONE_PATTERNS.point,
    ...args 
  }) {
    super({ ...args });
    this.passThroughEnergyCost = passThroughEnergyCost;
    this.passThroughRequiredResources = passThroughRequiredResources;
    this.keymapTriggerString = keymapTriggerString;
    this.validTargetFilter = validTargetFilter;
    this.triggerRange = triggerRange;
    this.throwRange = throwRange;
    this.cursorShape = cursorShape;
    this.processDelay = 0;
    this.energyCost = 0;
  }

  perform() {
    const pos = this.actor.getPosition();
    // const positionsInRange = Helper.getPointsWithinRadius(pos, this.triggerRange);
    // const positionsInRange = Helper.getPointsOnSquarePerimeter({x: pos.x + 1, y: pos.y + 1}, this.triggerRange);
    // const positionsInRange = Helper.getPointsWithinSquare(pos, this.triggerRange);
    const positionsInRange = Helper.getAllPositionsInStraightPathRange(pos, this.triggerRange);

    const rangeAnims = []
    const deactivateAnimations = (anims) => anims.forEach((anim) => {
      this.game.display.removeAnimation(anim.id);
    })

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

      rangeAnims.push(this.game.display.addAnimation(
        this.game.display.animationTypes.BLINK_BOX, 
        {
          x: position.x,
          y: position.y,
          color: Constant.THEMES.SOLARIZED.base00,
          isBlinking: false,
          strokeWidth: 3,
        }
      ))
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
        deactivateAnimations(rangeAnims)
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
          range: this.triggerRange,
          label: 'move N',
          direction: Constant.DIRECTIONS.N,
        })
      },
      'a,ArrowLeft': () => { 
        return new MoveTargetingCursor({
          actor: this.actor,
          game: this.game,
          range: this.triggerRange,
          label: 'move W',
          direction: Constant.DIRECTIONS.W,
        })
      },
      's,ArrowDown': () => { 
        return new MoveTargetingCursor({
          actor: this.actor,
          game: this.game,
          range: this.triggerRange,
          label: 'move S',
          direction: Constant.DIRECTIONS.S,
        })
      },
      'd,ArrowRight': () => { 
        return new MoveTargetingCursor({
          actor: this.actor,
          game: this.game,
          range: this.triggerRange,
          label: 'move E',
          direction: Constant.DIRECTIONS.E,
        })
      },
      [this.keymapTriggerString]: () => {
        return new PrepareTelekinesisThrow({
          ...this.actionParams,
          actor: this.actor,
          game: this.game,
          label: 'confirm targets',
          throwRange: this.throwRange,
          targetPosition: { ...this.actor.getCursorPositions().at(0) },
          targetPositions: [...this.actor.getCursorPositions()],
          passThroughEnergyCost: this.passThroughEnergyCost,
          passThroughRequiredResources: this.passThroughRequiredResources,
          onSuccess: () => {
            // this.actor.deactivateCursor();
            // this.actor.setNextAction(goToPreviousKeymap);
            deactivateAnimations(rangeAnims)

            // modify cursor color or size
            this.actor.updateAllCursorNodes([
              {key: 'fill', value: COLORS.blue}, 
              {key: 'stroke', value: 'transparent'}, 
            ]);

            // then add direction arrows
            const cursorPosition = this.actor.getCursorPositions().at(0)
            this.actor.addTextAnimationAtPositions([
              {
                position: Helper.getPositionInDirection(cursorPosition, Constant.DIRECTIONS.N),
                text: '↑',
                color: COLORS.blue,
                textAttributes: {fontSize: 24}
              },
              {
                position: Helper.getPositionInDirection(cursorPosition, Constant.DIRECTIONS.E),
                text: '→',
                color: COLORS.blue,
                textAttributes: {fontSize: 24}
              },
              {
                position: Helper.getPositionInDirection(cursorPosition, Constant.DIRECTIONS.S),
                text: '↓',
                color: COLORS.blue,
                textAttributes: {fontSize: 24}
              },
              {
                position: Helper.getPositionInDirection(cursorPosition, Constant.DIRECTIONS.W),
                text: '←',
                color: COLORS.blue,
                textAttributes: {fontSize: 24}
              },
            ])
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
