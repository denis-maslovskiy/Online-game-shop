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

export const Navbar = () => {
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);
  const classes = useStyles();
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
  const auth = useContext(AuthContext);

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const logoutHandler = () => {
    auth.logout();
  };

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
      <MenuItem>
        {!auth.isAuthenticated && (
          <IconButton>
            <Badge>
              <Link to="/authorization" className="mobile-menu-link">
                Log In
              </Link>
            </Badge>
          </IconButton>
        )}
      </MenuItem>
      <MenuItem>
        {!auth.isAuthenticated && (
          <IconButton>
            <Badge>
              <Link to="/registration" className="mobile-menu-link">
                Sign Up
              </Link>
            </Badge>
          </IconButton>
        )}
      </MenuItem>
      <MenuItem>
        {auth.isAuthenticated && (
          <IconButton onClick={logoutHandler}>
            <Badge>
              <p className="mobile-menu-link">Log Out</p>
            </Badge>
          </IconButton>
        )}
      </MenuItem>
    </Menu>
  );

  // const path = ['/authorization', '/registration'];
  const navbarLinks = [
    {linkName: 'Log In', path: '/authorization'},
    {linkName: 'Sign Up', path: '/registration'}
  ]

  return (
    <div className={classes.grow}>
      <AppBar id='navbar'>
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
                {
                  navbarLinks.map(item => {
                    return (
                      <IconButton>
                        <Badge>
                          <Link to={item.path} className='navbar-links'>
                            {item.linkName}
                          </Link>
                        </Badge>
                      </IconButton>
                    )
                  })
                }
              </>
            )}
            {auth.isAuthenticated && (
              <>
                <IconButton onClick={logoutHandler}>
                  <Badge>
                    <Link className="navbar-links">
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
