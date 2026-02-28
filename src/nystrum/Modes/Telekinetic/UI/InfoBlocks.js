import React from 'react';
import * as _ from 'lodash';
import { CARTRIDGE } from '../../../Nystrum';

function InfoBlocks(props) {
  return (
    <div style={{bottom: 680, position: 'relative'}}>
      {
        _.map(_.get(props.game, 'mode.infoBlocks', {}), (value, key) => {
          return (
            <div
              key={key}
              style={{
                color: CARTRIDGE.theme.accent,
                backgroundColor: CARTRIDGE.theme.main,
                padding: 8,
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <span
                style={{
                  textAlign: 'left',
                  whiteSpace: 'pre-wrap',
                }}
              >
                {value.text}
              </span>
            </div>
          )
        })
      } 
    </div>
  )
}

export default InfoBlocks;
