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
  }, []);

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
      <div className="container__account-info-block account-info-block">
        <div className="title-block">
          <h2 className="title-block__text">User Info</h2>
        </div>
        <div className="user-info">
          {isReadyToDisplayUserInfo &&
            userData.map((item) => (
              <h2 className="user-info__text" key={item.id}>
                <span className="user-info__title static-field">{item.title}: </span>
                {item.value}
              </h2>
            ))}
        </div>

        <div className="title-block">
          <h2 className="title-block__text">Achievements</h2>
        </div>
        <div className="account-info__achievements achievements">
          {isReadyToDisplayUserInfo &&
            (user?.achievements?.length
              ? user?.achievements.map((achieve) => <p key={achieve.achievementText}>{achieve.achievementText}</p>)
              : "No achievements. Try to update, maybe they will appear!")}
        </div>
      </div>

      <div className="orders-info">
        <div className="orders-info__orders orders">
          <div className="title-block">
            <h2 className="title-block__text">Orders</h2>

            <div className="title-block__old-first-checkbox old-first-checkbox">
              <FormControlLabel
                aria-required
                value={isCheckboxActive}
                control={<Checkbox name="oldFirst" color="primary" onChange={checkboxChangeHandler} />}
                label="Old first"
              />
            </div>
          </div>

          {purchasedGames.map((item) => (
            <div className="orders__game game" key={item.dateAddedToBasket}>
              {item?.imgSource?.length ? (
                <Image
                  cloudName={cloudName}
                  publicId={item.imgSource[0]}
                  className="game__picture"
                  alt={`${item.gameName} image`}
                />
              ) : (
                <img src={noImageAvailable} className="game__picture" alt={`No available image for ${item.gameName}`} />
              )}
              <div className="game__text text">
                <p>{item.gameName}</p>
                <p>
                  {new Date(item.dateAddedToBasket).getMonth() + 1}.{new Date(item.dateAddedToBasket).getDate()}.
                  {new Date(item.dateAddedToBasket).getFullYear()}
                </p>
                <p>{item.price} $</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PersonalAccount;
