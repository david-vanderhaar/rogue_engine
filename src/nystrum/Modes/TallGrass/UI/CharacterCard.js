import React from 'react';
import * as _ from 'lodash';
import ActionMenu from '../../../UI/Jacinto/ActionMenu'
import { NamePlate, Portrait, ProgressBar, StatusEffects } from '../../../UI/Entity/CharacterCard';

function CharacterCard ({actor, game}) {
  return (
    <div className='CharacterCard'>
      <div>
        <NamePlate actor={actor}/>
        <Portrait actor={actor}/>
        <ProgressBar 
          label='Action Points'
          attributePath='energy'
          attributePathMax='speed'
          colorFilled='#ff9926'
          unit={100}
          actor={actor} 
        />
        <ProgressBar 
          label='Health Points'
          attributePath='durability'
          attributePathMax='durabilityMax'
          colorFilled='#dc322f'
          unit={1}
          actor={actor} 
        />
        {/* <ProgressBar 
          label='Fear'
          attributePath='fearPoints'
          attributePathMax='maxFearPoints'
          colorFilled='#859900'
          unit={1}
          actor={actor} 
        /> */}
        <StatusEffects actor={actor} />
      </div>
      <div>
        <ActionMenu keymap={actor.getKeymap()} game={game} />
      </div>
    </div>
  )
}

export default CharacterCard;
