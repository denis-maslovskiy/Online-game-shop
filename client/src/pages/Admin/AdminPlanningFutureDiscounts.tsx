import React, { useState, useEffect, ChangeEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import DatePicker from "react-datepicker";
import { RootState } from "../../redux/rootReducer";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import { adminUpdateGameData, getAllGames } from "../../redux/games/gamesActions";
import "react-datepicker/dist/react-datepicker.css";
import "./admin-planning-future-discounts.scss";

interface Game {
  gameName: string;
  gameDescription: string;
  releaseDate: string;
  author: string;
  genre: string;
  numberOfPhysicalCopies: number;
  price: number;
  isPhysical: boolean;
  isDigital: boolean;
  discount: number;
  plannedDiscount: number;
  plannedDiscountStartsOn: Date;
  plannedDiscountEndsOn: Date;
  _id: string;
}

const AdminPlanningFutureDiscounts: React.FC = () => {
  const [gameNamesArray, setGamesNamesArray] = useState<Array<string>>([]);
  const [selectedResult, setSelectedResult] = useState<Array<string>>([]);
  const [discountValue, setDiscountValue] = useState<number>(0);
  const [plannedDiscountDates, setPlannedDiscountDates] = useState({
    startsOn: new Date(),
    endsOn: new Date(),
  });
  const dispatch = useDispatch();
  const { allGames } = useSelector((state: RootState) => state.games);
  const { userId } = JSON.parse(localStorage.getItem("userData")!);

  useEffect(() => {
    dispatch(getAllGames());
  }, []);

  useEffect(() => {
    const tempArray: Array<string> = [];
    allGames.forEach((game: Game) => {
      tempArray.push(game.gameName);
    });
    setGamesNamesArray(tempArray);
  }, [allGames.length]);

  const onGameNameChangeHandler = (e: ChangeEvent<{}>, value: Array<string>) => {
    setSelectedResult(value);
  };

  const saveButtonClickHandler = () => {
    selectedResult.forEach((gameName) => {
      allGames.forEach((game: Game) => {
        if (gameName === game.gameName) {
          game.plannedDiscount = discountValue;
          game.plannedDiscountStartsOn = plannedDiscountDates.startsOn;
          game.plannedDiscountEndsOn = plannedDiscountDates.endsOn;
          dispatch(adminUpdateGameData(game._id, { ...game }, userId));
        }
      });
    });
  };

  return (
    <div className="admin-add-game-container">
      <div className="container-title-block planning-future-discounts-title">
        <h2 className="container-title">Admin Planning Future Discounts</h2>
      </div>
      <div className="planning-future-discounts">
        <div className="planning-future-discounts__pfd-content">
          <div className="autocomplete-field">
            <Autocomplete
              multiple
              id="autocomplete"
              options={gameNamesArray}
              getOptionLabel={(option) => option}
              onChange={onGameNameChangeHandler}
              renderInput={(params) => <TextField {...params} label="Game Names" />}
            />
          </div>
          <div className="form__div">
            <TextField
              type="number"
              label="Discount value"
              variant="filled"
              className="form__input"
              value={discountValue}
              onChange={(e) => setDiscountValue(+e.target.value)}
              InputProps={{ inputProps: { min: 0, max: 100 } }}
              disabled={!selectedResult.length}
            />
          </div>
          <div>
            <DatePicker
              selected={plannedDiscountDates.startsOn}
              dateFormat="MM-dd-yyyy"
              name="plannedDiscountStartsOn"
              disabled={!selectedResult.length}
              onChange={(date) =>
                // @ts-ignore
                setPlannedDiscountDates((plannedDiscountDates) => ({ ...plannedDiscountDates, startsOn: date }))
              }
            />
          </div>
          <div>
            <DatePicker
              selected={plannedDiscountDates.endsOn}
              dateFormat="MM-dd-yyyy"
              name="plannedDiscountEndsOn"
              disabled={!selectedResult.length}
              onChange={(date) =>
                // @ts-ignore
                setPlannedDiscountDates((plannedDiscountDates) => ({ ...plannedDiscountDates, endsOn: date }))
              }
            />
          </div>
          <button className="add-game-button" onClick={saveButtonClickHandler} disabled={!selectedResult.length}>
            Save changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminPlanningFutureDiscounts;
