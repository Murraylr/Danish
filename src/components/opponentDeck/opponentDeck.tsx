import React from "react";
import CardBack from "../cardImages/cardBack";
import DownFacingCardDeck from "../downFacingCardDeck/downFacingCardDeck";
import { Flex } from "antd";
import { OtherPlayer } from "../../models/otherPlayer";
import { selectGameState } from "../../redux/gameState/gameStateSlice";

interface OpponentDeckProps {
  player: OtherPlayer
}

const OpponentDeck: React.FC<OpponentDeckProps> = ({
  player
}) => {
  const gameState = selectGameState();

  let status: string;
  if (gameState.gameStarted) {
    status = gameState.isPlayerTurn(player) ? "Playing" : "";
  } else {
    status = player.isReady ? "Ready" : "Not Ready";
  }

  return (
    <div style={container}>
      <h3 style={headerStyle}>{player.name} ({status})</h3>
      <DownFacingCardDeck bestCards={player.bestCards} blindCards={player.blindCards} />
      <Flex style={deckStyle}>
        {Array.from({ length: player.cardsHeld }).map((_, index) => {
          let style: React.CSSProperties = {
            ...cardStyle,
            left: index * 0.5 - (player.cardsHeld - 7) * 0.2 + "em",
            zIndex: index,
          };

          return <CardBack style={style} />;
        })}
      </Flex>
    </div>
  );
};

const headerStyle: React.CSSProperties = {
  marginTop: "0.3em",
  marginBottom: "0.3em",
};

const container: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  flexBasis: "min-content",
};

const deckStyle: React.CSSProperties = {
  position: "relative",
  width: "10em",
  height: "11.5em",
};

const cardStyle: React.CSSProperties = {
  position: "absolute",
  width: "7em",
};

export default OpponentDeck;
