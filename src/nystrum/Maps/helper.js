import * as _ from 'lodash';
import * as Helper from '../../helper';
import { GAME } from '../game'

export const getCenter = () => {
  return {
    x: Math.floor(GAME.mapWidth / 2),
    y: Math.floor(GAME.mapHeight / 2),
  }
}

export const getPositionsInTileZone = (
  mapHeight,
  mapWidth,
  origin = { x: 0, y: 0 },
  height = 3,
  width = 3,
) => {
  const result = [];
  for (let i = 0; i < mapHeight; i++) {
    for (let j = 0; j < mapWidth; j++) {
      if (i >= origin.y && i <= origin.y + (height - 1) && j >= origin.x && j <= origin.x + (width - 1)) {
        result.push({x: j, y: i})
      }
    }
  }

  return result;
}

export const addTileZone = (
  tileKey,
  origin = { x: 0, y: 0 },
  height = 3,
  width = 3,
  type = 'GROUND',
  map,
  mapHeight,
  mapWidth,
) => {
  for (let i = 0; i < mapHeight; i++) {
    for (let j = 0; j < mapWidth; j++) {
      if (i >= origin.y && i <= origin.y + (height - 1) && j >= origin.x && j <= origin.x + (width - 1)) {
        const key = `${j},${i}`
        addTileToMap({map, key, tileKey, tileType: type})
      }
    }
  }
}

export const addTileZoneRectFilled = addTileZone
export const addTileZoneRectUnfilled = (
  tileKey,
  origin = { x: 0, y: 0 },
  height = 3,
  width = 3,
  type = 'GROUND',
  map,
) => {
  // add tiles to the edges of a rectangle defined by origin, height, and width
  // but not the interior
  for (let y = origin.y; y < origin.y + height; y++) {
    for (let x = origin.x; x < origin.x + width; x++) {
      if (y === origin.y || y === origin.y + height - 1 || x === origin.x || x === origin.x + width - 1) {
        const key = `${x},${y}`
        addTileToMap({map, key, tileKey, tileType: type})
      }
    }
  }
}

export const addTileZoneFilledCircle = (
  origin = { x: 0, y: 0 },
  radius = 3,
  type = 'GROUND',
) => {
  Helper.getPointsWithinRadius(origin, radius).forEach((point) => {
    const key = `${point.x},${point.y}`
    addTileToMap({map: GAME.map, key, tileKey: GAME.tileKey, tileType: type})
  })
}

export const addTileZoneUnfilledCircle = (
  origin = { x: 0, y: 0 },
  radius = 3,
  type = 'GROUND',
) => {
  Helper.getPointsOnCircumference(origin, radius).forEach((point) => {
    const key = `${point.x},${point.y}`
    addTileToMap({map: GAME.map, key, tileKey: GAME.tileKey, tileType: type})
  })
}

export const addTileToMap = ({map, key, tileKey, tileType, entities = []}) => {
  const numberOfAnimationFrames = _.get(tileKey[tileType], 'animation.length', 0);
  const currentFrame = Helper.getRandomInt(0, numberOfAnimationFrames);
  const tileData = {
    type: tileType,
    currentFrame,
    entities,
    tileKey,
  };
  map[key] = tileData;

  return tileData;
}

export const tileHasTag = ({tile, tag}) => {
  const tags = _.get(tile.tileKey[tile.type], 'tags', []);
  return tags.includes(tag);
}

export const tileHasAnyTags = ({tile, tags}) => {
  const tileTags = _.get(tile.tileKey[tile.type], 'tags', []);
  return tags.some((tag) => tileTags.includes(tag))
}

export const getTileFromMap = ({map, position}) => map[Helper.coordsToString(position)];