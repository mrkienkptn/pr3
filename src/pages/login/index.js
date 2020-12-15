import React, {useState} from 'react'
import {Link, useHistory} from 'react-router-dom'
import {gql, useMutation, useLazyQuery} from '@apollo/client'
import './index.css'
import logo from './images/img-01.png'
import CircularProgress from '@material-ui/core/CircularProgress';

const LOGIN = gql`
    mutation Login($email: String!, $password: String!){
        login (email: $email, password: $password){
            user{
                id
                name
            }
            token
        }
    }
`

const Login = props => {
    const history = useHistory()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [inProgress, setInProgress ] = useState(false)
    const [fail, setFail] = useState('')

    const [login, result] = useMutation(LOGIN)

    const onChangeEmail = e => setEmail(e.target.value)
    const onChangePassword = e => setPassword(e.target.value)
    const handleLogin = (e) =>{
        e.preventDefault()
        login({
            variables: {email: email, password: password}
        })
        .then(res => {
            console.log(res.data.login)
            const {token, user} = res.data.login
            localStorage.setItem("access-token", token)
            localStorage.setItem("name", user.name)
            localStorage.setItem("id", user.id)
            history.push(`/home`)
        })
        .catch(err =>{
            setFail(err.message)
            setEmail('')
            setPassword('')
        })
    }
    return (
        <div className="limiter">
            <div className="container-login100">
                <div className="wrap-login100">
                    <div className="login100-pic js-tilt" data-tilt>
                        <img src={logo} alt="IMG" />
                    </div>

                    <form className="login100-form">
                        <span className="login100-form-title">
                            Member Login
                        </span>

                        <div className="wrap-input100 validate-input">
                            <input className="input100" type="email" name="email" placeholder="Email" value={email} onChange={onChangeEmail} />
                            <span className="focus-input100" />
                            <span className="symbol-input100">
                            <i className="fa fa-envelope" aria-hidden="true" />
                            </span>
                        </div>

                        <div className="wrap-input100 validate-input" data-validate="Password is required" value={password} onChange={onChangePassword}>
                            <input className="input100" type="password" name="pass" placeholder="Password" />
                            <span className="focus-input100" />
                            <span className="symbol-input100">
                            <i className="fa fa-lock" aria-hidden="true" />
                            </span>
                        </div>
                        <p style={{textAlign:'center', color: 'red'}} >{fail}</p>
                        <div className="container-login100-form-btn">
                            <button disabled={inProgress} onClick={handleLogin} className="login100-form-btn">
                                Login
                                {inProgress && <CircularProgress size={20}/>}
                            </button>
                        </div>
                        
                        <div className="text-center p-t-12">
                            <span className="txt1">
                                Forgot
                            </span>
                            <a className="txt2" href="#">
                                Username / Password?
                            </a>
                        </div>

                        <div className="text-center p-t-136">
                            <Link className="txt2" to="/signup">
                                Create your Account
                                <i className="fa fa-arrow-right m-l-5" aria-hidden="true" />
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
export default Login