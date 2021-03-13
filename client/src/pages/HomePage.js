import React, { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { Image } from "cloudinary-react";
import { useDispatch, useSelector } from "react-redux";
import { getAllGames } from "../redux/games/gamesActions";
import { getAllAuthors } from "../redux/gameAuthor/gameAuthorActions";
import { DependenciesContext } from "../context/DependenciesContext";
import noImageAvailable from "../img/no-image-available.jpg";
import "../styles/home-page.scss";

const Slider = ({ allGames, cloudName }) => {
  const sortedByRating = allGames;
  sortedByRating.sort((a, b) => b.rating - a.rating);

  return (
    <div className="home-page-slider">
      <h2 className="home-page-slider__title">Top 5 games by rating</h2>
      <div className="home-page-slides">
        {sortedByRating.map((game) => (
          <div className="home-page-slide" key={game._id}>
            <Link to={`/selected-game/${game._id}`} className="home-page-slide__link">
              <p className="home-page-slide__text-on-image">{game.gameName}</p>
              {game.imgSource.length ? (
                <Image
                  cloudName={cloudName}
                  publicId={game.imgSource[0]}
                  width="800"
                  height="450"
                  crop="scale"
                  alt={game.gameName}
                />
              ) : (
                <img src={noImageAvailable} width="800" height="450" alt={game.gameName}></img>
              )}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

const HomePage = () => {
  const dispatch = useDispatch();
  const { allGames, filteredGames } = useSelector((state) => state.games);
  const { cloudName } = useContext(DependenciesContext);

  useEffect(() => {
    dispatch(getAllGames());
    dispatch(getAllAuthors());
  }, [dispatch]);

  if (filteredGames.length && filteredGames[0] === "No matches found.") {
    return (
      <main>
        {allGames.length && <Slider allGames={allGames} cloudName={cloudName} />}
        <div className="content">
          <h2 className="content__no-matches-found">{filteredGames[0]}</h2>
        </div>
      </main>
    );
  }

  const discountCalculating = (game) => {
    let finalPrice = 0;

    if (game?.plannedDiscountEndsOn && game?.plannedDiscountStartsOn) {
      const startsOn = game.plannedDiscountStartsOn,
        endsOn = game.plannedDiscountEndsOn;
      if (Date.parse(startsOn) < Date.now() && Date.now() < Date.parse(endsOn)) {
        finalPrice =
          (game?.price * (1 - (game?.discount + game.plannedDiscount) / 100)).toFixed(2) > 0
            ? (game?.price * (1 - (game?.discount + game.plannedDiscount) / 100)).toFixed(2)
            : 0;
      } else {
        finalPrice =
          (game?.price * (1 - game?.discount / 100)).toFixed(2) > 0
            ? (game?.price * (1 - game?.discount / 100)).toFixed(2)
            : 0;
      }
    } else {
      finalPrice =
        (game?.price * (1 - game?.discount / 100)).toFixed(2) > 0
          ? (game?.price * (1 - game?.discount / 100)).toFixed(2)
          : 0;
    }

    return Boolean(+finalPrice < +game.price) ? `${finalPrice} $` : null;
  };

  return (
    <main>
      {allGames.length && <Slider allGames={allGames} cloudName={cloudName} />}
      {filteredGames.length && filteredGames[0] !== "No matches found." ? (
        <div className="content">
          {filteredGames &&
            filteredGames.map((game) => (
              <button className="content__card-btn" key={game._id}>
                <Link to={`/selected-game/${game._id}`} className="link">
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                  <div className="link__card card">
                    {game.imgSource.length ? (
                      <Image
                        cloudName={cloudName}
                        publicId={game.imgSource[0]}
                        className="card__picture"
                        alt={game.gameName}
                      />
                    ) : (
                      <img src={noImageAvailable} className="card__picture" alt={game.gameName} />
                    )}
                    <div>
                      <h2>{game.gameName}</h2>
                      <h3>{game.genre}</h3>
                      <h3>{game.author}</h3>
                      <div className="card__price-container price-container">
                        <p className={discountCalculating(game) ? "price-container__crossed-out-price" : ""}>
                          {game.price} $
                        </p>
                        <p className="price-container__price-with-discount">{discountCalculating(game)}</p>
                      </div>
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
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                  <div className="link__card card">
                    {game.imgSource.length ? (
                      <Image
                        cloudName={cloudName}
                        publicId={game.imgSource[0]}
                        className="card__picture"
                        alt={game.gameName}
                      />
                    ) : (
                      <img src={noImageAvailable} className="card__picture" alt={game.gameName} />
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
