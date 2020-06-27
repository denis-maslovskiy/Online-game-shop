import React from 'react';
import { fade, makeStyles, withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import InputBase from '@material-ui/core/InputBase';
import Badge from '@material-ui/core/Badge';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import SearchIcon from '@material-ui/icons/Search';
import MoreIcon from '@material-ui/icons/MoreVert';
import { Link } from 'react-router-dom';
import FilterListIcon from '@material-ui/icons/FilterList';



import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import NativeSelect from '@material-ui/core/NativeSelect';



import '../styles/navbar.scss'

const useStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(3),
      width: 'auto',
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
  sectionDesktop: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'flex',
    },
  },
  sectionMobile: {
    display: 'flex',
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
}));

const BootstrapInput = withStyles((theme) => ({
  root: {
    'label + &': {
      marginTop: theme.spacing(3),
    },
  },
  input: {
    borderRadius: 4,
    position: 'relative',
    backgroundColor: theme.palette.background.paper,
    border: '1px solid #ced4da',
    fontSize: 16,
    padding: '10px 26px 10px 12px',
    transition: theme.transitions.create(['border-color', 'box-shadow']),
    // Use the system font instead of the default Roboto font.
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
    '&:focus': {
      borderRadius: 4,
      borderColor: '#80bdff',
      boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)',
    },
  },
}))(InputBase);

export const Navbar = () => {
  const classes = useStyles();
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);

  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const mobileMenuId = 'primary-search-account-menu-mobile';
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem>
        <IconButton>
          <Badge>
            <Link to='/authorization' className='mobile-menu-link'>Log In</Link>
          </Badge>
        </IconButton>
      </MenuItem>

      <MenuItem>
        <IconButton>
          <Badge>
            <Link to='/registration' className='mobile-menu-link'>Sign Up</Link>
          </Badge>
        </IconButton>
      </MenuItem>
    </Menu>
  );




  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  // const handleChange = (event) => {
  //   setAuth(event.target.checked);
  // };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };


  // DROP DOWN MENU
  const [age, setAge] = React.useState('');
  const handleChange = (event) => {
    setAge(event.target.value);
  };

  return (
    <div className={classes.grow}>
      <AppBar style={{display: "block"}}>
        <Toolbar>
          <Typography className={classes.title} variant="h6" noWrap>
            <Link to='/' className='navbar-links'>Online Game Shop</Link>
          </Typography>
          <div className={classes.search}>
            <div className={classes.searchIcon}>
              <SearchIcon />
            </div>
            <InputBase
              placeholder="Search…"
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput,
              }}
              inputProps={{ 'aria-label': 'search' }}
            />
          </div>

          <IconButton
                aria-controls="menu-appbar"
                color="inherit"
                onClick={handleMenu}
              >
                <FilterListIcon/>
            </IconButton>

          <div className={classes.grow} />
          <div className={classes.sectionDesktop}>
            <IconButton>
              <Badge>
                <Link to='/authorization' className='navbar-links'>Log In</Link>
              </Badge>
            </IconButton>

            <IconButton>
              <Badge>
                <Link to='/registration' className='navbar-links'>Sign Up</Link>
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


            
          <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
                open={open}
                onClose={handleClose}
              >
                {/* <MenuItem onClick={handleClose}>Profile</MenuItem>
                <MenuItem onClick={handleClose}>My account</MenuItem> */}

                <div className='filter-block'>
                  <div className='filter-block__filter'>
                      <h2>Filter</h2>

                      <div className='filter-block__filter-option'>
                        <span className='filter-block__filter-option__title'>Game Name:</span>
                        <FormControl className={classes.margin}>
                          <InputLabel htmlFor="demo-customized-textbox">Game Name</InputLabel>
                          <BootstrapInput id="demo-customized-textbox" />
                        </FormControl>
                      </div>

                      <div className='filter-block__filter-option'>
                        <span className='filter-block__filter-option__title'>Author:</span>
                        <FormControl className={classes.margin}>
                          <InputLabel htmlFor="demo-customized-textbox">Author</InputLabel>
                          <BootstrapInput id="demo-customized-textbox" />
                        </FormControl>
                      </div>

                      <div className='filter-block__filter-option'>
                        <span className='filter-block__filter-option__title'>Genre:</span>
                        <FormControl className={classes.margin}>
                          <InputLabel htmlFor="demo-customized-textbox">Genre</InputLabel>
                          <BootstrapInput id="demo-customized-textbox" />
                        </FormControl>
                      </div>

                      <div className='filter-block__filter-option'>
                        <span className='filter-block__filter-option__title'>Number of copies:</span>
                        <FormControl className={classes.margin}>
                          <InputLabel htmlFor="demo-customized-textbox">Number of copies</InputLabel>
                          <BootstrapInput id="demo-customized-textbox" />
                        </FormControl>
                      </div>
                  </div>

                  <div className='filter-block__sort'>
                    <h2>Sorting</h2>

                    <div className='filter-block__filter-option'>
                      <span className='filter-block__filter-option__title'>Select sort:</span>
                      <FormControl className={classes.margin}>
                        <InputLabel id="demo-customized-select-label">Sorting</InputLabel>
                        <Select
                          labelId="demo-customized-select-label"
                          id="demo-customized-select"
                          value={age}
                          onChange={handleChange}
                          input={<BootstrapInput />}
                        >
                          <MenuItem value="">
                            <em>None</em>
                          </MenuItem>
                          <MenuItem value={'popular'}>Popular</MenuItem>
                          <MenuItem value={'price'}>Price</MenuItem>
                          <MenuItem value={'new'}>New</MenuItem>
                          <MenuItem value={'discount'}>Discount</MenuItem>
                        </Select>
                      </FormControl>
                    </div>



                  </div>
                </div>
              </Menu>



        </Toolbar>
      </AppBar>
      
      {renderMobileMenu}

    </div>
      
  );
}
