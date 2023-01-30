import * as Helper from '../../../helper';

export class Particle {
  constructor({
    game,
    pos = { x: 0, y: 0 },
    life = 10,
    speed = 1,
    color = '#fff',
    backgroundColor = '#000',
    character = '*',
    direction = null,
    path = null,
    rendererGradients = null,
  }) {
    this.game = game
    this.pos = pos;
    this.life = life;
    this.maxLife = life;
    this.speed = speed;
    this.color = color;
    this.backgroundColor = backgroundColor;
    this.character = character;
    this.direction = direction;
    this.path = path;
    this.rendererGradients = rendererGradients;

    const layer = this.game.display.particleLayer
    this.displayNode = this.game.display.createTile(
      this.pos.x,
      this.pos.y,
      this.character,
      this.color,
      this.backgroundColor,
      layer
    )
  }

  update() {
    this.life -= 1;
    if (this.life > 0) {
      this.updateColors()
      this.updatePosition()
    }
  }

  updatePosition() {
    this.pos = this.getNextPos();
    const x = this.pos.x * this.displayNode.width()
    const y = this.pos.y * this.displayNode.height()
    this.displayNode.x(x)
    this.displayNode.y(y)
  }

  getNextPos(step) {
    if (this.direction) return this.getNextPosInDirection(this.speed)
    if (this.path) return this.getNextPosInPath()
    return this.pos
  }

  getNextPosInDirection(step) {
    return {
      x: this.pos.x + (this.direction.x * this.speed) * step,
      y: this.pos.y + (this.direction.y * this.speed) * step,
    };
  }

  getNextPosInPath() {
    const nextPos = this.path.shift();
    return nextPos ? { ...nextPos } : { ...this.pos };
  }

  updateColors() {
    if (this.rendererGradients === null) return
    const keys = Object.keys(this.rendererGradients)
    const percentage = (1 - (this.life / this.maxLife))
    keys.forEach((key) => {
      const [start, end] = this.rendererGradients[key]
      const color = interpolateHexColor(start, end, percentage)
      this[key] = color
    })

    this.game.display.updateTile(this.displayNode, this.character, this.color, this.backgroundColor)
  }
}

const interpolateHexColor = (c0, c1, f) => {
  c0 = c0.substr(1).match(/.{1,2}/g).map((oct)=>parseInt(oct, 16) * (1-f))
  c1 = c1.substr(1).match(/.{1,2}/g).map((oct)=>parseInt(oct, 16) * f)
  let ci = [0,1,2].map(i => Math.min(Math.round(c0[i]+c1[i]), 255))
  return '#' + ci.reduce((a,v) => ((a << 8) + v), 0).toString(16).padStart(6, "0")
}

export class ParticleEmitter {
  constructor({
    game = null,
    particles = [],
    isRunning = false,
    easingFunction = Helper.EASING.linear,
    animationTimeStep = 0.9, // 0.1 >=< 0.9
  }) {
    this.game = game;
    this.particles = particles;
    this.easingFunction = easingFunction;
    this.animationTimeStep = animationTimeStep;
    this.isRunning = isRunning;
  }

  addParticle(particleAttributes) {
    let particle = new Particle({game: this.game, ...particleAttributes})
    this.particles.push(particle);
    return true;
  }

  async process(time) {
    this.particles.forEach((particle) => {
      particle.update();
      if (particle.life <= 0) {
        particle.displayNode.destroy()
      }
    })

    this.game.display.particleLayer.batchDraw();
    const delay = Math.max(time * 100, 12)
    await Helper.delay(delay);
    this.particles = this.particles.filter((particle) => particle.life > 0)
    if (this.particles.length === 0) return false;
    return true;
  }

  getTileAtPos(x, y) {
    let key = `${x},${y}`;
    return this.game.map[key];
  }

  async start() {
    this.isRunning = true;
    let time = this.animationTimeStep
    while (this.isRunning) {
      this.isRunning = await this.process(time);
      time = this.easingFunction(time);
    }
  }

  stop() {
    this.isRunning = false;
  }

}