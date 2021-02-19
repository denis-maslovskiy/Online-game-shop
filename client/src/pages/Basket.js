import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ClearIcon from "@material-ui/icons/Clear";
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
              <span>{item.price} $</span>
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

const Basket = () => {
  const [itemsInBasket, setItemsInBasket] = useState([]);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const { successMsg, infoMsg } = useSelector((state) => state.notification);

  let totalPrice = 0,
    youWillPay = 0;

  const userId = JSON.parse(localStorage.getItem("userData")).userId;

  useEffect(() => {
    dispatch(getUserData(userId));
  }, []);

  useEffect(() => {
    if (Object.keys(user).length !== 0) {
      setItemsInBasket(user.gamesInTheBasket);
    }
  }, [user]);

  if (itemsInBasket?.length) {
    totalPrice = itemsInBasket
      .reduce((prevValue, currValue) => {
        return prevValue + currValue.price * (1 - currValue?.discount / 100);
      }, 0)
      .toFixed(2);
    youWillPay = totalPrice * (1 - user?.personalDiscount / 100);
  }

  const removeGameHandler = async (gameName) => {
    try {
      dispatch(clearInfoMessage());
      const newBasket = itemsInBasket.filter((item) => item.gameName !== gameName);
      setItemsInBasket(newBasket);
      if (Object.keys(user).length !== 0) {
        user.gamesInTheBasket = newBasket;
        dispatch(removeGameFromBasket(userId, user));
      }

      const gameId = itemsInBasket.filter((item) => item.gameName === gameName)[0].gameId;
      const gameType = itemsInBasket.filter((item) => item.gameName === gameName)[0].gameType;
      const game = await getGameInfo(gameId);
      if (gameType === "Physical") {
        game.numberOfPhysicalCopies = game.numberOfPhysicalCopies + 1;
        dispatch(updateGameData(gameId, game));
      }
    } catch (e) {
      throw new Error(e);
    }
  };

  const purchaseClickHandler = () => {
    dispatch(clearSuccessMessage());
    // Increase game rating
    itemsInBasket.forEach(async (item) => {
      try {
        const game = await getGameInfo(item.gameId);
        game.rating = game.rating + 100;
        dispatch(updateGameData(game._id, game));
      } catch (e) {
        throw new Error(e);
      }
    });

    user.purchasedGames = user.purchasedGames.concat(itemsInBasket);
    user.gamesInTheBasket = [];
    setItemsInBasket([]);
    dispatch(purchaseGame(userId, user));
  };

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
            <span className="price-summary__text">Personal discount: {user?.personalDiscount}%</span>
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

export default Basket;
