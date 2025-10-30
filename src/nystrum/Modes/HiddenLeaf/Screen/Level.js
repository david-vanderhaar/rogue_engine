import React from 'react';
import { SCREENS } from './constants';
import * as Engine from '../../../Engine/engine';
import * as Game from '../../../game';
import Instructions from '../UI/Instructions';
import PlayerInformation from '../UI/Entity/PlayerInformation';
import Messages from '../../../UI/Messages';
import InfoBlocks from '../UI/InfoBlocks';
import Equipment from '../../../UI/HiddenLeaf/Equipment';
import { ImagePortrait } from '../UI/Entity/CharacterCard';
import { NamePlate } from '../../../UI/Entity/CharacterCard';
import { LookedAtEntites, LookedAtEntitesInline } from '../../../UI/VisibleEntities';
import { COLORS } from '../theme';
import {SOUNDS, SOUND_MANAGER} from '.././sounds'

function fadeSoundIn(sound, volume = 0.2) {
  sound.play()
  sound.fade(0, volume, SOUND_MANAGER.master_track_fade_time) 
}

function fadeSoundOut(sound, volume = 0.2) {
  sound.fade(volume, 0, SOUND_MANAGER.master_track_fade_time / 4); 
}

function fadeThemeIn() {
  fadeSoundIn(SOUNDS.wind_loop_2)
  fadeSoundIn(SOUNDS.taiko_drum_loop)
}

function fadeThemeOut() {
  fadeSoundOut(SOUNDS.wind_loop_2)
  fadeSoundOut(SOUNDS.taiko_drum_loop)
}

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

  async componentWillUnmount() {
    fadeThemeOut()
  }

  async componentDidMount() {
    fadeThemeIn()
    this.state.game.initialize(this.presserRef, document)
    this.state.game['setActiveScreen'] = (activeScreen) => this.props.setActiveScreen(activeScreen)
    this.state.game['backToTitle'] = () => this.props.setActiveScreen(SCREENS.TITLE);
    this.state.game['toLose'] = () => {
      this.props.setActiveScreen(SCREENS.LOSE)
    };
    this.state.game['toWin'] = () => {
      this.props.setActiveScreen(SCREENS.WIN)
    };
    this.state.game['onLose'] = () => {
      fadeThemeOut()
      fadeSoundIn(SOUNDS.lose_theme)
    };
    this.state.game['onWin'] = () => {
      fadeThemeOut()
      fadeSoundIn(SOUNDS.win_theme)
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

  getPlayer(meta) {
    let player = this.state.game.getFirstPlayer()
    if (!player) player = meta.tournament.player.basicInfo

    return player
  }

  getOpponent(meta) {
    let opponent = this.state.game.mode.getOpponentActor()
    if (!opponent) opponent = meta.tournament.opponents[0].basicInfo

    return opponent
  }

  render() {
    const meta = this.props.meta()
    const opponent = this.getOpponent(meta)
    const player = this.getPlayer(meta)
    return (
      <div className="Level" style={{fontSize: 12}}>
        <div style={{display: 'flex', justifyContent: 'space-around'}}>
          <div style={{flex: 5}}>
            <div className='game_display_container' style={{margin: 0, height: 680, width: 924, backgroundColor: COLORS.bg_override}}>
              {Game.DisplayElement(this.presserRef, Game.handleKeyPress, this.state.game.engine)}
              <InfoBlocks game={this.state.game} />
            </div>
            <div style={{paddingLeft: 6, paddingTop: 6, backgroundColor: COLORS.bg_override, top: -52, height: 92, position: 'relative'}}>
              <LookedAtEntitesInline game={this.state.game} lookedAt={this.state.game.entityLog.getAllUniqueEntities()} />
            </div>
          </div>
          <div style={{flex: 2, padding: 12, paddingLeft: 28}}>
            <div style={{display: 'flex'}}>
              <div>
                <div style={{fontSize: 16, fontWeight: 'bold', textAlign: 'center', marginBottom: 8}}>Player</div>
                <ImagePortrait actor={player} width={200} height={74} />
                <NamePlate actor={player} />
              </div>
              <div style={{marginLeft: 12, marginTop: 42}}>
                <div style={{fontSize: 12, fontWeight: 'bold', textAlign: 'center', marginBottom: 8}}>vs</div>
                <ImagePortrait actor={opponent} width={100} height={37} />
                <NamePlate actor={opponent} />
              </div>
            </div>
            <PlayerInformation game={this.state.game} />
            <Messages messages={this.state.game.messages.slice(-20).reverse()} />
            {/* <Equipment game={this.state.game} player={this.state.game.getFirstPlayer()} /> */}
          </div>
          <Instructions 
            game={this.state.game}
            spriteMode={this.state.game.spriteMode}
            setActiveScreen={this.props.setActiveScreen}
            toggleSpriteMode={this.toggleSpriteMode.bind(this)}
          />
        </div>
      </div>
    );
  }
}

export default Level;
