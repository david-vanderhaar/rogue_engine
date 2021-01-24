import React from 'react';
import * as _ from 'lodash';
import Tooltip from './Tooltip';

function ResourceBlock({ resource, superScript }) {
  return (
    <div className="ResourceBlock" style={{
      backgroundColor: resource.renderer.background,
      color: resource.renderer.color,
      borderColor: resource.renderer.color,
      fontFamily: 'scroll-o-script',
      width: superScript ? 'auto' : 20,
    }}>
      {`${superScript ? superScript + ' ' : ''}${resource.renderer.character}`}
    </div>
  )
}

class ActionBar extends React.Component {
  render() {
    return (  
      <div className="ActionBar">
        <div className="CharacterActions">
          {
            
            this.props.keymap && (
              Object.entries(this.props.keymap).map(([key, getAction], index) => {
                const action = getAction();
                const hidden = _.get(action, 'hidden', false);
                const color = key === 'Escape' ? 'amber darken-3' : 'grey darken-1';
                const reqs = action.listPayableResources();

                if (!hidden) {
                  return (
                    <Tooltip
                      key={`${index}-label`}
                      title={action.label}
                      text={action.label}
                    >
                      <div 
                        className="CharacterActions__item"
                        onClick={() => {
                          action.setAsNextAction();
                          if (!this.props.game.engine.isRunning) this.props.game.engine.start();
                          this.props.game.refocus();
                        }}
                      >
                        <div className="CharacterActions__item__label">
                          {action.label}
                        </div>
                        <div className="CharacterActions__item__content">
                          {key}
                        </div>
                        <div className="CharacterActions__item__resources">
                          {
                            reqs.map((req, i) => {
                              const numBlocks = req.getResourceCost();
                              return numBlocks > 0 && (
                                <ResourceBlock
                                  key={`${i}-${req.name}-resource-block`}
                                  superScript={numBlocks}
                                  resource={req}
                                />
                              )
                            })
                          }
                        </div>
                      </div>
                    </Tooltip>
                  )
                }
              })
            )
          }
        </div>
      </div>
    );
  }
}

export default ActionBar;