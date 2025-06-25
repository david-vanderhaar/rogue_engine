import React from 'react';
import { OpponentCard } from './OpponentCard';

export function Bracket({ bracket, currentRound, currentMatch, player, isCurrentMatch, isDefeated }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'flex-start', gap: 32 }}>
      {bracket.map((round, roundIdx) => (
        <div key={roundIdx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 32 }}>
          <div style={{ fontWeight: 'bold', marginBottom: 8 }}>Round {roundIdx + 1}</div>
          {round.map((match, matchIdx) => (
            <BracketMatch
              key={matchIdx}
              match={match}
              roundIdx={roundIdx}
              matchIdx={matchIdx}
              player={player}
              isCurrent={isCurrentMatch(roundIdx, matchIdx)}
              isDefeated={isDefeated(roundIdx, matchIdx)}
            />
          ))}
        </div>
      ))}
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
    background: character && character.renderer ? character.renderer.background : '#222',
    color: character && character.renderer ? character.renderer.color : '#eee',
    border: isCurrent ? '3px solid var(--color-secondary)' : isDefeated ? '2px dashed #888' : '2px solid #444',
    borderRadius: 5,
    boxShadow: isCurrent ? '0 0 8px var(--color-secondary)' : 'none',
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
