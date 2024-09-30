import React from "react";
import CardBack from "../cardImages/cardBack";
import { Flex } from "antd";

interface Props {
  blindCards: number;
  bestCards: number;
}

const DownFacingCardDeck: React.FC<Props> = ({ bestCards, blindCards }) => {
  // Implement your component logic here

  return (
    <Flex justify="space-around" style={deckStyle}>
      {Array.from({ length: blindCards }).map((_, index) => {
        let style: React.CSSProperties = {
          ...cardStyle,
          left: (index - 1) * 4 + "em",
          zIndex: index,
        };

        return <CardBack key={index} style={style} />;
      })}

      {Array.from({ length: bestCards }).map((_, index) => {
        let style: React.CSSProperties = {
          ...cardStyle,
          left: ((index - 1) * 4) + 0.5 + "em",
          zIndex: index,
        };

        return <CardBack  key={index} style={style} />;
      })}
    </Flex>
  );
};

const deckStyle: React.CSSProperties = {
  position: "relative",
  width: "100%",
  height: "100%",
};

const cardStyle: React.CSSProperties = {
  position: "absolute",
  width: "100%",
  height: "100%",
};

export default DownFacingCardDeck;
