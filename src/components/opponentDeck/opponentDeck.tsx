import React from "react";
import CardBack from "../cardImages/cardBack";
import OtherPlayerCards from "../otherPlayerCards/otherPlayerCards";
import DownFacingCardDeck from "../downFacingCardDeck/downFacingCardDeck";

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
      <h3>{opponentName}</h3>
      <DownFacingCardDeck bestCards={bestCards} blindCards={blindCards} />
      <div style={handStyle}>
        {Array.from({ length: hand }).map((_, index) => (
          <div key={index} style={{ ...handCard, left: 3 * index }}>
            <CardBack />
          </div>
        ))}
      </div>
    </div>
  );
};

const container: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
};

const handStyle: React.CSSProperties = {
  position: "relative",
  minHeight: "15em",
  minWidth: "10em",
};

const handCard: React.CSSProperties = {
  position: "absolute",
};

export default OpponentDeck;
