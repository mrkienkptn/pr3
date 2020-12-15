import React from 'react'
import {Route, Redirect} from 'react-router-dom'
const PrivateRoute = ({component: Component, ...rest})=>{
    const token = localStorage.getItem('access-token')
    return (
        <Route
            {...rest}
        >
            {token === null ? <Redirect to="/login" /> : <Component/>} 
        </Route>
    )
}
export default PrivateRoute