import React, { useState } from "react";
import ClearIcon from "@material-ui/icons/Clear";
import image from "../img/3.jpg";
import "../styles/basket.scss";

const itemsInBasketList = (itemsInBasket, removeGameHandler) => {
  return (
    <>
      {itemsInBasket.map((item) => {
        return (
          <div className="order__game game" key={item.id}>
            <img className="game__picture" src={image} alt={item.gameName} />
            <div className="game__text">
              <span>{item.gameName}</span>
              <span>{item.price} $</span>
            </div>
            <button
              className="remove-game"
              onClick={removeGameHandler.bind(null, item.id)}
            >
              <ClearIcon />
            </button>
          </div>
        );
      })}
    </>
  );
};

export const Basket = () => {
  const [itemsInBasket, setItemsInBasket] = useState([
    { gameName: "game name", price: 19.99, id: "1" },
    { gameName: "game name", price: 22.99, id: "2" },
    { gameName: "game name", price: 33, id: "3" },
    { gameName: "game name", price: 9.99, id: "4" },
  ]);

  const removeGameHandler = (id) => {
    setItemsInBasket(itemsInBasket.filter((item) => item.id !== id));
  };

  return (
    <div className="container">
      <div className="order">
        <h1 className="container__titles">Order</h1>
        {itemsInBasket.length ? (
          itemsInBasketList(itemsInBasket, removeGameHandler)
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
          <button className="purchase-btn">Purchase</button>
        ) : (
          <button className="purchase-btn purchase-btn_disabled" disabled>
            Purchase
          </button>
        )}
      </div>
    </div>
  );
};
