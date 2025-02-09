import * as Helper from '../../helper';

export const Rendering = superclass => class extends superclass {
  constructor({ pos = { x: 0, y: 0 }, renderer, traversableTiles = [], ...args }) {
    super({ ...args });
    this.entityTypes = this.entityTypes.concat('RENDERING');
    this.pos = pos;
    this.renderer = { ...renderer };
    this.currentFrame = 0;
    this.traversableTiles = traversableTiles;
  }

  getRenderer() {
    return this.renderer
  }

  getPosition() {
    return this.pos;
  }

  setPosition(pos) {
    return this.pos = pos
  }

  move(targetPos) {
    let success = false;
    if (this.game.canOccupyPosition(targetPos, this)) {
      let tile = this.game.map[Helper.coordsToString(this.pos)];
      this.game.map[Helper.coordsToString(this.pos)] = { ...tile, entities: tile.entities.filter((e) => e.id !== this.id) };
      this.pos = targetPos;
      this.game.map[Helper.coordsToString(targetPos)].entities.push(this);
      success = true;
    }
    return success;
  }

  canTraverse(tileType) {
    return this.traversableTiles.includes(tileType);
  }

  shove(targetPos, direction, moveSelf = true) {
    let success = false;
    let entityMoveSuccess = false;
    let targetTile = this.game.map[Helper.coordsToString(targetPos)];
    if (targetTile) {
      targetTile.entities.map((entity) => {
        if (entity.entityTypes.includes('PUSHABLE')) {
          if (!entity.passable && entity.pushable) {
            let newX = entity.pos.x + direction[0];
            let newY = entity.pos.y + direction[1];
            let newPos = { x: newX, y: newY };
            entityMoveSuccess = entity.move(newPos);
          }
        }
      });
    }

    if (moveSelf) {
      success = this.move(targetPos);
    } else {
      success = entityMoveSuccess;
    }

    return success;
  }
};
