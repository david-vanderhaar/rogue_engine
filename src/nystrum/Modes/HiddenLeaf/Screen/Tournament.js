import React, {useEffect, useState} from 'react';
import { SOUNDS } from '../sounds';
import { fadeMusicInOut } from './useEffects/fadeMusicInOut';
import { SCREENS } from '../../../Modes/HiddenLeaf/Screen/constants';
import { createTournament, advanceOneRound } from './Tournament/bracketUtils';
import { Bracket } from './Tournament/Bracket';


function getTournament (props) {
  return props.meta()?.tournament || createTournament(props)
}

export default function Tournament(props) {
  // Use React state for tournament so we can update on hotkey
  const [tournament, setTournament] = useState(() => getTournament(props));
  // console.log('tournament', tournament);
  // const tournament = getTournament(props);
  
  
  // Helper to reset tournament
  function resetTournament() {
    setTournament(createTournament(props));
  }

  // Helper to advance tournament
  function advanceTournament() {
    setTournament(prev => advanceOneRound(prev));
  }

  // Hotkey handler for left/right arrows
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'ArrowRight') {
        advanceTournament();
      } else if (event.key === 'ArrowLeft') {
        resetTournament();
      } else if (event.key === 'Enter') {
        gotToLevel();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  let { bracket, currentRound, currentMatch, player, defeated } = tournament;

  useEffect(fadeMusicInOut(SOUNDS.tournament_theme), []);
  useEffect(() => {
    // set the meta data in a global state
    props.meta({tournament});
  }, []);

  function gotToLevel () {
    props.setActiveScreen(SCREENS.LEVEL);
  }

  // Helper to determine if a character is the player
  const isPlayer = (character) => character && character.name === player.name;

  // Helper to determine if a match is the current match
  function isCurrentMatch(roundIdx, matchIdx) {
    return roundIdx === currentRound && matchIdx === currentMatch;
  }

  // Helper to determine if a match is defeated
  function isDefeated(roundIdx, matchIdx) {
    // If winner is set and not the player, it's defeated
    const match = bracket[roundIdx][matchIdx];
    return match.winner && !isPlayer(match.winner);
  }

  // Render the bracket as a grid/tree
  return (
    <div className="Title">
      <div className="Title__content">
        <h2>Tournament Bracket</h2>
        <div style={{
            overflowY: 'scroll', 
            height: 482,
            scrollbarColor: 'var(--color-accent) transparent',
            scrollbarWidth: 'thin',
            paddingRight: 32,
        }}>
          <Bracket
            bracket={bracket}
            currentRound={currentRound}
            currentMatch={currentMatch}
            player={player}
            isCurrentMatch={isCurrentMatch}
            isDefeated={isDefeated}
          />
        </div>
        <button
          className='btn btn-main btn-themed'
          onClick={gotToLevel}
        >
          Fight!
        </button>
        <br/>
        <span>press enter to start | → advance | ← reset</span>
      </div>
    </div>
  );
}

