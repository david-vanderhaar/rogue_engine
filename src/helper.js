import * as ROT from 'rot-js';

export const delay = (timeDelayed = 100) => {
  // return;
  if (timeDelayed <= 0) return;
  return new Promise(resolve => setTimeout(resolve, timeDelayed));
}

export const range = (number) => [...Array(number).keys()]
export const duplicate = (number, item) => [...Array(number).fill('').map(item)]

export const clamp = (value, min, max) => {
  return Math.min(Math.max(value, min), max);
};

export const getRandomInArray = (array) => {
  return array[Math.floor(Math.random() * array.length)];
}

export function getNumberOfItemsInArray(number, originalArray) {
  const array = [...originalArray]
  let result = []

  range(number).forEach(() => {
    const index = Math.floor(Math.random() * array.length)
    const item = array.splice(index, 1)
    result = result.concat(item)
  })

  return result
}

export const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

export const getRandomIntInclusive = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const coordsAreEqual = (pos_one, pos_two) => pos_one.x === pos_two.x && pos_one.y === pos_two.y

export const coordsToString = (coords) => coords && `${coords.x},${coords.y}`
export const stringToCoords = (key) => {
  const parts = key.split(',')
  return {
    x: parseInt(parts[0]),
    y: parseInt(parts[1]),
  }
}

const isTilePassable = (game) => (x, y) => {
  const tile = game.map[x + "," + y];
  if (tile) {
    return (game.tileKey[tile.type].passable);
  } else {
    return false
  }
}

export const getTileAtPosition = (game, pos) => game.map[coordsToString(pos)]

const isTileAndEntitiesPassable = (game, sourceEntityPos) => (x, y) => {
  const tile = game.map[x + "," + y];
  if (tile) {
    const tileIsPassable = game.tileKey[tile.type].passable
    if (tile.entities.length && !coordsAreEqual(sourceEntityPos, {x, y})) {
      const entitiesArePassable = tile.entities.every((entity) => entity.passable);
      return tileIsPassable && entitiesArePassable;
    }
    return tileIsPassable;
  } else {
    return false
  }
}

export const calculatePath = (game, targetPos, currentPos, topology = 4, isPassable = isTilePassable) => {
  let map = game.map
  let isPassableCallback = isPassable(game);
  let astar = new ROT.Path.AStar(targetPos.x, targetPos.y, isPassableCallback, { topology });
  let path = [];
  astar.compute(currentPos.x, currentPos.y, function (x, y) {
    path.push({ x, y })
  });

  return path.slice(1);
}

export const calculateAstar8Path = (game, currentPos, targetPos) => calculatePath(game, targetPos, currentPos, 8, () => () => true);

export const calculatePathAroundObstacles = (
  game, 
  targetPos, 
  currentPos, 
  topology = 4
) => calculatePath(
  game,
  targetPos,
  currentPos,
  topology,
  (gameObject) => isTileAndEntitiesPassable(gameObject, currentPos)
);

export const calculateStraightPath = (p0, p1) => {
  let points = [];
  let N = diagonal_distance(p0, p1);
  for (let step = 0; step < N; step++) {
    let t = N === 0 ? 0.0 : step / N;
    points.push(round_point(lerp_point(p0, p1, t)));
  }
  return points;
}

export const diagonal_distance = (p0, p1) => {
  let dx = p1.x - p0.x, dy = p1.y - p0.y;
  return Math.max(Math.abs(dx), Math.abs(dy));
}

const round_point = (p) => {
  return {x: Math.round(p.x), y: Math.round(p.y)};
}

const lerp_point = (p0, p1, t) => {
  return {
    x: lerp(p0.x, p1.x, t),
    y: lerp(p0.y, p1.y, t)
  };
}

const lerp = (start, end, t) => {
  return start + t * (end - start);
}

export const getPositionInDirection = (pos, direction) => {
  return {x: pos.x + direction[0], y: pos.y + direction[1]}
}

export const getDirectionFromOrigin = (origin, target) => {
  return {
    x: Math.sign(target.x - origin.x),
    y: Math.sign(target.y - origin.y),
  }
}

export const calculatePathWithRange = (game, targetPos, currentPos, topology, range) => {
  let path = calculatePath(game, targetPos, currentPos, topology);
  return path.slice(0, range + 1);
}

export const getRandomPos = (map) => {
  let keys = Object.keys(map);
  let key = getRandomInArray(keys).split(',');
  let pos = { x: parseInt(key[0]), y: parseInt(key[1])}
  return {coordinates: pos, text: key}
}

export const getDestructableEntities = (entites) => {
  return entites.filter((entity) => entity.hasOwnProperty('durability'));
}

export const getFirstDestructableEntity = (entites) => {
  const destrucableEntities = getDestructableEntities(entites)
  if (destrucableEntities.length) return destrucableEntities[0]
  else return null
}

export const filterEntitiesByType = (entites, type) => {
  return entites.filter((entity) => entity.entityTypes.includes(type));
}

export const filterEntitiesByAttr = (entites, attr, value) => {
  return entites.filter((entity) => entity[attr] === value);
}

export const getEntitiesByPosition = ({game, position}) => {
  const tile = getTileAtPosition(game, position)
  if (!tile) return []
  return tile.entities
}

export const getEntitiesByPositionByType = ({game, position, entityType}) => {
  const entities = getEntitiesByPosition({game, position})
  return filterEntitiesByType(entities, entityType);
}

export const getEntitiesByPositionByAttr = ({game, position, attr, value}) => {
  const entities = getEntitiesByPosition({game, position})
  return filterEntitiesByAttr(entities, attr, value);
}

const getGranularity = (radius) => {
  let result = (2 / 3) * (Math.pow(radius, 3) - (9 * Math.pow(radius, 2)) + (32 * radius) - 18)
  return result
}

export const getNeighboringTiles = (map, pos) => {
  const neigborPositions = [
    { x: 0, y: 1},
    { x: 1, y: 1},
    { x: 1, y: 0},
    { x: 1, y: -1},
    { x: 0, y: -1},
    { x: -1, y: -1},
    { x: -1, y: 0},
    { x: -1, y: 1},
  ];

  return neigborPositions.map((point) => {
    const newPos = { x: pos.x + point.x, y: pos.y + point.y};
    let newTile = map[coordsToString(newPos)];
    if (newTile) {
      return newTile
    }
  }).filter((item) => Boolean(item));
}

export const getPointsOnCircumference = (centerX = 0, centerY = 0, r = 3) => {
  const n = getGranularity(r);
  let list = [];
  for (let i = 0; i < n; i++) {
    let x = Math.round(centerX + (Math.cos(2 * Math.PI / n * i) * r))
    let y = Math.round(centerY + (Math.sin(2 * Math.PI / n * i) * r))
    list.push({ x, y });
  }
  return list
}

export const getPointsWithinRadius = (position, radius) => {
  let positions = [];
  for (let x = position.x - radius; x < position.x + radius; x++) {
    let yspan = Math.floor(radius * Math.sin(Math.acos((position.x - x) / radius)));
    for (let y = position.y - yspan + 1; y < position.y + yspan; y++) {
      positions.push({x, y})
    }
  }
  return positions;
}

export const getPointsWithinRadiusInDirections = (position, radius, direction) => {
  let positions = [];
  const xLeft = direction.x <= 0
  const xRight = direction.x >= 0
  const yDown = direction.y <= 0
  const yUp = direction.y >= 0

  for (let x = position.x - (radius * xLeft); x < position.x + (radius * xRight); x++) {
    let yspan = Math.floor(radius * Math.sin(Math.acos((position.x - x) / radius)));
    for (let y = position.y - (yspan * yDown); y < position.y + (yspan * yUp); y++) {
      positions.push({x, y})
    }
  }
  return positions;
}

export const getPositionsFromStructure = (structure, initialPosition) => {
  return structure.positions.map((slot) => {
    let position = {
      x: initialPosition.x + slot.x + structure.x_offset,
      y: initialPosition.y + slot.y + structure.y_offset
    }
    return position
  })
}

export const EASING = {
  linear: (t) => t,
  easeIn: (t) => t *= t,
  easeOut: (t) => t * (2 - t),
  easeInOutQuad: (t) => t < .5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
  easeInCubic: (t) => t * t * t,
  easeOutCubic: (t) => (--t) * t * t + 1,
}

export const interpolateHexColor = (c0, c1, f) => {
  c0 = c0.substr(1).match(/.{1,2}/g).map((oct)=>parseInt(oct, 16) * (1-f))
  c1 = c1.substr(1).match(/.{1,2}/g).map((oct)=>parseInt(oct, 16) * f)
  let ci = [0,1,2].map(i => Math.min(Math.round(c0[i]+c1[i]), 255))
  return '#' + ci.reduce((a,v) => ((a << 8) + v), 0).toString(16).padStart(6, "0")
}

export const getNeighboringPoints = (origin, eightWay = false) => {
  let neighbors = [
    {
      x: origin.x,
      y: origin.y + 1
    },
    {
      x: origin.x + 1,
      y: origin.y
    },
    {
      x: origin.x,
      y: origin.y - 1
    },
    {
      x: origin.x - 1,
      y: origin.y
    },
  ]

  if (eightWay) {
    neighbors = neighbors.concat([
      {
        x: origin.x + 1,
        y: origin.y + 1
      },
      {
        x: origin.x + 1,
        y: origin.y - 1
      },
      {
        x: origin.x - 1,
        y: origin.y - 1
      },
      {
        x: origin.x - 1,
        y: origin.y + 1
      },
    ])
  }
  return neighbors;
}
