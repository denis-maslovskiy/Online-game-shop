import React, { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { Image } from "cloudinary-react";
import { useDispatch, useSelector } from "react-redux";
import { getAllGames } from "../redux/games/gamesActions";
import { getAllAuthors } from "../redux/gameAuthor/gameAuthorActions";
import { DependenciesContext } from "../context/DependenciesContext";
import noImageAvailable from "../img/no-image-available.jpg";
import "../styles/content.scss";

const HomePage = () => {
  const dispatch = useDispatch();
  const { allGames, filteredGames } = useSelector((state) => state.games);
  const { cloudName } = useContext(DependenciesContext);

  useEffect(() => {
    dispatch(getAllGames());
    dispatch(getAllAuthors());
  }, []);

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
                    {game.imgSource.length ? (
                      <Image
                        cloudName={cloudName}
                        publicId={game.imgSource[0]}
                        className="card__picture"
                        alt={`${game.gameName} image`}
                      />
                    ) : (
                      <img
                        src={noImageAvailable}
                        className="card__picture"
                        alt={`No available image for ${game.gameName}`}
                      />
                    )}
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
                    {game.imgSource.length ? (
                      <Image
                        cloudName={cloudName}
                        publicId={game.imgSource[0]}
                        className="card__picture"
                        alt={`${game.gameName} image`}
                      />
                    ) : (
                      <img
                        src={noImageAvailable}
                        className="card__picture"
                        alt={`No available image for ${game.gameName}`}
                      />
                    )}
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
