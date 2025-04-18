import React from 'react';
import { CARTRIDGE } from '../../../Nystrum';
import CharacterSelect from '../../../UI/CharacterCardSelect';

class CharacterSelectScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="Title">
        <div className="Title__content">
          <h1>Choose your Ninja</h1>
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

export default CharacterSelectScreen;