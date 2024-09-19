import React from "react";
import { Card } from "../../models/card";

interface CardComponentProps {
  card: Card;
  style?: React.CSSProperties;
}

const CardComponent: React.FC<CardComponentProps> = ({
  card,
}: CardComponentProps) => {
  return card.render();
};

export default CardComponent;
