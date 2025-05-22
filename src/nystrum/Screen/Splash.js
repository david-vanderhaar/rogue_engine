import React, { useEffect } from 'react';
import { CARTRIDGE } from '../Nystrum';
import { SCREENS } from './constants';

export default function Splash(props) {
  function nextScreen () {
    props.setActiveScreen(SCREENS.TITLE)
  }

  useEffect(() => {
    // Add event listener when the component mounts
    window.addEventListener('click', nextScreen);

    // Clean up by removing the event listener when the component unmounts
    return () => {
      window.removeEventListener('click', nextScreen);
    };
  }, []);

  return (
    <div className="Title" style={{height: 720, width: 1280, backgroundColor: 'var(--color-console-background)'}}>
      <div className="Title__content">
        <img
          src={window.PUBLIC_URL + '/hidden_leaf/title/exclaim_0.png'}
          alt="Exclaim 0"
          style={{left: 446, top: 96}}
          className="fadeIn__image"
        />
        <div
          className='btn btn-main btn-themed-outline Splash__button'
          style={{top: 600, position: 'relative'}}
          onClick={nextScreen}
        >
          click to start
        </div>
      </div>
    </div>
  );
}
