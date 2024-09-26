import React, { useCallback, useState } from "react";
import { Card } from "../../models/card";
import FaceUpCard from "../card/card";
import { selectGameState } from "../../redux/gameState/gameStateSlice";
import socket from "../../services/socket.io/socket.io";
import { SocketEvents } from "../../models/socketEvents";
import { BestCardSelection } from "../../models/bestCardSelection";
import { selectRoom } from "../../redux/roomState/roomStateSlice";
import { selectPlayerState } from "../../redux/playerState/playerStateSlice";
import DownFacingCardDeck from "../downFacingCardDeck/downFacingCardDeck";
import { Turn } from "../../models/turn";
import { every, uniqBy } from "lodash";
import { Nomination } from "../../models/nomination";
import { PickUpModel } from "../../models/pickUpModel";
import { Button, Flex } from "antd";

interface MyCardsProps {
  cards: Card[];
}

const MyCards: React.FC<MyCardsProps> = ({ cards }: MyCardsProps) => {
  let sortedCards = cards
    .slice()
    .sort((a: Card, b: Card) => a.getNumber() - b.getNumber());

  const gameState = selectGameState();
  const room = selectRoom();
  const playerState = selectPlayerState();

  const [selectedCardsIndexes, setSelectedCards] = useState<number[]>([]);

  const selectCard = useCallback(
    (index: number) => {
      let selectedCards = selectedCardsIndexes.slice();

      if (selectedCards.includes(index)) {
        selectedCards = selectedCards.filter((i) => i !== index);
        console.log("Selected cards: ", selectedCards);
        setSelectedCards(selectedCards);
        return;
      }

      if (gameState.cardSelectingState && selectedCardsIndexes.length >= 3) {
        return;
      }

      selectedCards.push(index);

      if (
        !gameState.cardSelectingState &&
        uniqBy(
          selectedCards.map((i) => sortedCards[i]),
          (c) => c.getNumber()
        ).length > 1
      ) {
        console.log("Not all cards are the same number");
        return;
      }

      console.log("Selected cards: ", selectedCards);
      setSelectedCards(selectedCards);
    },
    [gameState?.cardSelectingState, selectedCardsIndexes, sortedCards]
  );

 


  if (!playerState || !playerState.me) {
    return null;
  }

  return (
    <Flex vertical>
      <div>{gameState.getStatusMessage(playerState.me)}</div>
      <Flex vertical justify="center">
        <Flex style={deckStyle}>
          {sortedCards.map((card, index) => {
            let isSelected = selectedCardsIndexes.includes(index);
            let style: React.CSSProperties = {
              ...cardStyle,
              left: (index * 1.5) - ((sortedCards.length - 4) * 0.7) + 'em',
              zIndex: index,
              top: isSelected ? "10px" : "20px",
            };

            return (
              <div style={style} key={index} onClick={(e) => selectCard(index)}>
                <FaceUpCard card={card}></FaceUpCard>
              </div>
            );
          })}
        </Flex>
        <DownFacingCardDeck
          bestCards={playerState?.me?.bestCards?.length || 0}
          blindCards={playerState?.me?.blindCards || 0}
        />
      </Flex>
    </Flex>
  );
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

export default MyCards;
