import React, { useEffect, useState, useCallback } from 'react'
import { fade, makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';

import Message from './Messages'
import SearchIcon from '@material-ui/icons/Search';
import ChatListItem from '../../components/ChatListItem'
import GroupListItem from './../../components/GroupListItem'
import { useQuery, gql, useMutation } from '@apollo/client'
import CircularProgress from '@material-ui/core/CircularProgress';
import JoinGroup from '@material-ui/icons/AddCircleOutlined';
import ModalAddUserToGroup from './../../components/ModalAddUserToGroup';
import ModalJoinGroup from './../../components/ModalJoinGroup';
import CreateGroup from '@material-ui/icons/BorderColor';
import './index.css'
import MessagesGroup from './MessagesGroup'


const useStyles = makeStyles((theme) => ({
    root: {
        width: 300,
        backgroundColor: "#f8f8ff",
    },
    item: {
        height: 60,
        marginBottom: 5,
        backgroundColor: "#fff",
        marginRight: 5,
        '&:hover': { backgroundColor: "#f8f8ff" }
    }
}));

const GET_FRIEND = gql`
    query GetFriendList ($userId: String!){
        getFriendList(userId: $userId){
            id
            name
        }

        getGroupList (userId: $userId) {
            id
            name
            admin
            code
        }
    }
`

const GET_CONVERSATION = gql`
    mutation GetConversation($senderId: String!, $receiverId: String!){
        getConversation(senderId: $senderId, receiverId: $receiverId){
            receiverId
            text{
                sender
                time
                content
            }
        }
    }

`

const GET_GROUP_CONVERSATION = gql`
    mutation GetGroupConversation($userId: String!, $id: String!) {
        getGroupConversation (userId: $userId, id: $id) {
            id
            admin
            member
            message {
                senderId
                senderName
                content
            }
        }
    }
`

const ChatList = props => {

    const classes = useStyles();
    const [videoIndex, setVideoIndex] = useState(0)

    const [conversationData, setConversationData] = useState({ contact: '', msgData: '' })
    const [groupConversationData, setGroupConversationData] = useState({ groupName: '', messGroup: '' })
    const [statusChatUser, setStatusChatUser] = useState(false)
    const [loadingConversation, setLoadingConversation] = useState(true)
    const [status, setStatus] = useState('')

    const userId = localStorage.getItem("id")

    const [GetConversation] = useMutation(GET_CONVERSATION)
    const [GetGroupConversation] = useMutation(GET_GROUP_CONVERSATION)


    const { loading, error, data, refetch } = useQuery(GET_FRIEND, { variables: { userId: userId } })
    
    if (loading) return (
        <div className="chat-list">
            <CircularProgress color="secondary" />
        </div>
    )
    if (error) return `Error: ${error.message}`
    
    else {

        const changeConversation = async (index) => {
            let res = await onChangeConversation(userId, data.getFriendList[index].id)
            let passData = {
                contact: data.getFriendList[index],
                msgData: res.data.getConversation.text
            }
            setConversationData(passData)
            setStatus('friend')
        }
        const onChangeConversation = async (senderId, receiverId) => {
            let res = await GetConversation({ variables: { senderId: senderId, receiverId: receiverId } })
            return res

        }

        const changeGroupConversation = (index) => {
            console.log(data.getGroupList[index]);
            GetGroupConversation({ variables: { userId: userId, id: data.getGroupList[index].id } })
                .then(res => {
                    // console.log(res.data.getGroupConversation.member);
                    let memberGroup = res.data.getGroupConversation.member
                    memberGroup = memberGroup.concat([res.data.getGroupConversation.admin])
                    let dataInGroup = {
                        idGroup: data.getGroupList[index].id,
                        codeGroup: data.getGroupList[index].code,
                        groupName: data.getGroupList[index].name,
                        messGroup: res.data.getGroupConversation.message,
                        memberGroup: memberGroup
                    }
                    let dataJoinRoom = {
                        idGroup: data.getGroupList[index].id,
                        memberGroup: memberGroup,
                        senderId: userId
                    }
                    global.chatSocket.emit('join-room-chat', dataJoinRoom)
                    // console.log(res.data.getGroupConversation.message);
                    setGroupConversationData(dataInGroup)
                    setStatus('group')
                })
                .catch(err => {
                    console.log(err);
                })
        }

        global.chatSocket.on('res-create-new-group', (data) => {
            if (data.status === true) {
                refetch()
            }
        })

        global.chatSocket.on('res-join-group', (data) => {
            if (data.status === true) {
                refetch()
            }
        })


        global.refetchFriendList = refetch

        return (
            <div className="chat-list">

                <div className="d-flex justify-content-center">
                    <div className="search-message">
                        <SearchIcon />
                        <input placeholder="Seacrh message..." />
                    </div>
                    <div>
                        <CreateGroup
                            style={{ margin: '15px 0px' }}
                            data-toggle="modal" data-target="#addGroupChatRoom"
                        />
                    </div>
                    <div>
                        <JoinGroup
                            style={{ margin: '15px auto' }}
                            data-toggle="modal" data-target="#joinGroup"
                        />
                    </div>
                </div>


                <div className="friends">
                    <List className={classes.root} component="nav">
                        {data.getFriendList.map((item, index) => (
                            <ChatListItem key={item.id} name={item.name} index={index} changeConversation={changeConversation} />
                        ))}

                        {data.getGroupList.map((item, index) => (
                            <GroupListItem key={item.id} groupName={item.name} indexGroup={index} changeGroupConversation={changeGroupConversation} />
                        ))}

                    </List>
                </div>

                <div className="conversation">
                    {status === 'friend' && <Message peerId={props.peerId} peer={props.peer} data={conversationData} />}
                    {status === 'group' && <MessagesGroup  dataGroup={groupConversationData} />}

                </div>

                <div className="modal fade" id="addGroupChatRoom" tabIndex={-1} role="dialog" aria-labelledby="addGroupChatRoom" aria-hidden="true">
                    <ModalAddUserToGroup />
                </div>


                <div className="modal fade" id="joinGroup" tabIndex={-1} role="dialog" aria-labelledby="joinGroup" aria-hidden="true">
                    <ModalJoinGroup />
                </div>

            </div>
        )
    }
}

export default ChatList