import React from "react";
import { Card, CardType } from "../../models/card";
import FaceUpCard from "../card/card";

interface DiscardPileProps {
  cards: CardType[];
  lastCardsPlayed: CardType[];
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
          left: index * 5 + 20 + cards.length,
          zIndex: cards.length + index,
        };
        return <FaceUpCard key={index} style={style} card={card}></FaceUpCard>;
      })}
    </div>
  );
};

const deckStyle: React.CSSProperties = {
  position: "relative",
  width: '100%',
  height:'100%',
  flex: 1,
};

const cardStyle: React.CSSProperties = {
  position: "absolute",
  minWidth: "7em",
};

export default DiscardPile;
