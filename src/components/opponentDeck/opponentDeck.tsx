import React from "react";
import CardBack from "../cardImages/cardBack";
import OtherPlayerCards from "../otherPlayerCards/otherPlayerCards";
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
      <Flex flex={0}>
        {Array.from({ length: hand }).map((_, index) => (
          <CardBack />
        ))}
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

const handStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "5em 1fr",
  gridTemplateRows: "8em 1fr",
};

const handCard: React.CSSProperties = {
  gridArea: "1/1/2/2",
};

export default OpponentDeck;
