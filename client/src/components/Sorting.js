import React, { useState, useEffect } from "react";
import { IconButton, Menu, FormControl, InputLabel, Select, MenuItem } from "@material-ui/core";
import SortIcon from "@material-ui/icons/Sort";
import { useSelector, useDispatch } from "react-redux";
import { setFilteredArray } from "../redux/games/gamesActions";
import "./sorting.scss";

export const Sorting = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [sortType, setSortType] = useState("");

  const dispatch = useDispatch();
  const { allGames } = useSelector((state) => state.games);
  const sortValues = [
    { value: "popular", label: "Popular", id: 1 },
    { value: "price", label: "Price", id: 2 },
    { value: "new", label: "New", id: 3 },
    { value: "discount", label: "Discount", id: 4 },
  ];
  const open = Boolean(anchorEl);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleChange = (event) => {
    setSortType(event.target.value);
  };

  const sortTrigger = (isSortActive) => {
    if (isSortActive) {
      document.getElementById("sort-icon").style.color = "#2196F3";
    } else {
      document.getElementById("sort-icon").style.color = "white";
    }
  };

  useEffect(() => {
    switch (sortType) {
      case "popular":
        allGames.sort((a, b) => {
          return b.rating - a.rating;
        });
        sortTrigger(true);
        break;
      case "price":
        allGames.sort((a, b) => {
          return b.price - a.price;
        });
        sortTrigger(true);
        break;
      case "new":
        allGames.sort((a, b) => {
          let x = new Date(a.gameAddDate);
          let y = new Date(b.gameAddDate);
          return y.getTime() - x.getTime();
        });
        sortTrigger(true);
        break;
      case "discount":
        allGames.sort((a, b) => {
          if (!a.discount) {
            a.discount = 0;
          }
          if (!b.discount) {
            b.discount = 0;
          }
          return b.discount - a.discount;
        });
        sortTrigger(true);
        break;
      default:
        sortTrigger(false);
        break;
    }
    dispatch(setFilteredArray(allGames));
    handleClose();
  }, [sortType, allGames, dispatch]);

  return (
    <>
      <IconButton aria-controls="menu-appbar" color="inherit" onClick={handleMenu}>
        <SortIcon id="sort-icon" />
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
        <div className="sorting-block">
          <h2 className="sorting-block__section-name">Sort</h2>
          <div className="sorting-block__sorting-option sorting-option">
            <FormControl>
              <InputLabel id="demo-customized-select-label">By:</InputLabel>
              <Select
                labelId="demo-customized-select-label"
                id="demo-customized-select"
                value={sortType || "None"}
                onChange={handleChange}
              >
                <MenuItem value="None">
                  <em>None</em>
                </MenuItem>
                {sortValues.map((item) => {
                  return (
                    <MenuItem value={item.value} key={item.id}>
                      {item.label}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </div>
        </div>
      </Menu>
    </>
  );
};
