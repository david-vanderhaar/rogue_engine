import React from 'react';
import * as _ from 'lodash';
import { CARTRIDGE } from '../Nystrum';



function InfoBlocks(props) {
  return (
    <div>
      {
        _.map(_.get(props.game, 'mode.infoBlocks', {}), (value, key) => {
          return (
            <div key={key} className='Instructions__block' style={{color: CARTRIDGE.theme.accent, backgroundColor: CARTRIDGE.theme.main}}>
              {value.text}
            </div>
          )
        })
      } 
    </div>
  )
}

export default InfoBlocks;
