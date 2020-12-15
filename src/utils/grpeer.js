import Peer from 'peerjs'
import {domain, server} from './constant'
const userId = localStorage.getItem('id')

let peer = new Peer(userId, {host: domain, port: 80, path: '/call-video'})
peer.on('open', id => {
    console.log("GR PEER, ", id)
})

peer.on('error', (e)=> {
    console.log(e)
})
export default peer