import React from 'react';
import { SCREENS } from './constants';
import ModeSelect from '../UI/ModeSelect';
import { CARTRIDGE } from '../Nystrum';

class Title extends React.Component {
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
          <ModeSelect 
            modes={this.props.modes} 
            selectedMode={this.props.selectedMode} 
            setSelectedMode={this.props.setSelectedMode}
            setActiveScreen={this.props.setActiveScreen}
          />
        </div>
      </div>
    );
  }
}

export default Title;