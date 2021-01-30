import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useDispatch } from "react-redux";
import { getUserData } from "../redux/user/userActions";
import Achievements from '../components/Achievements';
import image from "../img/3.jpg";
import "../styles/personal-account.scss";

const PersonalAccount = (props) => {
  const dispatch = useDispatch();
  const [isReadyToDisplayUserInfo, setIsReadyToDisplayUserInfo] = useState(false);
  const [isCheckboxActive, setIsCheckboxActive] = useState(false);
  const [user, setUser] = useState(null);
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

  const { getUserData } = props;
  const userId = JSON.parse(localStorage.getItem("userData")).userId;

  useEffect(() => {
    (async function () {
      const user = await getUserData(userId);
      setUser(user);
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
    })();
  }, [getUserData, userData, dispatch, isUserDataUpdate]);

  const UpdatingUserDataTriggered = () => {
    setIsUserDataUpdated(true);
  }

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
      <h2 className="block-title">User Info</h2>
      <div className="user-info">
        {isReadyToDisplayUserInfo &&
          userData.map((item) => (
            <h2 className="user-info__text" key={item.id}>
              <span className="user-info__title">{item.title}: </span>
              {item.value}
            </h2>
          ))}
      </div>
      <div className="account-info">
        <div className="account-info__orders orders">
          <h2 className="block-title">Orders</h2>
          <div>
            <label>Old first</label>
            <input type="checkbox" value={isCheckboxActive} onChange={checkboxChangeHandler} />
          </div>
          {purchasedGames.map((item) => (
            <div className="orders__game game" key={item.dateAddedToBasket}>
              <img className="game__picture" src={image} alt={item.gameName} />
              <div className="game__text">
                <span>{item.gameName}</span>
                <span>
                  {new Date(item.dateAddedToBasket).getMonth() + 1}.{new Date(item.dateAddedToBasket).getDate()}.
                  {new Date(item.dateAddedToBasket).getFullYear()}
                </span>
                <span>{item.price} $</span>
              </div>
            </div>
          ))}
        </div>
        <h2 className="block-title">Achievements</h2>
        <div className="account-info__achievements achievements">
          {isReadyToDisplayUserInfo && <Achievements user={user} UpdatingUserDataTriggered={UpdatingUserDataTriggered}/>}
        </div>
      </div>
    </div>
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    getUserData: (userId) => dispatch(getUserData(userId)),
  };
};

export default connect(null, mapDispatchToProps)(PersonalAccount);
