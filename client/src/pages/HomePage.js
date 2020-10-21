import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import image from "../img/3.jpg";
import { getAllGames } from "../redux/games/gamesActions";
import "../styles/content.scss";

const HomePage = () => {
  const dispatch = useDispatch();
  const { allGames } = useSelector((state) => state.games);
  useEffect(() => {
    dispatch(getAllGames())
  }, []);

  return (
    <main className="container">
      <div className="content">
        {allGames &&
          allGames.map((game) => (
            <button className="content__card-btn" key={game._id}>
              <Link
                to={`/selectedgame/${game._id}`}
                className="link"
              >
                <div className="link__card card">
                  <img
                    src={image}
                    className="card__picture"
                    alt={game.gameName}
                  />
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
    </main>
  );
};

export default HomePage;
