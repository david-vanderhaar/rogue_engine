import React, { useEffect } from 'react';
import HelpContent from './HelpContent';
import SoundControl from '../../../../AppComponents/SoundControl';
import { COLORS } from '../theme';

function SettingsModal(props) {
  let elems = []
  React.useLayoutEffect(() => {
    elems = document.querySelectorAll(`#${props.id}`);
    window.M.Modal.init(elems)
  })

  function triggerHelpModal() {
    elems.forEach((elem) => {
      window.M.Modal.getInstance(elem).open()
    })
  }

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === '?') {
        triggerHelpModal()
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
      <div className="Jacinto_Help" style={{width: '100%'}}>
        <div className="modal-content" style={{backgroundColor: COLORS.dark}}>
          <div className="row">
            <div className="col s12">
              <div className="Jacinto_Help__section_header">Sound</div>
              <div className="Jacinto_Help__section_body">
                <SoundControl />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="modal-footer">
        <a href="#!" className="modal-close waves-effect waves-green btn-flat">Close</a>
      </div>
    </div>
  )
}

export default SettingsModal;