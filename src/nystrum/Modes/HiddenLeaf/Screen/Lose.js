import React, {useEffect} from 'react';
import { CARTRIDGE } from '../../../Nystrum';
import { SCREENS } from '../../../Screen/constants';

export default function Lose(props) {
  function gotToTitle () {
    props.setActiveScreen(SCREENS.TITLE);
  }

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Enter') {
        gotToTitle();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div className="Title">
      <div className="Title__content">
        <h2 style={{color: CARTRIDGE.theme.accent, marginBottom: 70}}>You'll get 'em next year.</h2>
        <button
          className='btn btn-main btn-themed'
          onClick={gotToTitle}
        >
          It's my ninja way!
        </button>
        <span>press enter to play again</span>
      </div>
    </div>
  )
}