import React, { useCallback, useEffect, useState } from 'react';
import io from 'socket.io-client'
import Peer from 'peerjs'
import VideoC from '../pages/home/VideoC'
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import {domain, server} from '../utils/constant'

const userId = localStorage.getItem('id')
const userName = localStorage.getItem('name')


const peer = new Peer(userId + 'vdcall', {host: domain, secure: true, path: '/call-video'})
// const videoSocket = io(`${server}/video-call?userId=${userId}`, { autoConnect: false, path: '/video-call'})
const videoSocket = io(`http://52.187.62.22:4004?userId=${userId}`, {
    path: '/video-call',
    autoConnect: false,
    secure: true

  })
const VideoCallProvider = () => {


    const [callWindow, setCallWindow] = useState(null)
    const [busy, setBusy] = useState(false)
    const [busyAlert, setBusyAlert] = useState(false)
    const [remoteName, setRemoteName] = useState('')
    // const [peerId, setPeerId] = useState('')
    peer.on('open', id => {
        console.log('Peer id: ', id)
        // setPeerId(id)
    })

    const closeBusyAlert = () => {
        setBusyAlert(false)
    }

    const call = (action, calleeId, calleeName) => {
        let Videov = (<VideoC
            contactId={calleeId}
            action={action}
            calleeName={calleeName}
            setCallWindow={setCallWindow}
            setBusy={setBusy}
            peer={peer}
            peerId={userId + 'vdcall'}
            socket={videoSocket}
        />)
        setCallWindow(Videov)
    }
    const startCall = (calleeId, calleeName) => {
        setBusy(true)
        call('start_a_call', calleeId, calleeName)
    }
    global.startCall = startCall
    useEffect(() => {
        console.log("busy: ", busy)
        videoSocket.open()
        videoSocket.on('receive_a_call', data => {
            const { callerId, callerName } = data

            if (busy) {
                console.log("avoid call ")
                videoSocket.emit('busying', { callerId: callerId, calleeName: userName })
            } else {
                setBusy(true)
                call('receive_a_call', callerId, callerName)
                videoSocket.emit('reply_peerId', { callerId: callerId, peerId: userId + 'vdcall' })
            }
        })
        videoSocket.on('callee_busying', ({ calleeName }) => {
            setRemoteName(calleeName)
            setBusyAlert(true)
            setCallWindow(null)
        })
        return () => {
            videoSocket.off('receive_a_call')
            videoSocket.off('calee_busying')
        }
    }, [busy])

    return (

        <div>
            {callWindow}
            <Dialog
                open={busyAlert}
                onClose={closeBusyAlert}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{`${remoteName} is in a call!`}</DialogTitle>
            </Dialog>
        </div>

    );
}

export default VideoCallProvider;
