import React from 'react';
import { CARTRIDGE } from '../../../Nystrum';
import { SCREENS } from '../../../Screen/constants';

class Win extends React.Component {
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
            backgroundColor: CARTRIDGE.theme.accent,
            backgroundImage: `url("${CARTRIDGE.coverImage}")`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            backgroundPositionY: '10px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column'
          }}
        >
          <p style={{color: CARTRIDGE.theme.main}}>Congratualtions! The dark fades. You made it.</p>
          <br />
          <button
            style={{
              backgroundColor: CARTRIDGE.theme.main,
              color: CARTRIDGE.theme.accent,
            }}
            className={`btn btn-main`}
            onClick={() => {
              this.props.setSelectedCharacter(this.props.characters[0])
              this.props.setActiveScreen(SCREENS.LEVEL)
            }}
          >
            Light the Lantern, Enter The Dark
          </button>
        </div>
      </div>
    );
  }
}

export default Win;