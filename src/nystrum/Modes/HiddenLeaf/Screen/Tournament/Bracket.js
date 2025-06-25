import React, { useRef, useLayoutEffect, useState } from 'react';
import { OpponentCard } from './OpponentCard';

// Helper to determine winner for a match
function getWinner(match) {
  return match && match.winner ? match.winner : null;
}

// Helper to get the bounding rectangle of a DOM element relative to a container
function getElementRectRelative(el, container) {
  if (!el || !container) return { left: 0, top: 0, width: 0, height: 0 };
  const elRect = el.getBoundingClientRect();
  const containerRect = container.getBoundingClientRect();
  return {
    left: elRect.left - containerRect.left + container.scrollLeft,
    top: elRect.top - containerRect.top + container.scrollTop,
    width: elRect.width,
    height: elRect.height,
  };
}

export function Bracket({ bracket, currentRound, currentMatch, player, isCurrentMatch, isDefeated }) {
  // Refs for each match card and the container
  const matchRefs = useRef([]);
  const containerRef = useRef(null);
  const [lines, setLines] = useState([]);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

  // Calculate lines after render
  useLayoutEffect(() => {
    if (!containerRef.current) return;
    // Use scrollWidth/scrollHeight to cover all content, not just visible area
    const width = containerRef.current.scrollWidth;
    const height = containerRef.current.scrollHeight;
    setContainerSize({ width, height });
    // Get all match card rects relative to container
    const rects = bracket.map((round, roundIdx) =>
      round.map((_, matchIdx) => {
        const ref = matchRefs.current?.[`${roundIdx}-${matchIdx}`];
        return getElementRectRelative(ref, containerRef.current);
      })
    );
    // Build bracket lines
    const newLines = [];
    for (let roundIdx = 0; roundIdx < bracket.length - 1; roundIdx++) {
      const round = bracket[roundIdx];
      const nextRound = bracket[roundIdx + 1];
      for (let matchIdx = 0; matchIdx < round.length; matchIdx++) {
        const match = round[matchIdx];
        const winner = getWinner(match);
        const rect = rects[roundIdx][matchIdx];
        if (!rect) continue;
        const y1 = rect.top + rect.height / 4;
        const y2 = rect.top + (3 * rect.height) / 4;
        const xStart = rect.left + rect.width;
        const xJoin = xStart + 24;
        const yJoin = (y1 + y2) / 2;
        let xNext = null, yNext = null;
        let winnerColor = null;
        if (winner) {
          const winnerIdx = nextRound.findIndex(
            m => (m.player1 && m.player1.name === winner.name) || (m.player2 && m.player2.name === winner.name)
          );
          if (winnerIdx !== -1) {
            const nextRect = rects[roundIdx + 1][winnerIdx];
            if (nextRect) {
              xNext = nextRect.left;
              yNext = nextRect.top + nextRect.height / 2;
            }
          }

          // Use winner's custom color if available
          winnerColor = winner.basicInfo.renderer?.background || 'var(--color-secondary)';
        }
        // Style for winner/loser
        let color = winnerColor || 'var(--color-accent)';
        let opacity = 0.3;
        if (winner && xNext !== null && yNext !== null) {
          color = winnerColor;
          opacity = 1;
        }
        // Horizontal from player1 card to join
        newLines.push({ x1: xStart, y1: y1, x2: xJoin, y2: y1, color, opacity });
        // Horizontal from player2 card to join
        newLines.push({ x1: xStart, y1: y2, x2: xJoin, y2: y2, color, opacity });
        // Vertical join
        newLines.push({ x1: xJoin, y1: y1, x2: xJoin, y2: y2, color, opacity });
        // Now, for the winner, draw a polyline with two 90-degree turns:
        // 1. From join point, horizontal to a midX (between join and next card)
        // 2. Vertical to yNext
        // 3. Horizontal to xNext (left edge of winner's card)
        if (xNext !== null && yNext !== null) {
          const midX = xJoin + (xNext - xJoin) * 0.5;
          // Horizontal from join to midX at yJoin
          newLines.push({ x1: xJoin, y1: yJoin, x2: midX, y2: yJoin, color, opacity });
          // Vertical from (midX, yJoin) to (midX, yNext)
          newLines.push({ x1: midX, y1: yJoin, x2: midX, y2: yNext, color, opacity });
          // Horizontal from (midX, yNext) to (xNext, yNext)
          newLines.push({ x1: midX, y1: yNext, x2: xNext, y2: yNext, color, opacity });
        }
      }
    }
    setLines(newLines);
  }, [bracket]);

  // Render SVG lines behind the bracket grid, sized to the scrollable container
  return (
    <div ref={containerRef} style={{ position: 'relative', overflow: 'hidden' }}>
      <svg
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: containerSize.width,
          height: containerSize.height,
          pointerEvents: 'none',
          zIndex: 0,
        }}
        width={containerSize.width}
        height={containerSize.height}
      >
        {lines.map((line, i) => (
          <line
            key={i}
            x1={line.x1}
            y1={line.y1}
            x2={line.x2}
            y2={line.y2}
            stroke={line.color}
            strokeWidth={4}
            opacity={line.opacity}
            style={{ transition: 'all 0.2s' }}
          />
        ))}
      </svg>
      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'flex-start', gap: 60, position: 'relative', zIndex: 1 }}>
        {bracket.map((round, roundIdx) => (
          <div key={roundIdx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 32 }}>
            <div style={{ fontWeight: 'bold', marginBottom: 8 }}>Round {roundIdx + 1}</div>
            {round.map((match, matchIdx) => (
              <div
                key={matchIdx}
                ref={el => {
                  if (!matchRefs.current) matchRefs.current = {};
                  matchRefs.current[`${roundIdx}-${matchIdx}`] = el;
                }}
                style={{ position: 'relative', zIndex: 2 }}
              >
                <BracketMatch
                  match={match}
                  roundIdx={roundIdx}
                  matchIdx={matchIdx}
                  player={player}
                  isCurrent={isCurrentMatch(roundIdx, matchIdx)}
                  isDefeated={isDefeated(roundIdx, matchIdx)}
                />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function BracketMatch({ match, roundIdx, matchIdx, player, isCurrent, isDefeated }) {
  const cardClass = () => {
    if (isCurrent) return 'animated-border';
    if (isDefeated) return 'blinking-border';
    return '';
  };
  const cardStyle = (character) => ({
    opacity: character ? 1 : 0.3,
    filter: isDefeated ? 'grayscale(100%)' : isCurrent ? 'none' : 'grayscale(60%)',
    margin: 2,
    minWidth: 120,
    minHeight: 60,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: character && character.renderer ? character.renderer.background : '#222',
    color: character && character.renderer ? character.renderer.color : '#eee',
    border: isCurrent ? '3px solid var(--color-secondary)' : isDefeated ? '2px dashed #888' : '2px solid #444',
    borderRadius: 5,
    fontWeight: isCurrent ? 'bold' : 'normal',
    boxShadow: isCurrent ? '0 0 8px var(--color-secondary)' : 'none',
    position: 'relative',
    transition: 'all 0.2s',
  });
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, position: 'relative' }}>
      <div className={`bracket-card ${cardClass()}`} style={cardStyle(match.player1)}>
        {match.player1 ? (
          <OpponentCard character={match.player1.basicInfo || match.player1} animated={isCurrent && match.player1 && match.player1.name === player.name} />
        ) : <span>BYE</span>}
      </div>
      <div style={{ height: 8 }} />
      <div className={`bracket-card ${cardClass()}`} style={cardStyle(match.player2)}>
        {match.player2 ? (
          <OpponentCard character={match.player2.basicInfo || match.player2} animated={isCurrent && match.player2 && match.player2.name === player.name} />
        ) : <span>BYE</span>}
      </div>
    </div>
  );
}
