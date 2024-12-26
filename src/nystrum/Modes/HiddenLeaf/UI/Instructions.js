import React, { useEffect } from 'react';
import { SCREENS } from '../Screen/constants';
import * as _ from 'lodash';
import { CARTRIDGE } from '../../../Nystrum';
import Help from './Help';

function Button({triggerModal = null, onClick, children}) {
  const className = triggerModal ? 'modal-trigger' : '';
  const dataTarget = triggerModal
  return (
    <button 
      className={className}
      data-target={dataTarget}
      onClick={onClick}
      style={{
        backgroundColor: CARTRIDGE.theme.accent,
        color: CARTRIDGE.theme.main,
        fontFamily: 'var(--font-main)',
        borderRadius: '5px 5px 0 0',
        border: 'none',
        padding: 2,
        marginRight: 8,
        textAlign: 'center',
        fontSize: 12,
        cursor: 'pointer',
      }}
    >
      {children}
    </button>
  )
}

function Instructions(props) {
  const infoHeader = _.get(props.game, 'mode.infoHeader', null);
  // const infoBlocks = _.get(props.game, 'mode.infoBlocks', {});
  const restart = () => {
    // props.setActiveScreen(SCREENS.TITLE)
    window.location.reload()
  }

  return (
    <div
      style={{
        position: 'relative',
        top: 688,
        right: 152,
      }}
    >
      {infoHeader && (<p>{infoHeader}</p>)}
      <div>
        <Button onClick={restart}>Restart</Button>
        {/* <Button onClick={props.toggleSpriteMode}>
          {
            props.spriteMode ? (
              'Text mode'
            ) : (
              'Sprite mode'
            )
          }
        </Button> */}
        <Button triggerModal="help-modal">
          Help (?)
        </Button>
      </div>
      <Help id='help-modal' />
    </div>
  );
}

export default Instructions;