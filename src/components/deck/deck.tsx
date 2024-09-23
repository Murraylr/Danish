import { Flex } from "antd";
import React from "react";
import CardBack from "../cardImages/cardBack";

interface DeckProps {
  deckNumber: number;
}

const Deck: React.FC<DeckProps> = ({ deckNumber }) => {
  return (
    <Flex vertical justify="center" align="center">
      <Flex style={deckStyle}>
        {Array.from({ length: deckNumber }).map((_, index) => (
          <CardBack style={{ ...cardStyle, left: index * 1, zIndex: index }} />
        ))}
      </Flex>
      <span>Remaining cards: {deckNumber}</span>
    </Flex>
  );
};

const deckStyle: React.CSSProperties = {
  position: "relative",
  width: "10em",
  height: "33vh",
  margin: '1em',
};

const cardStyle: React.CSSProperties = {
  position: "absolute",
  width: "8em",
  height: "100%",
};

export default Deck;
