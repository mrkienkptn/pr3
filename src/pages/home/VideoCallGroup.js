
import React, { useState, useEffect } from 'react';
import CallIcon from '@material-ui/icons/Call';
import CallEndIcon from '@material-ui/icons/CallEnd';
import MicIcon from '@material-ui/icons/Mic';
import MicOffIcon from '@material-ui/icons/MicOff';
import VideocamIcon from '@material-ui/icons/Videocam';
import VideocamOffIcon from '@material-ui/icons/VideocamOff';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import CloseIcon from '@material-ui/icons/Close';
import MinimizeIcon from '@material-ui/icons/Minimize';
import { dragElement } from '../../utils/dragElement'
import Peer from 'peerjs'
import './VideoCallGroup.css'
import {domain, server} from '../../utils/constant'
import {gql, useMutation} from '@apollo/client'

const GET_USER_INFO = gql`
    mutation GetUserInfo($userId: String!) {
        getUserInfo(userId: $userId) {
            name
        }
    }
`




const VideoC = (props) => {

    const {  groupId, groupName } = props
    const [isCalling, setIsCalling] = useState(false)
    const [micOn, setMicOn] = useState(true)
    const [camOn, setCamOn] = useState(true)
    const [openAlert, setOpenAlert] = useState(false)

    const [GetUserInfo] = useMutation(GET_USER_INFO)

    const userId = localStorage.getItem('id')
    
    const peerId = userId
    

    const sendData = (event, data) => {
        global.notifySocket.emit(event, JSON.stringify(data))
    }
    const handleMic = () => {
        setMicOn(!micOn)
    }
    const closeVideoCall = () => {
        setOpenAlert(true)
    }
    const closeAlert = () => {
        setOpenAlert(false)
    }
    const agreeAlert = () => {
        hangup()
        props.setVideoView(null)
        setOpenAlert(false)
    }
    const addVideoStream = (video, stream, div) => {
        video.srcObject = stream

        video.addEventListener('loadedmetadata', () => {
            video.play()
        })
        div.append(video)
        document.getElementById('remote-videoo').append(div)

    }
    const startCall = async (peer) => {
        setIsCalling(true)
        try {
            navigator.mediaDevices.getUserMedia({ video: true, audio: true })
                .then(stream => {
                    
                    document.getElementById('local-video').srcObject = stream
                   
                    peer.on('call', call => {
                        console.log("RECEIVE CALLLLLLLLL", call.peer)

                        const div = document.createElement('div')
                        div.setAttribute('class', 'video-item')
                        const name = document.createElement('p')
                        const video = document.createElement('video')
                        video.setAttribute('class', 'remote-video')   
                        call.answer(stream)
                        
                        call.on('stream', async userStream => {                                                     
                            let rmName = (await GetUserInfo({variables: {userId: call.peer}})).data.getUserInfo.name
                            name.innerHTML = rmName
                            div.append(name)
                            addVideoStream(video, userStream, div)
                        })       

                        call.on('close', () => {
                            div.remove()
                        })
                        global.notifySocket.on('member_quit', dt => {
                            let id = JSON.parse(dt).peerId
                            if (id === call.peer)
                                call.close() //fix here
                        })
                        
                    })

                    global.notifySocket.on('member_join', dt => {

                        console.log("HAS MEMBER JOIN : ", JSON.parse(dt).peerId)
                        connectToNewMember(JSON.parse(dt), stream, peer)
                    })

                    sendData("join_group_call", {
                        callerId: localStorage.getItem('id'),
                        groupId: groupId,
                        peerId: peerId,
                        callerName: localStorage.getItem('name')
                    })
                })
        } catch (error) {
            console.log(error)
        }
    }


    const connectToNewMember = (peerData, stream, peer) => {
        console.log("CALL TO, ", peerData.peerId)
        const call = peer.call(peerData.peerId, stream)
        
        if (call === undefined) return 
        const div = document.createElement('div')
        div.setAttribute('class', 'video-item')

        const name = document.createElement('p')
        name.innerHTML = peerData.callerName

        div.append(name)

        const video = document.createElement('video')
        video.setAttribute('class', 'remote-video')


        call.on('stream', userStream => {
            console.log("RECEISTREAM, ", userStream)
            addVideoStream(video, userStream, div)
        })
        call.on('close', () => {
            div.remove()
        })
        global.notifySocket.on('member_quit', dt => {
            let id = JSON.parse(dt).peerId
            console.log(id)
            if (id === peerData.peerId)
            call.close() //fix here
        })
    }

    const hangup = () => {
        global.notifySocket.emit('quit-group-call', { peerId: peerId, groupId: groupId })
        let video = document.getElementById('local-video')
        let mediaStream = video.srcObject
        mediaStream.getTracks().forEach(track => track.stop())
    }

    useEffect(() => {

        const peer = new Peer(userId, {host: domain, secure: true, path: '/call-video'})
        peer.on('open', id => console.log("GROUP CALL PEER ID: ", id))
        peer.on('error', err => {
            console.log(err)
        })
        peer.on('disconnected', ()=> {
            console.log("DIS")
        })

        startCall(peer)

        dragElement(document.getElementById("video-call-gr"))
        return () => {
            global.notifySocket.off('receive_reply_peerId')
            global.notifySocket.off('end-call')
            global.notifySocket.off('member_join')
            global.notifySocket.off('member_quit')
            peer.destroy()
        }

    }, [])

    const minimize = () => {
        document.getElementById('video-call-gr').setAttribute('class', 'minimize')
        document.getElementById('minimize-btn').setAttribute('class', 'min-item')
    }
    const maximize = () => {
        document.getElementById('video-call-gr').setAttribute('class', 'maximize')
        document.getElementById('minimize-btn').setAttribute('class', 'hide-min-item')
    }
    return (
        <div>
            <div id="video-call-gr" className="maximize">
                <div id="video-call-grheader">
                    <div className="info">
                        
                            <div style={{ width:30, height:30, borderRadius: 15, backgroundColor:'green'}} ></div>
                        
                        <div className="video-call-name">
                            {groupName}
                        </div>
                    </div>
                    <div className="action">
                        <button onClick={minimize}>

                            <MinimizeIcon style={{ color: "#5f18af" }} />
                        </button>
                        <button onClick={closeVideoCall}>
                            <CloseIcon style={{ color: "red" }} />
                        </button>
                    </div>
                </div>
                <div id="remote-videoo">
                    <div className="video-item" >
                        <p>{localStorage.getItem('name')}</p>
                        <video className="local-video" autoPlay id="local-video" muted={!micOn}></video>
                    </div>
                </div>
                <div id="video-frame" className="video-frame" >
                    <div className="handle-btn">
                        {
                            isCalling ?
                                <button onClick={closeVideoCall}>
                                    <CallEndIcon style={{ color: "red" }} />
                                </button>
                                :
                                <button onClick={startCall}>
                                    <CallIcon style={{ color: "green" }} />

                                </button>
                        }
                        {
                            micOn ?
                                <button onClick={handleMic}>
                                    <MicOffIcon style={{ color: "gray" }} />
                                </button>
                                :
                                <button onClick={handleMic}>
                                    <MicIcon style={{ color: "black" }} />
                                </button>
                        }
                        {
                            camOn ?
                                <button>
                                    <VideocamOffIcon style={{ color: "gray" }} />
                                </button>
                                :
                                <buttom>
                                    <VideocamIcon style={{ color: "black" }} />
                                </buttom>
                        }

                    </div>



                </div>
                <Dialog
                    open={openAlert}
                    onClose={closeAlert}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">{"Close will end this call?"}</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            Do you want to continue?
                    </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={closeAlert} color="primary">
                            Cancel
                    </Button>
                        <Button onClick={agreeAlert} color="primary" autoFocus>
                            End call
                    </Button>
                    </DialogActions>
                </Dialog>
            </div>
            <button id="minimize-btn" onClick={maximize} title={groupName}>
                <div className="min-item-badge" >
                    <div className="badge-icon">
                        <VideocamIcon style={{ color: "red" }} />
                    </div>
                </div>
            </button>
        </div>
    );
}

export default VideoC;
