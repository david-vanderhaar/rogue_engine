import React from 'react';
import { CARTRIDGE } from '../../../Nystrum';
import { SCREENS } from '../../../Screen/constants';

class Lose extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="Title">
        <div className="Title__content">
          <h2 style={{color: CARTRIDGE.theme.accent, marginBottom: 70}}>You'll get 'em next year.</h2>
          <button
            className='btn btn-main btn-themed'
            onClick={() => {
              // this.props.setSelectedCharacter(this.props.characters[0])
              this.props.setActiveScreen(SCREENS.CHARACTER_SELECT)
            }}
          >
            It's my ninja way!
          </button>
        </div>
      </div>
    );
  }
}

export default Lose;