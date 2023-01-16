import React from 'react';
import { SCREENS } from '../Screen/constants';
import * as _ from 'lodash';
import { CARTRIDGE } from '../Nystrum';

class Instructions extends React.Component {
  render() {
    const infoHeader = _.get(this.props.game, 'mode.infoHeader', null);
    const infoBlocks = _.get(this.props.game, 'mode.infoBlocks', {});

    return (
      <div className="Instructions UI">
        {infoHeader && (<p className='flow-text'>{infoHeader}</p>)}
        <div className='flow-text'>
          <div 
            className='Instructions__block'
            onClick={() => this.props.setActiveScreen(SCREENS.TITLE)}
            // onClick={() => window.location.reload()}
          >
            <button 
              style={{
                backgroundColor: CARTRIDGE.theme.accent,
                color: CARTRIDGE.theme.main,
              }}
              className='btn btn-main'
            >
              Restart
            </button>
          </div>
          <div 
            className='Instructions__block'
            onClick={() => this.props.toggleSpriteMode()}
          >
            <button
              style={{
                backgroundColor: CARTRIDGE.theme.accent,
                color: CARTRIDGE.theme.main,
              }}
              className='btn btn-main'
            >
              {
                this.props.spriteMode ? (
                  'ASCII mode'
                ) : (
                  'Sprite mode'
                )
              }
            </button>
          </div>
          <div className='Instructions__block'>
            <button
              style={{
                backgroundColor: CARTRIDGE.theme.accent,
                color: CARTRIDGE.theme.main,
              }}
              data-target="jacinto_help"
              className='btn btn-main modal-trigger'
            >
              Help
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default Instructions;