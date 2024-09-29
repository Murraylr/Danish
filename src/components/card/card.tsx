import React from "react";
import { Card, CardType, newCard } from "../../models/card";

interface CardComponentProps {
  card: CardType;
  style?: React.CSSProperties;
}

const CardComponent: React.FC<CardComponentProps> = ({
  style,
  card,
}: CardComponentProps) => {
  let c = newCard(card);
  return c.render(style);
};

export default CardComponent;
