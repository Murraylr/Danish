import React from "react";
import { Card } from "../../models/card";
import FaceUpCard from "../card/card";

interface DiscardPileProps {
  cards: Card[];
  lastCardsPlayed: Card[];
}

const DiscardPile: React.FC<DiscardPileProps> = ({
  cards,
  lastCardsPlayed,
}) => {
  return (
    <div style={deckStyle}>
      {cards.map((card, index) => {
        let style: React.CSSProperties = {
          ...cardStyle,
          left: index * 1,
          zIndex: index,
        };
        return <FaceUpCard key={index} style={style} card={card}></FaceUpCard>;
      })}
      {lastCardsPlayed.map((card, index) => {
        let style: React.CSSProperties = {
          ...cardStyle,
          left: (index * 5) + 20,
          zIndex: cards.length + index,
        };
        return <FaceUpCard key={index} style={style} card={card}></FaceUpCard>;
      })}
    </div>
  );
};

const deckStyle: React.CSSProperties = {
  position: "relative",
  width: "10em",
  height: "33vh",
  margin: "1em",
};

const cardStyle: React.CSSProperties = {
  position: "absolute",
  width: "8em",
  height: "100%",
};

export default DiscardPile;
