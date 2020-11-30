import React from 'react';
import Button from './Button';
import * as _ from 'lodash';

class Keymap extends React.Component {
  render() {
    return (  
      <div className="Keymap UI">
        <div className='flow-text center'>Keymap</div>
        {
          
          this.props.keymap && (
            Object.entries(this.props.keymap).map(([key, value], index) => {
              const hidden = value.hasOwnProperty('hidden') ? value.hidden : false;
              const color = key === 'Escape' ? 'amber darken-3' : 'grey darken-1';
              const action = _.get(value, 'action', null);
              // const reqs = action.getRequiredResources();
              const reqs = action.listPayableResources();

              if (!hidden) {
                return (
                  <Button 
                    key={index}
                    onClick={() => {
                        value.activate({action});
                        if (!this.props.game.engine.isRunning) this.props.game.engine.start();
                        this.props.refocus();
                      } 
                    }
                    color={color}
                  >
                    {key} {value.label} {reqs.map((req) => `${req.canPay} ${req.name}`)}
                  </Button>
                )
              }
            })
          )
        }
      </div>
    );
  }
}

export default Keymap;