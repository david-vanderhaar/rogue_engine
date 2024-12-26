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
      console.log(event);
      
      if (event.key === '?') {
        triggerHelpModal()
      }
    };
    // Add event listener when the component mounts
    window.addEventListener('keydown', handleKeyPress);
    // Clean up by removing the event listener when the component unmounts
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