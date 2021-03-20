import React, { useContext, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { Image } from "cloudinary-react";
import { getSelectedGameAuthor } from "../redux/gameAuthor/gameAuthorActions";
import { getAllGames } from "../redux/games/gamesActions";
import { DependenciesContext } from "../context/DependenciesContext";
import noImageAvailable from "../img/no-image-available.jpg";
import "../styles/selected-game-author.scss";

const SelectedGameAuthor = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const locationSplittedArray = location.pathname.split("/");
  const gameAuthorId = locationSplittedArray[locationSplittedArray.length - 1];

  useEffect(() => {
    dispatch(getSelectedGameAuthor(gameAuthorId));
    dispatch(getAllGames());
  }, [dispatch, gameAuthorId]);

  const { cloudName } = useContext(DependenciesContext);
  const { selectedGameAuthor } = useSelector((state) => state.gameAuthor);
  const { allGames } = useSelector((state) => state.games);

  const getGameId = (gameName, gameId) => {
    if (gameId) {
      return gameId;
    }

    let setGameId = "";
    allGames.forEach((game) => {
      if (game.gameName === gameName) {
        setGameId = game._id;
      }
    });
    return setGameId;
  };

  return (
    <>
      {selectedGameAuthor && (
        <div className="selected-game-author-container">
          <div className="game-name game-author-title-block">
            <h2 className="game-name__title game-author-title titles">{selectedGameAuthor?.authorName}</h2>
          </div>
          {selectedGameAuthor?.authorLogo ? (
            <Image
              cloudName={cloudName}
              publicId={selectedGameAuthor?.authorLogo}
              className="author-logo"
              alt="Author's Logo"
            />
          ) : (
            <img src={noImageAvailable} alt="No logo for author" className="author-logo"></img>
          )}
          <div className="selected-game-author-container__author-description-block">
            <div>
              <span className="default-text">
                <strong className="static-field default-text">Description:</strong>{" "}
                {selectedGameAuthor?.authorDescription}
              </span>
            </div>
            <div>
              <span className="default-text">
                <strong className="static-field default-text">Year of foundation of the company: </strong>
                {new Date(selectedGameAuthor?.yearOfFoundationOfTheCompany).getMonth() + 1}
                {"-"}
                {new Date(selectedGameAuthor?.yearOfFoundationOfTheCompany).getDate()}
                {"-"}
                {new Date(selectedGameAuthor?.yearOfFoundationOfTheCompany).getFullYear()}
              </span>
            </div>
          </div>
          <div className="game-links-container">
            {selectedGameAuthor?.authorsGames?.length &&
              selectedGameAuthor?.authorsGames?.map((game) => (
                <Link
                  to={`/selected-game/${getGameId(game.gameName, game._id)}`}
                  key={game.gameName}
                  className="game-links-container__game-link"
                >
                  <div className="orders__game game selected-author-game">
                    {game?.imgSource?.length ? (
                      <Image
                        cloudName={cloudName}
                        publicId={game.imgSource[0]}
                        className="game__picture"
                        alt={game.gameName}
                      />
                    ) : (
                      <img src={noImageAvailable} className="game__picture" alt={game.gameName} />
                    )}
                    <div className="game__text authors-game-text">
                      <p className="default-text">{game.gameName}</p>
                      <p className="default-text">{game.gameDescription}</p>
                      <p className="default-text">
                        {new Date(game.releaseDate).getMonth() + 1}
                        {"-"}
                        {new Date(game.releaseDate).getDate()}
                        {"-"}
                        {new Date(game.releaseDate).getFullYear()}
                      </p>
                      <p className="default-text">{game.genre}</p>
                    </div>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      )}
    </>
  );
};

export default SelectedGameAuthor;
