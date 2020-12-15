import React from 'react'
import SideBar from './SideBar'
import TabBar from './TabBar'

import './index.css'
import VideoCallProvider from '../../components/VideoCallProvider'
const Home = props => {
    return (

        <div className="container-home">
            <TabBar/>
            <SideBar/>
            <VideoCallProvider />
        </div>

    )
}
export default Home