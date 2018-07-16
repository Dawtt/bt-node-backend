import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import MenuButton from './menuButton';


const styles = {
  root: {
    flexGrow: 1,
  },
  flex: {
    flex: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
};

class Header extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            date: new Date(),
            auth: true,
            anchorEl: null,
            username: '',
            year: '2005',
            month: '08',
            day: '10',
            value1: 1,
            value2: 2,
            value3: 3,
            menuaccountitems: ['Profile','Logout'],
            menumusicitems: ['Create Playlist', 'Get a Song'],
            loggedin: false
        }
    };


  handleChange = (event, checked) => {
    this.setState({ auth: checked });
  };

  handleMenu = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };
    _handleChange(fieldName, value){
        this.setState({
            [fieldName]: value
        });
    }
    render() {
        const { classes } = this.props;
        const { auth, anchorEl } = this.state;
        const open = Boolean(anchorEl);

        return (
            <div className={classes.root}>
                <AppBar position="static">
                    <Toolbar>
                        {auth && <MenuButton
                            iconType={MenuIcon}
                            items={this.state.menumusicitems}
                        />}
                        <Typography variant="title" color="inherit" className={classes.flex}>
                            <p>Basement Tunes</p>
                        </Typography>
                        <Typography variant="title" color="inherit" className={classes.flex}>
                            {this.props.username}
                        </Typography>
                        {auth && <MenuButton
                            iconType={AccountCircle}
                            items={this.state.menuaccountitems}

                        />}
                    </Toolbar>
                </AppBar>
            </div>
        );

  }
}

Header.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Header);
