import * as Constant from '../../constants';
import * as Helper from '../../../helper';
import * as Item from '../../items';
import * as MapHelper from '../../Maps/helper';
import { generate as generateBuilding } from '../../Maps/generator';
import * as CoverGenerator from '../../Maps/coverGenerator';
import { Debris, Bandit, RangedBandit, FireSpread, JacintoAI } from '../../Entities/index';
import * as Behaviors from '../../Entities/AI/Behaviors';
import { MESSAGE_TYPE } from '../../message';
import { Mode } from '../default';
import SOUNDS from '../../sounds';
import * as _ from 'lodash';
import { TILE_KEY } from './theme';
import SpatterEmitter from '../../Engine/Particle/Emitters/spatterEmitter';

export class Normandy extends Mode {
  constructor({ ...args }) {
    super({ ...args });
    this.tileKey = TILE_KEY
    this.data = {
      level: 0,
      highestLevel: null,
      turnCount: 0,
    };
    this.dataByLevel = [
      {
        enemies: Array(1).fill('Bandit'),
        // enemies: Array(10).fill('Bandit'),
      },
      {
        enemies: Array(1).fill('Bandit'),
      },
    ]
  }

  getTournamentOpponent () {
    const tournament = this.meta().tournament;
    const opponent = tournament.opponents[tournament.active]
    return opponent;
  }

  initialize (meta) {
    this['meta'] = meta;
    super.initialize();
    this.createEmptyLevel();
    this.game.initializeMapTiles();
    this.setWaveData();

    // add a random number of blobs of random size of GROUND
    // using addTileZone
    for (let i = 0; i < 20; i++) {
      let size = Helper.getRandomInt(4, 12);
      let x = Helper.getRandomInt(0, this.game.mapWidth);
      let y = Helper.getRandomInt(0, this.game.mapHeight);
      MapHelper.addTileZone(
        this.game.tileKey,
        { x, y },
        size,
        size,
        'GROUND',
        this.game.map,
        this.game.mapHeight,
        this.game.mapWidth,
      );
    }

    // add a random number of blobs of random size of WATER
    // using addTileZone
    for (let i = 0; i < 3; i++) {
      let size = Helper.getRandomInt(2, 6);
      let x = Helper.getRandomInt(0, this.game.mapWidth);
      let y = Helper.getRandomInt(0, this.game.mapHeight);
      MapHelper.addTileZoneFilledCircle(
        { x, y },
        size,
        'WATER',
      );
    }

    // outer walls
    MapHelper.addTileZoneRectUnfilled(
      this.game.tileKey,
      { x: 0, y: 0 },
      this.game.mapHeight,
      this.game.mapWidth,
      'WALL',
      this.game.map,
    );
    
    // inner walls
    MapHelper.addTileZoneRectUnfilled(
      this.game.tileKey,
      { x: 1, y: 1 },
      this.game.mapHeight - 2,
      this.game.mapWidth - 2,
      'WALL',
      this.game.map,
    );

    // place player start zone
    MapHelper.addTileZone(
      this.game.tileKey,
      { x: 31, y: 9 },
      4,
      4,
      'SAFE',
      this.game.map,
      this.game.mapHeight,
      this.game.mapWidth,
    );
    this.placePlayersInSafeZone();

    // place enemies
    let groundTiles = Object.keys(this.game.map).filter((key) => this.game.map[key].type === 'GROUND')
    this.data.enemies.forEach((enemyName) => {
      let pos = Helper.getRandomInArray(groundTiles);
      let posXY = pos.split(',').map((coord) => parseInt(coord));
      this[`add${enemyName}`]({ x: posXY[0], y: posXY[1] });
    })

    const edgeTiles = MapHelper.getPositionsInTileZone(
      this.game.mapHeight,
      this.game.mapWidth,
      { x: 3, y: 3 },
      this.game.mapHeight - 6,
      this.game.mapWidth - 6,
    )

    for (let i = 0; i < 10; i++) {
      let posXY = Helper.getRandomInArray(edgeTiles);
      CoverGenerator.generateTree(posXY, this.game);
    }
  }


  createEmptyLevel () {
    for (let i = 0; i < this.game.mapHeight; i ++) {
      for (let j = 0; j < this.game.mapWidth; j ++) {
        const key = `${j},${i}`
        let type = 'GROUND_ALT';
        MapHelper.addTileToMap({map: this.game.map, key, tileKey: this.tileKey, tileType: type})
      }
    }
  }

  getPlayers () {
    return this.game.engine.actors.filter((actor) => actor.entityTypes.includes('PLAYING'))
  }

  getOpponentActor() {
    return this.game.engine.actors.find((actor) => actor.name === this.getTournamentOpponent().name)
  }

  updateUI() {
    _.each(this.getPlayers(), (player, index) => {
      const currentBlips = Math.floor(player.energy / 100);
      const maxBlips = Math.floor(player.speed / 100);
      const arr = [
        ...Array(currentBlips).fill(''),
        ...Array(maxBlips - currentBlips).fill('_'),
      ];
      this.createOrUpdateInfoBlock(`playerSpeed${player.id}`, { text: `${player.name} | AP: ${arr.join(' ')}` })
      // this.createOrUpdateInfoBlock(`playerSpeed`, { text: `AP: ${player.energy}/${player.speed}` })
    })
  }

  update () {
    super.update();
    // this.updateUI();
    if (this.hasLost()) {
      this.onLose()
    } else if (this.hasWon()) {
      this.onWin()
    } else if (this.levelComplete()) {
      this.nextLevel();
      this.setWaveData();
      this.game.initializeGameData();
    }
  }

  onLose() {
    if (!this.data['hasLost']) {
      // SOUNDS.lose.play();
      // this.game.toLose();
      // this.reset();
      // this.game.initializeGameData();
      this.createOrUpdateInfoBlock('hasLost', {text: `${this.meta().tournament.player.name} is down! Good luck next year.`})
      this.createOrUpdateInfoBlock('hasLost_enter', {text: 'Press Enter to Play Again'})
      this.addOnEnterListener();
    }
    this.data['hasLost'] = true;
  }

  onWin() {
    // this.game.toWin()
    if (!this.data['hasWon']) {
      this.addFireWorks();
      this.createOrUpdateInfoBlock('hasWon', {text: `${this.game.getFirstPlayer().name} has won the Chunin Tournament!`})
      this.createOrUpdateInfoBlock('hasWon_enter', {text: 'Press Enter to Play Again'})
      this.addOnEnterListener();
    }
    this.data['hasWon'] = true;
  }

  addOnEnterListener() {
    const handleKeyPress = (event) => {
      if (event.key === 'Enter') {
        this.game.backToTitle()
        this.meta({})
        // TODO (reset data)
        window.removeEventListener('keydown', handleKeyPress);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
  }

  addSingleCelebratoryDebris () {
    const position = Helper.getRandomPos(this.game.map).coordinates;
    this.addCelebratoryDebris(position);
  }

  addCelebratoryDebris (position) {
    SpatterEmitter({
      game: this.game,
      fromPosition: position,
      spatterAmount: .3,
      spatterRadius: 10,
      transfersBackground: false,
      spatterColors: ['#e9d679', '#673ab7', '#3fc072', '#e16264', '#67a1d7'],
    }).start()
  }

  addFireWorks () {
    // pick a range of random positions
    // then add celebratory debris to each on a timer
    const positions = Array(30).fill(null).map(() => Helper.getRandomPos(this.game.map).coordinates);

    positions.forEach((position) => {
      setTimeout(() => {
        this.addCelebratoryDebris(position);
      }, Helper.getRandomInt(0, 10000))
    })
  }
  
  //Extras
  setLevel (level) {
    this.data.turnCount = 0;
    this.setMetaTournamentLevel(level)
  }

  nextLevel () {
    const level = this.getMetaTournamentLevel() + 1
    this.setLevel(level);
    this.game.setActiveScreen('Tournament');
  }

  setMetaTournamentLevel(level) {
    const metaData = this.meta()
    metaData.tournament.active = level;
    this.meta(metaData)
  }

  getMetaTournamentLevel() {
    return this.meta().tournament.active;
  }

  reset () {
    this.setLevel(0);
    this.initialize();
  }

  setWaveData () {
    const nextLevelData = this.dataByLevel[0];
    this.data = {...this.data, ...nextLevelData}
  }

  levelComplete () {
    return this.game.engine.actors.length === 1; 
  }

  hasWon () {
    const level = this.getMetaTournamentLevel()
    const maxLevel = this.meta().tournament.opponents.length - 1;
    return this.levelComplete() && (level >= maxLevel);
  }

  hasLost () {
    let players = this.getPlayers()
    if (!players.length) return true;
    else if (players.length) {
      if (players[0].durability <= 0) {
        return true;
      }
    }
    return false;
  }

  addDebris (pos, name = 'box', character = '%', durability = 5, explosivity = 0, pushable = true, draggable = true, background = Constant.THEMES.SOLARIZED.base01) {
    let sprite = Helper.getRandomInArray(['', '', '', '', '', '']);
    switch (character) {
      case '%':
        sprite = Helper.getRandomInArray(['', '']);
        break;
      case 'm':
        sprite = Helper.getRandomInArray(['', '']);
        break;
      case 'H':
        sprite = Helper.getRandomInArray(['', '']);
        break;
      case 'Xs':
        sprite = ''
        break;
      case 'X':
        sprite = ''
        break;
      case 'XL':
        sprite = ''
        break;
      default:
        sprite = '';
        break;
    }

    let box = new Debris({
      pos,
      renderer: {
        character,
        sprite,
        color: Constant.THEMES.SOLARIZED.base2,
        background,
      },
      name,
      game: this.game,
      durability,
      explosivity,
      flammability: 0,
      draggable,
      pushable,
    })

    this.game.placeActorOnMap(box)
    // this.game.draw();
  }

  getBanditStats () {
    let banditLevels = [
      {
        name: 'Slingshot',
        renderer: {
          character: Helper.getRandomInArray(['r']),
          color: '#ced5dd',
          background: 'black',
        },
        durability: 1,
        attackDamage: 1,
        speed: 100,
        entityClass: RangedBandit
      },
      {
        name: 'Buckshot',
        renderer: {
          character: Helper.getRandomInArray(['r']),
          color: '#3fc072',
          background: 'black',
        },
        durability: 2,
        attackDamage: 1,
        speed: 200,
        entityClass: RangedBandit
      },
      {
        name: 'Ross',
        renderer: {
          character: Helper.getRandomInArray(['b']),
          color: '#ced5dd',
          background: 'black',
        },
        durability: 1,
        attackDamage: 1,
        speed: 100,
        entityClass: Bandit
      },
      {
        name: 'Kevin',
        renderer: {
          character: Helper.getRandomInArray(['b']),
          color: '#3fc072',
          background: 'black',
        },
        durability: 2,
        attackDamage: 1,
        speed: 100,
        entityClass: Bandit
      },
      {
        name: 'Jacob',
        renderer: {
          character: Helper.getRandomInArray(['b']),
          color: '#67a1d7',
          background: 'black',
        },
        durability: 3,
        attackDamage: 1,
        speed: 100,
        entityClass: Bandit
      },
      {
        name: 'Jarod',
        renderer: {
          character: Helper.getRandomInArray(['b']),
          color: '#e16264',
          background: 'black',
        },
        durability: 1,
        attackDamage: 5,
        speed: 300,
        entityClass: Bandit
      },
      {
        name: 'Bigii',
        renderer: {
          character: Helper.getRandomInArray(['b']),
          color: '#9f62e1',
          background: 'black',
        },
        durability: 15,
        attackDamage: 10,
        speed: 100,
        entityClass: Bandit
      },
    ]
    return Helper.getRandomInArray(banditLevels);
  }

  addBandit (pos) {
    let players = this.getPlayers()
    let targetEntity = players[0]
    // tournament opponent stats
    let stats = null;

    // TODO: fix, this.meta() is not a function error
    try {
      stats = this.getTournamentOpponent().basicInfo;
    } catch (error) {
      console.log(error);
      stats = this.getBanditStats();
    }
    // let entity = new stats.entityClass({
    // let entity = new Bandit({
    let entity = new JacintoAI({
      targetEntity,
      pos,
      renderer: stats.renderer,
      name: stats.name,
      game: this.game,
      actions: [],
      attackDamage: stats.attackDamage,
      durability: stats.durability,
      speed: stats.speed,
      charge: 20,
      faction: 'OPPONENT',
      enemyFactions: ['PLAYER'],
      behaviors: stats?.behaviors || [
        new Behaviors.MoveTowardsEnemy({
          repeat: stats.speed/Constant.ENERGY_THRESHOLD,
          maintainDistanceOf: -1, // causes to move and attack in same turn if close enough
          chainOnFail: true
        }),
        new Behaviors.MoveAwayFromEnemy({
          repeat: stats.speed/Constant.ENERGY_THRESHOLD,
          maintainDistanceOf: 4, // causes to move and attack in same turn if close enough
          // chainOnFail: fals
        }),
      ],
      // directional projectile destruction breaks engine
      getProjectile: ({ pos, targetPos, direction, range }) => Item.directionalKunai(this.game.engine, { ...pos }, direction, range)
      // getProjectile: ({ pos, targetPos, direction, range }) => Item.kunai(game.engine, { ...pos }, { ...targetPos })
    })
    if (this.game.placeActorOnMap(entity)) {
      this.game.engine.addActor(entity);
      // this.game.draw();
    };
  }

  placePlayersInSafeZone () {
    let players = this.getPlayers()
    const keys = Object.keys(this.game.map).filter((key) => this.game.map[key].type == 'SAFE');
    players.forEach((player) => {
      const key = keys.shift();
      if (key) {
        const position = {
          x: parseInt(key.split(',')[0]),
          y: parseInt(key.split(',')[1]),
        }
        player.move(position)
      }
    })
  }

}
