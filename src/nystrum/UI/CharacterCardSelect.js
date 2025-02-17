import React, { useEffect, useState, useRef } from 'react';
import { SCREENS } from '../Modes/HiddenLeaf/Screen/constants';
import Tooltip from './Tooltip';
import { ProgressBar } from './Entity/CharacterCard';

const CharacterCardSelect = ({characters, setActiveScreen, setSelectedCharacter}) => {
  const [selected, setSelected] = useState(0);
  const cardRefs = useRef([]);

  // Reorder the array so selected character is in the middle
  const getReorderedCharacters = (selectedIndex) => {
    const reordered = [...characters];
    const length = characters.length;
    const middle = Math.floor(length / 2);

    // shift the array so the selected character is in the middle
    // based on the selected index
    for (let i = 0; i < (selectedIndex + middle); i++) {
      reordered.push(reordered.shift());
    }
    return reordered;
  };

  // allow number key events and arrow keys to select character
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === 'ArrowLeft') {
        setSelected((prev) => {
          const newIndex = prev > 0 ? prev - 1 : characters.length - 1;
          return newIndex;
        });
      } else if (event.key === 'ArrowRight') {
        setSelected((prev) => {
          const newIndex = prev < characters.length - 1 ? prev + 1 : 0;
          return newIndex;
        });
      } else if (event.key === 'Enter') {
        setSelectedCharacter(characters[selected]);
        setActiveScreen(SCREENS.TOURNAMENT);
      }
    };
    // Add event listener when the component mounts
    window.addEventListener('keydown', handleKeyPress);
    // Clean up by removing the event listener when the component unmounts
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [selected, characters, setActiveScreen, setSelectedCharacter]);

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
            const distanceFromCenter = Math.abs(visualIndex);
            const opacity = 1 - (distanceFromCenter * 0.3);

            if (Math.abs(visualIndex) > 2) return null;
            
            return (
              <div 
                key={character.basicInfo.name}
                style={{ 
                  opacity,
                  // width: 210,
                  position: 'relative',
                }}
              >
                <CharacterCard 
                  character={character}
                  setSelectedCharacter={setSelectedCharacter}
                  setActiveScreen={setActiveScreen}
                  index={characters.indexOf(character)} // Use original index for reference
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
  const actor = character.basicInfo;
  const background = selectedStyle ? actor.renderer.background : 'var(--color-accent)';
  const color = selectedStyle ? actor.renderer.color : 'var(--color-main)';
  const borderColor = selectedStyle ? actor.renderer.color : 'var(--color-main)';
  const width = selectedStyle ? '14rem' : '14rem';
  const height = selectedStyle ? '29rem' : '27rem';
  const margin = selectedStyle ? '1rem' : '0.5rem';

  return (
    <button
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
        setActiveScreen(SCREENS.TOURNAMENT);
      }}
      ref={ref}
    >
      {/* a small, bordered character portrait */}
      <div>
        <img
          src={actor.portrait}
          alt={actor.name}
          style={{
            height: '100%',
            width: '100%',
          }}
        />
      </div>
      {/* the character's name */}
      <div>
        {actor.name}
      </div>
      {/* the character's description */}
      <div>
        {actor.description}
      </div>
      <div style={{display: 'flex', marginTop: 10, fontSize: 10}}> {/* bottom half of card  */}
      <div>
          {/* stats */}
          <div style={{textAlign: 'left',}}>
            <b style={{minWidth: 70, marginRight: 5}}>Speed</b>
            <ProgressBar 
                attributePath='speedRating'
                attributeValueMax={3}
                colorFilled='#ff9926'
                unit={100}
                actor={actor} 
              />
          </div>
          <div style={{textAlign: 'left',}}>
            <b style={{minWidth: 70, marginRight: 5}}>Defense</b>
            <ProgressBar 
              attributePath='durabilityRating'
              attributeValueMax={3}
              colorFilled='#dc322f'
              unit={1}
              actor={actor} 
            />
          </div>
          <div style={{textAlign: 'left',}}>
            <b style={{minWidth: 70, marginRight: 5}}>Chakra</b>
            <ProgressBar 
              attributePath='chakraRating'
              attributeValueMax={3}
              colorFilled='#3e7dc9'
              unit={1}
              actor={actor} 
            />
          </div>
        </div>        
        <div style={{flex: 1, textAlign: 'left'}}>
          {/* summary of charactet's special abilities */}
          <div><b>Jutsus</b></div>
          {actor.abilities.map((ability, index) => {
            return (
              <Tooltip 
                key={index}
                title={ability.name}
                text={ability.description}
              >
                <div style={{border: '1px solid', borderRadius: 5, padding: 5, marginRight: 10, marginBottom: 10}}>
                  {ability.name}
                </div>
              </Tooltip>
            )
          })}
        </div>
      </div>
    </button>
  )
});

export default CharacterCardSelect;