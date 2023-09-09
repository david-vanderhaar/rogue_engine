import * as ROT from 'rot-js';
import { Mode } from '../default';
import * as CONSTANT from '../../constants';
import * as TALL_GRASS_CONSTANT from '../TallGrass/theme'
import * as JACINTO_CONSTANT from '../Jacinto/theme'
import * as MonsterActors from '../TallGrass/Actors/Monsters';
import * as Helper from '../../../helper'
import * as MapHelper from '../../Maps/helper';
import * as CoverGenerator from '../../Maps/coverGenerator';
import * as BuildingGenerator from '../../Maps/generator';
import { EmergenceHole, RenderedWithPickUpEffects, Wall } from '../../Entities';
import { Ammo } from '../../Items/Pickups/Ammo';
import { Beacon, Lantern } from '../../Items/Environment/Lantern';
import { Battery } from './Items/Pickups/Battery';
import { JACINTO_SOUNDS } from '../Jacinto/sounds';
import { Pistol, Revolver, Rifle, Shotgun } from './Items/Weapons/Revolver';
import { CombatBaton, Katana, Knife, Machete } from './Items/Weapons/Melee';
import { Berries, Brambles } from './Items/Environment/Brambles';
import { GlowStick, SmallGlowStick, SuperGlowStick } from './Items/Pickups/GlowSticks';
import { Grenade } from './Items/Weapons/Grenade';
import { destroyEntity } from '../../Entities/helper';

export class SomethingInTheTallGrass extends Mode {
  constructor({ ...args }) {
    super({ ...args });
    this.game.tileKey = {
      ...CONSTANT.TILE_KEY,
      ...JACINTO_CONSTANT.TILE_KEY,
      ...TALL_GRASS_CONSTANT.TILE_KEY,
    }
    this.data = {
      level: 1,
      // finalLevel: 1,
      finalLevel: 5,
      finalLevelAmmo: 10,
      finalLevelBattery: 2,
      finalLevelMonsters: 6,
      finalLevelMonsterNests: 2,
      monstersPerLevel: [2, 6],
      lootCachesPerLevel: [1, 5],
      lootPerLevel: [2, 8],
      lootList: [
        Ammo,
        Ammo,
        Ammo,
        Ammo,
        Ammo,
        Ammo,
        Ammo,
        Ammo,
        Ammo,
        Ammo,
        SmallGlowStick,
        SmallGlowStick,
        SmallGlowStick,
        SmallGlowStick,
        SuperGlowStick,
        SuperGlowStick,
        Battery,
        Battery,
        Knife,
        Knife,
        Revolver,
        Revolver,
        Machete,
        Machete,
        CombatBaton,
        CombatBaton,
        Katana,
        Rifle,
        Pistol,
        Pistol,
        Shotgun,
        Shotgun,
        Grenade,
        Grenade,
      ],
      lootCacheList: [
        this.addBuilding.bind(this),
        this.addBuilding.bind(this),
        this.addBeacon.bind(this),
        this.addBeacon.bind(this),
        this.addNest.bind(this),
      ],
      bramblePatchAmount: [3, 6],
      berryPatchAmount: [0, 4],
    };

    this.game.fovActive = true
  }

  initialize() {
    JACINTO_SOUNDS.wind_loop.play()
    super.initialize();
    this.game.createEmptyLevel();
    this.generateLevel()
    this.game.initializeMapTiles();

    
    if (this.data.level < this.data.finalLevel) {
      this.placePlayerOnEmptyTile()
      this.addLootCaches(Helper.getRandomIntInclusive(...this.data.lootCachesPerLevel))
      this.addOvergrowth()
      this.addLoot(Helper.getRandomIntInclusive(...this.data.lootPerLevel))
      this.addMonsters(Helper.getRandomIntInclusive(...this.data.monstersPerLevel))
      this.placeGeneratorPiece(Helper.getRandomPos(this.game.map).coordinates)
    } else {
      const mapCenter = this.mapCenter()
      this.addBaseCamp(mapCenter)
      // place monsters
      this.addMonsters(this.data.finalLevelMonsters)
      // place monster nests 
      Helper.range(this.data.finalLevelMonsterNests).forEach(() => this.addNest())
      this.placePlayerAtPosition({x: mapCenter.x + 2, y: mapCenter.y})
    }

    this.addBrambles()
    this.addBerries()
    this.addTallGrass()

    const player = this.game.getFirstPlayer()
    player.setAllEquipmentPositions()
  }

  mapCenter() {
    return {x: Math.round(this.game.mapWidth / 2), y: Math.round(this.game.mapHeight / 2)}
  }

  update() {
    super.update();
    this.updateUI()
    if (this.hasWon()) {
      this.game.toWin()
    }
  }

  updateUI() {
    let text = ''
    if (this.data.level < this.data.finalLevel) {
      text = `${this.data.level} of ${this.data.finalLevel - 1} fields cleared.`
    } else {
      text = `You made it to Base Camp, Defend it.`
    }

    this.createOrUpdateInfoBlock('gameProgress', {text});
  }

  addBaseCamp(origin) {
    const clearedPositions = Helper.getPointsWithinRadius(origin, 10)
    clearedPositions.forEach((position) => {
      const tile = MapHelper.getTileFromMap({map: this.game.map, position})
      if (tile) tile.type = Helper.getRandomInArray(['GROUND', 'GROUND_ALT'])
    })

    const beaconPositions = Helper.getPointsWithinRadius(origin, 6)
    beaconPositions.forEach((position) => {
      const tile = MapHelper.getTileFromMap({map: this.game.map, position})
      if (tile) tile.type = 'STEEL_FLOOR'
    })

    const lantern = Beacon({engine: this.game.engine, lightRange: 10})
    lantern.setPosition(origin)
    this.game.placeActorOnMap(lantern)

    const neigbors = Helper.getNeighboringPoints(origin, true)
    neigbors.forEach((point) => this.placeGeneratorPiece(point))

    // place ammo and batteries in building
    this.addLoot(this.data.finalLevelAmmo, Ammo)
    this.addLoot(this.data.finalLevelBattery, Battery)
  }

  addLootCaches(numberOfCaches) {
    Helper.range(numberOfCaches).forEach(() => {
      const cacheGenerator = Helper.getRandomInArray(this.data.lootCacheList)
      cacheGenerator()
    })
  }

  addBuilding() {
    const keys = this.getEmptyGroundTileKeys()
    const randomKey = Helper.getRandomInArray(keys)
    const pos = Helper.stringToCoords(randomKey)
    const rooms = Helper.getRandomIntInclusive(1, 2)
    const roomSize = Helper.getRandomIntInclusive(2, 4)
    return BuildingGenerator.generate(this.game.map, pos.x, pos.y, rooms, roomSize);
  }

  addBeacon(origin = null) {
    if (origin === null) {
      const keys = this.getEmptyGrassTileKeys()
      const randomKey = Helper.getRandomInArray(keys)
      origin = Helper.stringToCoords(randomKey)
    }

    const positions = Helper.getPointsWithinRadius(origin, 4)
    positions.forEach((position) => {
      const tile = MapHelper.getTileFromMap({map: this.game.map, position})
      if (tile) tile.type = 'STEEL_FLOOR'
    })

    const lantern = Beacon({engine: this.game.engine, lightRange: 0})
    lantern.setPosition(origin)
    this.game.placeActorOnMap(lantern)
    // CoverGenerator.generateCoverBlock(origin, this.game)
  }

  addNest() {
    const keys = this.getEmptyTileKeys()
    const randomKey = Helper.getRandomInArray(keys)
    const origin = Helper.stringToCoords(randomKey)


    const positions = Helper.getPointsWithinRadius(origin, 2)
    positions.forEach((position) => {
      const tile = MapHelper.getTileFromMap({map: this.game.map, position})
      if (tile) tile.type = 'NEST'
    })

    const nest = new EmergenceHole({
      name: 'nest',
      pos: origin,
      game: this.game,
      passable: true,
      renderer: {
        character: '+',
        sprite: '',
        color: TALL_GRASS_CONSTANT.COLORS.flesh1,
        background: TALL_GRASS_CONSTANT.COLORS.black
      },
      timeToSpread: 5,
      spreadCount: 10,
      durability: 1,
      faction: 'MONSTER',
      enemyFactions: ['PEOPLE'],
      speed: CONSTANT.ENERGY_THRESHOLD,
      getSpawnedEntity: (spawnPosition) => MonsterActors.createRandomBasic(this, spawnPosition),
      onDestroy: () => {
        this.game.map[Helper.coordsToString(origin)].type = 'GROUND'
      },
    });

    if (this.game.placeActorOnMap(nest)) {
      this.game.engine.addActor(nest);
      this.game.draw();
    };
  }

  addBrambles() {
    const keys = this.getEmptyTileKeysByTags(['BRAMBLES'])
    const amount = Helper.getRandomIntInclusive(...this.data.bramblePatchAmount)
    const randomSelection = Helper.getNumberOfItemsInArray(amount, keys)
    randomSelection.forEach((key) => {
      this.addBramblePatch(Helper.stringToCoords(key))
    })
  }

  addBramblePatch(origin) {
    const size = Helper.getRandomIntInclusive(2, 5)
    const clearedPositions = Helper.getPointsWithinRadius(origin, size)
    clearedPositions.forEach((position) => {
      const tile = MapHelper.getTileFromMap({map: this.game.map, position})
      if (tile) {
        if (MapHelper.tileHasTag({tile, tag: 'BRAMBLES'})) {
          this.placeBrambleBush(position)
        }
      }
    })
  }

  placeBrambleBush(position) {
    const bramble = Brambles(this.game.engine, position) 

    this.game.map[Helper.coordsToString(position)].type = 'BRAMBLE'
    this.game.placeActorOnMap(bramble)
  }
 
  addBerries() {
    const keys = this.getEmptyTileKeysByTags(['BERRIES'])
    const amount = Helper.getRandomIntInclusive(...this.data.berryPatchAmount)
    const randomSelection = Helper.getNumberOfItemsInArray(amount, keys)
    randomSelection.forEach((key) => {
      this.addBerryPatch(Helper.stringToCoords(key))
    })
  }

  addBerryPatch(origin) {
    const size = Helper.getRandomIntInclusive(1, 2)
    const clearedPositions = Helper.getPointsWithinRadius(origin, size)
    clearedPositions.forEach((position) => {
      const tile = MapHelper.getTileFromMap({map: this.game.map, position})
      if (tile) {
        if (MapHelper.tileHasTag({tile, tag: 'BERRIES'})) {
          this.placeBerryBush(position)
        }
      }
    })
  }

  placeBerryBush(position) {
    const bush = Berries(this.game.engine, position) 
    
    this.game.map[Helper.coordsToString(position)].type = 'BERRY'
    this.game.placeActorOnMap(bush)
  }

  addOvergrowth() {
    const keys = this.getEmptyTileKeysByTags(['OVERGROWN'])
    const percentOvergrown = 0.3;
    const numberOfOvergrownTiles = Math.round(keys.length * percentOvergrown)
    const randomSelection = Helper.getNumberOfItemsInArray(numberOfOvergrownTiles, keys)
    randomSelection.forEach((key) => {
      this.placeTallGrass(Helper.stringToCoords(key))
    })
  }

  addLoot(amountOfLoot = 1, itemCreator = null) {
    const keys = this.getEmptyTileKeysByTags(['LOOT'])
    const randomSelection = Helper.getNumberOfItemsInArray(amountOfLoot, keys)
    randomSelection.forEach((key) => {
      this.placeLootItem(Helper.stringToCoords(key), itemCreator)
    })
  }

  placeLootItem(position, itemCreator = null) {
    if (!itemCreator) {
      itemCreator = Helper.getRandomInArray(this.data.lootList)
    }

    const item = itemCreator(this.game.engine)
    item.setPosition(position)

    this.game.placeActorOnMap(item)
  }

  addMonsters(amount = 1) {
    Helper.range(amount).forEach((index) => 
      MonsterActors.addRandom(
      // MonsterActors.addHider(
      // MonsterActors.addCamoCritter(
      // MonsterActors.addJuvenile(
        this, 
        Helper.getRandomPos(this.game.map).coordinates)
      )
  }

  addTallGrass() {
    this.getEmptyGrassTileKeys()
      .forEach((key) => this.placeTallGrass(Helper.stringToCoords(key)))
  }

  generateLevel_v1() {
    const x = Math.floor(this.game.mapWidth / 2)
    MapHelper.addTileZone(
      this.game.tileKey,
      { x, y: 0 },
      this.game.mapHeight,
      10,
      'GROUND_ALT',
      this.game.map,
      this.game.mapHeight,
      this.game.mapWidth,
    );
  }

  generateLevel () {
    const digger = new ROT.Map.Cellular(this.game.mapWidth, this.game.mapHeight);
    digger.randomize(0.6) // the higher this percentage, the hight the difficulty due to more tall grass
    Helper.range(4).forEach(() => digger.create())
    let freeCells = [];
    let digCallback = function (x, y, value) {      
      let key = x + "," + y;
      let type = Helper.getRandomInArray(['GROUND', 'GROUND_ALT'])
      if (value) { 
        type = 'LAYED_GRASS';
      }
      MapHelper.addTileToMap({map: this.game.map, key, tileKey: this.game.tileKey, tileType: type})
      freeCells.push(key);
    }
    digger.create(digCallback.bind(this));
    digger.connect(digCallback.bind(this))
  }

  placeTallGrass(position, onlyOnEmptyTiles = false) {
    const tile = this.game.map[Helper.coordsToString(position)]
    if (!tile) return
    if (onlyOnEmptyTiles && tile.entities.length > 0) return
    const lightPassable = Math.random() < 0.3 // 30% chance this grass allows light to pass

    const grass = new Wall({
      durability: 1,
      defense: 0,
      name: 'tall grass',
      baseDescription: 'grass in the Layoria region is known for its thick outer shell... and for the things that call it home.',
      passable: true,
      lightPassable,
      pos: position,
      renderer: {
        character: lightPassable ? '' : Helper.getRandomInArray(["'", '.', '"', ',']),
        sprite: lightPassable ? '' : '',
        background: TALL_GRASS_CONSTANT.COLORS.sunset,
        color: lightPassable ? TALL_GRASS_CONSTANT.COLORS.sunset : TALL_GRASS_CONSTANT.COLORS.sandy_brown,
      }
    })

    const tileType = Helper.getRandomInArray(['GROUND', 'GROUND_ALT'])
    tile.type = tileType
    this.game.placeActorOnMap(grass)
  }

  placeGeneratorPiece(position) {
    const item = new RenderedWithPickUpEffects({
      name: 'an important component',
      baseDescription: 'a component that powers up our base camp generator',
      pos: position,
      passable: true,
      lightPassable: true,
      renderer: {
        character: Helper.getRandomInArray(['a', 'b', 'c', 'd']),
        sprite: Helper.getRandomInArray(['', '', '', '',]),
        background: TALL_GRASS_CONSTANT.COLORS.violet,
        color: TALL_GRASS_CONSTANT.COLORS.white,
      },
      pickupEffects: [
        () => this.goToNextLevel()
      ]
    })

    this.game.placeActorOnMap(item)
  }

  placePlayerOnEmptyTile() {
    const player = this.game.getFirstPlayer()
    if (!player) return

    const randomPosition = Helper.getRandomInArray(this.getEmptyGroundTileKeys())
    player.setPosition(Helper.stringToCoords(randomPosition))
    this.game.placeActorOnMap(player)
  }

  placePlayerAtPosition(position) {
    const player = this.game.getFirstPlayer()
    if (!player) return

    player.setPosition(position)
    this.game.placeActorOnMap(player)
  }

  getEmptyTileKeys (keys = Object.keys(this.game.map)) {
    return keys.filter((key) => !!!this.game.map[key].entities.length)
  }

  getEmptyTileKeysByTags (tags, keys = Object.keys(this.game.map)) {
    return this.getEmptyTileKeys(keys)
      .filter((key) => MapHelper.tileHasAnyTags({tile: this.game.map[key], tags}))
  }

  getEmptyGroundTileKeys (keys = Object.keys(this.game.map)) {
    return this.getEmptyTileKeys(keys)
      .filter((key) => this.game.map[key].type === 'GROUND' || this.game.map[key].type === 'GROUND_ALT')
  }

  getEmptyGrassTileKeys (keys = Object.keys(this.game.map)) {
    // return this.getEmptyTileKeys(keys).filter((key) => this.game.map[key].type === 'TALL_GRASS')
    return this.getEmptyTileKeys(keys).filter((key) => this.game.map[key].type === 'LAYED_GRASS')
  }

    
  //Extras
  setLevel (level) {
    this.data.level = level;
  }

  nextLevel () {
    this.setLevel(this.data.level + 1);
  }

  goToNextLevel() {
    if (this.data.level >= this.data.finalLevel) return
    // this.game.initializeGameData()
    // this.destroyAllMonsters()
    this.destroyAll()
    this.nextLevel();
    this.initialize();
  }

  destroyAllMonsters() { this.enemies().forEach((enemy) => enemy.destroy()) }
  destroyAll() { this.leftoverEntities().forEach((ent) => destroyEntity(ent)) }

  // reset () {
  //   this.destroyAllMonsters()
  //   this.setLevel(1);
  //   this.initialize();
  // }

  // setWaveData () {
  //   const level = this.data.level - 1
  //   const nextLevelData = _.get(this.dataByLevel, level, {});
  //   this.data = {...this.data, ...nextLevelData, hasPlayedEndSound: false}
  // }

  enemiesDefeated () {
    return this.enemies().length <= 0
  }

  enemies () {
    return this.game.engine.actors.filter((actor) => actor['faction'] === 'MONSTER')
  }

  leftoverEntities() {
    // return this.game.engine.actors.filter((actor) => {
    return this.game.entityLog.getAllEntities().filter((actor) => {
      if (actor['faction'] === 'MONSTER') return true
      if (actor['enemyFactions'] && actor['enemyFactions'].includes('PEOPLE')) return true
      if ([
        'glow stick',
        'used glow stick',
        'super glow stick',
        'beacon',
      ].includes(actor['name'])) return true
      return false
    })
  }

  hasWon () {
    return (this.data.level >= this.data.finalLevel && this.enemiesDefeated());
  }

  // hasLost () {
  //   let players = this.getPlayers()
  //   if (!players.length) return true;
  //   else if (players.length) {
  //     if (players[0].durability <= 0) {
  //       return true;
  //     }
  //   }
  //   return false;
  // }
}