import React from 'react';
import clsx from 'clsx';
import {
  MdPerson,
  MdPeople,
  MdSettings,
  MdDashboard,
  MdExpandLess,
  MdExpandMore,
} from 'react-icons/md';
import {
  Box,
  Drawer,
  Button,
  makeStyles,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  Avatar,
  Collapse,
} from '@material-ui/core';
import Logo from './logo.svg';
import PropTypes from 'prop-types';
import { ImLab } from 'react-icons/im';
import { DrawerWidth } from './constants';
import { useHistory } from 'react-router-dom';
import { useIsDesktop, useIsMobile } from './hooks';
import { logoutAction } from './auth/AuthStoreSlice';
import { deepPurple } from '@material-ui/core/colors';
import { useSelector, useDispatch } from 'react-redux';
import { BiHotel, BiRadioCircle } from 'react-icons/bi';
import { FaUserMd, FaWheelchair, FaFirstAid } from 'react-icons/fa';

function AppDrawer(props) {
  const styles = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();
  const isMobile = useIsMobile();
  const isDesktop = useIsDesktop();
  const { drawer, onDrawerClose } = props;

  const username = useSelector((state) => state.auth.username);

  const [isOpen, setIsOpen] = React.useState({
    main: false,
    users: false,
    labs: false,
    beds: false,
  });

  const handleRouteItemCollapes = (type) => {
    switch (type) {
      case 'main':
        setIsOpen({ main: !isOpen.main });
        break;
      case 'users':
        setIsOpen({ users: !isOpen.users });
        break;
      case 'labs':
        setIsOpen({ labs: !isOpen.labs });
        break;
      case 'beds':
        setIsOpen({ beds: !isOpen.beds });
        break;
      default:
        break;
    }
  };

  const handleLogout = () => {
    dispatch(logoutAction());
    history.push('/login');
    return;
  };

  React.useLayoutEffect(() => {
    if (drawer === false) {
      setIsOpen((p) => ({
        ...p,
        main: false,
        users: false,
        labs: false,
        beds: false,
      }));
    }
  }, [drawer]);

  return (
    <Drawer
      open={drawer}
      onClose={onDrawerClose}
      className={clsx(styles.drawer, {
        [styles.drawer_open]: drawer,
        [styles.drawer_close]: !drawer,
      })}
      classes={{
        paper: clsx(styles.drawer_bg, {
          [styles.drawer_open]: drawer,
          [styles.drawer_close]: !drawer,
        }),
      }}
      hideBackdrop={isDesktop ? true : false}
      variant={isDesktop ? 'permanent' : 'temporary'}>
      <Box
        paddingY={10}
        display='flex'
        alignItems='center'
        justifyContent='center'>
        <img src={Logo} alt='Logo' width={35} height={35} />
        {drawer && <Typography variant='h5'>Creative</Typography>}
      </Box>
      <Divider />
      <Box>
        <List>
          <DrawerItemCollapes
            open={isOpen.main}
            showExpandIcon={drawer}
            onClick={() => handleRouteItemCollapes('main')}
            label={username === null ? 'John Doe' : username}
            icon={
              <Avatar className={clsx(styles.avatar, styles.avatar_small)}>
                A
              </Avatar>
            }>
            <DrawerItem
              label='Profile'
              style={{ paddingLeft: 30 }}
              icon={<MdPerson size={20} />}
              onClick={() => history.push('/profile')}
            />
            <DrawerItem
              label='Setting'
              style={{ paddingLeft: 30 }}
              icon={<MdSettings size={20} />}
            />
          </DrawerItemCollapes>

          <Divider />
          <Box marginTop={5}>
            <React.Fragment>
              {routeItem.map(({ icon, label, link }, index) => (
                <DrawerItem
                  key={index}
                  icon={icon}
                  label={label}
                  onClick={() => history.push(link)}
                />
              ))}
            </React.Fragment>
            <React.Fragment>
              {routeItemCollapes.map(({ icon, label, item, type }) => (
                <DrawerItemCollapes
                  icon={icon}
                  key={type}
                  label={label}
                  open={isOpen[type]}
                  showExpandIcon={drawer}
                  onClick={() => handleRouteItemCollapes(type)}>
                  {item.map((item, index) => (
                    <DrawerItem
                      key={index}
                      icon={item.icon}
                      label={item.label}
                      style={{ paddingLeft: 30 }}
                      onClick={() => history.push(item.link)}
                    />
                  ))}
                </DrawerItemCollapes>
              ))}
            </React.Fragment>
          </Box>
        </List>
        <Box
          paddingTop={20}
          justifyContent='center'
          display={isMobile ? 'none' : 'flex'}>
          <Button
            size='small'
            color='primary'
            variant='contained'
            onClick={handleLogout}>
            Logout
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
}

AppDrawer.propTypes = {
  drawer: PropTypes.bool,
  handleDrawerClose: PropTypes.func,
};

export default AppDrawer;

function DrawerItem(props) {
  const { icon, label, ...others } = props;

  return (
    <ListItem component='li' button {...others}>
      <ListItemIcon>{icon}</ListItemIcon>
      <ListItemText primary={label} disableTypography />
    </ListItem>
  );
}

DrawerItem.propTypes = {
  icon: PropTypes.element,
  label: PropTypes.string.isRequired,
};

function DrawerItemCollapes(props) {
  const { open, icon, label, children, showExpandIcon, ...others } = props;

  return (
    <>
      <ListItem button {...others}>
        <ListItemIcon>{icon}</ListItemIcon>
        <ListItemText primary={label} disableTypography />
        <Box display={showExpandIcon === true ? 'flex' : 'none'}>
          {open === true ? <MdExpandMore /> : <MdExpandLess />}
        </Box>
      </ListItem>
      <Collapse in={open} timeout='auto' unmountOnExit>
        {children}
      </Collapse>
    </>
  );
}

DrawerItemCollapes.propTypes = {
  open: PropTypes.bool,
  children: PropTypes.node.isRequired,
};

const routeItem = [
  { icon: <MdDashboard size={20} />, label: 'Dashboard', link: '/dashboard' },
  { icon: <FaUserMd size={20} />, label: 'Doctor', link: '/doctor' },
  { icon: <FaWheelchair size={20} />, label: 'Patients', link: '/patients' },
  { icon: <FaFirstAid size={20} />, label: 'Medicine', link: '/medicine' },
];

const routeItemCollapes = [
  {
    type: 'users',
    icon: <MdPeople size={20} />,
    label: 'Users',
    item: [
      { icon: <MdPerson size={20} />, label: 'Nurses', link: '/nurse' },
      { icon: <MdPerson size={20} />, label: 'Pharmacist' },
      { icon: <MdPerson size={20} />, label: 'Laboraties' },
    ],
  },
  {
    type: 'labs',
    icon: <ImLab size={20} />,
    label: 'Labs',
    item: [{ icon: <BiRadioCircle size={20} />, label: 'Patients Test' }],
  },
  {
    type: 'beds',
    icon: <BiHotel size={20} />,
    label: 'Beds',
    item: [{ icon: <BiRadioCircle size={20} />, label: 'Beds Categories' }],
  },
];

const useStyles = makeStyles((theme) => ({
  drawer_bg: {
    color: theme.palette.common.white,
    backgroundColor: theme.palette.primary.main,
  },
  drawer: {
    width: DrawerWidth,
    '& .MuiListItemIcon-root': {
      color: theme.palette.common.white,
      minWidth: 40,
    },
    '& .MuiListItem-root': {
      justifyContent: 'center',
    },
  },
  drawer_open: {
    width: DrawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawer_close: {
    width: 70,
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    '& .MuiListItemText-root': {
      display: 'none',
    },
    '& .MuiListItemIcon-root': {
      justifyContent: 'center',
    },
  },

  avatar: {
    backgroundColor: deepPurple[500],
    color: theme.palette.getContrastText(deepPurple[500]),
  },
  avatar_small: {
    width: 25,
    height: 25,
  },
}));
