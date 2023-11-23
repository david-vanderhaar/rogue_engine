import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { SCREENS } from './Screen/constants';
import Screens from './Screen/index';
import Cartridges from './Cartridge/index'

// export const CARTRIDGE = Cartridges.defaultCart()
// export const CARTRIDGE = Cartridges.somethingInTheTallGrassCart()
// export const CARTRIDGE = Cartridges.developmentCart()
// export const CARTRIDGE = Cartridges.jacintoCart()
// export const CARTRIDGE = Cartridges.toTheWallsCart()
// export const CARTRIDGE = Cartridges.flumeCart()
export const CARTRIDGE = Cartridges.hiddenLeafCart()


class Nystrum extends React.Component {
  constructor() {
    super();
    let characters = Object.entries(CARTRIDGE.characters).map(([key, value]) => {
      return {
        initialize: value?.initialize || value,
        basicInfo: value?.basicInfo || null,
        selected: false,
        name: key.split('_').join(' '),
      }
    });

    let modes = Object.entries(CARTRIDGE.modes).map(([key, value]) => {
      return {
        class: value,
        selected: false,
        name: key.split('_').join(' '),
      }
    });

    this.state = {
      activeScreen: Object.keys(CARTRIDGE.screens)[0],
      characters,
      modes,
      selectedCharacter: null,
      selectedMode: modes.length === 1 ? modes[0] : null,
      meta: null,
    };
  }

  setActiveScreen (activeScreen) {
    this.setState({activeScreen})
  }

  setSelectedCharacter (character) {
    this.setState({selectedCharacter: {...character}})
  }

  setSelectedMode (mode) {
    this.setState({selectedMode: mode})
  }

  getSetMeta(data = null) {
    if (data) this.setMeta(data)
    return this.getMeta()
  }

  setMeta(data) {
    this.setState({meta: data})
  }

  getMeta() {
    return this.state.meta
  }

  getActiveScreen () {
    const ScreenComponent = CARTRIDGE.screens[this.state.activeScreen].component

    return (
      <div key={this.state.activeScreen}>
        {
          <ScreenComponent
            setActiveScreen={this.setActiveScreen.bind(this)}
            setSelectedCharacter={this.setSelectedCharacter.bind(this)}
            setSelectedMode={this.setSelectedMode.bind(this)}
            meta={this.getSetMeta.bind(this)}
            // meta={this.state.meta}
            selectedCharacter={this.state.selectedCharacter}
            selectedMode={this.state.selectedMode}
            characters={this.state.characters}
            modes={this.state.modes}
          />
        }
      </div>
    )
  }

  render() {
    return (
      <div className="Nystrum" style={{backgroundColor: CARTRIDGE.theme.main}}>
        <ReactCSSTransitionGroup
          transitionName="fade"
          transitionAppear={true}
          transitionEnter={true}
          transitionLeave={true}
          transitionAppearTimeout={500}
          transitionEnterTimeout={500}
          transitionLeaveTimeout={300}
        >
          { this.getActiveScreen() }
        </ReactCSSTransitionGroup>
      </div>
    );
  }
}

export default Nystrum;
