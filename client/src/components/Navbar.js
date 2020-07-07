import React, { useState } from "react";
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

export const Navbar = () => {
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);
  const classes = useStyles();
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
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
        <IconButton>
          <Badge>
            <Link to="/authorization" className="mobile-menu-link">
              Log In
            </Link>
          </Badge>
        </IconButton>
      </MenuItem>
      <MenuItem>
        <IconButton>
          <Badge>
            <Link to="/registration" className="mobile-menu-link">
              Sign Up
            </Link>
          </Badge>
        </IconButton>
      </MenuItem>
    </Menu>
  );

  return (
    <div className={classes.grow}>
      <AppBar>
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
            <IconButton>
              <Badge>
                <Link to="/authorization" className="navbar-links">
                  Log In
                </Link>
              </Badge>
            </IconButton>
            <IconButton>
              <Badge>
                <Link to="/registration" className="navbar-links">
                  Sign Up
                </Link>
              </Badge>
            </IconButton>
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
