import React from "react";
import CardBack from "../cardImages/cardBack";
import DownFacingCardDeck from "../downFacingCardDeck/downFacingCardDeck";
import { Flex } from "antd";

interface OpponentDeckProps {
  opponentName: string;
  blindCards: number;
  bestCards: number;
  hand: number;
}

const OpponentDeck: React.FC<OpponentDeckProps> = ({
  opponentName,
  blindCards,
  bestCards,
  hand,
}) => {
  return (
    <div style={container}>
      <h3 style={headerStyle}>{opponentName}</h3>
      <DownFacingCardDeck bestCards={bestCards} blindCards={blindCards} />
      <Flex style={deckStyle}>
        {Array.from({ length: hand }).map((_, index) => {
          let style: React.CSSProperties = {
            ...cardStyle,
            left: index * 0.5 - (hand - 7) * 0.2 + "em",
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
