import React from "react";
import { Card, CardType, newCard } from "../../models/card";

interface CardComponentProps {
  card: CardType;
  style?: React.CSSProperties;
}

const innerStyle: React.CSSProperties = {
  width: "100%",
  height: "100%",
  display: "block",
};

const CardComponent: React.FC<CardComponentProps> = ({
  style,
  card,
}: CardComponentProps) => {
  let c = newCard(card);
  return (
    <div className="game-card" style={style}>
      {c.render(innerStyle)}
    </div>
  );
};

export default CardComponent;
