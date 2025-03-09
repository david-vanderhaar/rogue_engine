import React from 'react';

function HelpContent() {
  return (
    <div className='Cartridge_Help'>
      <div className="modal-content">
        <div className="row">
          <div className="col s12">
            <div className="Cartridge_Help__section_header">Goal</div>
            <div className="Cartridge_Help__section_body">
              Storm the enemies' defensive positions. Take cover, aim carefully. Take what supplies you can in the field. We will see you at the victory party.
              <span style={{ color: 'var(--color-accent)'}}>&nbsp;Good luck, soldier.</span>
            </div>
            <div className="Cartridge_Help__section_header">Hints</div>
            <div className="Cartridge_Help__section_body">
              <div style={{marginBottom: 8}}> Search the field for extra ammo and weapons.</div>
              <div style={{marginBottom: 8}}> Use cover to avoid enemy fire.</div>
              <div style={{marginBottom: 8}}> Red means dead. Watch for incoming mortar fire.</div>
              <div style={{marginBottom: 8}}> The enemy is dug in, using the trenches.</div>
              <div style={{marginBottom: 8}}> Be mindful of your <span style={{ color: 'var(--color-accent)'}}>&nbsp;status effects</span>.</div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col s12">
            <div className="Cartridge_Help__section_header">Controls</div>
            <div className="Cartridge_Help__section_body">
              <div>Movement: WASD</div>
              <div>Actions: click or key press</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HelpContent;