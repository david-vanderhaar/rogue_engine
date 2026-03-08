import React, {useEffect, useState} from 'react';
import { fadeMusicInOut } from './useEffects/fadeMusicInOut';
import { SOUNDS } from '../sounds';
import { CARTRIDGE } from '../../../Nystrum';
import { SCREENS } from '../../../Screen/constants';

export default function Win(props) {
  function gotToTitle () {
    props.setActiveScreen(SCREENS.TITLE);
  }
  const [meta] = useState(props.meta());

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

  console.log(meta);
  
  return (
    <div className="Title" style={{backgroundColor: CARTRIDGE.theme.rock_lee, width: '100%', height: '720px'}}>
      <div style={{display: 'flex', height: '100%' }}>
        <div style={{flex: 5, alignSelf: 'center'}}>
          <img
            src={window.PUBLIC_URL + '/telekinetic/title/hands_down.png'}
            alt="hands"
            style={{margin: 40, borderRadius: 8, animationDelay: '0.1s', height: 600, position: 'relative', top: 245}}
            className="fadeIn"
          />
          <h6 
            style={{color: CARTRIDGE.theme.accent, marginBottom: 40, animationDelay: '0.3s'}}
            className="fadeIn"
          >
            You Escaped! What will you do with your powers now?
          </h6>
          <div style={{color: CARTRIDGE.theme.accent, marginBottom: 40, animationDelay: '0.6s'}} className="fadeIn">
            Statistics
            <hr style={{borderColor: CARTRIDGE.theme.accent, margin: '10px 0'}} />
            <ul>
              <li>Rounds Won: {meta?.tournament?.currentRound - 1 || '0'}</li>
              <li>Abilities Gained: {meta?.upgrades?.length || '0'}</li>
              {/* <li>Turns Taken: {meta?.turnsTaken || '0'}</li>
              <li>Enemies Defeated: {meta?.enemiesDefeated || '0'}</li> */}
            </ul>
          </div>
          <button
            className='btn btn-main btn-themed fadeIn'
            onClick={gotToTitle}
          >
            Play Again
          </button>
          <div className="fadeIn">press enter to play again</div>
          <img
            src={window.PUBLIC_URL + '/telekinetic/title/hands_front.png'}
            alt="hands"
            style={{margin: 40, borderRadius: 8, animationDelay: '0.2s', height: 600, position: 'relative', bottom: 190, left: -20}}
            className="fadeIn"
          />
        </div>
      </div>
    </div>
  )
}