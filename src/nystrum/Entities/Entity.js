import { pipe } from 'lodash/fp';
import uuid from 'uuid/v1';
import {GAME} from '../game';
import { Describable } from './Describable';


export class BaseEntity {
  constructor({ game = null, passable = false, lightPassable = false, name = 'nameless' }) {
    let id = uuid();
    this.entityTypes = ['Entity'];
    this.id = id;
    this.name = name;
    this.game = game || GAME;
    this.passable = passable;
    this.lightPassable = lightPassable
    this.active = true;

    this.game.entityLog.add(this)
  }
}

export const Entity = pipe(Describable)(BaseEntity)
