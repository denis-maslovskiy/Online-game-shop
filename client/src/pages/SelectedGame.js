import React, { useRef } from "react";
import "../styles/selected-game.scss";
import "../styles/carousel.scss";

const Carousel = () => {
  const ul = useRef();
  const li = useRef();

  let width;
  window.innerWidth > 504 ? (width = 320) : (width = 200);
  let count = 1;

  let position = 0;

  const onClickPrevHandler = () => {
    position += width * count;
    position = Math.min(position, 0);
    ul.current.style.marginLeft = position + "px";
  };

  const onClickNextHandler = () => {
    position -= width * count;
    width === 320
      ? (position = Math.max(position, -2240))
      : (position = Math.max(position, -1400));
    ul.current.style.marginLeft = position + "px";
    console.log(position);
  };

  return (
    <div className="carousel">
      <button
        className="carousel__arrow carousel__arrow__prev"
        onClick={onClickPrevHandler}
      >
        ⇦
      </button>
      <div className="carousel__gallery">
        <ul className="carousel__gallery__images" ref={ul}>
          <li ref={li}>
            <img
              src={require("../img/1.jpg")}
              alt="1"
              className="carousel__gallery__images__img"
            />
          </li>
          <li ref={li}>
            <img
              src={require("../img/2.jpg")}
              alt="2"
              className="carousel__gallery__images__img"
            />
          </li>
          <li ref={li}>
            <img
              src={require("../img/3.jpg")}
              alt="3"
              className="carousel__gallery__images__img"
            />
          </li>
          <li ref={li}>
            <img
              src={require("../img/4.jpg")}
              alt="4"
              className="carousel__gallery__images__img"
            />
          </li>
          <li ref={li}>
            <img
              src={require("../img/5.jpg")}
              alt="5"
              className="carousel__gallery__images__img"
            />
          </li>
          <li ref={li}>
            <img
              src={require("../img/6.jpg")}
              alt="6"
              className="carousel__gallery__images__img"
            />
          </li>
          <li ref={li}>
            <img
              src={require("../img/7.jpg")}
              alt="7"
              className="carousel__gallery__images__img"
            />
          </li>
          <li ref={li}>
            <img
              src={require("../img/8.jpg")}
              alt="8"
              className="carousel__gallery__images__img"
            />
          </li>
        </ul>
      </div>
      <button
        className="carousel__arrow carousel__arrow__next"
        onClick={onClickNextHandler}
      >
        ⇨
      </button>
    </div>
  );
};

export const SelectedGame = () => {
  const textFields = [
    {
      title: "Game description: ",
      value:
        "Fugiat proident eu cillum ipsum reprehenderit. Voluptate cupidatat qui ex sint do elit mollit eiusmod do non irure. Esse reprehenderit ad laborum exercitation ex sit. Sint cillum culpa et esse consectetur culpa elit non irure minim. Excepteur incididunt exercitation nostrud anim est irure non consequat aliquip fugiat exercitation voluptate quis. Ad sint fugiat ullamco proident ea ad aliquip ad fugiat anim cillum proident.",
    },
    { title: "Rating: ", value: 100 },
    { title: "Release date: ", value: "30/06/2020" },
    { title: "Author: ", value: "GameDev" },
    { title: "Genre: ", value: "RPG" },
    { title: "Custom Achievements: ", value: "Any achievements" },
  ];

  return (
    <div className="content-area">
      {Carousel()}

      <div className="content-area__game-info">
        {textFields.map((item) => {
          return (
            <div key={item.title}>
              <span className="content-area__game-info__text-field-title">
                {item.title}
              </span>
              <p className="content-area__game-info__text-field-value">
                {item.value}
              </p>
            </div>
          );
        })}
      </div>

      <div className="content-area__buy-game">
        <div className="content-area__buy-game__digital-copy">
          <h2 className="content-area__buy-game__title">Digital Copy</h2>
          <h2 className="content-area__buy-game__price">Price</h2>
          <button className="content-area__buy-game__button">
            Add to card
          </button>
        </div>

        <div className="content-area__buy-game__physical-copy">
          <h2 className="content-area__buy-game__title">Physical Copy</h2>
          <h2 className="content-area__buy-game__price">Price</h2>
          <button className="content-area__buy-game__button">
            Add to card
          </button>
        </div>
      </div>
    </div>
  );
};
