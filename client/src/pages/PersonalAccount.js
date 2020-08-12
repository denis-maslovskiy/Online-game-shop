import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { getUserData } from "../redux/user/userActions";
import image from "../img/3.jpg";
import "../styles/personal-account.scss";

import { useDispatch } from 'react-redux';
import { moment } from 'moment';

const PersonalAccount = (props) => {
  const dispatch = useDispatch()
  //
  const [isReadyToDisplayUserInfo, setIsReadyToDisplayUserInfo] = useState(
    false
  );
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
  const [purchasedGames, setPurchasedGames] = useState([]);

  const achievements = [
    { achieveName: "Title of achievement", progress: 25, id: 1 },
    { achieveName: "Title of achievement", progress: 6, id: 2 },
    { achieveName: "Title of achievement", progress: 48, id: 3 },
    { achieveName: "Title of achievement", progress: 90, id: 4 },
  ];

  useEffect(() => {
    let userId = JSON.parse(localStorage.getItem("userData")).userId;
    (async function () {
      // dispatch( getUserData(userId), )
      const user = await getUserData(userId);
      userData.map((item) => {
        if (item.fieldName === "dateOfRegistration") {
          console.log(item.value, user[item.fieldName]);
          return (item.value = user[item.fieldName].split("T")[0]);
        }
        console.log(moment(user[item.fieldName]));
        if (item.fieldName === "personalDiscount") {
          if(user[item.fieldName]) {
            return (item.value = user[item.fieldName] + "%");
          } else return (item.value = 0 + "%");
        }
        return (item.value = user[item.fieldName]);
      });
      setPurchasedGames(user.purchasedGames);
      setUserDate(userData);
      setIsReadyToDisplayUserInfo(true);
    })();
  }, [getUserData, userData, dispatch]);

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
          {purchasedGames.map((item) => (
            <div className="orders__game game" key={item.dateAddedToBasket}>
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
          ))}
        </div>
        <h2 className="block-title">Achievements</h2>
        <div className="account-info__achievements achievements">
          {achievements.map((item) => (
            <div className="achievements__achieve achieve" key={item.id}>
              <h2 className="achieve__text">
                <span className="achieve__title">{item.achieveName}: </span>
                {item.progress} %
              </h2>
            </div>
          ))}
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

// export default PersonalAccount
export default connect(null, mapDispatchToProps)(PersonalAccount);
