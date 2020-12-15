import React, { useEffect, useState, useCallback } from 'react'
import ReceiveMes from '../../components/ReceiveMes'
import SendMes from '../../components/SendMes'
import SendIcon from '@material-ui/icons/Send';
import VideocamIcon from '@material-ui/icons/Videocam';

import './Message.css'
import { gql, useMutation } from '@apollo/client'

const SEND_MESSAGE = gql`
    mutation SendMessage($senderId: String!, $receiverId: String!, $content: String!){
        sendMessage(senderId: $senderId, receiverId: $receiverId, content: $content){
            status
        }
    }
`
const GET_CONVERSATION = gql`
    query GetConversation($senderId: String!, $receiverId: String!){
        getConversation(senderId: $senderId, receiverId: $receiverId){
            content{
                time
                content
            }
        }
    }

`


const Messages = props => {


    const {data } = props

    const userId = localStorage.getItem("id")
    const userName = localStorage.getItem("name")
    const [SendMessage] = useMutation(SEND_MESSAGE)
    const [messageText, setMessageText] = useState('')
    const [VideoView, setVideoView] = useState(null)
    const [isInCall, setIsInCall] = useState(false)
    const [busyAlert, setBusyAlert] = useState(false)


    const contactId = data.contact.id
    const contactName = data.contact.name
    const [remoteName, setRemoteName] = useState(contactName)
    const [messages, setMessages] = useState('')


    const sendMessage = (content) => {
        SendMessage({ variables: { senderId: userId, receiverId: contactId, content: content } })

            .then((res) => {
                if (res.data.sendMessage.status) {
                    setMessages([...messages, { sender: userId, content: content },])
                }
                setMessageText('')
            })
    }


    const onChangeMessage = e => setMessageText(e.target.value)
    global.chatSocket.on('receive-msg', (data) => {
        console.log(data)
        if (data.senderId === contactId)
            setMessages([...messages, { sender: contactId, content: data.msg }])
    })
    useEffect(() => {
        setMessages(data.msgData)
    }, [data.msgData])

   
    return (
        <div className="message" >
            <div className="chat-header-bar" >
                <div style={{ fontWeight: "bold", fontSize: 20 }}>{data.contact.name}</div>
                {
                    data.contact.id !== undefined &&
                    <button onClick={() => {
                        setIsInCall(true)
                        global.startCall(contactId, contactName)
                    }} >
                        <VideocamIcon />
                    </button>
                }
            </div>
            <div className="content">
                {messages !== '' ? messages.map((msg, idx) => msg.sender === userId ? <SendMes content={msg.content} /> : <ReceiveMes content={msg.content} />) : ''}
            </div>
            <div className="input">
                <input value={messageText} onChange={onChangeMessage} />
                <button onClick={() => {
                    sendMessage(messageText)
                }} ><SendIcon /></button>
            </div>

            
        </div>
    )
}

export default Messages