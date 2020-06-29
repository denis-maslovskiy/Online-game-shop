import React, { useState } from "react";
import { fade, makeStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import FilterListIcon from "@material-ui/icons/FilterList";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import { BootstrapInput } from "./BootstrapInput";
import "../styles/navbar.scss";

const useStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    display: "none",
    [theme.breakpoints.up("sm")]: {
      display: "block",
    },
  },
  search: {
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    "&:hover": {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing(3),
      width: "auto",
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  inputRoot: {
    color: "inherit",
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
  sectionDesktop: {
    display: "none",
    [theme.breakpoints.up("md")]: {
      display: "flex",
    },
  },
  sectionMobile: {
    display: "flex",
    [theme.breakpoints.up("md")]: {
      display: "none",
    },
  },
}));

const CustomInput = BootstrapInput;

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
          <div className="filter-block__filter">
            <h2>Filter</h2>

            <div className="filter-block__filter-option">
              <span className="filter-block__filter-option__title">
                Game Name:
              </span>
              <FormControl className={classes.margin}>
                <InputLabel htmlFor="demo-customized-textbox">
                  Game Name
                </InputLabel>
                <CustomInput className="demo-customized-textbox" />
              </FormControl>
            </div>

            <div className="filter-block__filter-option">
              <span className="filter-block__filter-option__title">
                Author:
              </span>
              <FormControl className={classes.margin}>
                <InputLabel htmlFor="demo-customized-textbox">
                  Author
                </InputLabel>
                <CustomInput className="demo-customized-textbox" />
              </FormControl>
            </div>

            <div className="filter-block__filter-option">
              <span className="filter-block__filter-option__title">Genre:</span>
              <FormControl className={classes.margin}>
                <InputLabel htmlFor="demo-customized-textbox">Genre</InputLabel>
                <CustomInput className="demo-customized-textbox" />
              </FormControl>
            </div>

            <div className="filter-block__filter-option">
              <span className="filter-block__filter-option__title">
                Number of copies:
              </span>
              <FormControl className={classes.margin}>
                <InputLabel htmlFor="demo-customized-textbox">
                  Number of copies
                </InputLabel>
                <CustomInput className="demo-customized-textbox" />
              </FormControl>
            </div>
          </div>

          <div className="filter-block__sort">
            <h2>Sorting</h2>

            <div className="filter-block__filter-option">
              <span className="filter-block__filter-option__title">
                Select sort:
              </span>
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
                  <MenuItem value={"popular"}>Popular</MenuItem>
                  <MenuItem value={"price"}>Price</MenuItem>
                  <MenuItem value={"new"}>New</MenuItem>
                  <MenuItem value={"discount"}>Discount</MenuItem>
                </Select>
              </FormControl>
            </div>
          </div>
        </div>
      </Menu>
    </>
  );
};
