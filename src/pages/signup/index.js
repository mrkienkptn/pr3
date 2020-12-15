import React, {useState} from 'react'
import {Link, useHistory} from 'react-router-dom'
import './../login/index.css'
import logo from './../login/images/img-01.png'
import { useQuery, gql, useMutation } from '@apollo/client';

const SIGNUP = gql`
    mutation SignUp($email: String!, $name: String!, $password: String!){
        signup ( newUser: {email: $email, name: $name, password: $password}){
            user{
                id
                name
            }
            token
        }
    }
`;



const SignUp = props => {
    const history = useHistory()
    const [email, setemail] = useState('')
    const [password, setPassword] = useState('')
    const [confirm, setConfirm] = useState('')
    const [name, setName] = useState('')
    const [match, setMatch] = useState('') 
    const [signup, {data}] = useMutation(SIGNUP)
    const [fail, setFailed] = useState('')

    const onChangeemail = (e)=> setemail(e.target.value)
    const onChangeName = (e)=> setName(e.target.value)
    const onChangePassword = (e)=> setPassword(e.target.value)
    const onChangeConfirm = (e)=> {
        setConfirm(e.target.value)
        if (e.target.value === password) {
            setMatch(true)
        }
        else setMatch(false)
    }
    const onSignUp = (e) => {
        e.preventDefault()        
        signup({variables: {email: email, name:name, password: password}})
        .then(res => {
            localStorage.setItem("access-token", res.data.signup.token)
            localStorage.setItem("name", res.data.signup.user.name)
            localStorage.setItem("id", res.data.signup.user.id)
            history.push(`/home`)
        })
        .catch(err => {
            setFailed(err.message)
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
                            Member Register
                        </span>

                        <div className="wrap-input100 validate-input">
                            <input className="input100" type="email" name="email" placeholder="email" onChange={onChangeemail} value={email} />
                            <span className="focus-input100" />
                            <span className="symbol-input100">
                            <i className="fas fa-user" aria-hidden="true"></i>
                            </span>
                        </div>

                        <div className="wrap-input100 validate-input">
                            <input className="input100" type="text" name="name" placeholder="Name" onChange={onChangeName} value={name} />
                            <span className="focus-input100" />
                            <span className="symbol-input100">
                            <i className="fa fa-envelope" aria-hidden="true" />
                            </span>
                        </div>

                        <div className="wrap-input100 validate-input" data-validate="Password is required">
                            <input className="input100" type="password" name="pass" placeholder="Password" onChange={onChangePassword} value={password} />
                            <span className="focus-input100" />
                            <span className="symbol-input100">
                            <i className="fa fa-lock" aria-hidden="true" />
                            </span>
                        </div>

                        <div className="wrap-input100 validate-input" data-validate="Password is required">
                            <input className="input100" type="password" name="re-pass" placeholder="Re-Password" onChange={onChangeConfirm} value={confirm} />
                            <span className="focus-input100" />
                            <span className="symbol-input100">
                            <i className="fa fa-lock" aria-hidden="true" />
                            </span>
                            {match === false  && <span style={{color:"red"}}>Invalid</span>}
                            <p span style={{color:"red", textAlign:'center'}} > {fail}</p>
                        </div>

                        <div className="container-login100-form-btn">
                            <button className="login100-form-btn" onClick={onSignUp}>
                                Register
                            </button>
                        </div>

                        <div className="text-center p-t-136">
                            <Link className="txt2" to="/login">
                                You are already an account ? 
                                <i className="fa fa-arrow-right m-l-5" aria-hidden="true" />
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
export default SignUp