import React, {useEffect} from 'react';
import { CARTRIDGE } from '../../../Nystrum';
import { SCREENS } from '../../../Screen/constants';

export default function Win(props) {
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
        <h2 style={{color: CARTRIDGE.theme.accent, marginBottom: 70}}>Congratulations to the top Chunin of the year!</h2>
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