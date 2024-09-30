import { Flex } from "antd";
import React from "react";
import CardBack from "../cardImages/cardBack";

interface DeckProps {
  deckNumber: number;
}

const Deck: React.FC<DeckProps> = ({ deckNumber }) => {
  return (
    <Flex style={deckStyle} vertical justify="flex-end">
      {Array.from({ length: deckNumber }).map((_, index) => (
        <CardBack
          key={index}
          style={{ ...cardStyle, left: index * 1, zIndex: index, top: 0 }}
        />
      ))}
    </Flex>
  );
};

const deckStyle: React.CSSProperties = {
  position: "relative",
  width: "100%",
  height: "100%",
  flex: 1,
};

const remainingCards: React.CSSProperties = {};

const cardStyle: React.CSSProperties = {
  position: "absolute",
  width: "100%",
  height: "100%",
};

export default Deck;
