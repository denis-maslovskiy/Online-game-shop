import React, { useRef } from "react";
import "../styles/selected-game.scss";
import "../styles/carousel.scss";
import img1 from "../img/1.jpg";
import img2 from "../img/2.jpg";
import img3 from "../img/3.jpg";
import img4 from "../img/4.jpg";
import img5 from "../img/5.jpg";
import img6 from "../img/6.jpg";
import img7 from "../img/7.jpg";
import img8 from "../img/8.jpg";

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
  };

  const arrayOfImgs = [
    { img: img1, id: 1 },
    { img: img2, id: 2 },
    { img: img3, id: 3 },
    { img: img4, id: 4 },
    { img: img5, id: 5 },
    { img: img6, id: 6 },
    { img: img7, id: 7 },
    { img: img8, id: 8 },
  ];

  return (
    <div className="carousel">
      <button
        className="carousel__arrow carousel__arrow_prev"
        onClick={onClickPrevHandler}
      >
        ⇦
      </button>
      <div className="carousel__gallery gallery">
        <ul className="gallery__images images" ref={ul}>
          {arrayOfImgs.map((item) => {
            return (
              <li ref={li} className="images__li" key={item.id}>
                <img src={item.img} alt="pic" className="images__img" />
              </li>
            );
          })}
        </ul>
      </div>
      <button
        className="carousel__arrow carousel__arrow_next"
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

      <div className="content-area__game-info game-info">
        {textFields.map((item) => {
          return (
            <div key={item.title}>
              <span className="game-info__text-field-title">{item.title}</span>
              <p className="game-info__text-field-value">{item.value}</p>
            </div>
          );
        })}
      </div>

      <div className="content-area__buy-game buy-game">
        <div className="buy-game__digital-copy">
          <h2 className="buy-game__title">Digital Copy</h2>
          <h2 className="buy-game__price">Price</h2>
          <button className="buy-game__button">Add to card</button>
        </div>

        <div className="buy-game__physical-copy">
          <h2 className="buy-game__title">Physical Copy</h2>
          <h2 className="buy-game__price">Price</h2>
          <button className="buy-game__button">Add to card</button>
        </div>
      </div>
    </div>
  );
};
