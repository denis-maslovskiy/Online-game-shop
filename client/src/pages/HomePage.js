import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import image from "../img/3.jpg";
import { getAllGames } from "../redux/games/gamesActions";
import { getAllAuthors } from "../redux/gameAuthor/gameAuthorActions";
import "../styles/content.scss";

const HomePage = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getAllGames());
    dispatch(getAllAuthors());
  }, []);

  const { allGames, filteredGames } = useSelector((state) => state.games);

  if (filteredGames.length && filteredGames[0] === "No matches found.") {
    return (
      <main className="container">
        <div className="content">
          <h2>{filteredGames[0]}</h2>
        </div>
      </main>
    );
  }

  return (
    <main className="container">
      {filteredGames.length && filteredGames[0] !== "No matches found." ? (
        <div className="content">
          {filteredGames &&
            filteredGames.map((game) => (
              <button className="content__card-btn" key={game._id}>
                <Link to={`/selected-game/${game._id}`} className="link">
                  <div className="link__card card">
                    <img src={image} className="card__picture" alt={game.gameName} />
                    <div className="card_description">
                      <h2>{game.gameName}</h2>
                      <h3>{game.genre}</h3>
                      <h3>{game.author}</h3>
                      <p>{game.price} $</p>
                    </div>
                  </div>
                </Link>
              </button>
            ))}
        </div>
      ) : (
        <div className="content">
          {allGames &&
            allGames.map((game) => (
              <button className="content__card-btn" key={game._id}>
                <Link to={`/selected-game/${game._id}`} className="link">
                  <div className="link__card card">
                    <img src={image} className="card__picture" alt={game.gameName} />
                    <div className="card_description">
                      <h2>{game.gameName}</h2>
                      <h3>{game.genre}</h3>
                      <h3>{game.author}</h3>
                      <p>{game.price} $</p>
                    </div>
                  </div>
                </Link>
              </button>
            ))}
        </div>
      )}
    </main>
  );
};

export default HomePage;
