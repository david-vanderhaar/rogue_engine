import React from 'react';
import * as _ from 'lodash';
import { CARTRIDGE } from '../../../Nystrum';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
function InfoBlocks(props) {
  return (
    <ReactCSSTransitionGroup
      transitionName="fade"
      transitionAppear={true}
      transitionEnter={true}
      transitionLeave={true}
      transitionAppearTimeout={500}
      transitionEnterTimeout={500}
      transitionLeaveTimeout={300}
    >
      <div style={{bottom: 680, position: 'relative'}}>
        {
          _.map(_.get(props.game, 'mode.infoBlocks', {}), (value, key) => {
            return (
              <div
                key={key}
                style={{
                  color: CARTRIDGE.theme.accent,
                  backgroundColor: CARTRIDGE.theme.main,
                  padding: 8,
                  display: 'flex',
                  justifyContent: 'center',
                }}
              >
                <span
                  style={{
                    textAlign: 'left',
                    whiteSpace: 'pre-wrap',
                  }}
                >
                  {value.text}
                </span>
              </div>
            )
          })
        } 
      </div>
    </ReactCSSTransitionGroup>
  )
}

export default InfoBlocks;
