import React from 'react';
import { SCREENS } from './constants';
import * as Engine from '../../../Engine/engine';
import * as Game from '../../../game';
import Instructions from '../../../UI/Instructions';
import PlayerInformation from '../UI/Entity/PlayerInformation';
import Messages from '../../../UI/Messages';
import InfoBlocks from '../../../UI/InfoBlocks';
import Equipment from '../../../UI/Jacinto/Equipment';
import { OpponentCard } from './Tournament';
import { ImagePortrait, NamePlate } from '../../../UI/Entity/CharacterCard';

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
    const meta = this.props.meta()
    console.log('meta', meta);
    const opponent = meta.tournament.opponents[meta.tournament.active].basicInfo
    const player = meta.tournament.player.basicInfo
    return (
      <div className="Level">
        <div style={{display: 'flex', justifyContent: 'space-around'}}>
          <div style={{flex: 2}}>
            {/* <OpponentCard character={player} /> */}
            <div style={{fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 8}}>Player</div>
            <ImagePortrait actor={player} />
            <NamePlate actor={player} />
            <PlayerInformation game={this.state.game} />
          </div>
          <div style={{flex: 5}}>
            <div className='game_display_container'>
              {Game.DisplayElement(this.presserRef, Game.handleKeyPress, this.state.game.engine)}
            </div>
            <InfoBlocks game={this.state.game} />
            <Instructions 
              game={this.state.game}
              spriteMode={this.state.game.spriteMode}
              setActiveScreen={this.props.setActiveScreen}
              toggleSpriteMode={this.toggleSpriteMode.bind(this)}
            />
          </div>
          <div style={{flex: 2, paddingRight: 16}}>
            {/* <OpponentCard character={opponent} /> */}
            <div style={{fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 8}}>Opponent</div>
            <ImagePortrait actor={opponent} />
            <NamePlate actor={opponent} />
            <div style={{marginBottom: 16}}></div>
            <Messages messages={this.state.game.messages.slice(-5).reverse()} />
            <Equipment game={this.state.game} player={this.state.game.getFirstPlayer()} />
          </div>
        </div>
      </div>
    );
  }
}

export default Level;
