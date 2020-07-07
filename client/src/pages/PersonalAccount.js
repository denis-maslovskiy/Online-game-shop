import React from "react";
import image from "../img/3.jpg";
import "../styles/personal-account.scss";

export const PersonalAccount = () => {
  const purchasedGames = [
    { gameName: "Game Name", date: "06.07.2020", price: "10.99", id: "1" },
    { gameName: "Game Name", date: "06.07.2020", price: "5.66", id: "2" },
    { gameName: "Game Name", date: "06.07.2020", price: "24.99", id: "3" },
  ];

  const achievements = [
    { achieveName: "Title of achievement", progress: 25, id: 1 },
    { achieveName: "Title of achievement", progress: 6, id: 2 },
    { achieveName: "Title of achievement", progress: 48, id: 3 },
    { achieveName: "Title of achievement", progress: 90, id: 4 },
  ];

  const userData = [
    { fieldName: "Account name", value: "John Bonbon" },
    { fieldName: "Email", value: "john.bon@gmail.com" },
    { fieldName: "Registration date", value: "28.05.2019" },
    { fieldName: "Personal discount", value: 15 },
  ];

  return (
    <div className="container">
      <h2 className="block-title">User Info</h2>
      <div className="user-info">
        {userData.map((item) => {
          return (
            <h2 className="user-info__text">
              <span className="user-info__title">{item.fieldName}: </span>
              {item.value}
            </h2>
          );
        })}
      </div>
      <div className="account-info">
        <div className="account-info__orders orders">
          <h2 className="block-title">Orders</h2>
          {purchasedGames.map((item) => {
            return (
              <div className="orders__game game" key={item.id}>
                <img
                  className="game__picture"
                  src={image}
                  alt={item.gameName}
                />
                <div className="game__text">
                  <span>{item.gameName}</span>
                  <span>{item.date}</span>
                  <span>{item.price} $</span>
                </div>
              </div>
            );
          })}
        </div>
        <h2 className="block-title">Achievements</h2>
        <div className="account-info__achievements achievements">
          {achievements.map((item) => {
            return (
              <div className="achievements__achieve achieve" key={item.id}>
                <h2 className="achieve__text">
                  <span className="achieve__title">{item.achieveName}: </span>
                  {item.progress} %
                </h2>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
