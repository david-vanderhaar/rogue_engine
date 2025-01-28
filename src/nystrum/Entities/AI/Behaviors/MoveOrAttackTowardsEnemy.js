import { MoveOrAttack } from '../../../Actions/MoveOrAttack';
import MoveTowardsEnemy from './MoveTowardsEnemy';

export default class MoveOrAttackTowardsEnemy extends MoveTowardsEnemy {
  constructor({...args }) {
    super({ ...args });
  }

  constructActionClassAndParams () {
    const [_, actionParams] = super.constructActionClassAndParams() 
    return [MoveOrAttack, actionParams];
  }
}
