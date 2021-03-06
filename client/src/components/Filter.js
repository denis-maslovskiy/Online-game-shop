import React, { useEffect, useState } from "react";
import { IconButton, Menu } from "@material-ui/core";
import FilterListIcon from "@material-ui/icons/FilterList";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { useSelector, useDispatch } from "react-redux";
import { setFilteredArray } from "../redux/games/gamesActions";
import "../styles/navbar.scss";
import "./filter.scss";

export const Filter = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [authorsArray, setAuthorsArray] = useState([]);
  const [genresArray, setGenresArray] = useState([]);
  const [gameNamesArray, setGameNamesArray] = useState([]);
  const [resultObject, setResultObject] = useState({
    gameNamesArray: [],
    authorsArray: [],
    genresArray: [],
    numberOfCopies: null,
  });

  const dispatch = useDispatch();
  const { allGames } = useSelector((state) => state.games);
  const open = Boolean(anchorEl);
  const resultArray = [];

  // Create options for Autocomplete
  useEffect(() => {
    const tempAuthorsArray = [],
      tempGenresArray = [],
      tempGameNamesArray = [];
    if (allGames.length) {
      allGames.forEach((item) => {
        if (tempAuthorsArray.indexOf(item.author) === -1) {
          tempAuthorsArray.push(item.author);
        }
        if (tempGenresArray.indexOf(item.genre) === -1) {
          tempGenresArray.push(item.genre);
        }
        tempGameNamesArray.push(item.gameName);
      });
      setAuthorsArray(tempAuthorsArray);
      setGenresArray(tempGenresArray);
      setGameNamesArray(tempGameNamesArray);
    }
  }, [allGames]);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const onGameNameChangeHandler = (e, value) => {
    setResultObject({ ...resultObject, gameNamesArray: value });
  };
  const onAuthorChangeHandler = (e, value) => {
    setResultObject({ ...resultObject, authorsArray: value });
  };
  const onGenreChangeHandler = (e, value) => {
    setResultObject({ ...resultObject, genresArray: value });
  };
  const onNumberOfCopiesChangeHandler = (e) => {
    setResultObject({ ...resultObject, numberOfCopies: e.target.value });
  };

  const filterTrigger = (isFilterActive) => {
    if (isFilterActive) {
      document.getElementById("filter-icon").style.color = "#2196F3";
    } else {
      document.getElementById("filter-icon").style.color = "white";
    }
  };

  const onDone = () => {
    allGames.map((item) => {
      if (
        resultObject.gameNamesArray.includes(item.gameName) ||
        resultObject.authorsArray.includes(item.author) ||
        resultObject.genresArray.includes(item.genre)
      ) {
        resultArray.push(item);
      }
      if (
        item.isPhysical &&
        resultObject.numberOfCopies &&
        item.numberOfPhysicalCopies >= resultObject.numberOfCopies
      ) {
        resultArray.push(item);
      }
    });
    handleClose();
    if (!resultArray.length) {
      if (
        !!resultObject.authorsArray.length ||
        !!resultObject.gameNamesArray.length ||
        !!resultObject.genresArray.length ||
        !!resultObject.numberOfCopies
      ) {
        resultArray.push("No matches found.");
        dispatch(setFilteredArray(resultArray));
        filterTrigger(true);
      } else {
        dispatch(setFilteredArray(resultArray));
        filterTrigger(false);
      }
    } else {
      filterTrigger("true");
      dispatch(setFilteredArray(resultArray));
    }
  };

  const filterValues = [
    { inputName: "Game Name:", inputLabel: "Game Name", id: 1 },
    { inputName: "Author:", inputLabel: "Author", id: 2 },
    { inputName: "Genre:", inputLabel: "Genre", id: 3 },
    { inputName: "Number of copies:", inputLabel: "Number of copies", id: 4 },
  ];

  return (
    <>
      {authorsArray.length && genresArray.length && gameNamesArray.length && (
        <section>
          <IconButton aria-controls="menu-appbar" color="inherit" onClick={handleMenu}>
            <FilterListIcon id="filter-icon" />
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            keepMounted
            transformOrigin={{
              vertical: "top",
              horizontal: "left",
            }}
            open={open}
            onClose={handleClose}
          >
            <div className="filter-block">
              <div className="filter-block__filter filter">
                <h2 className="filter-block__section-name">Filter</h2>
                {filterValues.map((item) => {
                  switch (item.inputLabel) {
                    case "Game Name":
                      return (
                        <div className="filter__option option" key={item.id}>
                          {/* <span className="option__title">{item.inputName}</span> */}
                          <Autocomplete
                            multiple
                            className="filter__input"
                            id={`${item.id}`}
                            options={gameNamesArray}
                            getOptionLabel={(option) => option}
                            onChange={onGameNameChangeHandler}
                            renderInput={(params) => <TextField {...params} label={item.inputLabel} />}
                          />
                        </div>
                      );
                    case "Author":
                      return (
                        <div className="filter__option option" key={item.id}>
                          {/* <span className="option__title">{item.inputName}</span> */}
                          <Autocomplete
                            multiple
                            className="filter__input"
                            id={`${item.id}`}
                            options={authorsArray}
                            getOptionLabel={(option) => option}
                            onChange={onAuthorChangeHandler}
                            renderInput={(params) => <TextField {...params} label={item.inputLabel} />}
                          />
                        </div>
                      );
                    case "Genre":
                      return (
                        <div className="filter__option option" key={item.id}>
                          {/* <span className="option__title">{item.inputName}</span> */}
                          <Autocomplete
                            multiple
                            className="filter__input"
                            id={`${item.id}`}
                            options={genresArray}
                            getOptionLabel={(option) => option}
                            onChange={onGenreChangeHandler}
                            renderInput={(params) => <TextField {...params} label={item.inputLabel} />}
                          />
                        </div>
                      );
                    case "Number of copies":
                      return (
                        <div className="filter__option option" key={item.id}>
                          {/* <span className="option__title">{item.inputName}</span> */}
                          <TextField
                            className="filter__input"
                            type="number"
                            label={item.inputLabel}
                            onChange={onNumberOfCopiesChangeHandler}
                            InputProps={{ inputProps: { min: 0 } }}
                          />
                        </div>
                      );
                  }
                })}
              </div>
              <div className="filter-block__button-container button-container">
                <button className="button-container__button" onClick={() => onDone()}>
                  Done
                </button>
              </div>
            </div>
          </Menu>
        </section>
      )}
    </>
  );
};
