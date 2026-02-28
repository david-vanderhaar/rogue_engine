import React, {useEffect} from 'react';
import { fadeMusicInOut } from './useEffects/fadeMusicInOut';
import { SOUNDS } from '../sounds';
import { CARTRIDGE } from '../../../Nystrum';
import { SCREENS } from '../../../Screen/constants';

export default function Lose(props) {
  function gotToTitle () {
    props.setActiveScreen(SCREENS.TITLE);
  }

  useEffect(fadeMusicInOut(SOUNDS.lose_theme), []);
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
    <div className="Title" style={{backgroundColor: CARTRIDGE.theme.neji_alt, width: '100%', height: '720px'}}>
      <div className="Title__content">
        <img
          src={window.PUBLIC_URL + '/hidden_leaf/lose/itachi_lose.jpg'}
          alt="Itachi Uchiha saying 'you lose'"
          style={{marginTop: 80, width: '50%', height: 'auto', borderRadius: 8, animationDelay: '0.1s'}}
          className="fadeIn"
        />
        <h6 
          style={{color: CARTRIDGE.theme.accent, marginBottom: 40, width: '50%', animationDelay: '0.3s'}}
          className="fadeIn"
        >
          {/* "People's lives don't end when they die, It ends when they lose faith." */}
          "Somebody told me I'm a failure, I'll prove them wrong." - Naruto Uzumaki
        </h6>
        <div style={{color: CARTRIDGE.theme.accent, marginBottom: 80, animationDelay: '0.6s'}} className="fadeIn">
          Statistics
          <hr style={{borderColor: CARTRIDGE.theme.accent, margin: '10px 0'}} />
          <ul>
            <li>Rounds Won: 1</li>
            <li>Turns Taken: 100</li>
            <li>Jutsus Used: 5</li>
          </ul>
        </div>
        <button
          className='btn btn-main btn-themed fadeIn'
          onClick={gotToTitle}
        >
          It's my ninja way!
        </button>
        <span className="fadeIn">press enter to play again</span>
      </div>
    </div>
  )
}