import React from 'react';
import * as _ from 'lodash';

function ResourceBlock({ resource, superScript, canPay }) {
  const character = resource.renderer.sprite ? resource.renderer.sprite : resource.renderer.character
  return (
    <div className="HiddenLeaf__ResourceBlock" style={{
      backgroundColor: canPay ? resource.renderer.color : '#616161',
      color: canPay ? resource.renderer.background : '#bdbdbd',
      borderColor: canPay ? resource.renderer.background : '#bdbdbd',
      // fontFamily: 'scroll-o-script',
      width: superScript ? 'auto' : 20,
    }}>
      {/* {`${superScript ? superScript + ' ' : ''}${character}`} */}
      {superScript}
    </div>
  )
}

const ActionMenu = ({keymap, game}) => {
  return (  
    <div className="HiddenLeaf__ActionMenu">
      <div className="HiddenLeaf__ActionMenu__Actions">
        {
          keymap && (
            Object.entries(keymap).map(([key, getAction], index) => {
              const action = getAction();
              const hidden = _.get(action, 'hidden', false);
              const renderer = _.get(action, 'renderer', null);
              const reqs = action.listPayableResources();

              if (!hidden) {
                return (
                  <div
                    key={`${index}-label`}
                    className="HiddenLeaf__ActionMenu__Actions__item"
                    onClick={() => {
                      action.setAsNextAction();
                      if (!game.engine.isRunning) game.engine.start();
                      game.refocus();
                    }}
                  >
                    <div className="HiddenLeaf__ActionMenu__Actions__item__label">
                      {key}
                    </div>
                    <div className="HiddenLeaf__ActionMenu__Actions__item__content" style={renderer && {
                      backgroundColor: renderer.background,
                      color: renderer.color,
                      borderColor: renderer.color,
                    }}>
                      {action.label}
                    </div>
                    <div className="HiddenLeaf__ActionMenu__Actions__item__resources">
                      {
                        reqs.map((req, i) => {
                          const numBlocks = req.getResourceCostDisplay();
                          return numBlocks > 0 && (
                            <ResourceBlock
                              key={`${i}-${req.name}-resource-block`}
                              superScript={numBlocks}
                              resource={req}
                              canPay={req.canPay}
                            />
                          )
                        })
                      }
                    </div>
                  </div>
                )
              }
            })
          )
        }
      </div>
    </div>
  );
}

export default ActionMenu;