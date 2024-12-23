import React from 'react';
// import ActionBar from '../../../../UI/ActionBar';
// import ActionMenu from '../../../../UI/Jacinto/ActionMenu'
import ActionMenu from '../ActionMenu';
import * as _ from 'lodash'
import { NamePlate, ProgressBar, StatusEffects, ImagePortrait } from '../../../../UI/Entity/CharacterCard';

export function SimpleProgressBar ({
  actor, 
  label, 
  colorFilled = 'red',
  colorEmpty = 'gray',
  attributePathMax, 
  attributePath, 
  attributeValueMax,
  attributeValue,
  unit,
}) {
  // const valueMax = attributeValueMax || _.get(actor, attributePathMax, 0) / unit;
  const valueCurrent = attributeValue || _.get(actor, attributePath, 0) / unit;
  return (
    <span style={{marginRight: 24}} >
      {label}:<span style={{color: colorFilled}}>{valueCurrent}</span>
    </span>
  )
}

function CharacterCard ({actor, game}) {
  return (
    <div className='CharacterCard'>
      <div style={{marginBottom: 12}}>
        <SimpleProgressBar 
          label='AP'
          attributePath='energy'
          attributePathMax='speed'
          colorFilled='#ff9926'
          unit={100}
          actor={actor} 
        />
        <SimpleProgressBar 
          label='HP'
          attributePath='durability'
          attributePathMax='durabilityMax'
          colorFilled='#dc322f'
          unit={1}
          actor={actor} 
        />
        {
          actor.chargeMax > 0 && (
            <SimpleProgressBar 
              label='CH'
              attributePath='charge'
              attributePathMax='chargeMax'
              colorFilled='#3e7dc9'
              unit={1}
              actor={actor} 
            />
          )
        }
        {/* <StatusEffects actor={actor} /> */}
      </div>
      <div>
        {/* <ActionBar keymap={actor.getKeymap()} game={game} /> */}
        <ActionMenu keymap={actor.getKeymap()} game={game} />
      </div>
    </div>
  )
}

export default CharacterCard;
