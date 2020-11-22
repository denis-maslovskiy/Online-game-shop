import React, { useState, useEffect } from "react";
import {
  IconButton,
  Menu,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@material-ui/core";
import SortIcon from "@material-ui/icons/Sort";
import { useSelector, useDispatch } from "react-redux";
import { setFilteredArray } from "../redux/games/gamesActions";
import "./sorting.scss";

export const Sorting = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [sortType, setSortType] = useState("");

  const dispatch = useDispatch();

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

  const { allGames } = useSelector((state) => state.games);

  useEffect(() => {
    switch (sortType) {
      case "popular":
        allGames.sort((a, b) => {
          return b.rating - a.rating;
        });
        break;
      case "price":
        allGames.sort((a, b) => {
          return b.price - a.price;
        });
        break;
      case "new":
        allGames.sort((a, b) => {
          let x = new Date(a.gameAddDate);
          let y = new Date(b.gameAddDate);
          return y.getTime() - x.getTime();
        });
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
        break;
    }
    dispatch(setFilteredArray(allGames));
    handleClose();
  }, [sortType, allGames]);

  return (
    <>
      <IconButton
        aria-controls="menu-appbar"
        color="inherit"
        onClick={handleMenu}
      >
        <SortIcon />
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
          <h2 className="sorting-block__section-name">Sorting</h2>
          <div className="sorting-block__sorting-option sorting-option">
            <span className="sorting-option__title">Select sort:</span>
            <FormControl>
              <InputLabel id="demo-customized-select-label">Sorting</InputLabel>
              <Select
                labelId="demo-customized-select-label"
                id="demo-customized-select"
                value={sortType}
                onChange={handleChange}
              >
                <MenuItem value="">
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