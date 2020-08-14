import React, { useState } from "react";
import { useHistory, Link } from "react-router-dom";
import {AppBar, Toolbar, IconButton, Typography, InputBase, Badge, MenuItem, Menu} from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import MoreIcon from "@material-ui/icons/MoreVert";
import { Filter } from "./Filter";
import { useAuth } from "../hooks/authHook";
import { useStyles } from "../hooks/useStyles";
import "../styles/navbar.scss";

export const Navbar = () => {
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);
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
    console.log(isAuthenticated);
    history.push('/');
  };

  const notLoggedIn_MobileMenu = [
    { linkTo: "/authorization", linkName: "Log In", id: 1 },
    { linkTo: "/registration", linkName: "Sign Up", id: 2 },
  ];

  const loggedIn_MobileMenu = [
    { linkTo: "/account", linkName: "Account", id: 1 },
    { linkTo: "/basket", linkName: "Basket", id: 2 },
  ];

  console.log(isAuthenticated);
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
      {isAuthenticated &&
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
      {isAuthenticated && (
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
            {isAuthenticated &&
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
            {isAuthenticated && (
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
