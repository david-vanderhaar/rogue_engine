import React, { useEffect, useState, useRef } from 'react';
import { SCREENS } from '../Modes/HiddenLeaf/Screen/constants';
import Tooltip from './Tooltip';
import { ProgressBar } from './Entity/CharacterCard';

const CharacterCardSelect = ({characters, setActiveScreen, setSelectedCharacter}) => {
  const [selected, setSelected] = useState(Math.floor(characters.length / 2));
  const cardRefs = useRef([]);

  // allow number key events and arrow keys to select character
  useEffect(() => {
    const handleKeyPress = (event) => {
      const options = Array(characters.length).fill(null).map((_, i) => (i + 1).toString());
      if (options.includes(event.key)) {
        const index = parseInt(event.key) - 1;
        setSelected(index);
        cardRefs.current[index].focus();
      } else if (event.key === 'ArrowLeft') {
        setSelected((prev) => {
          const newIndex = prev > 0 ? prev - 1 : characters.length - 1;
          cardRefs.current[newIndex].focus();
          return newIndex;
        });
      } else if (event.key === 'ArrowRight') {
        setSelected((prev) => {
          const newIndex = prev < characters.length - 1 ? prev + 1 : 0;
          cardRefs.current[newIndex].focus();
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

  // focus first card when component mounts
  useEffect(() => {
    cardRefs.current[selected].focus();
  }, []);

  return (
    // single row of character cards
    <div style={{
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      overflow: 'hidden',
      position: 'relative',
      width: '100%',
    }}
    >
      <div style={{
        display: 'flex',
        transition: 'transform 0.5s ease',
        transform: `translateX(${-selected * 220 + (window.innerWidth / 2 - 110)}px)`,
      }}>
        {
          characters.map((character, index) => {
            const distanceFromCenter = Math.abs(index - selected);
            const opacity = 1 - (distanceFromCenter * 0.2);
            return (
              <div key={index} style={{ opacity, width: 220 }}>
                <CharacterCard 
                  character={character} 
                  setSelectedCharacter={setSelectedCharacter} 
                  setActiveScreen={setActiveScreen}
                  index={index}
                  ref={(el) => cardRefs.current[index] = el}
                />
                <div style={{fontSize: 16, width: 200, margin: 'auto'}}>
                {selected === index && (<p className='text--blinking'>press Enter to confirm</p>)}
                {selected !== index && index === selected - 1 && <div style={{textAlign: 'center', fontSize: 16, marginTop: 10}}>&lt;</div>}
                {selected !== index && index === selected + 1 && <div style={{textAlign: 'center', fontSize: 16, marginTop: 10}}>&gt;</div>}
                {selected !== index && (<p style={{fontSize: 12}}>press {index + 1} to select</p>)}
                </div>
              </div>
            )
          })
        }
      </div>
    </div>
  );
}

const CharacterCard = React.forwardRef(({character, setActiveScreen, setSelectedCharacter}, ref) => {
  const actor = character.basicInfo;

  return (
    <button
      className='hidden-leaf-character-card'
      style={{
        '--character-background-color': character.basicInfo.renderer.background,
        '--character-color': character.basicInfo.renderer.color,
        fontFamily: 'player-start-2p',
        fontSize: 12,
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