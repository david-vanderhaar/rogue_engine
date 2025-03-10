import React from 'react';
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
  const restart = () => {
    // props.setActiveScreen(SCREENS.TITLE)
    window.location.reload()
  }

  return (
    <div
      style={{
        position: 'relative',
        bottom: 70,
      }}
    >
      <div style={{width: 'max-content'}}>
        <Button onClick={restart}>Restart</Button>
        <Button triggerModal="help-modal">
          Help (?)
        </Button>
      </div>
      <Help id='help-modal' />
    </div>
  );
}

export default Instructions;