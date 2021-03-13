import React, { useEffect, useState, useContext } from "react";
import { useHistory, Link, useLocation } from "react-router-dom";
import { AppBar, Toolbar, IconButton, Typography, Badge, MenuItem, Menu, TextField } from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import MoreIcon from "@material-ui/icons/MoreVert";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { useSelector, useDispatch } from "react-redux";
import { getSelectedGameAuthor } from "../redux/gameAuthor/gameAuthorActions";
import { Filter } from "./Filter";
import { Sorting } from "./Sorting";
import { useStyles } from "../hooks/useStyles";
import { DependenciesContext } from "../context/DependenciesContext";
import "../styles/navbar.scss";

export const Navbar = () => {
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);
  const [isHomePage, setIsHomePage] = useState(false);

  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();
  const { allGames } = useSelector((state) => state.games);
  const { allGameAuthors } = useSelector((state) => state.gameAuthor);
  const { isAuthenticated, logout, isAdmin } = useContext(DependenciesContext);
  const classes = useStyles();
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
  let optionAutocompleteArray = [];
  const mobileMenuId = "primary-search-account-menu-mobile";

  useEffect(() => {
    const isHomePage = Boolean(location.pathname === "/");
    setIsHomePage(isHomePage);
  }, [location.pathname]);

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

  const notLoggedInMobileMenu = [
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

  if (isAdmin) {
    loggedIn.push({ linkName: "Admin Panel", path: "/admin-panel", id: "3" });
    loggedIn_MobileMenu.push({ linkTo: "/admin-panel", linkName: "Admin Panel", id: 3 });
  }

  if (allGames.length && allGameAuthors.length) {
    optionAutocompleteArray = allGames.concat(allGameAuthors);
  }

  const onSearchFocusHandler = () => {
    document.getElementById("search-icon").style.display = "none";
  };

  const onSearchBlurHandler = () => {
    if (!document.getElementById("search-input").getAttribute("value")) {
      document.getElementById("search-icon").style.display = "inline-block";
    }
  };

  const onSearchChangeHandler = (e, value) => {
    if (value) {
      if (value.authorName) {
        dispatch(getSelectedGameAuthor(value._id));
        history.push(`/selected-game-author/${value._id}`);
      } else {
        history.push(`/selected-game/${value._id}`);
      }
    }
  };

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
        notLoggedInMobileMenu.map((item) => {
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
              options={optionAutocompleteArray}
              getOptionLabel={(option) =>
                option.authorName ? option.authorName : option.gameName + " - " + option.author
              }
              getOptionSelected={(option, value) => option.id === value.id}
              renderInput={(params) => (
                <TextField {...params} inputProps={{ ...params.inputProps, id: "search-input" }} />
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
