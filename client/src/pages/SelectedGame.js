import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { Image } from "cloudinary-react";
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Slide } from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import { updateGameData } from "../redux/games/gamesActions";
import { getGameInfo } from "../helpers/gameHelpers";
import { clearErrorMessage, clearSuccessMessage } from "../redux/notification/notificationActions";
import { addGameInTheBasket, getUserData } from "../redux/user/userActions";
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
      <Dialog open={isModalOpen} TransitionComponent={ModalTransition} keepMounted onClose={handleCloseModal}>
        <DialogTitle>Please choose a delivery method for a physical copy of the game</DialogTitle>
        <DialogContent>
          <DialogContentText>
            We offer you two delivery options: courier delivery, self-pickup. Please choose one option
          </DialogContentText>
          <button
            type="button"
            aria-pressed={isButtonPressed(COURIER_DELIVERY)}
            onClick={() => deliveryMethodButtonHandler(COURIER_DELIVERY)}
          >
            Courier delivery
          </button>
          <button
            type="button"
            aria-pressed={isButtonPressed(SELF_PICKUP)}
            onClick={() => deliveryMethodButtonHandler(SELF_PICKUP)}
          >
            Self-pickup
          </button>
        </DialogContent>
        <DialogActions>
          <button type="button" onClick={onModalConfirm} disabled={!deliveryMethod}>
            Confirm selection
          </button>
          <button type="button" onClick={onModalClose}>
            Close
          </button>
        </DialogActions>
      </Dialog>
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
  const [arrayOfImgs, setArrayOfImgs] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getUserData(userId));
  }, []);

  const { user } = useSelector((state) => state.user);
  const { successMsg, errorMsg } = useSelector((state) => state.notification);
  const userId = JSON.parse(localStorage.getItem("userData")).userId;
  const locationHrefArray = window.location.href.split("/");
  const gameId = locationHrefArray[locationHrefArray.length - 1];
  const PHYSICAL = "Physical";

  const history = useHistory();

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

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
        <div>
          <h2 className="game-name">{textFields[5].value}</h2>
        </div>
      )}
      {arrayOfImgs.length && (
        <div className="slidershow middle">
          <div className="slides">
            {arrayOfImgs?.map((item) => (
              <input type="radio" name="r" id={item.id} key={item.id} />
            ))}
            {arrayOfImgs?.map((item, index) => {
              if (index === 0) {
                return (
                  <div className="slide s1" key={item.id}>
                    <Image cloudName="dgefehkt9" publicId={item.imgId} width="300" crop="scale" />
                  </div>
                );
              }
              return (
                <div className="slide" key={item.id}>
                  <Image cloudName="dgefehkt9" publicId={item.imgId} width="300" crop="scale" />
                </div>
              );
            })}
          </div>
          <div className="navigation">
            {arrayOfImgs?.map((item) => (
              <label htmlFor={item.id} className="bar" key={item.id} />
            ))}
          </div>
        </div>
      )}
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
            <h2 className="buy-game__title">Physical Copy</h2>
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
