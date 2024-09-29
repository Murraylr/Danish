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
          style={{ ...cardStyle, left: index * 1, zIndex: index, top: 0, }}
        />
      ))}

    </Flex>
  );
};

const deckStyle: React.CSSProperties = {
  position: "relative",
  width: "10em",
  height: "27vh",
  margin: "1em",
};

const remainingCards: React.CSSProperties = {

};

const cardStyle: React.CSSProperties = {
  position: "absolute",
};

export default Deck;
