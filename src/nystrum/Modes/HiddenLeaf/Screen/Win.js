import React, {useEffect} from 'react';
import { fadeMusicInOut } from './useEffects/fadeMusicInOut';
import { SOUNDS } from '../sounds';
import { CARTRIDGE } from '../../../Nystrum';
import { SCREENS } from '../../../Screen/constants';

export default function Win(props) {
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
    <div className="Title" style={{backgroundColor: CARTRIDGE.theme.rock_lee, width: '100%', height: '720px'}}>
      <div style={{display: 'flex', height: '100%' }}>
        <div style={{flex: 2}}>
          <img
            src={window.PUBLIC_URL + '/hidden_leaf/win/rock_lee_win.jpg'}
            alt="Itachi Uchiha saying 'you lose'"
            style={{margin: 40, borderRadius: 8, animationDelay: '0.1s'}}
            className="fadeIn"
          />
        </div>
        <div style={{flex: 5, alignSelf: 'center'}}>
          <h6 
            style={{color: CARTRIDGE.theme.accent, marginBottom: 40, animationDelay: '0.3s'}}
            className="fadeIn"
          >
            Congrats! You have completed the Chunin Exams!
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
            <div className="fadeIn">press enter to play again</div>
        </div>
      </div>
    </div>
  )
}