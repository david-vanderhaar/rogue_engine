import React from 'react';
import { COLORS } from '../theme';

function HelpContent() {
  return (
    <div className="Jacinto_Help" style={{width: '100%'}}>
      <div className="modal-content" style={{backgroundColor: COLORS.dark}}>
        <div className="row">
          <div className="col s12">
            <div className="Jacinto_Help__section_header">Background</div>
            <div className="Jacinto_Help__section_body">
              You woke up on an operating table, in a lab, at the top of sleezy corpo tower. You are too frail in body to defend yourself with bump attacks.
              But your mind expands. It dances, reaches outward, becomes more dense with... <span style={{ color: COLORS.accent }}>Telekinetic Power</span>.
              Use it to escape all 10 floors of this place.
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col s12 m6">
            <div className="Jacinto_Help__section_header">Goal</div>
            <div className="Jacinto_Help__section_body">
              <span style={{ color: COLORS.accent }}>+</span> Missions are how you move the game forward. Their details are on the top of the screen. Fulfill their requirements to descend to the next floor.<br/><br/>
              <span style={{ color: COLORS.accent }}>+</span> Deal with the enemies on each floor.<br/><br/>
              <span style={{ color: COLORS.accent }}>+</span> In between floors you will grow stronger with buffs or new abilities.<br/><br/>
            </div>
          </div>
          <div className="col s12 m6">
            <div className="Jacinto_Help__section_header">Controls</div>
            <div className="Jacinto_Help__section_body">
              <div><span style={{ color: COLORS.accent }}>Movement:</span> WASD</div>
              <div><span style={{ color: COLORS.accent }}>Actions:</span> press the corresponding key or click the action in the side bar</div>
              <div><span style={{ color: COLORS.accent }}>Help:</span> press ?</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HelpContent;