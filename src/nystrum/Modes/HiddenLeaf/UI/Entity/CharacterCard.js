import React from 'react';
import ActionBar from '../../../../UI/ActionBar';
import ActionMenu from '../../../../UI/Jacinto/ActionMenu'
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
  const valueMax = attributeValueMax || _.get(actor, attributePathMax, 0) / unit;
  const valueCurrent = attributeValue || _.get(actor, attributePath, 0) / unit;
  return (
    <div className="ProgressBar">
      {
        label && (
          <div>
            <span className='ProgressBar__label'>{label}</span>
          </div>
        )
      }
      <div>
        <div className='ProgressBar__blips'>
          {
            Array(valueMax).fill(true).map((blip, index) => {
              return (
                <span 
                  key={index}
                  className='ProgressBar__blips__blip__' 
                  style={{backgroundColor: valueCurrent > index ? colorFilled : colorEmpty }}
                >*</span>
              )
            })
          }
        </div>
      </div>
    </div>
  )
}

function CharacterCard ({actor, game}) {
  return (
    <div className='CharacterCard'>
      <div>
        <SimpleProgressBar 
          label='Action Points'
          attributePath='energy'
          attributePathMax='speed'
          colorFilled='#ff9926'
          unit={100}
          actor={actor} 
        />
        <SimpleProgressBar 
          label='Health Points'
          attributePath='durability'
          attributePathMax='durabilityMax'
          colorFilled='#dc322f'
          unit={1}
          actor={actor} 
        />
        {
          actor.chargeMax > 0 && (
            <SimpleProgressBar 
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
