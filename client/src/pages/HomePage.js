import React from "react";
import image from "../img/3.jpg";
import "../styles/content.scss";

export const HomePage = () => {
  const games = [
    {
      gameName: "Some kind of game",
      genre: "Action",
      author: "Artificial Intelligence",
      price: "20",
      id: 1,
    },
    {
      gameName: "Some kind of game",
      genre: "Action",
      author: "Artificial Intelligence",
      price: "20",
      id: 2,
    },
    {
      gameName: "Some kind of game",
      genre: "Action",
      author: "Artificial Intelligence",
      price: "20",
      id: 3,
    },
    {
      gameName: "Some kind of game",
      genre: "Action",
      author: "Artificial Intelligence",
      price: "20",
      id: 4,
    },
    {
      gameName: "Some kind of game",
      genre: "Action",
      author: "Artificial Intelligence",
      price: "20",
      id: 5,
    },
    {
      gameName: "Some kind of game",
      genre: "Action",
      author: "Artificial Intelligence",
      price: "20",
      id: 6,
    },
    {
      gameName: "Some kind of game",
      genre: "Action",
      author: "Artificial Intelligence",
      price: "20",
      id: 7,
    },
    {
      gameName: "Some kind of game",
      genre: "Action",
      author: "Artificial Intelligence",
      price: "20",
      id: 8,
    },
  ];

  return (
    <main className="container">
      <div className="content">
        {games.map((game) => {
          return (
            <button className="content__card-btn" key={game.id}>
              <div className="content__card card">
                <img src={image} className="card__picture" />
                <div className="card_description">
                  <h2>{game.gameName}</h2>
                  <h3>{game.genre}</h3>
                  <h3>{game.author}</h3>
                  <p>{game.price} $</p>
                </div>
              </div>
            </button>
          );
        })}

        <div></div>
      </div>
    </main>
  );
};
