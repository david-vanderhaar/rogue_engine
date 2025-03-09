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
import { COLORS, TILE_KEY } from './theme';
import SpatterEmitter from '../../Engine/Particle/Emitters/spatterEmitter';
import { destroyEntity } from '../../Entities/helper';
import { SCREENS } from './Screen/constants';
import { testLevelBuilder } from './MapBuilders/testLevel';
import { beach } from './MapBuilders/beach';
import { MortarStrike } from './Items/Weapons/MortarStrike';
import { JACINTO_SOUND_MANAGER, JACINTO_SOUNDS } from '../Jacinto/sounds';

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
        enemyCount: 2,
        allyCount: 5,
        unlocks: ['TheMedic'],
        levelBuilder: beach,
      },
      // {
      //   enemyCount: 5,
      //   allyCount: 1,
      //   levelBuilder: beach,
      // },
    ]

    this.game.fovActive = true
  }

  initialize (meta) {
    this['meta'] = meta;
    super.initialize();
    this.setWaveData();
    this.data.levelBuilder(this)
    this.game.initializeMapTiles();
    JACINTO_SOUND_MANAGER.stopAll();
    JACINTO_SOUNDS.beach_wind_loop.play()
    JACINTO_SOUNDS.distant_gunfight.play()
  }

  getPlayers () {
    return this.game.engine.actors.filter((actor) => actor.entityTypes.includes('PLAYING'))
  }

  updateUI() {
    this.updateUIPlayerStats();
    this.updateUIEnemiesRemaining();
  }

  updateUIPlayerStats() {
    const player = this.game.getFirstPlayer();
    const currentBlips = Math.floor(player.energy / 100);
    const maxBlips = Math.floor(player.speed / 100);
    const arr = [
      ...Array(currentBlips).fill(''),
      ...Array(maxBlips - currentBlips).fill('_'),
    ];
    this.createOrUpdateInfoBlock(`playerSpeed${player.id}`, { text: `${player.name} | AP: ${arr.join(' ')}` })
    // this.createOrUpdateInfoBlock(`playerSpeed`, { text: `AP: ${player.energy}/${player.speed}` })
  }

  updateUIEnemiesRemaining() {
    const enemies = this.game.getFirstPlayer().getEnemies().length;
    const maxEnemies = this.data.enemyCount;
    const arr = [
      ...Array(enemies).fill(''),
      ...Array(maxEnemies - enemies).fill('_'),
    ];
    this.createOrUpdateInfoBlock(`goalMessage`, { text: 'Destroy the enemy defensive positions.' }) 
    this.createOrUpdateInfoBlock(`enemiesRemaining`, { text: `Enemies Remaining: ${arr.join(' ')}` }) 
  }

  checkAndUnlockCharacters() {
    const unlocks = this.dataByLevel[this.getMetaLevel()]?.unlocks || []
    const currentUnlocks = this.meta().unlocks || []
    const newUnlocks = unlocks.filter((unlock) => !currentUnlocks.includes(unlock))
    if (newUnlocks.length) {
      this.meta({
        ...this.meta(),
        unlocks: [...currentUnlocks, ...newUnlocks],
      })
      this.createOrUpdateInfoBlock('unlocks', {text: `You have unlocked: ${newUnlocks.join(', ')}`})
      this.addSingleCelebratoryDebris()
    }
  }

  checkCoverAnimations() {
    this.game.engine.actors.forEach((actor) => {
      if (actor.entityTypes.includes('USES_COVER')) {
        if (actor.resetCoverAnimations());
      }
    })
  }

  createMortarStrike(pos, size = 2) {
    return MortarStrike(this.game.engine, pos, size)
  }

  spawnMortarStrike() {
    // Use sine wave to create cyclical intensity of strikes
    const cycle = 200; // Length of a complete cycle in turns
    const cyclePosition = this.data.turnCount % cycle;
    // Convert cycle position to a value between 0 and 1
    const normalizedPosition = cyclePosition / cycle;
    // Use sine wave to create value between 0 and 1
    const intensity = (Math.sin(normalizedPosition * Math.PI * 2) + 1) / 2;
    
    // Define constants for min/max values
    const maxInterval = 140;
    const minInterval = 20;

    const minStrikes = 5;
    const maxStrikes = 5;
    const minRadius = 8;
    const maxRadius = 20;
    
    // Base interval that changes with intensity
    const interval = Math.floor(minInterval + (maxInterval - minInterval) * (1 - intensity));
    
    if (this.data.turnCount % interval === 0) {
      const player = this.getPlayers()[0];
      const playerPos = player.pos;
      
      // Number of strikes based on intensity, between min and max
      const strikes = Math.max(minStrikes, Math.floor(intensity * maxStrikes));
      
      // Radius decreases with intensity, between min and max
      const radius = Math.max(minRadius, Math.floor(maxRadius - intensity * (maxRadius - minRadius)));
      
      for (let i = 0; i < strikes; i++) {
        const pointsInRange = Helper.getPointsWithinRadius(playerPos, radius);
        const strikePos = Helper.getRandomInArray(pointsInRange);
        const strike = this.createMortarStrike(strikePos);
        this.game.addActor(strike);
      }
    }
  }

  update () {
    super.update();
    this.updateUI();
    this.checkCoverAnimations();
    if (!this.data['hasWon']) this.spawnMortarStrike();
    if (this.hasLost()) {
      this.onLose()
    } else if (this.hasWon()) {
      this.onWin()
    } else if (this.levelComplete()) {
      // this.checkAndUnlockCharacters();
      this.nextLevel();
      this.setWaveData();
      this.game.setActiveScreen(SCREENS.TOURNAMENT);
      // this.game.entityLog.getAllEntities().forEach((entity) => {
      //   if (!entity.entityTypes.includes('PLAYING')) {
      //     destroyEntity(entity);
      //   }
      // });
      // this.initialize(this.meta);
      // this.game.initializeGameData();
    }

    // start a new turn on current level
    this.data.turnCount++;
    // this.spawnMortarStrike();
  }

  onLose() {
    if (!this.data['hasLost']) {
      SOUNDS.lose.play();
      this.game.toLose();
      // this.reset();
      // this.game.initializeGameData();
      // this.createOrUpdateInfoBlock('hasLost', {text: 'Down goes the hero, on goes the war.'})
      // this.createOrUpdateInfoBlock('hasLost_enter', {text: 'Press Enter to Play Again'})
      // this.addOnEnterListener();
    }
    this.data['hasLost'] = true;
  }

  onWin() {
    // this.game.toWin()
    if (!this.data['hasWon']) {
      this.addFireWorks();
      this.createOrUpdateInfoBlock('hasWon', {text: `War never ends, but ${this.game.getFirstPlayer().name}'s battle is over. Good job soldier.`})
      this.createOrUpdateInfoBlock('hasWon_enter', {text: 'Press Enter to Play Again'})
      this.addOnEnterListener();
    }
    this.data['hasWon'] = true;
  }

  addOnEnterListener() {
    const handleKeyPress = (event) => {
      if (event.key === 'Enter') {
        this.setLevel(0);
        this.meta({})
        this.game.backToTitle()
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

  getRandomFireworkColors () {
    const colors = [
      [COLORS.white, COLORS.red_0, COLORS.red_1],
      [COLORS.white, COLORS.blue_2, COLORS.blue_1],
      [COLORS.white, COLORS.sand_2, COLORS.sand_1],
    ];
    return Helper.getRandomInArray(colors);
  }

  addCelebratoryDebris (position) {
    SpatterEmitter({
      game: this.game,
      fromPosition: position,
      spatterAmount: .3,
      spatterRadius: 10,
      transfersBackground: false,
      spatterColors: this.getRandomFireworkColors(),
    }).start()
  }

  addFireWorks () {
    // pick a range of random positions
    // then add celebratory debris to each on a timer
    const positions = Array(60).fill(null).map(() => Helper.getRandomPos(this.game.map).coordinates);

    positions.forEach((position) => {
      setTimeout(() => {
        this.addCelebratoryDebris(position);
      }, Helper.getRandomInt(0, 10000))
    })
  }
  
  //Extras
  setLevel (level) {
    this.data.turnCount = 0;
    this.setMetaLevel(level)
  }

  nextLevel () {
    const level = this.getMetaLevel() + 1
    this.setLevel(level);
  }

  setMetaLevel(level) {
    const metaData = this.meta()
    metaData.level = level;
    console.log(metaData);
    
    this.meta(metaData)
  }

  getMetaLevel() {
    return this.meta().level;
  }

  reset () {
    this.setLevel(0);
    this.initialize(this.meta);
  }

  setWaveData () {
    const nextLevelData = this.dataByLevel[this.getMetaLevel()];
    this.data = {...this.data, ...nextLevelData}
  }

  levelComplete () {
    return this.game.getFirstPlayer().getEnemies().length === 0;
    // return this.game.engine.actors.length === 1; 
  }

  hasWon () {
    const level = this.getMetaLevel()
    const maxLevel = this.dataByLevel.length - 1;
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
    let stats = this.getBanditStats();
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
        // new Behaviors.MoveTowardsEnemy({
        //   repeat: stats.speed/Constant.ENERGY_THRESHOLD,
        //   maintainDistanceOf: -1, // causes to move and attack in same turn if close enough
        //   chainOnFail: true
        // }),
        // new Behaviors.MoveAwayFromEnemy({
        //   repeat: stats.speed/Constant.ENERGY_THRESHOLD,
        //   maintainDistanceOf: 4, // causes to move and attack in same turn if close enough
        //   // chainOnFail: fals
        // }),
        new Behaviors.MoveTowardsEnemy({
          repeat: stats.speed/Constant.ENERGY_THRESHOLD,
          maintainDistanceOf: -1, // causes to move and attack in same turn if close enough
          chainOnFail: true
        }),
        new Behaviors.Telegraph({
          repeat: 1,
          attackPattern: Constant.CLONE_PATTERNS.clover,
          chainOnSuccess: true
        }),
        new Behaviors.ExecuteAttack({repeat: 1}),
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
