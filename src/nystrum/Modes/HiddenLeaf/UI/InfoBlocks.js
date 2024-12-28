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
                textAlign: 'center',
              }}
            >
              {value.text}
            </div>
          )
        })
      } 
    </div>
  )
}

export default InfoBlocks;
