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
    { value: "popular", label: "Popular" },
    { value: "price", label: "Price" },
    { value: "new", label: "New" },
    { value: "discount", label: "Discount" },
  ];

  const filterValues = [
    { inputName: "Game Name:", inputLabel: "Game Name" },
    { inputName: "Author:", inputLabel: "Author" },
    { inputName: "Genre:", inputLabel: "Genre" },
    { inputName: "Number of copies:", inputLabel: "Number of copies" },
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
            <h2>Filter</h2>
            {filterValues.map((item, index) => {
              return (
                <div className="filter__option option" key={index}>
                  <span className="option__title">
                    {item.inputName}
                  </span>
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
            <h2>Sorting</h2>
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
                  {sortValues.map((item, index) => {
                    return (
                      <MenuItem value={item.value} key={index}>
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
