import React, { useEffect, useState, useCallback } from 'react'
import ReceiveMesGroup from '../../components/ReceiveMesGroup'
import SendMes from '../../components/SendMes'
import SendIcon from '@material-ui/icons/Send'
import './Message.css'
import {gql, useMutation, useQuery} from '@apollo/client'
import VideocamIcon from '@material-ui/icons/Videocam'
import VideoCallGroup from './VideoCallGroup'

const SEND_MESS_GROUP = gql`
    mutation SendMessGroup($senderId: String!, $idGroup: String!, $content: String!) {
        sendMessGroup(senderId: $senderId, idGroup: $idGroup, content: $content) {
            senderId
            senderName
            content
        }
    }
`

const MessagesGroup = props => {

    const currentUserId = localStorage.getItem("id")
    const idGroup = props.dataGroup.idGroup
    const memberGroup = props.dataGroup.memberGroup
    const [messTextGroup, setMessTextGroup] = useState('')
    const [SendMessGroup] = useMutation(SEND_MESS_GROUP)
    const [messagesGroup, setMessagesGroup] = useState('')
    const [videoView, setVideoView] = useState(null)


    const onChangeMessGroup = (e) => {
        setMessTextGroup(e.target.value)
    }

    const sendMessToGroup = (content) => {
        SendMessGroup({variables: {senderId: currentUserId, idGroup: idGroup, content: content}})
        .then((res) => {
            setMessagesGroup([...messagesGroup, {senderId: res.data.sendMessGroup.senderId, senderName: res.data.sendMessGroup.senderName, content: content}])
            setMessTextGroup('')
            global.chatSocket.emit('send-mess-group', {memberGroup: memberGroup, idGroup: idGroup, content: content, senderName: res.data.sendMessGroup.senderName, senderId: res.data.sendMessGroup.senderId})
        })
        .catch(err => {
            console.log(err);
        })
    }

    global.chatSocket.on('res-send-mess-group', (data)=>{
        console.log(data);
        setMessagesGroup([ ...messagesGroup, {senderId: data.senderId, senderName: data.senderName, content: data.content}])         
    })

    const call = (groupId, groupName) => {
        let Videov = (<VideoCallGroup
            groupId={groupId}
            groupName={groupName}
            setVideoView={setVideoView}
        />)
        setVideoView(Videov)
    }


    const joinCall = ()=> {
        call(props.dataGroup.codeGroup, props.dataGroup.groupName )
    }
    useEffect(() => {
        setMessagesGroup(props.dataGroup.messGroup)
    }, [props.dataGroup.messGroup])

    return (
        <div className="message" >
            <div className="chat-header-bar" >
                <div style={{ fontWeight: "bold", fontSize: 20 }}>{props.dataGroup.groupName} {props.dataGroup.codeGroup}</div>
                <button onClick={joinCall}>
                    <VideocamIcon />
                </button>
            </div>
            <div className="content">
                {messagesGroup !== '' ? messagesGroup.map((msg, idx) => msg.senderId === currentUserId ? <SendMes content={msg.content} /> : <ReceiveMesGroup name={msg.senderName} content={msg.content} />) : ''}
            </div>
            <div className="input">
                <input value={messTextGroup} onChange={onChangeMessGroup}/>
                <button onClick={() => {sendMessToGroup(messTextGroup)}}><SendIcon /></button>
            </div>
            {videoView}
        </div>
    )
}

export default MessagesGroup