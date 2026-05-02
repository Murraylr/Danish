import { Flex } from "antd";
import React from "react";
import DiscardPile from "../discardPile/discardPile";
import Deck from "../deck/deck";
import { selectGameState } from "../../redux/gameState/gameStateSlice";

interface Props {
  style: React.CSSProperties;
}

const PlayArea: React.FC<Props> = ({ style }) => {
  const gameState = selectGameState();

  return (
    <Flex vertical justify="center" align="center" style={{ width: "100%" }}>
      <div style={{ ...table, ...style }}>
        <Flex
          justify="space-evenly"
          align="center"
          style={{ width: "100%", height: "100%" }}
        >
          <DiscardPile
            cards={gameState.bottomDiscardPile}
            lastCardsPlayed={gameState.lastCardsPlayed}
          />
          <Deck deckNumber={gameState.pickupDeckNumber} />
        </Flex>
      </div>
    </Flex>
  );
};

const table: React.CSSProperties = {
  display: "flex",
  width: "min(36em, 92%)",
  minHeight: "12em",
  padding: "1.4em 1.2em",
  borderRadius: "20px",
  background:
    "radial-gradient(ellipse at center, rgba(255,255,255,0.08) 0%, rgba(0,0,0,0.35) 100%)",
  border: "1px solid rgba(245, 210, 122, 0.4)",
  boxShadow:
    "0 0 0 4px rgba(0,0,0,0.25) inset, 0 8px 24px rgba(0,0,0,0.35)",
};

export default PlayArea;
