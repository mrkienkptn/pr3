import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import { Link } from 'react-router-dom'
import ChatList from './ChatList'
import SearchUser from './SearchUser'
import ChatBubbleOutlineIcon from '@material-ui/icons/ChatBubbleOutline';
import PeopleOutlineIcon from '@material-ui/icons/PeopleOutline';
import VideoCallProvider from '../../components/VideoCallProvider'
import io from 'socket.io-client'
import {domain, server} from '../../utils/constant'

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      style={{ marginTop: 70 }}
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

const a11yProps = (index) => {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {

    backgroundColor: theme.palette.background.paper,
    display: 'flex',
    height: '100%',
    minHeight: '100vh',

  },
  tabs: {
    textAlign: 'left',
    paddingTop: 70,
    background: 'radial-gradient(circle, rgba(31,38,103,0.9), #5f18af)',
    color: "#fff"
  },
  logout: {
    width: '100%',
    position: 'absolute',
    bottom: '10px',
    left: '0px',
    display: 'flex',
    flexDirection: 'row',
    color: "#fff",
    justifyContent: 'center',
    textDecoration: 'none'
  }
}));


export default function VerticalTabs() {
  const userId = localStorage.getItem("id")
  // const [peerId, setPeerId] = useState('')
  const [id, setID] = useState(userId)
  // const chatSocket = io(`${server}/chat?userId=${userId}`, {
  //   path: '/chat',
  //   autoConnect: false,
  //   secure: true,
  //   rejectUnauthorized: false
  // })

  const chatSocket = io(`http://52.187.62.22:4003?userId=${userId}`, {
    path: '/chat',
    autoConnect: false,
    secure: true

  })

  chatSocket.on('receive-msg', dt=> {
    console.log(dt)
  })

  useEffect(() => {
    // peer.on('open', (id)=> {
    //   console.log("PEER ID: ", id)
    //   setPeerId(id)
    // })
    chatSocket.open()
    global.chatSocket = chatSocket
  }, [id])
  const closeSocket = () => {
    chatSocket.close()
  }

  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const handleLogout = () => {
    localStorage.clear()
    closeSocket()
    global.notifySocket.close()
  }
  return (
    <div fullWidth={100} className={classes.root}>
      <Tabs
        orientation="vertical"
        variant="scrollable"
        value={value}
        onChange={handleChange}
        aria-label="Vertical tabs example"
        className={classes.tabs}

      >

        <Tab style={{ textTransform: 'capitalize' }} label={<div><ChatBubbleOutlineIcon /> Message</div>} {...a11yProps(0)} />
        <Tab style={{ textTransform: 'capitalize' }} label={<div><PeopleOutlineIcon /> Find</div>} {...a11yProps(1)} />

        <Link onClick={handleLogout} className={classes.logout} to="/" ><ExitToAppIcon /> Logout</Link>
      </Tabs>
      <TabPanel value={value} index={0}>
        <ChatList />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <SearchUser />
      </TabPanel>

    
    </div>
  );
}
