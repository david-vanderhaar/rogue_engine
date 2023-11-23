import React from 'react';
import ActionBar from '../../../../UI/ActionBar';
import ActionMenu from '../../../../UI/Jacinto/ActionMenu'
import { NamePlate, ProgressBar, StatusEffects, ImagePortrait } from '../../../../UI/Entity/CharacterCard';

function CharacterCard ({actor, game}) {
  return (
    <div className='CharacterCard'>
      <div>
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
        {
          actor.chargeMax > 0 && (
            <ProgressBar 
              label='Chakra'
              attributePath='charge'
              attributePathMax='chargeMax'
              colorFilled='#3e7dc9'
              unit={1}
              actor={actor} 
            />
          )
        }
        <StatusEffects actor={actor} />
      </div>
      <div>
        {/* <ActionBar keymap={actor.getKeymap()} game={game} /> */}
        <ActionMenu keymap={actor.getKeymap()} game={game} />
      </div>
    </div>
  )
}

export default CharacterCard;
