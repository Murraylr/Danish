import React, { useCallback, useState } from "react";
import { Card, CardType, newCard } from "../../models/card";
import FaceUpCard from "../card/card";
import { selectGameState } from "../../redux/gameState/gameStateSlice";
import socket from "../../services/socket.io/socket.io";
import { SocketEvents } from "../../models/socketEvents";
import { BestCardSelection } from "../../models/bestCardSelection";
import { selectRoom } from "../../redux/roomState/roomStateSlice";
import { selectPlayerState } from "../../redux/playerState/playerStateSlice";
import DownFacingCardDeck from "../downFacingCardDeck/downFacingCardDeck";
import { Turn } from "../../models/turn";
import { every, uniq, uniqBy } from "lodash";
import { Nomination } from "../../models/nomination";
import { PickUpModel } from "../../models/pickUpModel";
import { Button, Flex } from "antd";
import Controls from "../controls/controls";
import useGameStateService from "../../hooks/useGameStateService/useGameStateService";
import useWindowDimensions from "../../hooks/useWindowDimensions/useWindowDimensions";

interface MyCardsProps {
  cards: readonly CardType[];
}

const MyCards: React.FC<MyCardsProps> = ({ cards }: MyCardsProps) => {
  let sortedCards = cards
    .map((c) => newCard(c))
    .sort((a: Card, b: Card) => a.getNumber() - b.getNumber());

  const gameState = selectGameState();
  const gameFunctions = useGameStateService();
  const playerState = selectPlayerState();
  const { height, width } = useWindowDimensions();

  const [selectedCardIndexes, setSelectedCardIndexes] = useState<number[]>([]);

  const selectCard = useCallback(
    (index: number) => {
      if (selectedCardIndexes.includes(index)) {
        setSelectedCardIndexes((indexes) => indexes.filter((i) => i !== index));
        return;
      }

      if (gameState.cardSelectingState && selectedCardIndexes.length >= 3) {
        return;
      }

      if (
        !gameState.cardSelectingState &&
        uniqBy([...selectedCardIndexes, index], (i) =>
          sortedCards[i].getNumber()
        ).length > 1
      ) {
        return;
      }

      setSelectedCardIndexes((indexes) => [...indexes, index]);
    },
    [gameState?.cardSelectingState, sortedCards]
  );

  if (!playerState || !playerState.me) {
    return null;
  }

  return (
    <Flex vertical style={{ height: "100%", width: '100%', textAlign: 'center' }}>
      <div>{gameFunctions.getStatusMessage(playerState.me)}</div>
      <Flex vertical justify="center" align="center" style={container}>
        <Controls
          bestCards={playerState.me.bestCards}
          selectedCards={selectedCardIndexes.map((index) => sortedCards[index])}
          onConfirm={() => setSelectedCardIndexes([])}
        />
        <Flex style={deckStyle} flex={2} vertical>
          {sortedCards.map((card, index) => {
            let isSelected = selectedCardIndexes.includes(index);
            let style: React.CSSProperties = {
              ...cardStyle,
              left: `calc(50% + ${((index) - ((sortedCards.length + 1) / 2 + (height / 400))) * 1.5}em)`,
              zIndex: index,
              top: isSelected ? "10px" : "20px",
            };

            return (
              <div style={style} key={index} onClick={(e) => selectCard(index)} >
                <FaceUpCard card={card}></FaceUpCard>
              </div>
            );
          })}
        </Flex>
        <Flex style={blindCardsContainer} flex={1}>
          <DownFacingCardDeck
            bestCards={playerState?.me?.bestCards?.length || 0}
            blindCards={playerState?.me?.blindCards || 0}
          />
        </Flex>
      </Flex>
    </Flex>
  );
};

const container: React.CSSProperties = {
  height: "100%",

};

const deckStyle: React.CSSProperties = {
  position: "relative",
  height: "100%",
  width: "100%",
  marginBottom: '2em'
};

const blindCardsContainer: React.CSSProperties = {
  width: "100%",
  height: "100%",
};

const cardStyle: React.CSSProperties = {
  position: "absolute",
  height: "100%",
};

export default MyCards;
