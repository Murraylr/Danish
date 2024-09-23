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

  const playTurn = useCallback(
    (cards: Card[]) => {
      let turn: Turn = {
        cards,
        playerId: playerState.me.playerId,
        room: room,
      };
      socket.emit(SocketEvents.PlayCard, turn);
    },
    [playerState?.me?.playerId, room]
  );

  const selectBestCards = useCallback(
    (cards: Card[]) => {
      let cardSelect: BestCardSelection = {
        cards,
        playerId: playerState.me.playerId,
        roomName: room.roomName,
      };
      socket.emit(SocketEvents.SelectBestCard, cardSelect);
    },
    [playerState?.me?.playerId, room?.roomName]
  );

  const onClick = useCallback(() => {
    let selectedCards: Card[] = sortedCards.filter((card, index) =>
      selectedCardsIndexes.includes(index)
    );

    setSelectedCards([]);

    if (gameState.cardSelectingState) {
      selectBestCards(selectedCards);
    } else {
      playTurn(selectedCards);
    }
  }, [
    gameState?.cardSelectingState,
    playTurn,
    selectBestCards,
    selectedCardsIndexes,
    sortedCards,
  ]);

  const pickUp = useCallback(() => {
    let pickupModel: PickUpModel = {
      playerId: playerState.me.playerId,
      roomName: room.roomName,
    };
    socket.emit(SocketEvents.PickUp, pickupModel);
  }, [playerState?.me?.playerId, room?.roomName]);

  if (!playerState || !playerState.me) {
    return null;
  }

  return (
    <Flex vertical>
      <div>{gameState.getStatusMessage(playerState.me)}</div>
      {!playerState.isNominating && (
        <Button type="primary" onClick={onClick}>
          Confirm Selection
        </Button>
      )}
      <Flex>
        {gameState.discardPile.length > 0 && (
          <Button onClick={pickUp} danger>
            Pickup
          </Button>
        )}
        {playerState.isNominating && (
          <div>
            {gameState.players.map((p) => {
              let nomination: Nomination = {
                nominatedPlayerId: p?.playerId,
                playerId: playerState?.me?.playerId,
                roomName: room?.roomName,
              };
              return (
                <button
                  onClick={() =>
                    socket.emit(SocketEvents.SelectNomination, nomination)
                  }
                >
                  {p.name}
                </button>
              );
            })}
          </div>
        )}
      </Flex>
      <Flex vertical justify="center">
        <Flex style={deckStyle}>
          {sortedCards.map((card, index) => {
            let isSelected = selectedCardsIndexes.includes(index);
            let style: React.CSSProperties = {
              ...cardStyle,
              left: (index * 1.5) - ((sortedCards.length - 4) * 0.5) + 'em',
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
