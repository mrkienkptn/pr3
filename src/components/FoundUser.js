import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import ImageIcon from '@material-ui/icons/Image';
import './FoundUser.css'
import { gql, useMutation } from '@apollo/client'

const ADD_FRIEND = gql`
    mutation AddFriend($userId: String!, $contactId: String! ){
        addFriend(userId: $userId, contactId: $contactId){
            id
            contactId
            status
            createdAt
        }
    }
`

const useStyles = makeStyles((theme) => ({
    button: {
        margin: theme.spacing(1),
        textTransform: 'capitalize',
        height: 35,
        marginRight: 20
    },
}));

const FoundUser = (props) => {
    const [AddFriend, d] = useMutation(ADD_FRIEND)
    const buttonText = props.status === "pending" ? "Cancel Request" : props.status === "accept" ? "Accepted" : "Add Friend"
    const [button, setButton] = useState(buttonText)
    const [status, setStatus] = useState(props.status)
    const onClickAddFriend = () => {
        let userId = localStorage.getItem("id")
        AddFriend({
            variables: {
                userId: userId,
                contactId: props.contactId
            }
        })
            .then(data => {
                setButton("Cancel Request")
                setStatus("pending")
            })
    }

    const onClickUnFriend = () => {
        console.log("Cancelreqyest")
    }
    const classes = useStyles();
    return (
        <div className="user-item">
            <div className="ava-name">
                <Avatar>
                    <ImageIcon />
                </Avatar>
                <div className="name" >{props.name}</div>
            </div>

            <Button
                onClick={status === "none" ? onClickAddFriend : onClickUnFriend}
                variant="contained"
                color="primary"
                size="small"
                className={classes.button}
                startIcon={<PersonAddIcon />}
            >
                {button}
            </Button>
        </div>
    );
}

export default FoundUser;
