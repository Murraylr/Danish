import React from 'react';
import CardBack from '../cardImages/cardBack';

interface OtherPlayerCardsProps {
    cardamount: number;
}

const OtherPlayerCards: React.FC<OtherPlayerCardsProps> = ({ cardamount }) => {
    return (
        <div style={cardContainer}>
            {Array.from({ length: cardamount }).map((_, index) => (
                <div  key={index} style={{ ...cardStyle, left: index * 3 }} >
                <CardBack/>
                </div>
            ))}
        </div>
    );
};

const cardContainer: React.CSSProperties = {
    padding: '10px',
    backgroundColor: '#f5f5f5',
    marginBottom: '20px',
    position: 'relative',
    margin: 'auto'
};

const cardStyle: React.CSSProperties = {
    position: 'absolute',
    left: '0',
    maxHeight: '10em',
};

export default OtherPlayerCards;