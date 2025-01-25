import React, { useState, useEffect } from "react";
import "tailwindcss/tailwind.css";

const generateCards = (num) => {
  const cards = [];
  for (let i = 1; i <= num / 2; i++) {
    const value = `https://picsum.photos/seed/${i}/100`;
    cards.push({ id: Math.random(), value, matched: false, flipped: false });
    cards.push({ id: Math.random(), value, matched: false, flipped: false });
  }
  return cards.sort(() => Math.random() - 0.5);
};

const MemoryGame = () => {
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedCards, setMatchedCards] = useState([]);
  const [moves, setMoves] = useState(0);
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [gameMode, setGameMode] = useState(4);
  const [background, setBackground] = useState("bg-gradient-to-r from-orange-400 to-purple-600");

  useEffect(() => {
    setCards(generateCards(gameMode));
  }, [gameMode]);

  useEffect(() => {
    let timer;
    if (isRunning) {
      timer = setInterval(() => setTime((prev) => prev + 1), 1000);
    } else {
      clearInterval(timer);
    }
    return () => clearInterval(timer);
  }, [isRunning]);

  const handleCardClick = (id) => {
    if (flippedCards.length === 2 || matchedCards.includes(id)) return;

    const updatedCards = cards.map((card) =>
      card.id === id ? { ...card, flipped: true } : card
    );
    setCards(updatedCards);
    setFlippedCards((prev) => [...prev, id]);

    if (flippedCards.length === 1) {
      const firstCard = cards.find((card) => card.id === flippedCards[0]);
      const secondCard = cards.find((card) => card.id === id);

      if (firstCard.value === secondCard.value) {
        setMatchedCards((prev) => [...prev, firstCard.id, secondCard.id]);
      } else {
        setTimeout(() => {
          setCards((prevCards) =>
            prevCards.map((card) =>
              flippedCards.includes(card.id) || card.id === id
                ? { ...card, flipped: false }
                : card
            )
          );
        }, 1000);
      }
      setFlippedCards([]);
      setMoves((prev) => prev + 1);
    }
  };

  const startGame = () => {
    setIsRunning(true);
    setTime(0);
    setMoves(0);
    setMatchedCards([]);
    setCards(generateCards(gameMode));
  };

  const changeGameMode = (mode) => {
    setGameMode(mode);
    setIsRunning(false);
    setTime(0);
    setMoves(0);
    setMatchedCards([]);
  };

  const changeBackground = (bg) => {
    setBackground(bg);
  };

  useEffect(() => {
    if (matchedCards.length === cards.length && isRunning) {
      setIsRunning(false);
    }
  }, [matchedCards, cards.length, isRunning]);

  return (
    <div className={`${background} min-h-screen flex justify-center items-center p-4`}>
      <div className="flex flex-col space-y-8 w-full max-w-5xl">
        <div className="flex justify-between items-center">
          <h1 className="text-white text-3xl font-bold">Memory Game</h1>
          <div className="text-white text-lg">
            <p>Moves: {moves}</p>
            <p>Time: {time} sec</p>
          </div>
        </div>

        <div className="flex space-x-4">
          <div className="flex flex-col space-y-4 w-1/4">
            <button
              className="bg-black text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition"
              onClick={startGame}
            >
              Start Game
            </button>
            <button
              className="bg-gray-900 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition"
              onClick={() => changeGameMode(4)}
            >
              4 Cards
            </button>
            <button
              className="bg-gray-900 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition"
              onClick={() => changeGameMode(16)}
            >
              16 Cards
            </button>
            <button
              className="bg-gray-900 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition"
              onClick={() => changeGameMode(32)}
            >
              32 Cards
            </button>
            <button
              className="bg-gray-900 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition"
              onClick={() => changeBackground("bg-gradient-to-r from-blue-500 to-green-500")}
            >
              Change Background
            </button>
          </div>

          <div
            className={`grid grid-cols-${Math.sqrt(gameMode)} gap-4 bg-white p-4 rounded-md shadow-md w-3/4`}
          >
            {cards.map((card) => (
              <div
                key={card.id}
                className={`h-24 flex items-center justify-center rounded-lg shadow-lg cursor-pointer bg-gray-800 text-white transition transform hover:scale-105 ${
                  card.flipped || matchedCards.includes(card.id) ? "bg-white" : ""
                }`}
                onClick={() => handleCardClick(card.id)}
              >
                {card.flipped || matchedCards.includes(card.id) ? (
                  <img src={card.value} alt="card" className="h-16 w-16" />
                ) : (
                  "?"
                )}
              </div>
            ))}
          </div>
        </div>

        {matchedCards.length === cards.length && (
          <div className="text-center text-white text-xl font-semibold mt-4">
            Congratulations! You completed the game in {moves} moves and {time} seconds.
          </div>
        )}
      </div>
    </div>
  );
};

export default MemoryGame;
