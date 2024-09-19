import { Flex } from "antd";
import React from "react";
import CardBack from "../cardImages/cardBack";

interface DeckProps {
  deckNumber: number;
}

const Deck: React.FC<DeckProps> = ({ deckNumber }) => {
  return (
    <Flex style={deckStyle}>
      {Array.from({ length: deckNumber }).map((_, index) => (
        <CardBack
          style={{
            gridArea: `1/1/2/2`,
            marginLeft: "2px",
          }}
        />
      ))}
    </Flex>
  );
};

const deckStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "5em 1fr",
  gridTemplateRows: "8em 1fr",
};

export default Deck;
