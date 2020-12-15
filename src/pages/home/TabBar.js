import React, { useEffect, useState } from 'react';
import io from 'socket.io-client'
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import InputBase from '@material-ui/core/InputBase';
import { fade, makeStyles } from '@material-ui/core/styles';
import Badge from '@material-ui/core/Badge'
import NotificationsIcon from '@material-ui/icons/Notifications';
import PersonAdd from '@material-ui/icons/PersonAdd';
import SearchIcon from '@material-ui/icons/Search';
import {gql, useMutation} from '@apollo/client'
import Fade from '@material-ui/core/Fade';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import NotifyItem from '../../components/NotifyItem'
import {domain, server} from '../../utils/constant'

const GET_NOTIFY = gql`
  mutation GetNotify($userId: String!){
    getNotify(userId: $userId){
      senderId
      type
      isRead
    }
  }
`

export default function SearchAppBar() {
  const classes = useStyles();
  const userId = localStorage.getItem("id")
  const [id, setID] = useState(userId)

  const [updateNotify] = useMutation(GET_NOTIFY)
  const [friendBadge, setFriendBadge] = useState(0)
  const [notify, setNotify] = useState(0)
  const [dataNotify, setDataNotify] = useState([])

  
  // const socket = io(`${server}/notify?userId=${userId}`, {
  //   autoConnect: false,
  //   secure: true,
  //   path:'/notify'
  // })
  const socket = io(`http://52.187.62.22:4002?userId=${userId}`, {
    path: '/notify',
    autoConnect: false,
    secure: true

  })
  useEffect(() => {
    socket.open()
  }, [id])
  global.notifySocket = socket
  const closeSocket = () => {
    socket.close()
  }


  socket.on("receive-add-fr-notify", (dataa) => {
    setFriendBadge(friendBadge + 1)
    setNotify(notify + 1)
  })

  const onClickNotify = (e) => {
    e.preventDefault();
    updateNotify({
      variables: {userId: userId}
    })
    .then(res => {

      setDataNotify(res.data.getNotify)
    })
    .catch(err => console.log(err))
  }


  const [anchorEl, setAnchorEl] = React.useState(null);
  const [open, setOpen] = React.useState(false);
  const [placement, setPlacement] = React.useState();

  const handleClick = (newPlacement) => (e) => {
    setAnchorEl(e.currentTarget);
    setOpen((prev) => placement !== newPlacement || !prev);
    setPlacement(newPlacement);

    onClickNotify(e);
  };

  return (
    <div className={classes.root} >
      <AppBar position="static" style={{ backgroundColor: "#f8f8ff", boxShadow: 'none' }}>
        <Toolbar>

          <Typography className={classes.title} variant="h6" noWrap>
            Chat
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

          <div style={{ marginRight: 20 }} >
            <Badge color="secondary" badgeContent={friendBadge}>
              <PersonAdd className="icon-person" style={{ color: "black", marginLeft: 60 }} />
            </Badge>
          </div>

          
          <div style={{ marginRight: 20 }}>
            <Badge color="secondary" badgeContent={notify} >
              <NotificationsIcon 
                className="icon-notification bg-black text-dark" 
                style={{ color: "black", marginLeft: 10 }} 
                onClick={handleClick('bottom-end')} 
                />
            </Badge>
          </div>

          <Popper open={open} anchorEl={anchorEl} placement={placement} transition>
            {({ TransitionProps }) => (
              <Fade {...TransitionProps} timeout={350}>
                <Paper className={classes.paperNotify}>
                  <Typography className={classes.typography}>

                  {
                     dataNotify.map((value, index) => {
                      return (
                        <NotifyItem value={value} key={index} />
                        // <li key={index} className={classes.itemNotify}>{value.type}</li>
                      )
                    })
                  }
                  <hr />
                  
                  </Typography>
                </Paper>
              </Fade>
            )}
          </Popper>

          <div style={{
            color: 'black',
            marginLeft: 20, fontWeight: 'bold',
            padding: 12,
            paddingTop: 5,
            paddingBottom: 5,
            
            textAlign: 'center',
            borderRadius: 5,
            backgroundColor: "#fff",
            boxShadow: '0px 0px 5px 0px #e8d3e8'
          }}>
            {localStorage.getItem("name")}
          </div>

        </Toolbar>
      </AppBar>
    </div>
  );
}

const useStyles = makeStyles((theme) => ({
  root: {
    position: 'absolute',
    width: `calc(100% - 160px)`,
    top: '0px',
    left: '160px',
    padding: 0,
  },

  title: {
    flexGrow: 1,
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
    color: "black"
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 1),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 1),
    },
    marginLeft: 0,
    width: '200px',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(1),
      width: 'auto',
    },
  },
  searchIcon: {
    color: '',
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'black',
  },
  inputInput: {
    // padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    transform: '1s',
    width: '200px',
    [theme.breakpoints.up('sm')]: {
      width: '200px',
      '&:focus': {
        width: '300px',
      },
    },
  },
  typography: {
    // padding: theme.spacing(2),
    paddingTop: 10,
    borderRadius: 10,
    backgroundColor: '#FAFAFA'
  },
  paperNotify: {
    
  },
  itemNotify: {
    padding: '5px',
    backgroundColor: '#F2F2F2',
    borderRadius: '5px',
    marginTop: '5px',
    color: 'black'
  },
  markAllReaded: {
    color: '#6303b1',
    cursor: 'pointer'
  },
  readMoreNotifications: {
    textAlign: 'center',
    color: '#6303b1',
    cursor: 'pointer'
  }
}));