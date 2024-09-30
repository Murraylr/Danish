import React from "react";
import CardBack from "../cardImages/cardBack";
import DownFacingCardDeck from "../downFacingCardDeck/downFacingCardDeck";
import { Flex } from "antd";
import { OtherPlayer } from "../../models/otherPlayer";
import { selectGameState } from "../../redux/gameState/gameStateSlice";
import useGameStateService from "../../hooks/useGameStateService/useGameStateService";

interface OpponentDeckProps {
  player: OtherPlayer;
}

const OpponentDeck: React.FC<OpponentDeckProps> = ({ player }) => {
  const gameState = selectGameState();
  const gameFunctions = useGameStateService();

  let status: string;
  if (gameState.gameStarted) {
    status = gameFunctions.isPlayerTurn(player) ? "Playing" : "";
  } else {
    status = player.isReady ? "Ready" : "Not Ready";
  }

  return (
    <div style={container}>
      <h3 style={headerStyle}>
        {player.name} {!!status ? `(${status})` : ""}
      </h3>
      <Flex style={downCardContainer} flex={1}>
        <DownFacingCardDeck
          bestCards={player.bestCards}
          blindCards={player.blindCards}
        />
      </Flex>
      <Flex style={deckStyle} flex={2}>
        {Array.from({ length: player.cardsHeld }).map((_, index) => {
          let style: React.CSSProperties = {
            ...cardStyle,
            left: (index + 1) * 0.7 - (player.cardsHeld / 2) * 0.7 + "em",
            zIndex: index,
          };

          return <CardBack key={index} style={style} />;
        })}
      </Flex>
    </div>
  );
};

const headerStyle: React.CSSProperties = {
  marginTop: "0.3em",
  marginBottom: "0.3em",
  width: "100%",
};

const container: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  flexBasis: "min-content",
  width: "100%",
  textAlign: "center",
};

const downCardContainer: React.CSSProperties = {
  width: "100%",
  height: "100%",
};

const deckStyle: React.CSSProperties = {
  position: "relative",
  height: "100%",
  width: "100%",
};

const cardStyle: React.CSSProperties = {
  position: "absolute",
  width: "100%",
  height: "100%",
};

export default OpponentDeck;
