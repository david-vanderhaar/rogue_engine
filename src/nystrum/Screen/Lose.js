import React from 'react';
import { CARTRIDGE } from '../Nystrum';
import CharacterSelect from '../UI/CharacterSelect';

class Lose extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="Title">
        <div
          style={{
            width: '100vw',
            height: '100vh',
            backgroundColor: CARTRIDGE.theme.main,
            backgroundImage: `url("${CARTRIDGE.coverImage}")`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            backgroundPositionY: '10px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <CharacterSelect 
            characters={this.props.characters} 
            selectedCharacter={this.props.selectedCharacter} 
            setSelectedCharacter={this.props.setSelectedCharacter}
            setActiveScreen={this.props.setActiveScreen}
          />
        </div>
      </div>
    );
  }
}

export default Lose;