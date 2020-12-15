
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

import './VideoCall.css'

const VideoC = (props) => {


    const { action, peer, peerId, contactId, socket } = props
    const [friendPeerId, setCalleePeerId] = useState('')
    const [isCalling, setIsCalling] = useState(false)
    const [micOn, setMicOn] = useState(true)
    const [camOn, setCamOn] = useState(true)
    const [openAlert, setOpenAlert] = useState(false)


    const sendData = (event, data) => {
        socket.emit(event, JSON.stringify(data))
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
    }

    const startCall = async () => {
        sendData("start_a_call", {
            callerId: localStorage.getItem('id'),
            calleeId: contactId,
            callerName: localStorage.getItem('name')
        })
    }

    

    const hangup = () => {
        socket.emit('end-call', {calleeId: contactId})
        
        let video = document.getElementById('local-video')
        let mediaStream = video.srcObject
        mediaStream.getTracks().forEach(track => track.stop())
        props.setBusy(false)
        props.setCallWindow(null)
        // peer.reconnect()
    }

    useEffect(() => {
        socket.on('receive_reply_peerId', async dt => {
            try {
                setIsCalling(true)
                console.log(dt.calleePeerId)
                setCalleePeerId(dt.calleePeerId)
                let stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
                document.getElementById('local-video').srcObject = stream
                const call = peer.call(dt.calleePeerId, stream)
                call.on('stream', remoteStream => {
                    document.getElementById('remote-video').srcObject = remoteStream
                })
                console.log(stream)
            } catch (error) {

            }
        })
    
        peer.on('call', async (call) => {
            try {
                console.log("ON RECEIVE CALL")
                setIsCalling(true)

                let stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
                document.getElementById('local-video').srcObject = stream
                call.answer(stream)
                call.on('stream', remoteStream => {
                    document.getElementById('remote-video').srcObject = remoteStream
                })
            }
            catch (e) {

            }
        })
        socket.on('end-call', ()=> {
            setIsCalling(false)

        })           
        if (action === "start_a_call") {
            startCall()
        }
        dragElement(document.getElementById("video-call"))
        return () => {
            socket.off('receive_reply_peerId')
            socket.off('end-call')
        }
    }, [])

    return (
        <div id="video-call">
            <div id="video-callheader">
                <div className="info">
                    <div>
                        <img src="https://scontent-hkg4-2.xx.fbcdn.net/v/t1.0-9/125233232_3743178699108570_6642470821502695124_o.png?_nc_cat=111&ccb=2&_nc_sid=730e14&_nc_ohc=zpXUSOoAiHgAX8OrANx&_nc_ht=scontent-hkg4-2.xx&oh=73fca147f94188c441f642dbc7b103ab&oe=5FD0352A" width="50px" height="50px" style={{ borderRadius: '25px' }} />
                    </div>
                    <div className="video-call-name">
                        {props.calleeName}
                    </div>
                </div>
                <div className="action">
                    <button >

                        <MinimizeIcon style={{ color: "#5f18af" }} />
                    </button>
                    <button onClick={closeVideoCall}>
                        <CloseIcon style={{ color: "red" }} />
                    </button>
                </div>
            </div>
            <div className="video-frame" >
                <div className="handle-btn">
                    {
                        isCalling ?
                            <button onClick={() => { socket.emit('end-call', { calleeId: contactId }); hangup() }}>
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
                <video className="video" autoPlay id="local-video" muted={!micOn}></video>
                <video className="video" autoPlay id="remote-video" muted></video>

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

    );
}

export default VideoC;
