import React, { useState, useContext } from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import InputBase from "@material-ui/core/InputBase";
import Badge from "@material-ui/core/Badge";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import SearchIcon from "@material-ui/icons/Search";
import MoreIcon from "@material-ui/icons/MoreVert";
import { Filter } from "./Filter";
import { useStyles } from "../hooks/useStyles";
import { Link } from "react-router-dom";
import "../styles/navbar.scss";
import { AuthContext } from "../context/AuthContext";
import { useHistory } from "react-router-dom";

import logout from '../redux/helpers/logoutHelper';

export const Navbar = () => {
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);
  const classes = useStyles();
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
  const auth = useContext(AuthContext);
  const history = useHistory();

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const logoutHandler = () => {
    // auth.logout();
    logout();
    history.push('/');
  };

  const notLoggedInMobileMenu = [
    { linkTo: "/authorization", linkName: "Log In", id: 1 },
    { linkTo: "/registration", linkName: "Sign Up", id: 2 },
  ];

  const loggedIn_MobileMenu = [
    { linkTo: "/account", linkName: "Account", id: 1 },
    { linkTo: "/basket", linkName: "Basket", id: 2 },
  ];

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
      {!auth.isAuthenticated &&
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
      {auth.isAuthenticated &&
        loggedIn_MobileMenu.map((item) => {
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
      {auth.isAuthenticated && (
        <MenuItem>
          <IconButton onClick={logoutHandler}>
            <Badge>
              <Link to="#" className="mobile-menu-link">
                Log Out
              </Link>
            </Badge>
          </IconButton>
        </MenuItem>
      )}
    </Menu>
  );

  const notLoggedIn = [
    { linkName: "Log In", path: "/authorization", id: "1" },
    { linkName: "Sign Up", path: "/registration", id: "2" },
  ];

  const loggedIn = [
    { linkName: "Account", path: "/account", id: "1" },
    { linkName: "Basket", path: "/basket", id: "2" },
  ];

  return (
    <div className={classes.grow}>
      <AppBar id="navbar">
        <Toolbar>
          <Typography className={classes.title} variant="h6" noWrap>
            <Link to="/" className="navbar-links">
              Online Game Shop
            </Link>
          </Typography>
          <div className={classes.search}>
            <div className={classes.searchIcon}>
              <SearchIcon />
            </div>
            <InputBase
              placeholder="Search…"
              classes={{
                root: classes.inputRoot,
                input: classes.input,
              }}
              inputProps={{ "aria-label": "search" }}
            />
          </div>
          <Filter />
          <div className={classes.grow} />
          <div className={classes.sectionDesktop}>
            {!auth.isAuthenticated && (
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
            {auth.isAuthenticated &&
              loggedIn.map((item) => {
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
            {auth.isAuthenticated && (
              <>
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
