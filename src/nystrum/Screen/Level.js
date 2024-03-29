import React from 'react';
import { SCREENS } from './constants';
import * as Engine from '../Engine/engine';
import * as Game from '../game';
import Instructions from '../UI/Instructions';
import Information from '../UI/Information';
import PlayerInformation from '../UI/Entity/PlayerInformation';
import Inventory from '../UI/Inventory';
// import KeymapUI from '../UI/Keymap';
import KeymapUI from '../UI/ActionBar';
import Messages from '../UI/Messages';
import InfoBlocks from '../UI/InfoBlocks';
import {VisibleEntities, LookedAtEntites} from '../UI/VisibleEntities';
import Equipment from '../UI/Jacinto/Equipment';
// import Equipment from '../UI/Equipment';

// import Help from '../UI/Jacinto/Help';
// import Help from '../UI/TallGrass/Help';

class Level extends React.Component {
  constructor(props) {
    super(props);
    let ENGINE = new Engine.Engine({});
    let game = new Game.Game({ 
      engine: ENGINE, 
      getSelectedCharacter: () => this.props.selectedCharacter.initialize(ENGINE),
      mode: this.props.selectedMode.class,
      meta: this.props.meta,
    })
    this.state = {
      game: game,
      activeTab: 0,
      spriteMode: game.spriteMode,
    };
    this.presserRef = React.createRef();
  }

  async componentDidMount() {
    this.state.game.initialize(this.presserRef, document)
    this.state.game['setActiveScreen'] = (activeScreen) => this.props.setActiveScreen(activeScreen)
    this.state.game['backToTitle'] = () => this.props.setActiveScreen(SCREENS.TITLE);
    this.state.game['toLose'] = () => {
      this.props.setActiveScreen(SCREENS.LOSE)
    };
    this.state.game['toWin'] = () => {
      this.props.setActiveScreen(SCREENS.WIN)
    };
    this.state.game['refocus'] = () => this.refocus();
    this.state.game.updateReact = (newGameState) => { this.setState({game: newGameState}) }
    this.state.game.engine.start()
  }

  refocus () {
    if (this.presserRef) this.presserRef.current.focus();
  }

  toggleSpriteMode () {
    this.state.game.spriteMode = !this.state.game.spriteMode;
    this.state.game.draw();
    this.refocus();
    this.setState({ spriteMode: this.state.game.spriteMode})
  }

  render() {
    return (
      <div className="Level">
        <div style={{display: 'flex', justifyContent: 'space-around'}}>
          <div style={{flex: 2}}>
            <PlayerInformation game={this.state.game} />
          </div>
          <div style={{flex: 5}}>
            {/* <LookedAtEntites game={this.state.game} /> */}
            <div className='game_display_container'>
              {Game.DisplayElement(this.presserRef, Game.handleKeyPress, this.state.game.engine)}
            </div>
            <LookedAtEntites game={this.state.game} />
            {/* <Help id="jacinto_help" /> */}
            <InfoBlocks game={this.state.game} />
            <Instructions 
              game={this.state.game}
              spriteMode={this.state.game.spriteMode}
              setActiveScreen={this.props.setActiveScreen}
              toggleSpriteMode={this.toggleSpriteMode.bind(this)}
            />
            {/* <PlayerInformation game={this.state.game} /> */}
            <Information game={this.state.game} />
          </div>
          <div style={{flex: 2, paddingRight: 16}}>
            <Messages messages={this.state.game.messages.slice(-5).reverse()} />
            <VisibleEntities game={this.state.game} />
            <Equipment game={this.state.game} player={this.state.game.getFirstPlayer()} />
            {/* <Inventory inventory={this.state.game.visibleInventory} /> */}
          </div>
          {/* <div className='col s2'> */}
          {/* </div> */}
          {/* <button className='btn' onClick={() => this.props.setActiveScreen(SCREENS.TITLE)}>Quit</button> */}
        </div>
      </div>
    );
  }
}

export default Level;
