import React, { useEffect } from 'react';
import HelpContent from './HelpContent';
import { JACINTO_SOUND_MANAGER } from '../../Jacinto/sounds';
import { GAME } from '../../../game';

// let masterVolume = 10
let masterVolume = JACINTO_SOUND_MANAGER.getVolume() * 100

function Help(props) {
  let elems = []
  React.useLayoutEffect(() => {
    elems = document.querySelectorAll(`#${props.id}`);
    window.M.Modal.init(elems)
    elems.forEach((elem) => {
      const instance = window.M.Modal.getInstance(elem);
      instance.options.onCloseEnd = GAME.refocus;
    })
  })

  function triggerHelpModal() {
    elems.forEach((elem) => {
      window.M.Modal.getInstance(elem).open()
    })
  }

  function closeHelpModal() {
    elems.forEach((elem) => {
      window.M.Modal.getInstance(elem).close()
    })
  }

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === '?') {
        triggerHelpModal()
      } else if (event.key === 'Backspace') {
        closeHelpModal()
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    
    // Remove event listeners on cleanup
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, []);

  return (
    <div id={props.id} className="modal">
      <HelpContent />
      <VolumeControl />
      <div className="modal-footer">
        <a href="#!" className="modal-close waves-effect waves-green btn-flat">Close</a>
      </div>
    </div>
  )
}

function VolumeControl() {
  return (
    <div className="range-field">
      <input
        id='volume'
        type="range"
        min="0"
        max="100"
        defaultValue={masterVolume}
        step="1"
        onChange={(event) => {
          const volume = event.target.value
          masterVolume = volume
          JACINTO_SOUND_MANAGER.setVolume(volume / 100)
        }}
      />
      <label htmlFor="volume">Master Volume</label>
    </div>
  )
}

export default Help;