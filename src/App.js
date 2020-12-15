import React from 'react'
import { BrowserRouter as Router, Switch, Link } from 'react-router-dom'
import PublicRoute from './components/PublicRoute'
import PrivateRoute from './components/PrivateRoute'
import Login from './pages/login'
import SignUp from './pages/signup'
import StartPage from './pages/start'
import Home from './pages/home'
import './index.css'
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import {domain, server} from './utils/constant'

const client = new ApolloClient({
    uri: `${server}/graphql`,
    cache: new InMemoryCache()
});
const App = () => {
    return (
        <ApolloProvider client={client}>
            <Router>
                <Switch>
                    <PublicRoute exact={true} path="/" component={StartPage} />
                    <PublicRoute exact={true} path="/login" component={Login} />
                    <PublicRoute exact={true} path="/signup" component={SignUp} />
                    <PrivateRoute exact={true} path="/home" component={Home} />
                </Switch>
            </Router>
        </ApolloProvider>
    )
}
export default App