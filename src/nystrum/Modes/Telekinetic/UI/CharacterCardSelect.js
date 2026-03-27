import React, { useEffect, useState, useRef } from 'react';
import { SCREENS } from '../Screen/constants';
import Tooltip from '../../../UI/Tooltip';
import { ProgressBar } from '../../../UI/Entity/CharacterCard';
import { SOUNDS } from '../sounds';

const CharacterCardSelect = ({upgrades: characters, setActiveScreen, setSelectedAbility: setSelectedCharacter}) => {
  const playButtonSound = () => {
    SOUNDS.wood_button.play();
  }

  const setActiveScreenWithSound = (screen) => {
    SOUNDS.wood_button.play();
    setActiveScreen(screen);
  }

  const [selected, setSelected] = useState(0);
  const cardRefs = useRef([]);

  const selectedRef = useRef(selected);
  useEffect(() => {
    selectedRef.current = selected;
  }, [selected]);

  const getReorderedCharacters = (selectedIndex) => {
    const reordered = [...characters];
    const length = characters.length;
    const middle = Math.floor(length / 2);

    const shift = (selectedIndex - middle + length) % length;

    for (let i = 0; i < shift; i++) {
      reordered.push(reordered.shift());
    }

    return reordered;
  };

  // allow number key events and arrow keys to select character
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === 'ArrowLeft' || event.key === 'a') {
        playButtonSound();
        setSelected(prev => prev > 0 ? prev - 1 : characters.length - 1);
      }

      else if (event.key === 'ArrowRight' || event.key === 'd') {
        playButtonSound();
        setSelected(prev => prev < characters.length - 1 ? prev + 1 : 0);
      }

      else if (event.key === 'Enter') {
        const current = selectedRef.current;
        setSelectedCharacter(characters[current]);
        setActiveScreenWithSound(SCREENS.LEVEL);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [characters]);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      overflow: 'hidden',
      position: 'relative',
      width: '100%',
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        width: '100%',
      }}>
        {
          getReorderedCharacters(selected).map((character, index) => {
            // Calculate the visual index relative to the center
            const visualIndex = index - Math.floor(characters.length / 2);
            // const visualIndex = index
            const distanceFromCenter = Math.abs(visualIndex);
            const opacity = 1 - (distanceFromCenter * 0.3);

            if (Math.abs(visualIndex) > 2) return null;
            
            return (
              <div 
                key={character.name.split(' ').join('_')}
                style={{ 
                  opacity,
                  // width: 210,
                  position: 'relative',
                }}
              >
                <CharacterCard 
                  character={character}
                  setSelectedCharacter={setSelectedCharacter}
                  setActiveScreen={setActiveScreenWithSound}
                  // index={characters.indexOf(character)} // Use original index for reference
                  ref={(el) => cardRefs.current[characters.indexOf(character)] = el}
                  selectedStyle={visualIndex === 0}
                />
                <div style={{fontSize: 16, width: 200, margin: 'auto'}}>
                  {visualIndex === 0 && (<p className='text--blinking'>press Enter to confirm</p>)}
                  {visualIndex === -1 && <div style={{textAlign: 'center', fontSize: 16, marginTop: 10}}>&lt;</div>}
                  {visualIndex === 1 && <div style={{textAlign: 'center', fontSize: 16, marginTop: 10}}>&gt;</div>}
                </div>
              </div>
            )
          })
        }
      </div>
    </div>
  );
}

const CharacterCard = React.forwardRef(({character, setActiveScreen, setSelectedCharacter, selectedStyle = false}, ref) => {
  const actor = character;
  const background = selectedStyle ? actor.renderer.background : 'var(--color-accent)';
  const color = selectedStyle ? actor.renderer.color : 'var(--color-main)';
  const borderColor = selectedStyle ? actor.renderer.color : 'var(--color-main)';
  const width = selectedStyle ? '14rem' : '14rem';
  const height = selectedStyle ? '29rem' : '27rem';
  const margin = selectedStyle ? '1rem' : '0.5rem';

  return (
    <button
      // snake_case the character name for the key
      // index={actor.name.split(' ').join('_').toLowerCase()}
      // key={actor.name.split(' ').join('_').toLowerCase()}
      className='hidden-leaf-character-card'
      style={{
        '--character-background-color': background,
        '--character-color': color,
        backgroundColor: background,
        color: color,
        borderColor: borderColor,
        fontFamily: 'player-start-2p',
        fontSize: 12,
        width: width,
        height: height,
        margin: margin,
      }}
      onClick={() => {
        setSelectedCharacter(character);
        setActiveScreen(SCREENS.LEVEL);
      }}
      ref={ref}
    >
      {/* a small, bordered character portrait */}
      {/* <div>
        <img
          src={actor.portrait}
          alt={actor.name}
          style={{
            height: '100%',
            width: '100%',
          }}
        />
      </div> */}
      {/* the character's name */}
      <div>
        <b>{actor.name}</b>
      </div>
      {/* the character's description */}
      <p>
        {actor.description}
      </p>
    </button>
  )
});

export default CharacterCardSelect;