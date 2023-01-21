import React from 'react';
import { SCREENS } from '../../../Screen/constants'
import { CARTRIDGE } from '../../../Nystrum';

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
          <button
            style={{
              backgroundColor: CARTRIDGE.theme.accent,
              color: CARTRIDGE.theme.main,
            }}
            className={`CharacterSelect__button btn btn-main`}
            onClick={() => {
              this.props.setActiveScreen(SCREENS.MODE_SELECT)
            }}
          >
            Save The City
          </button>
        </div>
      </div>
    );
  }
}

export default Title;