import React, { useContext, useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { Image } from "cloudinary-react";
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Slide, Checkbox, FormControlLabel } from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import { updateGameData } from "../redux/games/gamesActions";
import { getGameInfo } from "../helpers/gameHelpers";
import { clearErrorMessage, clearSuccessMessage } from "../redux/notification/notificationActions";
import { addGameInTheBasket, getUserData } from "../redux/user/userActions";
import { DependenciesContext } from "../context/DependenciesContext";
import Notification from "../components/Notification";
import "../styles/selected-game.scss";
import "../styles/carousel.scss";

const ModalTransition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const Modal = ({ isModalOpen, handleCloseModal, addToBasketButtonHandler }) => {
  const [deliveryMethod, setDeliveryMethod] = useState("");
  const SELF_PICKUP = "Self-pickup",
    COURIER_DELIVERY = "Courier delivery";

  const isButtonPressed = (deliveryMethodName) => deliveryMethodName === deliveryMethod;

  const deliveryMethodButtonHandler = (deliveryMethodName) => {
    deliveryMethodName === SELF_PICKUP ? setDeliveryMethod(deliveryMethodName) : setDeliveryMethod(COURIER_DELIVERY);
  };

  const onModalClose = () => {
    setDeliveryMethod(false);
    handleCloseModal();
  };

  const onModalConfirm = () => {
    if (deliveryMethod) {
      addToBasketButtonHandler("Physical", deliveryMethod);
      setDeliveryMethod(false);
      handleCloseModal();
    }
  };

  return (
    <div>
      <Dialog
        className="dialog"
        open={isModalOpen}
        TransitionComponent={ModalTransition}
        keepMounted
        onClose={handleCloseModal}
      >
        <DialogTitle className="dialog__title">
          Please choose a delivery method for a physical copy of the game
        </DialogTitle>
        <DialogContent className="dialog__dialog-content dialog-content">
          <DialogContentText className="dialog-content__text">
            We offer you two delivery options: <strong>courier delivery</strong>, <strong>self-pickup</strong>. Please
            choose one option
          </DialogContentText>
          <div className="dialog-content__checkboxes">
            <div>
              <FormControlLabel
                checked={isButtonPressed(COURIER_DELIVERY)}
                control={<Checkbox name="CourierDelivery" color="primary" onChange={() => deliveryMethodButtonHandler(COURIER_DELIVERY)} />}
                label="Courier delivery"
              />
            </div>
            <div>
              <FormControlLabel
                checked={isButtonPressed(SELF_PICKUP)}
                control={<Checkbox name="SelfPickup" color="primary" onChange={() => deliveryMethodButtonHandler(SELF_PICKUP)} />}
                label="Self-pickup"
              />
            </div>
          </div>
        </DialogContent>
        <DialogActions className="dialog__actions actions">
          <button
            className="actions__confirm actions__btn"
            type="button"
            onClick={onModalConfirm}
            disabled={!deliveryMethod}
          >
            Confirm
          </button>
          <button className="actions__close actions__btn" type="button" onClick={onModalClose}>
            Close
          </button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

const SliderShow = ({ arrayOfImgs, cloudName }) => {
  let inputRadios = [],
    images = [],
    labels = [];

  arrayOfImgs.map((item, index) => {
    inputRadios.push(<input type="radio" name="r" id={item.id} key={item.id} />);
    images.push(
      <div className={index ? "slide" : "slide s1"} key={item.id}>
        <Image cloudName={cloudName} publicId={item.imgId} width="800" crop="scale" />
      </div>
    );
    labels.push(<label htmlFor={item.id} className="bar" key={`label-${item.id}`} />);
  });

  return (
    <div className="slidershow middle">
      <div className="slides">
        {inputRadios}
        {images}
      </div>
      <div className="navigation">{labels}</div>
    </div>
  );
};

const SelectedGame = () => {
  const [isReadyToDisplayGameInfo, setIsReadyToDisplayGameInfo] = useState(false);
  const [isPhysical, setIsPhysical] = useState(false);
  const [isDigital, setIsDigital] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [gameData, setGameData] = useState(null);
  const [gamePrice, setGamePrice] = useState(0);
  const [arrayOfImgs, setArrayOfImgs] = useState([]);
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
    { title: "Discount: ", value: 0, fieldName: "discount" },
  ]);

  const dispatch = useDispatch();
  const location = useLocation();
  const history = useHistory();
  const { cloudName } = useContext(DependenciesContext);
  const { user } = useSelector((state) => state.user);
  const { successMsg, errorMsg } = useSelector((state) => state.notification);

  const userId = JSON.parse(localStorage.getItem("userData"))?.userId;
  const locationSplittedArray = location.pathname.split("/");
  const gameId = locationSplittedArray[locationSplittedArray.length - 1];
  const PHYSICAL = "Physical";

  useEffect(() => {
    dispatch(getUserData(userId));
  }, []);

  useEffect(() => {
    (async function () {
      const game = await getGameInfo(gameId);
      setGameData(game);

      const updatedImgArray = [];
      game.imgSource.forEach((imageId, index) => {
        updatedImgArray.push({ imgId: imageId, id: `r${index + 1}` });
      });
      setArrayOfImgs(updatedImgArray);

      textFields.map((item) => {
        return (item.value = game[item.fieldName]);
      });
      setTextFields(textFields);

      if (game?.plannedDiscountEndsOn && game?.plannedDiscountStartsOn) {
        const startsOn = game.plannedDiscountStartsOn,
          endsOn = game.plannedDiscountEndsOn;
        if (Date.parse(startsOn) < Date.now() && Date.now() < Date.parse(endsOn)) {
          setGamePrice((game?.price * (1 - (game?.discount + game.plannedDiscount) / 100)).toFixed(2));
        } else {
          setGamePrice((game?.price * (1 - game?.discount / 100)).toFixed(2));
        }
      } else {
        setGamePrice((game?.price * (1 - game?.discount / 100)).toFixed(2));
      }
      setIsDigital(game.isDigital);
      setIsPhysical(game.isPhysical);
      setIsReadyToDisplayGameInfo(true);

      // Increase game rating
      game.rating = game.rating + 1;
      dispatch(updateGameData(game._id, game));
    })();
  }, [textFields, gameId]);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const addToBasketButtonHandler = (gameType, deliveryMethod) => {
    dispatch(clearSuccessMessage());
    dispatch(clearErrorMessage());

    if (!!JSON.parse(localStorage.getItem("userData"))) {
      const briefInformationAboutTheGame = {
        gameName: gameData.gameName,
        price: gamePrice,
        dateAddedToBasket: new Date(),
        gameId: gameData._id,
        gameType: gameType,
        discount: gameData.discount,
        imgSource: gameData.imgSource,
      };

      if (deliveryMethod) briefInformationAboutTheGame.deliveryMethod = deliveryMethod;

      if (Object.keys(user).length) {
        user.gamesInTheBasket.push(briefInformationAboutTheGame);
        dispatch(addGameInTheBasket(userId, user));
      }

      if (briefInformationAboutTheGame.gameType === PHYSICAL) {
        gameData.numberOfPhysicalCopies = gameData.numberOfPhysicalCopies - 1;
        dispatch(updateGameData(gameId, gameData));
        setGameData(gameData);
      }

      // Increase game rating
      gameData.rating = gameData.rating + 10;
      dispatch(updateGameData(gameData._id, gameData));
    } else {
      history.push("/authorization");
    }
  };

  return (
    <>
      {isReadyToDisplayGameInfo && (
        <div className="game-name">
          <h2 className="game-name__title">{textFields[5].value}</h2>
        </div>
      )}
      {arrayOfImgs.length && <SliderShow arrayOfImgs={arrayOfImgs} cloudName={cloudName} />}
      {errorMsg && <Notification values={{ errorMsg }} />}
      {successMsg && <Notification values={{ successMsg }} />}
      <div className="content-area">
        <div className="content-area__game-info game-info">
          {isReadyToDisplayGameInfo &&
            textFields.map((item) => {
              if (item.fieldName === "discount") {
                return (
                  <div key={item.title}>
                    <p className="game-info__text-field-title">
                      <span className="static-field">{item.title}</span>
                      <span className="game-info__text-field-value">{item.value}%</span>
                    </p>
                  </div>
                );
              }
              if (item.fieldName === "releaseDate") {
                return (
                  <div key={item.title}>
                    <p className="game-info__text-field-title">
                      <span className="static-field">{item.title}</span>
                      <span className="game-info__text-field-value">
                        {new Date(item.value).getMonth() + 1}
                        {"-"}
                        {new Date(item.value).getDate()}
                        {"-"}
                        {new Date(item.value).getFullYear()}
                      </span>
                    </p>
                  </div>
                );
              }
              return (
                <div key={item.title}>
                  <p className="game-info__text-field-title">
                    <span className="static-field">{item.title}</span>
                    <span className="game-info__text-field-value">{item.value}</span>
                  </p>
                </div>
              );
            })}
        </div>
        <div className="content-area__buy-game buy-game">
          <div className="buy-game__digital-copy">
            <h2 className="buy-game__title static-field">Digital Copy</h2>
            {isReadyToDisplayGameInfo && <h2 className="buy-game__price">Price {gamePrice}$</h2>}
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
            <h2 className="buy-game__title static-field">Physical Copy</h2>
            {isReadyToDisplayGameInfo && <h2 className="buy-game__price">Price {gamePrice}$</h2>}
            {isPhysical && (
              <button className="buy-game__button" onClick={handleOpenModal}>
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
        handleCloseModal={handleCloseModal}
        addToBasketButtonHandler={addToBasketButtonHandler}
      />
    </>
  );
};

export default SelectedGame;
