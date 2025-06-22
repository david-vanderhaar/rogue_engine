// Tournament bracket logic utilities

// Pair participants into matches for a round
function pairParticipants(participants) {
  const pairs = [];
  for (let i = 0; i < participants.length; i += 2) {
    pairs.push({
      player1: participants[i],
      player2: participants[i + 1],
      winner: null,
      matchIndex: i / 2,
    });
  }
  return pairs;
}

// Create an empty round of matches
function createEmptyRound(numMatches) {
  return Array.from({ length: numMatches }, (_, i) => ({
    player1: null,
    player2: null,
    winner: null,
    matchIndex: i,
  }));
}

// Build the full bracket as an array of rounds
export function buildBracket(participants) {
  let arr = [...participants];
  if (arr.length % 2 !== 0) arr.push(null);
  const rounds = [pairParticipants(arr)];
  let matches = rounds[0].length;
  while (matches > 1) {
    rounds.push(createEmptyRound(Math.ceil(matches / 2)));
    matches = Math.ceil(matches / 2);
  }
  return rounds;
}

export function shuffle(array) {
  return array.slice().sort(() => Math.random() - 0.5);
}

// Get the opponent for the player in the current match
export function getCurrentOpponent({ bracket, currentRound, currentMatch, player }) {
  const match = bracket[currentRound][currentMatch];
  if (!match) return null;
  if (match.player1 && match.player1.name === player.name) return match.player2;
  if (match.player2 && match.player2.name === player.name) return match.player1;
  return null;
}

// Find the match index in a round where the player is present
function findPlayerMatchIndex(round, player) {
  return round.findIndex(
    m => (m.player1 && m.player1.name === player.name) || (m.player2 && m.player2.name === player.name)
  );
}

// Advance the tournament state by one round (returns new state)
export function advanceOneRound(state) {
  let newState;
  const { bracket, currentRound, currentMatch, player } = state;
  const newBracket = bracket.map(round => round.map(match => ({ ...match })));
  newBracket[currentRound][currentMatch].winner = player;
  newBracket[currentRound].forEach((m, idx) => {
    if (idx !== currentMatch && !m.winner) {
      const candidates = [m.player1, m.player2].filter(Boolean);
      if (candidates.length === 1) {
        m.winner = candidates[0];
      } else if (candidates.length === 2) {
        m.winner = candidates[Math.floor(Math.random() * 2)];
      } else {
        m.winner = null;
      }
    }
  });
  let nextRound = currentRound + 1;
  if (newBracket[nextRound]) {
    for (let i = 0; i < newBracket[nextRound].length; i++) {
      const prev1 = newBracket[currentRound][i * 2]?.winner;
      const prev2 = newBracket[currentRound][i * 2 + 1]?.winner;
      newBracket[nextRound][i].player1 = prev1 || null;
      newBracket[nextRound][i].player2 = prev2 || null;
    }
    // Always set currentMatch to the player's match in the next round
    const nextMatch = findPlayerMatchIndex(newBracket[nextRound], player);
    newState = {
      ...state,
      bracket: newBracket,
      currentRound: nextRound,
      currentMatch: nextMatch !== -1 ? nextMatch : 0,
    };
  } else {
    // If no next round, return updated bracket/state
    newState = {
      ...state,
      bracket: newBracket,
    };
  }

  return {
    ...newState,
    getCurrentOpponent: () => getCurrentOpponent(newState),
    advanceOneRound: () => advanceOneRound(newState),
  }
}

// Main tournament creation function
export function createTournament({ characters, selectedCharacter: player }) {
  const opponents = characters.filter(c => c.name !== player.name);
  const shuffledOpponents = shuffle(opponents);
  const insertAt = Math.floor(Math.random() * (shuffledOpponents.length + 1));
  const participants = [...shuffledOpponents];
  participants.splice(insertAt, 0, player);
  const bracket = buildBracket(participants);
  // Always set currentMatch to the player's match in the first round
  const currentRound = 0;
  const currentMatch = findPlayerMatchIndex(bracket[0], player);
  const state = {
    bracket,
    currentRound,
    currentMatch,
    active: 0,
    player,
    opponents,
    defeated: [],
  };
  return {
    ...state,
    getCurrentOpponent: () => getCurrentOpponent(state),
    advanceOneRound: () => advanceOneRound(state),
  };
}
