import { Flex } from "antd";
import React from "react";
import DiscardPile from "../discardPile/discardPile";
import Deck from "../deck/deck";
import { selectGameState } from "../../redux/gameState/gameStateSlice";
import { Five, Suit } from "../../models/card";

interface Props {
    style: React.CSSProperties;
}

const PlayArea: React.FC<Props> = ({ style }) => {
  const gameState = selectGameState();

  return (
    <Flex style={{...container, ...style}} justify="space-evenly">
      <DiscardPile cards={gameState.discardPile} lastCardsPlayed={gameState.lastCardsPlayed} />
      <Deck deckNumber={gameState.pickupDeckNumber} />
    </Flex>
  );
};

const container: React.CSSProperties = {
    width: '40vw',
    display: 'flex',
};

export default PlayArea;
