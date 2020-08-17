import React, { useState } from "react";
import { IconButton, MenuItem, Menu, InputLabel, FormControl, Select } from "@material-ui/core";
import FilterListIcon from "@material-ui/icons/FilterList";
import { CustomInput } from "./CustomInput";
import { useStyles } from "../hooks/useStyles";
import "../styles/navbar.scss";

export const Filter = () => {
  const [age, setAge] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);

  const classes = useStyles();
  const open = Boolean(anchorEl);

  const handleChange = (event) => {
    setAge(event.target.value);
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const sortValues = [
    { value: "popular", label: "Popular", id: 1 },
    { value: "price", label: "Price", id: 2 },
    { value: "new", label: "New", id: 3 },
    { value: "discount", label: "Discount", id: 4 },
  ];

  const filterValues = [
    { inputName: "Game Name:", inputLabel: "Game Name", id: 1 },
    { inputName: "Author:", inputLabel: "Author", id: 2 },
    { inputName: "Genre:", inputLabel: "Genre", id: 3 },
    { inputName: "Number of copies:", inputLabel: "Number of copies", id: 4 },
  ];

  return (
    <>
      <IconButton
        aria-controls="menu-appbar"
        color="inherit"
        onClick={handleMenu}
      >
        <FilterListIcon />
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
              return (
                <div className="filter__option option" key={item.id}>
                  <span className="option__title">{item.inputName}</span>
                  <FormControl className={classes.margin}>
                    <InputLabel htmlFor="demo-customized-textbox">
                      {item.inputLabel}
                    </InputLabel>
                    <CustomInput className="demo-customized-textbox" />
                  </FormControl>
                </div>
              );
            })}
          </div>
          <div className="filter-block__sort">
            <h2 className="filter-block__section-name">Sorting</h2>
            <div className="filter__option option">
              <span className="option__title">Select sort:</span>
              <FormControl className={classes.margin}>
                <InputLabel id="demo-customized-select-label">
                  Sorting
                </InputLabel>
                <Select
                  labelId="demo-customized-select-label"
                  id="demo-customized-select"
                  value={age}
                  onChange={handleChange}
                  input={<CustomInput />}
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
        </div>
      </Menu>
    </>
  );
};
