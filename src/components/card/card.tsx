import React from "react";
import { Card } from "../../models/card";

interface CardComponentProps {
  card: Card;
  style?: React.CSSProperties;
}

const CardComponent: React.FC<CardComponentProps> = ({
  style,
  card,
}: CardComponentProps) => {
  return card.render(style);
};

export default CardComponent;
