import React, { useState, useEffect } from "react";
import ClearIcon from "@material-ui/icons/Clear";
import { connect } from "react-redux";
import Notification from "../components/Notification";
import { getUserData, removeGameFromBasket, purchaseGame } from "../redux/user/userActions";
import { clearInfoMessage, clearSuccessMessage } from "../redux/notification/notificationActions";
import { updateGameData } from "../redux/games/gamesActions";
import { getGameInfo } from "../helpers/gameHelpers";
import image from "../img/3.jpg";
import "../styles/basket.scss";

const Timer = ({ removeGameHandler, gameName, dateAddedToBasket }) => {
  const fifteenMinutes = 900000;
  const oneMinute = 60000;

  const [minutes, setMinutes] = useState();
  const [seconds, setSeconds] = useState();

  useEffect(() => {
    const timer = setInterval(() => {
      let time = new Date(new Date(fifteenMinutes) - new Date(Date.now() - Date.parse(dateAddedToBasket)));
      setMinutes(time.getMinutes());
      setSeconds(time.getSeconds());
      if ((time.getMinutes() === 0 && time.getSeconds() === 0) || time.getMinutes() > fifteenMinutes / oneMinute) {
        removeGameHandler(gameName);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [minutes, seconds]);

  return (
    <div className="timer">
      {minutes} : {seconds}
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
              <span>{(item.price * (1 - item?.discount / 100)).toFixed(2)} $</span>
            </div>
            <button className="remove-game" onClick={() => removeGameHandler(item.gameName)}>
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
  const [userData, setUserData] = useState(null);
  let totalPrice = 0,
    youWillPay = 0;

  const {
    getUserData,
    purchaseGame,
    infoMsg,
    successMsg,
    clearInfoMessage,
    clearSuccessMessage,
    removeGameFromBasket,
    updateGameData,
  } = props;
  let userId = JSON.parse(localStorage.getItem("userData")).userId;

  const removeGameHandler = async (gameName) => {
    try {
      clearInfoMessage();
      const newBasket = itemsInBasket.filter((item) => item.gameName !== gameName);
      setItemsInBasket(newBasket);
      userData.gamesInTheBasket = newBasket;
      await removeGameFromBasket(userId, userData);

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

      // Increase game rating
      itemsInBasket.forEach(async (item) => {
        const game = await getGameInfo(item.gameId);
        game.rating = game.rating + 100;
        await updateGameData(game._id, game);
      });

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
      setUserData(data);
      setItemsInBasket(data.gamesInTheBasket);
    })();
  }, [getUserData, userId]);

  if(itemsInBasket.length) {
    console.log(userData);
    totalPrice = itemsInBasket
      .reduce((prevValue, currValue) => {
        return prevValue + currValue.price * (1 - currValue?.discount / 100);
      }, 0)
      .toFixed(2);
    youWillPay = totalPrice * (1-userData?.personalDiscount/100);

  }

  return (
    <>
      {infoMsg && <Notification values={{ infoMsg }} />}
      {successMsg && <Notification values={{ successMsg }} />}
      <div className="container">
        <div className="order">
          <h1 className="container__titles">Order</h1>
          {itemsInBasket.length ? (
            <ItemsInBasketList itemsInBasket={itemsInBasket} removeGameHandler={removeGameHandler} />
          ) : (
            <h1 className="order__empty-basket-text">Basket is empty</h1>
          )}
        </div>
        <div className="payment">
          <h1 className="container__titles">Payment</h1>
          <div className="price-summary">
            <span className="price-summary__text">Total price: {totalPrice}$</span>
            <span className="price-summary__text">Personal discount: {userData?.personalDiscount}%</span>
            <span className="price-summary__text">You will pay: {youWillPay.toFixed(2)}$</span>
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
    removeGameFromBasket: (userId, gameData) => dispatch(removeGameFromBasket(userId, gameData)),
    clearInfoMessage: () => dispatch(clearInfoMessage()),
    clearSuccessMessage: () => dispatch(clearSuccessMessage()),
    purchaseGame: (userId, gameData) => dispatch(purchaseGame(userId, gameData)),
    updateGameData: (userId, game) => dispatch(updateGameData(userId, game)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Basket);
