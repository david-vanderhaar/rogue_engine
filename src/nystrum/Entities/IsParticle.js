import * as Constant from '../constants'; 

export const createParticleRendererGradient =
  (attributeName, [startHex, endHex]) => ({[attributeName]: [startHex, endHex]})

export const IsParticle = superclass => class extends superclass {
  constructor({ 
    pos = { x: 1, y: 1 },
    direction = { x: 0, y: 0 },
    life = 1,
    speed = 1,
    type = Constant.PARTICLE_TYPE.directional,
    path = null,
    particleRendererGradients = null,
    ...args
  }) {
    super({ ...args });
    this.pos = pos;
    this.direction = direction;
    this.life = life;
    this.maxLife = life;
    this.speed = speed;
    this.type = type;
    this.path = path;
    this.particleRendererGradients = particleRendererGradients
    this.entityTypes = this.entityTypes.concat('PARTICLE');
  }
  
  update(step) {
    this.life -= step;
    if (this.life > 0) {
      this.updateRenderer()
      this.updatePosition(step)
    }
  }

  updatePosition(step) {
    this.pos = this.getNextPos(step);
  }

  getNextPos(step) {
    switch (this.type) {
      case Constant.PARTICLE_TYPE.directional:
        return {
          x: this.pos.x + (this.direction.x * this.speed) * step,
          y: this.pos.y + (this.direction.y * this.speed) * step,
        };
      case Constant.PARTICLE_TYPE.path:
        const nextPos = this.path.shift();
        return nextPos ? { ...nextPos } : { ...this.pos };
      default:
        break;
    }
  }

  updateRenderer() {
    if (this.particleRendererGradients === null) return
    const keys = Object.keys(this.particleRendererGradients)
    const percentage = (1 - (this.life / this.maxLife))
    keys.forEach((key) => {
      const [start, end] = this.particleRendererGradients[key]
      const color = interpolateHexColor(start, end, percentage)
      this.renderer[key] = color
    })
  }
};

const interpolateHexColor = (c0, c1, f) => {
  c0 = c0.substr(1).match(/.{1,2}/g).map((oct)=>parseInt(oct, 16) * (1-f))
  c1 = c1.substr(1).match(/.{1,2}/g).map((oct)=>parseInt(oct, 16) * f)
  let ci = [0,1,2].map(i => Math.min(Math.round(c0[i]+c1[i]), 255))
  return '#' + ci.reduce((a,v) => ((a << 8) + v), 0).toString(16).padStart(6, "0")
}