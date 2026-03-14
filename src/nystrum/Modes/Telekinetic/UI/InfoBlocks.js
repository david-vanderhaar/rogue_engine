import React from 'react';
import * as _ from 'lodash';
import { CARTRIDGE } from '../../../Nystrum';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
export default function InfoBlocks(props) {
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
                  {parseMarkup(value.text)}
                </span>
              </div>
            )
          })
        } 
      </div>
    </ReactCSSTransitionGroup>
  )
}

export function parseMarkup(text) {
  const tokenRegex = /(<\/?[bc](?::[^>]+)?>)/g;

  const tokens = text.split(tokenRegex);

  const stack = [{ bold: false, color: null }];
  const output = [];

  tokens.forEach((token, i) => {
    if (token.startsWith("<")) {
      // closing tag
      if (token.startsWith("</")) {
        stack.pop();
      } 
      // opening tag
      else {
        const current = { ...stack[stack.length - 1] };

        if (token.startsWith("<b")) {
          current.bold = true;
        }

        if (token.startsWith("<c:")) {
          const color = token.match(/<c:([^>]+)>/)[1];
          current.color = color;
        }

        stack.push(current);
      }
    } else if (token) {
      const style = stack[stack.length - 1];

      output.push(
        <span
          key={i}
          style={{
            fontWeight: style.bold ? "bold" : "normal",
            color: style.color || "inherit",
          }}
        >
          {token}
        </span>
      );
    }
  });

  return output;
};
