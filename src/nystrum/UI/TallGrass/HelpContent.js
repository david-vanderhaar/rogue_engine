import React from 'react';

function HelpContent() {
  return (
    <div className="Jacinto_Help">
      <div className="modal-content">
        <div className="row">
          <div className="col s12 m6">
            <div className="Jacinto_Help__section_header">Goal</div>
            <div className="Jacinto_Help__section_body">
              Navigate the night with you battery-powered lantern. Move field by field in search of
              <span style={{ color: '#6c71c4' }}>&nbsp;base camp components.</span> Once you arrive at base camp. Hold out until morning.
            </div>
          </div>
          <div className="col s12 m6">
            <div className="Jacinto_Help__section_header">Hints</div>
            <div className="Jacinto_Help__section_body">
              <div>Search the fields for old loot caches.</div><br/>
              <div>Drop batteries to boost your light sources.</div><br/>
              <div>Watch your fear meter. Keep your light bright.</div><br/>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col s12">
            <div className="Jacinto_Help__section_header">Controls</div>
            <div className="Jacinto_Help__section_body">
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