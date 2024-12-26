import React, { useEffect } from 'react';
import HelpContent from './HelpContent';

function Help(props) {
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
      <HelpContent />
      <div className="modal-footer">
        <a href="#!" className="modal-close waves-effect waves-green btn-flat">Close</a>
      </div>
    </div>
  )
}

export default Help;