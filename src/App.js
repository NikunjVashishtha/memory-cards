import React, { useState, useEffect } from "react";
import "./App.css";
import Back from "./back.svg";
import Dog from "./dog.svg";
import Cat from "./cat.svg";
import Fish from "./fish.svg";
import Sheep from "./sheep.svg";
import Whale from "./whale.svg";
import Penguin from "./penguin.svg";

const Box = ({ value, id, isFlipped, isMatched, isChecking, onClick }) => {
  const handleBoxClick = () => {
    if (!isFlipped && !isMatched && !isChecking) {
      const element = document.getElementById(`card-${id}`);
      // eslint-disable-next-line no-unused-expressions
      if (element) element.offsetHeight;
      onClick(id);
    }
  };

  return (
    <div
      id={`card-${id}`}
      className={`bx ${isMatched ? "matched" : ""} ${isChecking ? "checking" : ""}`}
      onClick={handleBoxClick}
      style={{
        transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
        transition: "transform 0.6s",
      }}
    >
      <div className="back">
        <img src={Back} id="bIMG" alt="back_image" />
      </div>
      <div className="frnt">
        <img src={value} alt={`card-${id}`} className="card-content" />
        {isMatched && <div className="match-indicator"></div>}
      </div>
    </div>
  );
};

const shuffleArray = (array) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

function App() {
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [isChecking, setIsChecking] = useState(false);
  const [isPreview, setIsPreview] = useState(false);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [isGameReady, setIsGameReady] = useState(false);
  const [checkingCards, setCheckingCards] = useState([]);

  useEffect(() => {
    if (isGameReady) prepareGame();
  }, [isGameReady]);

  const prepareGame = () => {
    const items = [Fish, Dog, Cat, Sheep, Whale, Penguin];
    const pairItems = [...items, ...items];
    const shuffledItems = shuffleArray(pairItems);
    
    const newCards = shuffledItems.map((item, index) => ({
      id: index,
      value: item,
      isFlipped: true,
      isMatched: false
    }));
    
    setCards(newCards);
    setFlippedCards([]);
    setMatchedPairs(0);
    setIsPreview(true);
    setIsGameStarted(true);
    
    setTimeout(() => {
      const hiddenCards = newCards.map(card => ({...card, isFlipped: false}));
      setCards(hiddenCards);
      setIsPreview(false);
    }, 3000);
  };

  const startGame = () => setIsGameReady(true);

  const handleCardClick = (id) => {
    if (isPreview || isChecking || flippedCards.length >= 2) return;
    if (cards.find(card => card.id === id).isFlipped) return;

    const updatedCards = cards.map(card => 
      card.id === id ? { ...card, isFlipped: true } : card
    );
    setCards(updatedCards);
    
    const newFlippedCards = [...flippedCards, id];
    setFlippedCards(newFlippedCards);
    
    if (newFlippedCards.length === 2) {
      setIsChecking(true);
      setCheckingCards(newFlippedCards);
      
      setTimeout(() => {
        const card1 = cards.find(card => card.id === newFlippedCards[0]);
        const card2 = cards.find(card => card.id === newFlippedCards[1]);
        
        if (card1.value === card2.value) {
          const matchedCards = cards.map(card => 
            card.id === newFlippedCards[0] || card.id === newFlippedCards[1]
              ? { ...card, isMatched: true, isFlipped: true }
              : card
          );
          setCards(matchedCards);
          setMatchedPairs(prevMatches => prevMatches + 1);
        } else {
          const resetCards = cards.map(card => 
            card.id === newFlippedCards[0] || card.id === newFlippedCards[1]
              ? { ...card, isFlipped: false }
              : card
          );
          setCards(resetCards);
        }
        
        setFlippedCards([]);
        setCheckingCards([]);
        setIsChecking(false);
      }, 1000);
    }
  };
  
  const resetGame = () => {
    setIsGameReady(false);
    setIsGameStarted(false);
    setIsPreview(false);
    setCards([]);
    setFlippedCards([]);
    setMatchedPairs(0);
  };

  return (
    <div id="App">
      <div id="nav">
        SCORE: {matchedPairs}
        <button id="reset-btn" onClick={resetGame}>New Game</button>
      </div>
      <div className="game-container">
        {!isGameStarted && !isGameReady && (
          <div className="start-screen">
            <h2>Memory Card Game</h2>
            <p>Match pairs of cards to win!</p>
            <button id="start-btn" onClick={startGame}>Start Game</button>
          </div>
        )}
        
        {isPreview && isGameStarted && (
          <div className="preview-message">Memorize the cards!</div>
        )}
        
        {isGameStarted && (
          <div id="grid">
            {cards.map(card => (
              <Box
                key={card.id} 
                id={card.id}
                value={card.value} 
                isFlipped={card.isFlipped}
                isMatched={card.isMatched}
                isChecking={checkingCards.includes(card.id)}
                onClick={handleCardClick}
              />
            ))}
          </div>
        )}
        
        {matchedPairs === 6 && (
          <div className="win-message">You won! All pairs found!</div>
        )}
      </div>
    </div>
  );
}

export default App;