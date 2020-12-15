import React from 'react'
import { Link } from 'react-router-dom'
import './index.css'
import SVG from '../../public/Untitled.svg'
import Button from '@material-ui/core/Button';

const StartPage = (props) => {
    console.log(process.env.SERVER)
    return (
        <div className="container-start">
            {/* <div className="content-auth"> */}
            {/* <div className="title">
                    <h1>Welcome To My Chat App</h1>
                </div>
                <hr />
                <div className="auth"> */}
            {/* <div className="auth-content">
                        <span className="auth-title">Auth: </span>
                        <span>Đỗ Viết Trí x Trần Văn Kiên</span>
                    </div>
                    <div className="auth-content">
                        <span className="auth-title">Gmail: </span>
                        <span>tri.dv173412@sis.hust.edu.vn x kien.tv1734208@sis.hust.edu.vn</span>
                    </div>
                    <div className="auth-content">
                        <span className="auth-title">Phone: </span>
                        <span>0964223234 x 0971891500</span>
                    </div> */}
            {/* <div className="btn-login-signup">
                        <Link to="/login" className="btn btn-primary">Login</Link>
                        <Link to="/signup" className="btn btn-outline-primary">Signup</Link>
                    </div>
                </div>
            </div> */}


            <img src={SVG} style={{ width: '100%' }} />

            <div className="btn-login-signup">
                <Link to="/login" >
                    <Button style={{ backgroundColor: 'green', width: 200, marginBottom: 20, borderRadius: 20, color:"#fff" }} >
                        LOGIN
                </Button>
                </Link>

                <br />
                <Link to="/signup">
                    <Button style={{ backgroundColor: 'green', width: 200, borderRadius: 20, color:'#fff' }}>
                        SIGNUP
                </Button>
                </Link>

            </div>
        </div>
    )
}

export default StartPage