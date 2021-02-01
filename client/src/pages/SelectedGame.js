import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Slide } from "@material-ui/core";
import { updateGameData } from "../redux/games/gamesActions";
import { addGameInTheBasket, getUserData } from "../redux/user/userActions";
import { clearErrorMessage, clearSuccessMessage } from "../redux/notification/notificationActions";
import Notification from "../components/Notification";
import { getGameInfo } from "../helpers/gameHelpers";
import img1 from "../img/1.jpg";
import img2 from "../img/2.jpg";
import img3 from "../img/3.jpg";
import img4 from "../img/4.jpg";
import img5 from "../img/5.jpg";
import img6 from "../img/6.jpg";
import "../styles/selected-game.scss";
import "../styles/carousel.scss";

const ModalTransition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const Modal = ({ isModalOpen, modalCloseHandler, addToBasketButtonHandler }) => {
  const [deliveryMethod, setDeliveryMethod] = useState('');
  const SelfPickup = "Self-pickup", CourierDelivery = "Courier delivery";

  const isButtonPressed = (deliveryMethodName) => {
    if (deliveryMethodName && deliveryMethod) {
      return deliveryMethodName === deliveryMethod ? true : false;
    } else return false;
  };

  const deliveryMethodButtonHandler = (deliveryMethodName) => {
    deliveryMethodName === SelfPickup ? setDeliveryMethod(deliveryMethodName) : setDeliveryMethod(CourierDelivery);
  };

  const onModalClose = () => {
    setDeliveryMethod(false);
    modalCloseHandler();
  };

  const onModalConfirm = () => {
    if (deliveryMethod) {
      addToBasketButtonHandler("Physical", deliveryMethod);
      setDeliveryMethod(false);
      modalCloseHandler();
    }
  };

  return (
    <div>
      <Dialog open={isModalOpen} TransitionComponent={ModalTransition} keepMounted onClose={modalCloseHandler}>
        <DialogTitle>{"Please choose a delivery method for a physical copy of the game"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            We offer you two delivery options: courier delivery, self-pickup. Please choose one option
          </DialogContentText>
          <button
            aria-pressed={isButtonPressed(CourierDelivery)}
            onClick={() => deliveryMethodButtonHandler(CourierDelivery)}
          >
            Courier delivery
          </button>
          <button aria-pressed={isButtonPressed(SelfPickup)} onClick={() => deliveryMethodButtonHandler(SelfPickup)}>
            Self-pickup
          </button>
        </DialogContent>
        <DialogActions>
          <button onClick={onModalConfirm} disabled={!deliveryMethod}>
            Confirm selection
          </button>
          <button onClick={onModalClose}>Close</button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

const SelectedGame = (props) => {
  const [isReadyToDisplayGameInfo, setIsReadyToDisplayGameInfo] = useState(false);
  const [isPhysical, setIsPhysical] = useState(false);
  const [isDigital, setIsDigital] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [gameData, setGameData] = useState(null);
  const [textFields, setTextFields] = useState([
    { title: "Game description: ", value: "", fieldName: "gameDescription" },
    { title: "Rating: ", value: 0, fieldName: "rating" },
    { title: "Release date: ", value: "", fieldName: "releaseDate" },
    { title: "Author: ", value: "", fieldName: "author" },
    { title: "Genre: ", value: "", fieldName: "genre" },
    { title: "Game Name: ", value: "", fieldName: "gameName" },
    {
      title: "Number Of Copies: ",
      value: "No physical copies",
      fieldName: "numberOfPhysicalCopies",
    },
  ]);

  const history = useHistory();

  const {
    getUserData,
    updateGameData,
    addGameInTheBasket,
    errorMsg,
    successMsg,
    clearErrorMessage,
    clearSuccessMessage,
  } = props;

  const gameId = window.location.href.split("/")[4];

  const arrayOfImgs = [
    { img: img1, id: "r1" },
    { img: img2, id: "r2" },
    { img: img3, id: "r3" },
    { img: img4, id: "r4" },
    { img: img5, id: "r5" },
    { img: img6, id: "r6" },
  ];

  const modalOpenHandler = () => setIsModalOpen(true);
  const modalCloseHandler = () => setIsModalOpen(false);

  useEffect(() => {
    async function func() {
      const game = await getGameInfo(gameId);
      setGameData(game);

      textFields.map((item) => {
        return (item.value = game[item.fieldName]);
      });
      setTextFields(textFields);
      setIsReadyToDisplayGameInfo(true);
      setIsDigital(game.isDigital);
      setIsPhysical(game.isPhysical);

      // Increase game rating
      game.rating = game.rating + 1;
      await updateGameData(game._id, game);
    }
    func();
  }, [textFields, getGameInfo, gameId]);

  const addToBasketButtonHandler = (gameType, deliveryMethod) => {
    clearSuccessMessage();
    clearErrorMessage();
    if (!!JSON.parse(localStorage.getItem("userData"))) {
      let userId = JSON.parse(localStorage.getItem("userData")).userId;
      const briefInformationAboutTheGame = {
        gameName: gameData.gameName,
        price: gameData.price,
        dateAddedToBasket: new Date(),
        gameId: gameData._id,
        gameType: gameType,
      };
      if (deliveryMethod) briefInformationAboutTheGame.deliveryMethod = deliveryMethod;
      (async function () {
        const user = await getUserData(userId);
        user.gamesInTheBasket.push(briefInformationAboutTheGame);
        const response = await addGameInTheBasket(userId, user);
        if (response && briefInformationAboutTheGame.gameType === "Physical") {
          gameData.numberOfPhysicalCopies = gameData.numberOfPhysicalCopies - 1;
          await updateGameData(gameId, gameData);
          setGameData(gameData);
        }

        // Increase game rating
        gameData.rating = gameData.rating + 10;
        await updateGameData(gameData._id, gameData);
      })();
    } else {
      history.push("/authorization");
    }
  };

  return (
    <>
      {isReadyToDisplayGameInfo && (
        <div>
          <h2 className="game-name">{textFields[5].value}</h2>
        </div>
      )}
      <div className="slidershow middle">
        <div className="slides">
          {arrayOfImgs.map((item) => (
            <input type="radio" name="r" id={item.id} key={item.id} />
          ))}
          {arrayOfImgs.map((item, index) => {
            if (index === 0) {
              return (
                <div className="slide s1" key={item.id}>
                  <img src={item.img} alt="GameImage" />
                </div>
              );
            }
            return (
              <div className="slide" key={item.id}>
                <img src={item.img} alt="GameImage" />
              </div>
            );
          })}
        </div>
        <div className="navigation">
          {arrayOfImgs.map((item) => (
            <label htmlFor={item.id} className="bar" key={item.id} />
          ))}
        </div>
      </div>
      {errorMsg && <Notification values={{ errorMsg }} />}
      {successMsg && <Notification values={{ successMsg }} />}
      <div className="content-area">
        <div className="content-area__game-info game-info">
          {isReadyToDisplayGameInfo &&
            textFields.map((item) => (
              <div key={item.title}>
                <span className="game-info__text-field-title">{item.title}</span>
                <p className="game-info__text-field-value">{item.value}</p>
              </div>
            ))}
        </div>
        <div className="content-area__buy-game buy-game">
          <div className="buy-game__digital-copy">
            <h2 className="buy-game__title">Digital Copy</h2>
            <h2 className="buy-game__price">Price</h2>
            {isDigital && (
              <button className="buy-game__button" onClick={() => addToBasketButtonHandler("Digital")}>
                Add to basket
              </button>
            )}
            {!isDigital && (
              <button className="buy-game__button--disable" disabled>
                Add to basket
              </button>
            )}
          </div>
          <div className="buy-game__physical-copy">
            <h2 className="buy-game__title">Physical Copy</h2>
            <h2 className="buy-game__price">Price</h2>
            {isPhysical && (
              <button className="buy-game__button" onClick={() => modalOpenHandler()}>
                Add to basket
              </button>
            )}
            {!isPhysical && (
              <button className="buy-game__button--disable" disabled>
                Add to basket
              </button>
            )}
          </div>
        </div>
      </div>
      <Modal
        isModalOpen={isModalOpen}
        modalCloseHandler={modalCloseHandler}
        addToBasketButtonHandler={addToBasketButtonHandler}
      />
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    errorMsg: state.notification.errorMsg,
    successMsg: state.notification.successMsg,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getUserData: (userId) => dispatch(getUserData(userId)),
    updateGameData: (userId, game) => dispatch(updateGameData(userId, game)),
    addGameInTheBasket: (userId, gameData) => dispatch(addGameInTheBasket(userId, gameData)),
    clearErrorMessage: () => dispatch(clearErrorMessage()),
    clearSuccessMessage: () => dispatch(clearSuccessMessage()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SelectedGame);
