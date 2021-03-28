import React, { useContext, useEffect, useState } from "react";
import { Image } from "cloudinary-react";
import { useDispatch, useSelector } from "react-redux";
import { Checkbox, FormControlLabel } from "@material-ui/core";
import { getUserData } from "../redux/user/userActions";
import { DependenciesContext } from "../context/DependenciesContext";
import noImageAvailable from "../img/no-image-available.jpg";
import "../styles/personal-account.scss";

const PersonalAccount = () => {
  const [isReadyToDisplayUserInfo, setIsReadyToDisplayUserInfo] = useState(false);
  const [isCheckboxActive, setIsCheckboxActive] = useState(false);
  const [purchasedGames, setPurchasedGames] = useState([]);
  const [isUserDataUpdate, setIsUserDataUpdated] = useState(false);
  const [numberOfLoadedGames, setNumberOfLoadedGames] = useState(5);
  const [userData, setUserDate] = useState([
    { title: "Account name", value: "", id: 1, fieldName: "username" },
    { title: "Email", value: "", id: 2, fieldName: "email" },
    {
      title: "Registration date",
      value: "",
      id: 3,
      fieldName: "dateOfRegistration",
    },
    {
      title: "Personal discount",
      value: "",
      id: 4,
      fieldName: "personalDiscount",
    },
  ]);

  const dispatch = useDispatch();
  const { cloudName } = useContext(DependenciesContext);
  const { user } = useSelector((state) => state.user);
  const userId = JSON.parse(localStorage.getItem("userData")).userId;

  useEffect(() => {
    dispatch(getUserData(userId));
  }, [dispatch, userId]);

  useEffect(() => {
    if (Object.keys(user).length) {
      userData.map((item) => {
        if (item.fieldName === "dateOfRegistration") {
          return (item.value = user[item.fieldName].split("T")[0]);
        }
        if (item.fieldName === "personalDiscount") {
          if (user[item.fieldName]) {
            return (item.value = user[item.fieldName] + "%");
          } else return (item.value = 0 + "%");
        }
        return (item.value = user[item.fieldName]);
      });

      user.purchasedGames.sort(
        (a, b) => new Date(b.dateAddedToBasket).getTime() - new Date(a.dateAddedToBasket).getTime()
      );
      setPurchasedGames(user.purchasedGames);
      setUserDate(userData);
      setIsReadyToDisplayUserInfo(true);
      setIsUserDataUpdated(false);
    }
  }, [userData, isUserDataUpdate, user]);

  const checkboxChangeHandler = (e) => {
    setIsCheckboxActive((prevState) => !prevState);
    e.target.checked
      ? setPurchasedGames((prevState) =>
          prevState.sort((a, b) => new Date(a.dateAddedToBasket).getTime() - new Date(b.dateAddedToBasket).getTime())
        )
      : setPurchasedGames((prevState) =>
          prevState.sort((a, b) => new Date(b.dateAddedToBasket).getTime() - new Date(a.dateAddedToBasket).getTime())
        );
  };

  return (
    <div className="container">
      <div className="orders-info">
        <div className="orders-info__orders orders">
          <div className="title-block">
            <h2 className="title-block__text titles">Orders</h2>

            <div className="title-block__old-first-checkbox old-first-checkbox">
              <FormControlLabel
                aria-required
                value={isCheckboxActive}
                control={<Checkbox name="oldFirst" color="primary" onChange={checkboxChangeHandler} />}
                label="Old first"
              />
            </div>
          </div>

          {purchasedGames.map((item, index) => {
            if (index < numberOfLoadedGames) {
              return (
                <div className="orders__game game" key={item.dateAddedToBasket}>
                  {item?.imgSource?.length ? (
                    <Image
                      cloudName={cloudName}
                      publicId={item.imgSource[0]}
                      className="card__picture game-image"
                      alt={item.gameName}
                    />
                  ) : (
                    <img src={noImageAvailable} className="card__picture game-image" alt={item.gameName} />
                  )}
                  <div className="game__text text">
                    <p className="default-text">{item.gameName}</p>
                    <p className="default-text">
                      {new Date(item.dateAddedToBasket).getMonth() + 1}.{new Date(item.dateAddedToBasket).getDate()}.
                      {new Date(item.dateAddedToBasket).getFullYear()}
                    </p>
                    <p className="default-text">{item.price} $</p>
                  </div>
                </div>
              );
            }
            return null;
          })}

          {purchasedGames.length && purchasedGames.length > 5 && purchasedGames.length >= numberOfLoadedGames ? (
            <button
              onClick={() => setNumberOfLoadedGames((prevState) => prevState + 5)}
              className="load-more-btn titles"
            >
              Load more
            </button>
          ) : null}

          {!Boolean(purchasedGames.length) && (
            <span className="basket-order__empty-basket-text default-text">You haven't bought any games yet</span>
          )}
        </div>
      </div>

      <div className="container__account-info-block account-info-block">
        <div className="title-block user-info-title-block">
          <h2 className="title-block__text titles">User Info</h2>
        </div>
        <div className="user-info">
          {isReadyToDisplayUserInfo &&
            userData.map((item) => (
              <h2 className="user-info__text default-text" key={item.id}>
                <span className="user-info__title static-field default-text">{item.title}: </span>
                {item.value}
              </h2>
            ))}
        </div>

        <div className="title-block">
          <h2 className="title-block__text titles">Achievements</h2>
        </div>
        <div className="account-info__achievements achievements default-text">
          {isReadyToDisplayUserInfo &&
            (user?.achievements?.length
              ? user?.achievements.map((achieve) => <p key={achieve.achievementText}>{achieve.achievementText}</p>)
              : "You have no achievements yet.")}
        </div>
      </div>
    </div>
  );
};

export default PersonalAccount;
