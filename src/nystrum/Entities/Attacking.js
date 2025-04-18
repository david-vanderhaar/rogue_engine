import { MESSAGE_TYPE } from '../message';
import * as Helper from '../../helper';

export const Attacking = superclass => class extends superclass {
  constructor({ attackDamage = 2, ...args }) {
    super({ ...args });
    this.entityTypes = this.entityTypes.concat('ATTACKING');
    this.attackDamage = attackDamage;
  }

  getAttackDamage(additional = 0) {
    return this.attackDamage + additional;
  }

  getAttackDamageWithEquipment(additional = 0) {
    let damage = this.getAttackDamage(additional);
    if (this.entityTypes.includes('EQUIPING')) {
      this.equipment.forEach((slot) => {
        if (slot.item) {
          if (slot.item.entityTypes.includes('ATTACKING')) {
            damage += slot.item.getAttackDamage();
          }
        }
      });
    }

    return damage;
  }

  canAttack(entity) {
    return true;
  }

  attack(targetPos, additional = 0) {
    // return this.attack_v1(targetPos, additional);
    return this.attack_v2(targetPos, additional);
  }

  attack_v1(targetPos, additional = 0) {
    // this is the first implementation of attack
    // we bundle all damage from equipment and the entity itself
    // and apply it to the target at once
    let success = false;
    let tile = this.game.map[Helper.coordsToString(targetPos)];
    if (!tile) {
      return success;
    }
    let targets = Helper.getDestructableEntities(tile.entities);
    if (targets.length > 0) {
      // let target = targets[0];
      let target = targets[targets.length - 1];
      if (this.canAttack(target)) {
        const damage = this.getAttackDamageWithEquipment(additional)
        this.game.addMessage(`${this.name} attacks ${target.name} for ${damage}`, MESSAGE_TYPE.DANGER);
        target.decreaseDurability(damage);
        if (this.entityTypes.includes('PLAYING')) this.game.display.shakeScreen({intensity: 1})
        
        success = true;
      }
    }
    return success;
  }

  attack_v2(targetPos, additional = 0) {
    // this is the second implementation of attack
    // we first attack with the entity itself
    // then we attack with all equipment that has the entity type 'ATTACKING'
    // this allows for more control over the attack process
    // TODO: shoulf this be a different entity type?

    let success = false;
    let tile = this.game.map[Helper.coordsToString(targetPos)];
    if (!tile) {
      return success;
    }
    let targets = Helper.getDestructableEntities(tile.entities);
    if (targets.length > 0) {
      let target = targets[targets.length - 1];
      if (this.canAttack(target)) {
        const damage = this.getAttackDamage(additional)
        if (damage > 0) {
          this.game.addMessage(`${this.name} hits ${target.name} for ${damage}`, MESSAGE_TYPE.DANGER);
          target.decreaseDurability(damage);
        }

        if (this.entityTypes.includes('EQUIPING')) {
          this.equipment.forEach((slot) => {
            if (slot.item) {
              if (slot.item.entityTypes.includes('ATTACKING')) {
                slot.item.attack(targetPos);
              }
            }
          });
        }

        if (this.entityTypes.includes('PLAYING')) this.game.display.shakeScreen({intensity: 1})
        
        success = true;
      }
    }
    return success;
  }
};
