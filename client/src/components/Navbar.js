import React, { useEffect, useState } from "react";
import { useHistory, Link } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Badge,
  MenuItem,
  Menu,
  TextField,
} from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import MoreIcon from "@material-ui/icons/MoreVert";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { useSelector } from "react-redux";
import { Filter } from "./Filter";
import { Sorting } from "./Sorting";
import { useAuth } from "../hooks/authHook";
import { useStyles } from "../hooks/useStyles";
import "../styles/navbar.scss";

export const Navbar = () => {
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);
  const [isHomePage, setIsHomePage] = useState(false);
  const classes = useStyles();
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
  const { isAuthenticated, logout } = useAuth();
  const history = useHistory();

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const logoutHandler = () => {
    logout();
    history.push("/");
  };

  const notLoggedIn_MobileMenu = [
    { linkTo: "/authorization", linkName: "Log In", id: 1 },
    { linkTo: "/registration", linkName: "Sign Up", id: 2 },
  ];

  const loggedIn_MobileMenu = [
    { linkTo: "/account", linkName: "Account", id: 1 },
    { linkTo: "/basket", linkName: "Basket", id: 2 },
  ];

  const notLoggedIn = [
    { linkName: "Log In", path: "/authorization", id: "1" },
    { linkName: "Sign Up", path: "/registration", id: "2" },
  ];

  const loggedIn = [
    { linkName: "Account", path: "/account", id: "1" },
    { linkName: "Basket", path: "/basket", id: "2" },
  ];

  const { allGames } = useSelector((state) => state.games);

  const onSearchFocusHandler = () => {
    document.getElementById("search-icon").style.display = "none";
  };

  const onSearchBlurHandler = () => {
    if (
      !document
        .getElementsByClassName(
          "MuiInputBase-input MuiInput-input MuiAutocomplete-input MuiAutocomplete-inputFocused MuiInputBase-inputAdornedEnd"
        )[0]
        .getAttribute("value")
    ) {
      document.getElementById("search-icon").style.display = "inline-block";
    }
  };

  const onSearchChangeHandler = (e, value) => {
    if (value) {
      history.push(`/selectedgame/${value._id}`);
    }
  };

  useEffect(() => {
    // Can be changed in future
    if (window.location.href === "http://localhost:3000/") {
      setIsHomePage(true);
    } else {
      setIsHomePage(false);
    }
  }, [window.location.href]);

  const mobileMenuId = "primary-search-account-menu-mobile";
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      {!isAuthenticated &&
        notLoggedIn_MobileMenu.map((item) => {
          return (
            <MenuItem key={item.id}>
              <IconButton>
                <Badge>
                  <Link to={item.linkTo} className="mobile-menu-link">
                    {item.linkName}
                  </Link>
                </Badge>
              </IconButton>
            </MenuItem>
          );
        })}
      {isAuthenticated && (
        <div>
          {loggedIn_MobileMenu.map((item) => {
            return (
              <MenuItem key={item.id}>
                <IconButton>
                  <Badge>
                    <Link to={item.linkTo} className="mobile-menu-link">
                      {item.linkName}
                    </Link>
                  </Badge>
                </IconButton>
              </MenuItem>
            );
          })}
          <MenuItem>
            <IconButton onClick={logoutHandler}>
              <Badge>
                <Link to="#" className="mobile-menu-link">
                  Log Out
                </Link>
              </Badge>
            </IconButton>
          </MenuItem>
        </div>
      )}
    </Menu>
  );

  return (
    <div className={classes.grow}>
      <AppBar id="navbar">
        <Toolbar>
          <Typography className={classes.title} variant="h6" noWrap>
            <Link to="/" className="navbar-links">
              Online Game Shop
            </Link>
          </Typography>
          <div className={classes.search} id="navbar__search">
            <div className={classes.searchIcon}>
              <SearchIcon id="search-icon" />
            </div>
            <Autocomplete
              options={allGames}
              getOptionLabel={(option) =>
                option.gameName + " - " + option.author
              }
              renderInput={(params) => (
                <TextField className="search-input" {...params} />
              )}
              onFocus={onSearchFocusHandler}
              onBlur={onSearchBlurHandler}
              onChange={onSearchChangeHandler}
            />
          </div>
          {isHomePage && <Filter />}
          {isHomePage && <Sorting />}
          <div className={classes.grow} />
          <div className={classes.sectionDesktop}>
            {!isAuthenticated && (
              <>
                {notLoggedIn.map((item) => {
                  return (
                    <IconButton key={item.id}>
                      <Badge>
                        <Link to={item.path} className="navbar-links">
                          {item.linkName}
                        </Link>
                      </Badge>
                    </IconButton>
                  );
                })}
              </>
            )}
            {isAuthenticated && (
              <>
                {loggedIn.map((item) => {
                  return (
                    <IconButton key={item.id}>
                      <Badge>
                        <Link to={item.path} className="navbar-links">
                          {item.linkName}
                        </Link>
                      </Badge>
                    </IconButton>
                  );
                })}
                <IconButton onClick={logoutHandler}>
                  <Badge>
                    <Link to="#" className="navbar-links">
                      Log Out
                    </Link>
                  </Badge>
                </IconButton>
              </>
            )}
          </div>
          <div className={classes.sectionMobile}>
            <IconButton
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
            >
              <MoreIcon />
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
    </div>
  );
};
