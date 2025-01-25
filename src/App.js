import React, { useState, useEffect } from "react";
import './index.css';

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
  const [showPopUp, setShowPopUp] = useState(false);
  const [topScore, setTopScore] = useState(localStorage.getItem('topScore') || null);
  const [topTime, setTopTime] = useState(localStorage.getItem('topTime') || null);

  const backgrounds = [
    "bg-gradient-to-r from-blue-500 to-green-500",
    "bg-gradient-to-r from-yellow-400 to-red-500",
    "bg-gradient-to-r from-teal-500 to-purple-600",
    "bg-gradient-to-r from-pink-500 to-orange-500",
    "bg-gradient-to-r from-indigo-400 to-pink-600"
  ];

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
    if (flippedCards.length === 2 || matchedCards.includes(id) || !isRunning) return;

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
    setShowPopUp(false); 
    setCards(generateCards(gameMode));
  };

  const changeGameMode = (mode) => {
    setGameMode(mode);
    setIsRunning(false);
    setTime(0);
    setMoves(0);
    setMatchedCards([]);
    setShowPopUp(false); 
  };

  const changeBackground = () => {
    const randomBg = backgrounds[Math.floor(Math.random() * backgrounds.length)];
    setBackground(randomBg);
  };

  useEffect(() => {
    if (matchedCards.length === cards.length && isRunning) {
      setIsRunning(false);
      setShowPopUp(true); 

      if (topScore === null || moves < topScore) {
        setTopScore(moves);
        localStorage.setItem('topScore', moves);
      }
      if (topTime === null || time < topTime) {
        setTopTime(time);
        localStorage.setItem('topTime', time);
      }
    }
  }, [matchedCards, cards.length, isRunning, moves, time, topScore, topTime]);

  return (
    <div className={`${background} min-h-screen flex justify-center items-center p-4`}>
      <div className="flex flex-col space-y-8 w-full max-w-5xl  bg-white bg-opacity-40 backdrop-blur-lg p-4 rounded-lg">
        <div className="flex justify-between items-center">
          <h1 className="text-white text-3xl font-bold">Memory Game By Hicham AKIR</h1>
          <div className="text-white text-lg">
            <p>Moves: {moves}</p>
            <p>Time: {time} sec</p>
            {topScore !== null && <p>Top Score: {topScore} Moves</p>}
            {topTime !== null && <p>Top Time: {topTime} sec</p>}
          </div>
        </div>

        <div className="flex space-x-4">
          <div className="flex flex-col space-y-4 w-1/4 bg-opacity-90 p-4 rounded border-0 backdrop-blur-lg">
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
              onClick={changeBackground}
            >
              Change Background
            </button>
          </div>

          <div className="flex flex-wrap gap-4 justify-center w-3/4">
            {cards.map((card) => (
              <div
                key={card.id}
                className={`h-24 w-24 flex items-center justify-center rounded-lg shadow-lg cursor-pointer
                   bg-gray-800 text-white transition transform hover:scale-105 ${
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

        {showPopUp && (
          <div className="absolute inset-0 flex justify-center items-center bg-black bg-opacity-50" >
            <div className="bg-white p-8 rounded-lg text-center">
              <h2 className="text-xl font-semibold">Congratulations!</h2>
              <p className="mt-4">You completed the game in {moves} moves and {time} seconds.</p>
              <button
                className="bg-black text-white py-2 px-4 mt-4 rounded-lg hover:bg-gray-700 transition"
                onClick={startGame}
              >
                Play Again
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MemoryGame;
