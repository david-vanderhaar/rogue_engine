import { MoveOrShove } from '../../../Actions/MoveOrShove';
import MoveTowardsEnemy from './MoveTowardsEnemy';

export default class MoveOrShoveTowardsEnemy extends MoveTowardsEnemy {
  constructor({...args }) {
    super({ ...args });
  }

  constructActionClassAndParams () {
    const [_, actionParams] = super.constructActionClassAndParams() 
    return [MoveOrShove, actionParams];
  }
}
