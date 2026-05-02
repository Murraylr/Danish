import React, { useMemo } from "react";
import CardBack from "../cardImages/cardBack";
import DownFacingCardDeck from "../downFacingCardDeck/downFacingCardDeck";
import { Flex } from "antd";
import { OtherPlayer } from "../../models/otherPlayer";
import { selectGameState } from "../../redux/gameState/gameStateSlice";
import useGameStateService from "../../hooks/useGameStateService/useGameStateService";

interface OpponentDeckProps {
  player: OtherPlayer;
}

const CARD_HEIGHT_EM = 4.8;
const CARD_ASPECT = 233 / 333;

const OpponentDeck: React.FC<OpponentDeckProps> = ({ player }) => {
  const gameState = selectGameState();
  const gameFunctions = useGameStateService();

  const isPlaying = gameState.gameStarted && gameFunctions.isPlayerTurn(player);

  let status: string;
  if (gameState.gameStarted) {
    status = isPlaying ? "Playing" : "";
  } else {
    status = player.isReady ? "Ready" : "Not Ready";
  }

  const fan = useMemo(() => {
    const remPx = 16;
    const cardWidthPx = CARD_HEIGHT_EM * CARD_ASPECT * remPx;
    const n = player.cardsHeld;
    const maxFanPx = 11 * remPx;
    const maxStep = cardWidthPx * 0.55;
    const minStep = 6;
    const fitStep = n > 1 ? (maxFanPx - cardWidthPx) / (n - 1) : 0;
    const step = Math.max(minStep, Math.min(maxStep, fitStep));
    const totalWidth = cardWidthPx + step * Math.max(n - 1, 0);
    return { cardWidthPx, step, totalWidth };
  }, [player.cardsHeld]);

  return (
    <div style={container}>
      <span className={`player-plate${isPlaying ? " active" : ""}`}>
        <span>{player.name}</span>
        {!!status && <span className="plate-status">{status}</span>}
      </span>

      <Flex justify="center" style={downCardContainer}>
        <DownFacingCardDeck
          bestCards={player.bestCards}
          blindCards={player.blindCards}
        />
      </Flex>

      <div style={handContainer}>
        <div
          style={{
            position: "relative",
            width: `${fan.totalWidth}px`,
            height: `${CARD_HEIGHT_EM}em`,
            maxWidth: "100%",
          }}
        >
          {Array.from({ length: player.cardsHeld }).map((_, index) => {
            const cardStyle: React.CSSProperties = {
              position: "absolute",
              width: `${fan.cardWidthPx}px`,
              aspectRatio: `${CARD_ASPECT}`,
              left: `${index * fan.step}px`,
              top: 0,
              borderRadius: "6px",
            };
            return <CardBack key={index} style={cardStyle} />;
          })}
        </div>
      </div>
    </div>
  );
};

const container: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "0.4em",
  flex: 1,
  minWidth: "10em",
  padding: "0.4em",
};

const downCardContainer: React.CSSProperties = {
  width: "100%",
  height: "5.5em",
};

const handContainer: React.CSSProperties = {
  width: "100%",
  display: "flex",
  justifyContent: "center",
  alignItems: "flex-start",
};

export default OpponentDeck;
