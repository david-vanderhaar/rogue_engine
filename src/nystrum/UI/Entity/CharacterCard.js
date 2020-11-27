import React from 'react';
import * as _ from 'lodash';
import Tooltip from '../Tooltip';

function Portrait ({actor}) {
  return (
    <div className="Portrait" style={{
      backgroundColor: actor.renderer.background, 
      color: actor.renderer.color,
      borderColor: actor.renderer.color,
    }}>
      {actor.renderer.character}
    </div>
  )
}

function StatusEffect ({effect}) {
  return (
    <div className="StatusEffects__effect" style={{
      backgroundColor: effect.renderer.background, 
      color: effect.renderer.color,
      borderColor: effect.renderer.color,
    }}>
      {effect.renderer.character}
    </div>
  )
}

function StatusEffects ({actor}) {
  return (
    <div className="StatusEffects">
      {
        actor.game.engine.getStatusEffectsByActorId(actor.id).map((effect, i) => {
          return (
            <Tooltip 
              key={i}
              title={effect.name}
              text={effect.name}
            >
              <StatusEffect effect={effect} />
            </Tooltip>
          )
        })
      }
    </div>
  )
}

function NamePlate ({actor}) {
  return (
    <div className="NamePlate">
      {actor.name}
    </div>
  )
}

function ProgressBar ({
  actor, 
  label, 
  colorFilled = 'red',
  colorEmpty = 'gray',
  attributePathMax, 
  attributePath, 
  unit,
}) {
  const valueMax = _.get(actor, attributePathMax, 0) / unit;
  const valueCurrent = _.get(actor, attributePath, 0) / unit;
  return (
    <div className="ProgressBar">
      <div>
        <span className='ProgressBar__label'>{label}</span>
      </div>
      <div>
        <div className='ProgressBar__blips'>
          {
            Array(valueMax).fill(true).map((blip, index) => {
              return (
                <span 
                  key={index}
                  className='ProgressBar__blips__blip' 
                  style={{backgroundColor: valueCurrent > index ? colorFilled : colorEmpty }}
                />
              )
            })
          }
        </div>
      </div>
    </div>
  )
}

function CharacterCard ({actor}) {
  return (
    <div className='CharacterCard'>
      <Portrait actor={actor}/>
      <div>
        <NamePlate actor={actor}/>
        <ProgressBar 
          label='Action Points'
          attributePath={'energy'}
          attributePathMax={'speed'}
          unit={100}
          actor={actor} 
        />
        <StatusEffects actor={actor} />
      </div>
    </div>
  )
}

export default CharacterCard;