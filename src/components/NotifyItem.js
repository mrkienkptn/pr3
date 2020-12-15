import React, {useState} from 'react';
import './NotifyItem.css'
import { Button} from '@material-ui/core/';
import {gql, useMutation} from '@apollo/client'

const ACCEPT_REQUEST = gql`
    mutation AcceptFriend($userId: String!, $contactId: String!, $type: String!){
        acceptFriend(userId: $userId, contactId: $contactId, type: $type){
            userId
            contactId
            status
            createdAt
        }
    }
`

const NotifyItem = (props) => {
    const userId = localStorage.getItem("id")
    const [success, setSuccess] = useState(false)
    const [AcceptFriend] = useMutation(ACCEPT_REQUEST)
    const acceptRequest = () => {
        AcceptFriend({variables:{ userId: userId, contactId: props.value.senderId, type: props.value.type }})
        .then((data)=>{
            if (data.data.acceptFriend.status === true) {
                setSuccess(true)
                global.refetchFriendList()
            }
        })
    }

    const cancelRequest = () => {
        return
    }
    return (
        <div className="notify-item">
            {props.value.isRead ? "Friend request is accepted" : props.value.type}
            {
                props.value.isRead===false && success===false && !props.value.type.includes('Accepted')
                && 
                <div className="button-div">
                    <Button size="small"
                        disabled={success}
                        onClick={acceptRequest}
                        style={{
                            backgroundColor:"#5f18af",
                             color: '#fff', 
                             fontSize:14, 
                             textTransform:'capitalize'
                            }}
                        >Accept</Button>
                    <Button
                    size="small"
                        color="#5f18af"
                        style={{
                            border :'2px solid #5f18af',
                            
                            fontSize:14, 
                            textTransform:'capitalize'
                            }}
                    >Cancel</Button>
                </div>
            }
        </div>
    );
}

export default NotifyItem;
