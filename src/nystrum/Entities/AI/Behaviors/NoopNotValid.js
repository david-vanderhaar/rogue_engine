import { NoopFail } from '../../../Actions/NoopFail';
import { Say } from '../../../Actions/Say';
import Behavior from './Behavior';

export default class NoopNotValid extends Behavior {
  constructor({ ...args }) {
    super({ ...args });
  }

  isValid () {
    return true
  }

  constructActionClassAndParams () {
    return [
      NoopFail,
      {message: '*noop not valid*'}
    ]
  }
}
