import React, { useState, useEffect, useContext } from "react";
import { Image } from "cloudinary-react";
import { useDispatch, useSelector } from "react-redux";
import ClearIcon from "@material-ui/icons/Clear";
import Notification from "../components/Notification";
import { getUserData, removeGameFromBasket, purchaseGame } from "../redux/user/userActions";
import { clearInfoMessage, clearSuccessMessage } from "../redux/notification/notificationActions";
import { updateGameData } from "../redux/games/gamesActions";
import { DependenciesContext } from "../context/DependenciesContext";
import { getGameInfo } from "../helpers/gameHelpers";
import noImageAvailable from "../img/no-image-available.jpg";
import "../styles/basket.scss";

const Timer = ({ removeGameHandler, gameName, dateAddedToBasket }) => {
  const [minutes, setMinutes] = useState();
  const [seconds, setSeconds] = useState();

  const fifteenMinutes = 900000;
  const oneMinute = 60000;

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
  const { cloudName } = useContext(DependenciesContext);
  return (
    <>
      {itemsInBasket.map((item) => {
        return (
          <div className="basket-order__basket-game basket-game" key={item.dateAddedToBasket}>
            {item?.imgSource?.length ? (
              <Image
                cloudName={cloudName}
                publicId={item.imgSource[0]}
                className="basket-game__picture"
                alt={`${item.gameName} image`}
              />
            ) : (
              <img
                src={noImageAvailable}
                className="basket-game__picture"
                alt={`No available image for ${item.gameName}`}
              />
            )}
            <div className="basket-game__text">
              <span>{item.gameName}</span>
              {item.gameType === "Physical" && item.deliveryMethod && <span>{item.deliveryMethod}</span>}
              <span>{item.price} $</span>
            </div>
            <button className="remove-basket-game" onClick={() => removeGameHandler(item.gameName)}>
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
      <div className="basket-container">
        <div className="basket-order">
          <h1 className="basket-container__titles">Order</h1>
          {itemsInBasket.length ? (
            <ItemsInBasketList itemsInBasket={itemsInBasket} removeGameHandler={removeGameHandler} />
          ) : (
            <h1 className="basket-order__empty-basket-text">Basket is empty</h1>
          )}
        </div>
        <div className="payment">
          <h1 className="basket-container__titles">Payment</h1>
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
