import { useState, useEffect } from 'react';
import { GameStateService } from '../../services/gameStateService/gameStateService';
import { selectGameState } from '../../redux/gameState/gameStateSlice';

const useGameStateService = () => {
    const [gameStateService, setGameStateService] = useState<GameStateService>(new GameStateService(null));

    const gameState = selectGameState();

    useEffect(() => {
        if (gameState) {
            setGameStateService(new GameStateService(gameState));
        }
    }, [gameState]);

    return gameStateService;
};

export default useGameStateService;