import React, { useEffect, useState } from 'react'
import { fade, makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import ImageIcon from '@material-ui/icons/Image';



const useStyles = makeStyles((theme) => ({

    item: {
        height: 60,
        marginBottom: 5,
        backgroundColor: "#fff",
        marginRight: 5,
        '&:hover': { backgroundColor: "#f8f8ff" }
    }
}));

const GroupListItem = props => {
    const classes = useStyles()
    return (

        <ListItem button  className={classes.item} onClick={() => props.changeGroupConversation(props.indexGroup)}>
            <ListItemAvatar>
                <Avatar>
                    <ImageIcon />
                </Avatar>
            </ListItemAvatar>
            <ListItemText primary={props.groupName} secondary="Oct 10, 2020" />
        </ListItem>

    )
}

export default GroupListItem