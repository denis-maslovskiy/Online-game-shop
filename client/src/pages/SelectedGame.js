import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import { getGameInfo, updateGameData } from "../redux/games/gamesActions";
import { addGameInTheBasket, getUserData } from "../redux/user/userActions";
import img1 from "../img/1.jpg";
import img2 from "../img/2.jpg";
import img3 from "../img/3.jpg";
import img4 from "../img/4.jpg";
import img5 from "../img/5.jpg";
import img6 from "../img/6.jpg";
import "../styles/selected-game.scss";
import "../styles/carousel.scss";

import Notification from "../components/Notification";
import {
  clearErrorMessage,
  clearSuccessMessage,
} from "../redux/notification/notificationActions";

const SelectedGame = (props) => {
  const [isReadyToDisplayGameInfo, setIsReadyToDisplayGameInfo] = useState(
    false
  );
  const [isPhysical, setIsPhysical] = useState(false);
  const [isDigital, setIsDigital] = useState(false);
  const [textFields, setTextFields] = useState([
    { title: "Game description: ", value: "", fieldName: "gameDescription" },
    { title: "Rating: ", value: 0, fieldName: "rating" },
    { title: "Release date: ", value: "", fieldName: "releaseDate" },
    { title: "Author: ", value: "", fieldName: "author" },
    { title: "Genre: ", value: "", fieldName: "genre" },
    { title: "Game Name: ", value: "", fieldName: "gameName" },
    {
      title: "Number Of Copies: ",
      value: "No physical copies",
      fieldName: "numberOfPhysicalCopies",
    },
  ]);
  const [gameData, setGameData] = useState(null);

  const history = useHistory();

  const {
    getGameInfo,
    getUserData,
    updateGameData,
    addGameInTheBasket,
    errorMsg,
    successMsg,
    clearErrorMessage,
    clearSuccessMessage,
  } = props;

  const gameId = window.location.href.split("/")[4];

  useEffect(() => {
    async function func() {
      const dataFromServer = await getGameInfo(gameId);
      setGameData(dataFromServer);

      textFields.map((item) => {
        return (item.value = dataFromServer[item.fieldName]);
      });
      setTextFields(textFields);
      setIsReadyToDisplayGameInfo(true);
      setIsDigital(dataFromServer.isDigital);
      setIsPhysical(dataFromServer.isPhysical);
    }
    func();
  }, [textFields, getGameInfo, gameId]);

  const addToCardButtonHandler = (gameType) => {
    clearSuccessMessage();
    clearErrorMessage();
    if (!!JSON.parse(localStorage.getItem("userData"))) {
      let userId = JSON.parse(localStorage.getItem("userData")).userId;
      const briefInformationAboutTheGame = {
        gameName: gameData.gameName,
        price: gameData.price,
        dateAddedToBasket: new Date(),
        gameId: gameData._id,
        gameType: gameType,
      };
      (async function () {
        const user = await getUserData(userId);
        user.gamesInTheBasket.push(briefInformationAboutTheGame);
        const response = await addGameInTheBasket(userId, user);
        if (response && gameData.isPhysical) {
          gameData.numberOfPhysicalCopies = gameData.numberOfPhysicalCopies - 1;
          await updateGameData(gameId, gameData);
          setGameData(gameData);
        }
      })();
    } else {
      history.push("/authorization");
    }
  };

  const arrayOfImgs = [
    { img: img1, id: "r1" },
    { img: img2, id: "r2" },
    { img: img3, id: "r3" },
    { img: img4, id: "r4" },
    { img: img5, id: "r5" },
    { img: img6, id: "r6" },
  ];

  return (
    <>
      {isReadyToDisplayGameInfo && (
        <div>
          <h2 className="game-name">{textFields[5].value}</h2>
        </div>
      )}
      <div className="slidershow middle">
        <div className="slides">
          {arrayOfImgs.map((item) => (
            <input type="radio" name="r" id={item.id} key={item.id} />
          ))}
          {arrayOfImgs.map((item, index) => {
            if (index === 0) {
              return (
                <div className="slide s1" key={item.id}>
                  <img src={item.img} alt="GameImage" />
                </div>
              );
            }
            return (
              <div className="slide" key={item.id}>
                <img src={item.img} alt="GameImage" />
              </div>
            );
          })}
        </div>
        <div className="navigation">
          {arrayOfImgs.map((item) => (
            <label htmlFor={item.id} className="bar" key={item.id} />
          ))}
        </div>
      </div>
      {errorMsg && <Notification values={{ errorMsg }} />}
      {successMsg && <Notification values={{ successMsg }} />}
      <div className="content-area">
        <div className="content-area__game-info game-info">
          {isReadyToDisplayGameInfo &&
            textFields.map((item) => (
              <div key={item.title}>
                <span className="game-info__text-field-title">
                  {item.title}
                </span>
                <p className="game-info__text-field-value">{item.value}</p>
              </div>
            ))}
        </div>
        <div className="content-area__buy-game buy-game">
          <div className="buy-game__digital-copy">
            <h2 className="buy-game__title">Digital Copy</h2>
            <h2 className="buy-game__price">Price</h2>
            {isDigital && (
              <button
                className="buy-game__button"
                onClick={() => addToCardButtonHandler("Digital")}
              >
                Add to card
              </button>
            )}
            {!isDigital && (
              <button className="buy-game__button--disable" disabled>
                Add to card
              </button>
            )}
          </div>
          <div className="buy-game__physical-copy">
            <h2 className="buy-game__title">Physical Copy</h2>
            <h2 className="buy-game__price">Price</h2>
            {isPhysical && (
              <button
                className="buy-game__button"
                onClick={() => addToCardButtonHandler("Physical")}
              >
                Add to card
              </button>
            )}
            {!isPhysical && (
              <button className="buy-game__button--disable" disabled>
                Add to card
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    errorMsg: state.notification.errorMsg,
    successMsg: state.notification.successMsg,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getGameInfo: (gameId) => dispatch(getGameInfo(gameId)),
    getUserData: (userId) => dispatch(getUserData(userId)),
    updateGameData: (userId, game) => dispatch(updateGameData(userId, game)),
    addGameInTheBasket: (userId, gameData) =>
      dispatch(addGameInTheBasket(userId, gameData)),
    clearErrorMessage: () => dispatch(clearErrorMessage()),
    clearSuccessMessage: () => dispatch(clearSuccessMessage()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SelectedGame);
