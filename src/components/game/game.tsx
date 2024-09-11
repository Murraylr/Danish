import React from "react";
import { GameState } from "../../models/gameState";
import OtherPlayerCards from "../otherPlayerCards/otherPlayerCards";
import DiscardPile from "../discardPile/discardPile";
import MyCards from "../myCards/myCards";
import { PlayerState } from "../../models/playerUpdate";
import OpponentDeck from "../opponentDeck/opponentDeck";

interface Props {
  gameState: GameState;
  playerState: PlayerState;
}

const Game: React.FC<Props> = ({ gameState, playerState }) => {
  return (
    <>
      <div style={opponentsContainer}>
        {playerState.otherPlayers.map((player, index) => (
          <div style={opponentContainer}>
            <OpponentDeck
              opponentName={player.name}
              blindCards={player.blindCards}
              bestCards={player.bestCards}
              hand={player.cardsHeld}
            />
          </div>
        ))}
      </div>
      <div style={discardPileStyle}>
        <DiscardPile cards={gameState.discardPile} />
      </div>
      <MyCards cards={playerState.hand} />
    </>
  );
};

const discardPileStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "row",
  justifyContent: "center",
};

const opponentsContainer: React.CSSProperties = {
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-evenly",
};

const opponentContainer: React.CSSProperties = {
  maxWidth: "20em",
};

export default Game;
