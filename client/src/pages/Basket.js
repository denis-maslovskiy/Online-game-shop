import React, { useState, useEffect } from "react";
import ClearIcon from "@material-ui/icons/Clear";
import { connect } from "react-redux";
import Notification from "../components/Notification";
import {
  getUserData,
  updateTheBasket,
  purchaseGame,
} from "../redux/user/userActions";
import {
  clearInfoMessage,
  clearSuccessMessage,
} from "../redux/notification/notificationActions";
import { updateGameData } from "../redux/games/gamesActions";
import { getGameInfo } from "../helpers/gameHelpers";
import image from "../img/3.jpg";
import "../styles/basket.scss";

const Timer = ({ removeGameHandler, gameName, dateAddedToBasket }) => {
  let [time, setTime] = useState(
    900 - Math.floor((Date.now() - Date.parse(dateAddedToBasket)) / 1000)
  );
  
  const getMinutes = () => {
    return ("0" + Math.floor((time % 3600) / 60)).slice(-2);
  };

  const getSeconds = () => {
    return ("0" + (time % 60)).slice(-2);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      time > 0 ? setTime((time = time - 1)) :  removeGameHandler(gameName)
    }, 1000);
    return () => clearInterval(timer);
  }, [time]);

  return (
    <div className="timer">
      {getMinutes()} : {getSeconds()}
    </div>
  );
};

const ItemsInBasketList = ({ itemsInBasket, removeGameHandler }) => {
  return (
    <>
      {itemsInBasket.map((item) => {
        return (
          <div className="order__game game" key={item.dateAddedToBasket}>
            <img className="game__picture" src={image} alt={item.gameName} />
            <div className="game__text">
              <span>{item.gameName}</span>
              <span>{item.price} $</span>
            </div>
            <button
              className="remove-game"
              onClick={() => removeGameHandler(item.gameName)}
            >
              <ClearIcon />
            </button>
            <div>
              {item.gameType === "Physical" && (
                <Timer
                  removeGameHandler={removeGameHandler}
                  gameName={item.gameName}
                  dateAddedToBasket={item.dateAddedToBasket}
                />
              )}
            </div>
          </div>
        );
      })}
    </>
  );
};

const Basket = (props) => {
  const [itemsInBasket, setItemsInBasket] = useState([]);

  const {
    getUserData,
    purchaseGame,
    infoMsg,
    successMsg,
    clearInfoMessage,
    clearSuccessMessage,
    updateTheBasket,
    updateGameData,
  } = props;
  let userId = JSON.parse(localStorage.getItem("userData")).userId;

  const removeGameHandler = async (gameName) => {
    try {
      clearInfoMessage();
      const newBasket = itemsInBasket.filter((item) => item.gameName !== gameName);
      setItemsInBasket(newBasket);
      const user = await getUserData(userId);
      user.gamesInTheBasket = newBasket;
      await updateTheBasket(userId, user);

      const gameId = itemsInBasket.filter((item) => item.gameName === gameName)[0].gameId;
      const gameType = itemsInBasket.filter((item) => item.gameName === gameName)[0].gameType;
      const game = await getGameInfo(gameId);
      if (gameType === "Physical") {
        game.numberOfPhysicalCopies = game.numberOfPhysicalCopies + 1;
        await updateGameData(gameId, game);
      }
    } catch (e) {
      throw new Error(e);
    }
  };

  const purchaseClickHandler = async () => {
    try {
      clearSuccessMessage();
      const user = await getUserData(userId);
      user.purchasedGames = user.purchasedGames.concat(itemsInBasket);
      user.gamesInTheBasket = [];
      setItemsInBasket([]);
      await purchaseGame(userId, user);
    } catch (e) {
      throw new Error(e);
    }
  };

  useEffect(() => {
    (async function () {
      const data = await getUserData(userId);
      setItemsInBasket(data.gamesInTheBasket);
    })();
  }, [getUserData, userId]);

  return (
    <>
      {infoMsg && <Notification values={{ infoMsg }} />}
      {successMsg && <Notification values={{ successMsg }} />}
      <div className="container">
        <div className="order">
          <h1 className="container__titles">Order</h1>
          {itemsInBasket.length ? (
            <ItemsInBasketList
              itemsInBasket={itemsInBasket}
              removeGameHandler={removeGameHandler}
            />
          ) : (
            <h1 className="order__empty-basket-text">Basket is empty</h1>
          )}
        </div>
        <div className="payment">
          <h1 className="container__titles">Payment</h1>
          <div className="price-summary">
            <span className="price-summary__text">
              Total price:{" "}
              {itemsInBasket
                .reduce((prevValue, currValue) => {
                  return prevValue + currValue.price;
                }, 0)
                .toFixed(2)}{" "}
              $
            </span>
            <span className="price-summary__text">Personal discount: </span>
            <span className="price-summary__text">You will pay: </span>
          </div>
          {itemsInBasket.length ? (
            <button className="purchase-btn" onClick={purchaseClickHandler}>
              Purchase
            </button>
          ) : (
            <button className="purchase-btn purchase-btn_disabled" disabled>
              Purchase
            </button>
          )}
        </div>
      </div>
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    infoMsg: state.notification.infoMsg,
    successMsg: state.notification.successMsg,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getUserData: (userId) => dispatch(getUserData(userId)),
    updateTheBasket: (userId, gameData) =>
      dispatch(updateTheBasket(userId, gameData)),
    clearInfoMessage: () => dispatch(clearInfoMessage()),
    clearSuccessMessage: () => dispatch(clearSuccessMessage()),
    purchaseGame: (userId, gameData) =>
      dispatch(purchaseGame(userId, gameData)),
    updateGameData: (userId, game) => dispatch(updateGameData(userId, game)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Basket);
