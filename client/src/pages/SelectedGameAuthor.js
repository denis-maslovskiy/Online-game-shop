import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Image } from "cloudinary-react";
import { getSelectedGameAuthor } from "../redux/gameAuthor/gameAuthorActions";
import { getAllGames } from "../redux/games/gamesActions";

const SelectedGameAuthor = () => {
  const dispatch = useDispatch();
  const hrefSplittedArray = window.location.href.split("/");
  const gameAuthorId = hrefSplittedArray[hrefSplittedArray.length - 1];

  useEffect(() => {
    dispatch(getSelectedGameAuthor(gameAuthorId));
    dispatch(getAllGames());
  }, []);

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
      {selectedGameAuthor?.authorLogo && (
        <Image cloudName="dgefehkt9" publicId={selectedGameAuthor?.authorLogo} width="300" />
      )}
      {selectedGameAuthor?.authorsGames?.length &&
        selectedGameAuthor?.authorsGames?.map((game) => {
          return (
            <div key={game.gameName}>
              <p>{game.gameName}</p>
              <p>{game.gameDescription}</p>
              <p>{game.releaseDate}</p>
              <p>{game.genre}</p>
              <Link to={`/selected-game/${getGameId(game.gameName, game._id)}`}>Game Link</Link>
            </div>
          );
        })}
    </>
  );
};

export default SelectedGameAuthor;
